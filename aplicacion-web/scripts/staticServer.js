const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { extname, join, normalize } = require('node:path');

const port = Number(process.env.PORT ?? 4173);
const root = join(__dirname, '..', 'app');

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript'
};

const server = createServer(async (req, res) => {
  const requestedPath = req.url === '/' ? '/index.html' : req.url ?? '/index.html';
  const filePath = normalize(join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const file = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypes[extname(filePath)] ?? 'text/plain'
    });
    res.end(file);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Control Center mock running at http://127.0.0.1:${port}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
