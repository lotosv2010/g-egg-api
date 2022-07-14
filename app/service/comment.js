const Service = require('egg').Service;

class CommentService extends Service {
  get Comment() {
    return this.app.model.Comment;
  }
  /**
   * 创建评论
   * @param {string} comment 评论信息
   * @return {Comment} 评论信息
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
  /**
   * 获取评论
   * @param {object} params 查询条件
   * @return {Comment} 评论信息
   */
  async find(params) {
    return await this.Comment.find(params);
  }
  /**
   * 根据 ID 获取评论
   * @param {string} id ID
   * @return {Comment} 评论信息
   */
  async findById(id) {
    return await this.Comment.findById(id);
  }
}

module.exports = CommentService;
