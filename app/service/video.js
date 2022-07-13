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
}

module.exports = VideoService;
