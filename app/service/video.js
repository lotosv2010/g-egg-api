const Service = require('egg').Service;

class VideoService extends Service {
  get Video() {
    return this.app.model.Video;
  }
  /**
   * 创建视频
   * @param {string} video 视频信息
   * @return {Video} 视频信息
   */
  async create(video) {
    return await this.Video.create(video);
  }
  /**
   * 根据视频ID获取视频信息
   * @param {string} id 视频ID
   * @return {Video} 视频信息
   */
  async findById(id) {
    return await this.Video
      .findById(id)
      .populate('user', '_id username avatar subscribersCount')
      .select('-updatedAt -__v');
  }
  /**
   * 获取视频总数
   * @return {number} 视频总数
   */
  async getTotalCount() {
    return await this.Video.countDocuments();
  }
  async getVideos(options) {
    const { pageNum, pageSize } = options;
    return await this.Video
      .find()
      .populate('user', '_id username avatar subscribersCount')
      .sort({
        createdAt: -1,
      })
      .skip((+pageNum - 1) * +pageSize)
      .limit(+pageSize);
  }
}

module.exports = VideoService;
