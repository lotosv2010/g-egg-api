const Service = require('egg').Service;

class LikeService extends Service {
  get Like() {
    return this.app.model.Like;
  }
  async findOne(data) {
    return await this.Like.findOne(data);
  }
}

module.exports = LikeService;
