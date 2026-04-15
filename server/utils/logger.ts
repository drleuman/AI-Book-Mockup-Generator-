
type LogMeta = Record<string, unknown>;

function log(level: 'INFO' | 'WARN' | 'ERROR', message: string, meta?: LogMeta) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...(meta ? { meta } : {}),
  };

  if (level === 'ERROR') {
    console.error(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

export const logger = {
  info: (message: string, meta?: LogMeta) => log('INFO', message, meta),
  warn: (message: string, meta?: LogMeta) => log('WARN', message, meta),
  error: (message: string, meta?: LogMeta) => log('ERROR', message, meta),
};
