import crypto from 'crypto';
import { NextApiResponse } from 'next';
import nc, { NextConnect } from 'next-connect';
import { onError } from './error';
import { NextApiRequestWithAuth, NextApiRequestWithLogging } from '../types/api';
import { Logger } from '../lib/logging/Logger';

interface BaseHandlerOptions {
  params?: object;
  checkMaintenance?: boolean;
  timing?: boolean;
  logging?: boolean;
  name?: string;
}

export function baseApi<
  TReqType extends NextApiRequestWithLogging = NextApiRequestWithAuth & NextApiRequestWithLogging,
  TResType = {}
>(options?: BaseHandlerOptions): NextConnect<TReqType, NextApiResponse<TResType>> {
  const defaultedOptions: BaseHandlerOptions = {
    params: {},
    checkMaintenance: false,
    timing: true,
    logging: true,
    ...options,
  };

  let connector = nc<TReqType, NextApiResponse<TResType>>({ onError, ...defaultedOptions.params }).use(
    (req, res, next) => {
      const name = defaultedOptions.name || req.url.split('?')[0].split('/').slice(2).join('.');
      const method = req.method.toLowerCase();
      const forwarded = req.headers['x-forwarded-for'] as string;
      const clientIp = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;

      req.logger = new Logger( null, {
        source: 'api',
        requestId: crypto.randomUUID(),
        userAgent: req.headers['user-agent'] ?? '<none>',
        clientIp,
        api: `${name}.${method}`,
      });

      next();
    }
  );

  if (defaultedOptions.timing || defaultedOptions.logging) {
    connector = connector.use(async (req, res, next) => {
      const startedAt = Date.now();

      res.on('finish', () => {
        const finishedAt = Date.now();
        const timing = finishedAt - startedAt;

        if (defaultedOptions.logging) {
          const contentLength = (Number(res.getHeader('content-length') || '0') / 1024).toFixed(3);
          req.logger.info(
            `${req.method.toUpperCase()} ${req.url}: ${res.statusCode} ${
              res.statusMessage
            } ${contentLength}KB ${timing}ms`,
            {
              status: res.statusCode.toString(),
            }
          );
        }
      });

      next();
    });
  }

  return connector;
}
