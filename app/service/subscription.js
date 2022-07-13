const Service = require('egg').Service;

class SubscriptionService extends Service {
  get Subscription() {
    return this.app.model.Subscription;
  }
  /**
   * 根据 userId 获取订阅频道
   * @param {string} userId 用户id
   * @return {Array} 订阅频道列表
   */
  async findByUserId(userId) {
    return await this.Subscription.find({
      user: userId,
    }).populate('channel');
  }
  async findOne(data) {
    return this.Subscription.findOne(data);
  }
}

module.exports = SubscriptionService;
