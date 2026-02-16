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
app.use(cors({ origin: ALLOWED }));
app.use('/api', createProxyMiddleware({
	target: TARGET,
	changeOrigin: true,
	proxyTimeout: 120000,
	timeout: 120000,
	// When mounted at `/api`, the middleware strips the mount path.
	// Re-add the `/api` prefix so upstream receives the full path (e.g. /api/chat).
	pathRewrite: { '^': '/api' },
	// Ensure Ollama sees requests as coming from its own origin/host to avoid 403 Forbidden
	onProxyReq: (proxyReq, req, res) => {
		try {
			// Remove headers that might trigger Ollama's CSRF protection
			proxyReq.removeHeader('origin');
			proxyReq.removeHeader('referer');

			// Alternatively, set the Host header correctly (changeOrigin: true handles this, 
			// but we can be explicit if needed)
			const u = new URL(TARGET);
			proxyReq.setHeader('host', u.host);
		} catch (e) {
			// ignore
		}
	},
	onError: (err, req, res) => {
		console.error('[proxy error]', err && err.message);
		try {
			res.writeHead(502, { 'Content-Type': 'text/plain' });
			res.end('Proxy error');
		} catch (e) {}
	}
}));
app.listen(PORT, () => console.log(`Proxy listening on http://127.0.0.1:${PORT} -> ${TARGET} (allowed origins: ${ALLOWED.join(',')})`));
