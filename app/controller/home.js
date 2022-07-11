'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    // ! 方式一
    // const user = await new ctx.model.User({
    //   userName: 'robin',
    //   password: '123456',
    // }).save();
    // ! 方式二
    const user = await ctx.model.User.create({
      userName: 'robin1',
      password: '123456',
    });
    console.log(user);
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
