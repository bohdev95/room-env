import { NextApiRequest } from 'next';
import { ILogger } from '../lib/logging/ILogger';

export interface NextApiRequestWithLogging extends NextApiRequest {
  logger: ILogger;
}

export interface NextApiRequestWithAuth extends NextApiRequestWithLogging {
  locals: {
    // user: IUser & IRepositoryEntity;
    session_id: number;
    // provider: AuthProvider;
  };
}

