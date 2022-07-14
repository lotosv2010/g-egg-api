const Service = require('egg').Service;

class LikeService extends Service {
  get Like() {
    return this.app.model.Like;
  }
  async findOne(data) {
    return await this.Like.findOne(data);
  }
  async create(like) {
    return await this.Like.create(like);
  }
  async getCount(params) {
    return await this.Like.countDocuments(params);
  }
}

module.exports = LikeService;
