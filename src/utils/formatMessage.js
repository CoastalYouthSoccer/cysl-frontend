function formatErrorMessage(message) {
  if (Array.isArray(message)) return message.join(', ')
  if (typeof message === 'string') return message
  return 'Unknown error'
}
