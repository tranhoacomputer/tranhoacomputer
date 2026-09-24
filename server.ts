import express from "express";
import http from "http";
import path from "path";
import { spawn, ChildProcess } from "child_process";
import { createServer as createViteServer } from "vite";

const PHP_PORT = 8999;
const PORT = 3000;

let phpProcess: ChildProcess | null = null;

function startPhpServer() {
  console.log(`[PHP] Starting PHP built-in server on 127.0.0.1:${PHP_PORT}...`);
  phpProcess = spawn("php", ["-S", `127.0.0.1:${PHP_PORT}`, "index.php"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  phpProcess.on("error", (err) => {
    console.error("[PHP] Process error:", err);
  });
}

startPhpServer();

async function startServer() {
  const app = express();

  // Proxy requests targeted for the PHP application (/index.php)
  app.use((req, res, next) => {
    if (req.path === "/index.php" || req.path === "/shop_data.sqlite") {
      const options: http.RequestOptions = {
        hostname: "127.0.0.1",
        port: PHP_PORT,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: req.headers.host || `localhost:${PORT}`,
        },
      };

      const proxyReq = http.request(options, (proxyRes) => {
        const headers = { ...proxyRes.headers };
        if (headers.location && typeof headers.location === "string") {
          headers.location = headers.location.replace(`127.0.0.1:${PHP_PORT}`, req.headers.host || `localhost:${PORT}`);
        }
        res.writeHead(proxyRes.statusCode || 200, headers);
        proxyRes.pipe(res);
      });

      proxyReq.on("error", (err) => {
        console.error("[Proxy] PHP error:", err.message);
        res.status(502).send("PHP server starting or unavailable.");
      });

      req.pipe(proxyReq);
      return;
    }
    next();
  });

  // Vite middleware for React app in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (Vite React + PHP Proxy)`);
  });
}

startServer();

process.on("exit", () => {
  if (phpProcess) phpProcess.kill();
});
process.on("SIGINT", () => {
  if (phpProcess) phpProcess.kill();
  process.exit();
});
process.on("SIGTERM", () => {
  if (phpProcess) phpProcess.kill();
  process.exit();
});
