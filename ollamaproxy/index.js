const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Allow overriding via CLI args or environment variables.
// Usage: node index.js --target=http://127.0.0.1:11434 --port=5000 --allowed=http://localhost:30000,http://example.com
const rawArgs = process.argv.slice(2);
const args = rawArgs.reduce((acc, cur) => {
	const [k, v] = cur.split("=");
	if (k && k.startsWith("--")) acc[k.replace(/^--/, "")] = v ?? true;
	return acc;
}, {});

const TARGET = args.target || process.env.TARGET || "http://127.0.0.1:11434";
const PORT = parseInt(args.port || process.env.PORT || "5000", 10);
const allowedRaw = args.allowed || process.env.ALLOWED || "http://localhost:30000";
const ALLOWED = allowedRaw.split(",").map(s => s.trim()).filter(Boolean);

const app = express();
app.use(cors({ origin: ALLOWED }));
app.use("/api", createProxyMiddleware({ target: TARGET, changeOrigin: true }));
app.listen(PORT, () => console.log(`Proxy listening on http://127.0.0.1:${PORT} -> ${TARGET} (allowed origins: ${ALLOWED.join(',')})`));
