'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    const { ctx, service: { user: userService } } = this;
    const { body } = ctx.request;

    // ! 1.数据校验
    ctx.validate({
      username: { type: 'string' },
      email: { type: 'email' },
      password: { type: 'string' },
    }, body);

    // 检验用户是否存在
    const { username } = body;
    if (await userService.findByUsername(username)) {
      ctx.throw(422, '用户已存在');
    }
    // 检验邮箱是否存在
    const { email } = body;
    if (await userService.findByEmail(email)) {
      ctx.throw(422, '邮箱已存在');
    }

    // ! 2.保存用户
    const user = await userService.createUser(body);

    // ! 3.生成 token
    const token = await userService.createToken({
      userId: user._id,
    });
    // ! 4.发送响应

    ctx.body = {
      user: {
        email: user.email,
        username: user.username,
        token,
        avatar: user.avatar,
        channelDescription: user.channelDescription,
      },
    };
  }
  async login() {
    const { ctx, service: { user: userService } } = this;
    const { body } = ctx.request;
    const { md5 } = ctx.helper;
    const { email, password } = body;

    // ! 1.数据校验
    ctx.validate({
      email: { type: 'email' },
      password: { type: 'string' },
    }, body);

    // ! 2.获取用户
    // 检验用户是否存在
    const user = await userService.findByEmail(email);
    if (!user) {
      ctx.throw(422, '用户不已存在');
    }

    // 检验密码是否正确
    if (user.password !== md5(password)) {
      ctx.throw(422, '密码不正确');
    }

    // ! 3.生成 token
    const token = await userService.createToken({
      userId: user._id,
    });
    // ! 4.发送响应

    ctx.body = {
      user: {
        email: user.email,
        username: user.username,
        token,
        avatar: user.avatar,
        channelDescription: user.channelDescription,
      },
    };
  }
}

module.exports = UserController;
