'use strict';

const Controller = require('egg').Controller;

class SubscriptionController extends Controller {
  get pick() {
    return this.ctx.helper.pick;
  }
  /**
   * 获取用户订阅的频道列表
   */
  async getSubscriptions() {
    const { ctx, service: { subscription: subscriptionService } } = this;
    const { userId } = ctx.params;
    let subscriptions = await subscriptionService.findByUserId(userId);
    subscriptions = subscriptions.map(s => this.pick([ '_id', 'username', 'avatar' ])(s?.channel));
    ctx.body = {
      subscriptions,
    };
  }
}

module.exports = SubscriptionController;
