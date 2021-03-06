module.exports = (options = { required: true }) => { // 外层函数负责接收参数
  // 返回一个中间件处理函数
  return async function authHandler(ctx, next) {
    try {
      // 从请求头获取 token 数据
      let token = ctx.headers.authorization;
      token = token ? token.split('Bearer ')[1] : null;

      if (token) {
        // 有效 --> 把用户信息读取出来挂在到 req 对象上
        const decodeToken = await ctx.service.user.getToken(token);
        ctx.user = await ctx.service.user.findById(decodeToken?.userId);
        ctx.token = token;
      } else if (options.required) {
        // 验证 token 是否有效，无效返回 401
        ctx.throw(401);
      }

      // 继续往后执行
      await next();
    } catch (err) {
      // ctx.app.emit('error', err, ctx);
      // 捕获到错误
      ctx.throw(err);
    }
  };
};
