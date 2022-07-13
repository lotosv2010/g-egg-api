const Service = require('egg').Service;

class VideoService extends Service {
  get Video() {
    return this.app.model.Video;
  }
  /**
   * 创建视频
   * @param {string} video 视频信息
   * @return {Array} 视频信息
   */
  async create(video) {
    return await this.Video.create(video);
  }
}

module.exports = VideoService;
