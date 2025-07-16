import os from 'os';
import ENV from '../utils/env-util';

const getLocalIPAddress = (): string => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
};

export const listenHandler = (error?: Error): void => {
  const protocol = 'http';
  const ip = getLocalIPAddress();
  const port = ENV.PORT;

  console.log(`server is running at ${protocol}://${ip}:${port}`);
};
