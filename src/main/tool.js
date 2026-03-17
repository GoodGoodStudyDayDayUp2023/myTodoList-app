export const responseMessage = (success = false, code, message, data = {}) => {
  return {
    success,
    code,
    message,
    data,
  }
}
