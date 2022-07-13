'use strict';

const Controller = require('egg').Controller;

class VideoController extends Controller {
  get pick() {
    return this.ctx.helper.pick;
  }
  /**
   * 创建视频
   */
  async createVideo() {
    const { ctx, service: { video: videoService } } = this;
    const { request: { body }, user } = ctx;

    // ! 1.数据校验
    ctx.validate({
      title: { type: 'string' },
      description: { type: 'string' },
      vodVideoId: { type: 'string' },
      cover: { type: 'string' },
    }, body);

    // ! 2.创建视频
    const video = await videoService.create({
      ...body,
      user: user._id,
    });

    // ! 3.返回信息
    ctx.status = 201;
    ctx.body = {
      video,
    };
  }
}

module.exports = VideoController;
