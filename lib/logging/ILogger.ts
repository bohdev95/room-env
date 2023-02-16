export type Tags = { [key in string]?: string };

export enum Severity {
  debug = 'DEBUG',
  info = 'INFO',
  warn = 'WARN',
  error = 'ERROR',
  fatal = 'FATAL',
}

export type LoggedItem = {
  timestamp: number; // Date.prototype.getTime()
  severity: Severity;
  message: string;
  tags?: Tags;
  stack?: string[];
};

export interface ILogTransport {
  queue(message: LoggedItem);
  flush();
}

export interface ILogger {
  log(message: string, tags?: Tags);
  debug(message: string, tags?: Tags);
  info(message: string, tags?: Tags);
  warn(message: string, tags?: Tags);
  error(message: string, tags?: Tags);
  error(exception: Error, tags?: Tags);
  record(severity: Severity, message: string, tags: Tags, timestamp?: Date);

  flush();

  withTags(tags: Tags): ILogger;
  tags(): Tags;
}
