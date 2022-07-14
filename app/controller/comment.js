'use strict';

const Controller = require('egg').Controller;

class VideoController extends Controller {
  get pick() {
    return this.ctx.helper.pick;
  }
  /**
   * 创建评论
   */
  async createVideoComment() {
    const { ctx, service: { comment: commentService, video: videoService } } = this;
    const { request: { body }, user, params: { videoId } } = ctx;

    // ! 1.数据校验
    ctx.validate({
      content: { type: 'string' },
    }, body);

    // ! 2.获取视频
    const video = await videoService.findById(videoId);
    if (!video) {
      ctx.throw(404, '视频不存在');
    }

    // ! 3.创建视频
    const commnet = await commentService.create({
      ...body,
      user: user._id,
      video: videoId,
    });

    // ! 4.更新视频评论数
    video.commentsCount = await commentService.getCount({
      video: videoId,
    });
    await video.save();

    // ! 5.返回信息
    // 映射评论所属的用户和视频字段数据
    await commnet.populate('user').populate('video').execPopulate();

    ctx.status = 201;
    ctx.body = {
      commnet,
    };
  }
  /**
   * 获取视频评论列表
   */
  async getVideoComments() {
    const { ctx, service: { comment: commentService } } = this;
    const { params: { videoId }, query } = ctx;

    // ! 1.获取评论列表
    // ! 2.获取评论数
    const options = query ?? { pageNum: 1, pageSize: 10 };
    const params = {
      video: videoId,
    };
    const [ comments, commentsCount ] = await Promise.all([
      commentService.getComments(options, params),
      commentService.getCount(params),
    ]);

    // ! 3.返回信息
    ctx.body = {
      comments,
      commentsCount,
    };
  }
}

module.exports = VideoController;
