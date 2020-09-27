module.exports = {
  returnCtxBody(ctx, arg_obj) {
    ctx.status = arg_obj.code || 500
    const returnBody = {}
    returnBody.code = arg_obj.code || 500
    if (arg_obj.code !== 200) {
      returnBody.error = arg_obj.error || 'unknown error'
    }
    if (arg_obj.data) {
      returnBody.data = arg_obj.data
    }
    if (arg_obj.message) {
      returnBody.message = arg_obj.message
    }
    ctx.body = returnBody
  }
}
