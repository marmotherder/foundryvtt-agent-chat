const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const rawArgs = process.argv.slice(2);
// Support both `--key=value` and `--key value` styles
const args = {};
for (let i = 0; i < rawArgs.length; i++) {
	const token = rawArgs[i];
	if (!token) continue;
	if (token.startsWith("--")) {
		const eq = token.indexOf("=");
		if (eq !== -1) {
			const k = token.slice(2, eq);
			const v = token.slice(eq + 1);
			args[k] = v;
		}
		else {
			const k = token.slice(2);
			const next = rawArgs[i + 1];
			if (next && !next.startsWith("--")) {
				args[k] = next;
				i++;
			}
			else {
				args[k] = true;
			}
		}
	}
}

const TARGET = args.target || process.env.TARGET || "http://127.0.0.1:11434";
const PORT = parseInt(args.port || process.env.PORT || "5000", 10);
const allowedRaw = args.allowed || process.env.ALLOWED || "http://localhost:30000,http://127.0.0.1:30000";
const ALLOWED = allowedRaw.split(",").map(s => s.trim()).filter(Boolean);

const app = express();

// Custom CORS middleware to handle preflight (OPTIONS) and standard CORS headers
app.use((req, res, next) => {
	const origin = req.headers.origin;
	// Reflect any origin that is in the ALLOWED list or if we're being permissive (*)
	if (origin) {
		const isAllowed = ALLOWED.includes(origin) || ALLOWED.includes("*");
		if (isAllowed) {
			res.setHeader("Access-Control-Allow-Origin", origin);
		} else {
			// If not allowed, still log for visibility to help the user troubleshoot their allowed list
			console.warn(`Origin ${origin} not in ALLOWED list. Current allowed: ${ALLOWED.join(', ')}`);
			// Fallback to first allowed or '*' for local development convenience if they are hitting this
			res.setHeader("Access-Control-Allow-Origin", ALLOWED[0] || "*");
		}
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "Content-Type, Authorization, Origin, Referer, Accept, X-Requested-With");
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Vary", "Origin");
	}

	if (req.method === "OPTIONS") {
		return res.status(204).end();
	}
	next();
});

app.use('/api', createProxyMiddleware({
	target: TARGET,
	changeOrigin: true,
	proxyTimeout: 120000,
	// When mounted at `/api` using app.use('/api', ...), 
	// the path seen by the proxy is relative to `/api` (e.g. /chat).
	// We must prepend /api back so it reaches Ollama as /api/chat.
	pathRewrite: { '^': '/api' },
	// In http-proxy-middleware v3, events move to the 'on' property
	on: {
		proxyReq: (proxyReq, req, res) => {
			try {
				// Remove headers that might trigger Ollama's CSRF protection
				proxyReq.removeHeader('origin');
				proxyReq.removeHeader('referer');

				// Ensure the Host header matches the target
				const u = new URL(TARGET);
				proxyReq.setHeader('host', u.host);
			} catch (e) {
				// ignore
			}
		},
		proxyRes: (proxyRes, req, res) => {
			// Ensure CORS headers are present on the response if the middleware missed them
			const origin = req.headers.origin;
			if (origin) {
				const isAllowed = ALLOWED.includes(origin) || ALLOWED.includes("*");
				res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : (ALLOWED[0] || "*"));
				res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
				res.setHeader('Access-Control-Allow-Headers', req.headers["access-control-request-headers"] || 'Content-Type, Authorization');
				res.setHeader('Access-Control-Allow-Credentials', 'true');
			}
		},
		error: (err, req, res) => {
			console.error('[proxy error]', err && err.message);
			try {
				res.writeHead(502, { 'Content-Type': 'text/plain' });
				res.end('Proxy error');
			} catch (e) {}
		}
	}
}));
app.listen(PORT, () => console.log(`Proxy listening on http://127.0.0.1:${PORT} -> ${TARGET} (allowed origins: ${ALLOWED.join(',')})`));
