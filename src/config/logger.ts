// src/middleware/logger.ts
import morgan from 'morgan';
import chalk from 'chalk';

import type { IncomingMessage } from 'http';

morgan.token('remote-ip', (req: IncomingMessage) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded;
  } else if (Array.isArray(forwarded)) {
    return forwarded[0];
  }
  // @ts-ignore
  return req.socket?.remoteAddress || '-';
});

morgan.token('user-agent', (req) => req.headers['user-agent'] || '-');

const methodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return chalk.green(method);
    case 'POST':
      return chalk.cyan(method);
    case 'PUT':
      return chalk.yellow(method);
    case 'DELETE':
      return chalk.red(method);
    default:
      return chalk.white(method);
  }
};

// 상태 코드 색상
const statusColor = (status: number) => {
  if (status >= 500) return chalk.red(status.toString());
  if (status >= 400) return chalk.yellow(status.toString());
  if (status >= 300) return chalk.cyan(status.toString());
  return chalk.green(status.toString());
};
const coloredFormat: morgan.FormatFn = (tokens, req, res) => {
  const method = methodColor(tokens.method(req, res) || '');
  const url = chalk.white(tokens.url(req, res) || '');
  const status = statusColor(Number(tokens.status(req, res)));
  const responseTime = chalk.blue(`${tokens['response-time'](req, res)} ms`);
  const ip = chalk.white(tokens['remote-ip'](req, res) || '');
  const agent = chalk.white(tokens['user-agent'](req, res) || '');

  return `${method} ${url} ${status} - ${responseTime} | IP: ${ip} | Agent: ${agent}`;
};

const logger = morgan(coloredFormat);

export default logger;
