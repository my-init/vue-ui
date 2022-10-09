enum LogLevel {
  Info = 'info',
  Warn = 'warn',
  Error = 'error'
}

const colorMap = {
  [LogLevel.Info]: 'blue',
  [LogLevel.Warn]: 'orange',
  [LogLevel.Error]: 'red'
}

const iconMap = {
  [LogLevel.Info]: '☁',
  [LogLevel.Warn]: '☂',
  [LogLevel.Error]: '❆'
}

function style(color: string) {
  return [
    `background-color:${color};color:white;padding:0 5px;`,
    `color:${color};font-weight:bold;`
  ]
}

export function log(type: LogLevel, message: any, ...args: any[]) {
  console.log(
    `%c${iconMap[type]} ${type.toUpperCase()}%c→ ${message}`,
    ...style(colorMap[type]),
    ...args
  )
}

export function logInfo(message: any, ...args: any[]) {
  log(LogLevel.Info, message, ...args)
}

export function logWarn(message: any, ...args: any[]) {
  log(LogLevel.Warn, message, ...args)
}

export function logError(message: any, ...args: any[]) {
  log(LogLevel.Error, message, ...args)
}
