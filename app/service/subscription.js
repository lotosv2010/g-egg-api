const Service = require('egg').Service;

class SubscriptionService extends Service {
  get Subscription() {
    return this.app.model.Subscription;
  }
  /**
   * 根据 ID 获取订阅频道
   * @param {string} id 用户id
   * @return {Array} 订阅频道列表
   */
  async findById(id) {
    return await this.Subscription.findById(id);
  }
}

module.exports = SubscriptionService;
