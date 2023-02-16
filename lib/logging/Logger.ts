import { ILogger, ILogTransport, Severity, Tags } from "./ILogger";

export class Logger implements ILogger {
  _tags: Tags;
  _transport: ILogTransport | null;

  constructor(transport: ILogTransport | null, tags?: Tags) {
    this._transport = transport;
    this._tags = tags ?? {};
  }

  withTags(tags: { string?: string }): ILogger {
    return new Logger(this._transport, { ...this._tags, ...tags });
  }

  tags(): { string?: string } {
    return this._tags;
  }

  async flush() {
    return await this._transport.flush();
  }

  debug(message: string | Error, tags?: Tags) {
    return this.record(
      Severity.debug,
      message.toString(),
      tags,
      null,
      (message as Error).stack?.split('\n')
    );
  }

  info(message: string | Error, tags?: Tags) {
    return this.record(
      Severity.info,
      message.toString(),
      tags,
      null,
      (message as Error).stack?.split('\n')
    );
  }

  warn(message: string | Error, tags?: Tags) {
    return this.record(
      Severity.warn,
      message.toString(),
      tags,
      null,
      (message as Error).stack?.split('\n')
    );
  }

  error(message: string | Error, tags?: Tags) {
    if (message.toString() === '[object Object]' && (message as Error).message) {
      message = `Error object ${JSON.stringify(message)}`;
    }

    return this.record(
      Severity.error,
      message.toString(),
      tags,
      null,
      (message as Error).stack?.split('\n')
    );
  }

  log(message: string | Error, tags?: Tags) {
    return this.info(message, tags);
  }

  record(severity: Severity, message: string, tags: Tags, timestamp?: Date, stack?: string[]) {
    // Produces a newline if there's a stack given, otherwise nothing:
    const stackTrace = [''].concat(stack || []).join('\n');
    const stackedTags = { ...this._tags, ...(tags ?? {}) };

    console[severity.toLowerCase()]?.(`${severity[0]}: ${message} [${JSON.stringify(stackedTags)}]${stackTrace}`);
    this._transport && this._transport.queue({
      timestamp: (timestamp ?? new Date()).getTime(),
      severity,
      message,
      tags: stackedTags,
      stack,
    });
  }
}
