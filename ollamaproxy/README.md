# Ollama Proxy

Small express proxy that forwards requests to an Ollama server and injects CORS headers so browser clients (for example Foundry VTT modules) can reach a local Ollama instance.

Requirements

- Node 14+ and npm

Install

Run this once to install the proxy dependencies from the repo root or inside the `ollamaproxy` folder:

```bash
npm install express cors http-proxy-middleware
```

Usage

Default (uses built-in defaults):

```bash
node ollamaproxy/index.js
```

Override values with CLI args (or environment variables):

- `--target` or `TARGET`: target Ollama server (default `http://127.0.0.1:11434`)
- `--port` or `PORT`: proxy listen port (default `5000`)
- `--allowed` or `ALLOWED`: comma-separated allowed origins for CORS (default `http://localhost:30000,http://127.0.0.1:30000`)

Examples

Run proxy on port 5000 for a local Ollama and allow several origins:

```bash
node ollamaproxy/index.js --target=http://127.0.0.1:11434 --port=5000 --allowed=http://localhost:30000,http://127.0.0.1:30000,http://foundry.local
```

Or set via env:

```bash
TARGET=http://127.0.0.1:11434 PORT=5000 ALLOWED="http://localhost:30000,http://127.0.0.1:30000" node ollamaproxy/index.js
```

Security and 403 Forbidden fixes

- **Bypass 403 Forbidden**: Ollama restricts incoming origins and referers for security. The proxy automatically strips these headers before forwarding to allow the request to pass.
- **CORS Handling**: Browsers sometimes use `localhost` and other times `127.0.0.1`. The default allowed list includes both to ensure Foundry can communicate with the proxy.
- **Restrict Origins**: Restrict the `ALLOWED` origins to only the origins you control; avoid `*` in production.
- **Local Use Only**: This proxy is designed to bridge local browser-based modules to a local Ollama instance. Keep any sensitive host credentials or secrets out of the client codebase.

How to use with Foundry

Point your module's Ollama endpoint setting to the proxy address (for example `http://127.0.0.1:5000/api`) so client code can call `/api` and the proxy will forward to the Ollama server.

License: MIT
