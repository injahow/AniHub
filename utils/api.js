
module.exports = {
  /**
   * 返回格式化ctx
   * @param {object} ctx
   * @param {object} arg
   */
  returnCtxBody(ctx, arg) {
    const code = arg.code || 500
    const returnBody = {}
    returnBody.code = code

    // ? code 20*
    if (code !== 200) {
      returnBody.error = arg.error || 'unknown error'
    }
    if (arg.data) {
      returnBody.data = arg.data
    }
    if (arg.message) {
      returnBody.message = arg.message
    }

    ctx.status = code
    ctx.body = returnBody
  }
}
