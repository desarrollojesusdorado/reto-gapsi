import { createServer, Server } from 'node:http';
import { AddressInfo } from 'node:net';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = join(__dirname, '..', '..', 'app');

const contentTypes: Record<string, string> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript'
};

export interface ControlCenterServer {
  baseURL: string;
  close: () => Promise<void>;
}

export async function startControlCenterServer(): Promise<ControlCenterServer> {
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

  await listen(server);

  const address = server.address() as AddressInfo;
  return {
    baseURL: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        });
      })
  };
}

function listen(server: Server): Promise<void> {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
}
