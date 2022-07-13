'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  get pick() {
    return this.ctx.helper.pick;
  }
  /**
   * 用户注册
   */
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
        token,
        ...this.pick([
          'username',
          'email',
          'avatar',
          'channelDescription',
        ])(user),
      },
    };
  }
  /**
   * 用户登录
   */
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
        token,
        ...this.pick([
          'username',
          'email',
          'avatar',
          'channelDescription',
        ])(user),
      },
    };
  }
  /**
   * 获取当前登录用户
   */
  async getCurrentUser() {
    const { ctx } = this;
    const { user = {}, token = '' } = ctx;
    // ! 1.验证 token
    // ! 2.获取用户信息
    // ! 3.发送信息
    ctx.body = {
      user: {
        token,
        ...this.pick([
          'username',
          'email',
          'avatar',
          'channelDescription',
        ])(user),
      },
    };
  }
  /**
   * 更新用户信息
   */
  async update() {
    const { ctx, service: { user: userService } } = this;
    const { body } = ctx.request;
    let { email, username, password } = body;
    const { user = {} } = ctx;
    const { md5 } = ctx.helper;
    // ! 1.基本数据验证
    ctx.validate({
      username: { type: 'string', required: false },
      email: { type: 'email', required: false },
      password: { type: 'string', required: false },
      channelDescription: { type: 'string', required: false },
      avatar: { type: 'string', required: false },
    }, body);
    // ! 2.校验用户是否已存在
    if (username && username !== user?.username && await userService.findByUsername(username)) {
      ctx.throw(422, 'username 已存在');
    }

    // ! 3.校验邮箱是否已存在
    if (email && email !== user?.email && await userService.findByEmail(email)) {
      ctx.throw(422, 'email 已存在');
    }

    if (password) {
      password = md5(password);
    }
    // 4.更新用户信息
    const userData = await userService.updateUser(body);
    // 5.返回更新之后的用户信息
    ctx.body = {
      user: this.pick([
        'username',
        'email',
        'avatar',
        'password',
        'channelDescription',
      ])(userData),
    };
  }
  /**
   * 订阅频道
   */
  async subscribe() {
    const { ctx, service: { user: userService } } = this;
    const { userId: channelId } = ctx.params;
    const { user = {} } = ctx;
    const { _id: userId } = user;
    // ! 1.用户不能订阅自己
    if (userId === channelId) {
      ctx.throw(422, '用户不能订阅自己');
    }
    // ! 2.添加订阅
    const userData = await userService.subscribe(userId, channelId);
    if (!userData) {
      ctx.throw(404, '订阅频道不存在');
    }
    // ! 3.发送信息
    ctx.body = {
      user: {
        ...this.pick([
          'username',
          'email',
          'avatar',
          'cover',
          'channelDescription',
          'subscribersCount',
        ])(userData),
        isSubscribed: true,
      },
    };
    // ctx.body = pick()();
  }
}

module.exports = UserController;
