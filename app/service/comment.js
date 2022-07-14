const Service = require('egg').Service;

class CommentService extends Service {
  get Comment() {
    return this.app.model.Comment;
  }
  /**
   * 创建评论
   * @param {string} comment 评论信息
   * @return {Video} 评论信息
   */
  async create(comment) {
    return await this.Comment.create(comment);
  }
  /**
   * 获取评论数
   * @param {string} params 入参
   * @return {number} 评论数
   */
  async getCountById(params) {
    return await this.Comment.countDocuments(params);
  }
}

module.exports = CommentService;
