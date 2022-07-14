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
  async getCount(params) {
    return await this.Comment.countDocuments(params);
  }
  /**
   * 获取评论列表
   * @param {object} options 请求参数
   * @param {object} params 查询条件
   */
  async getComments(options, params) {
    const { pageNum, pageSize } = options;
    return await this.Comment
      .find(params)
      .skip((+pageNum - 1) * +pageSize)
      .limit(+pageSize)
      .sort({
        createdAt: -1,
      })
      .populate('user')
      .populate('video');
  }
}

module.exports = CommentService;
