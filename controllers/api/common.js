module.exports = {
  returnCtxBody(ctx, status, ...[]) {
    ctx.status = status
    returnBody = { code: status }
    if (status !== 200) {
      if (typeof error !== 'undefined') {
        returnBody['error'] = error
      } else {
        returnBody['error'] = 'unknown error'
      }
    }
    if (typeof data !== 'undefined') {
      returnBody['data'] = data
    }
    if (typeof message !== 'undefined') {
      returnBody['message'] = message
    }
    ctx.body = returnBody
  }
}
