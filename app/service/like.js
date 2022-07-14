const Service = require('egg').Service;

class LikeService extends Service {
  get Like() {
    return this.app.model.Like;
  }
  async findOne(data) {
    return await this.Like.findOne(data);
  }
  async find(params) {
    return await this.Like.find(params);
  }
  async create(like) {
    return await this.Like.create(like);
  }
  async getCount(params) {
    return await this.Like.countDocuments(params);
  }
  async getLike(options, params = {}) {
    const { pageNum, pageSize } = options;
    return await this.Like
      .find(params)
      .sort({
        createdAt: -1,
      })
      .skip((+pageNum - 1) * +pageSize)
      .limit(+pageSize);
  }
}

module.exports = LikeService;
