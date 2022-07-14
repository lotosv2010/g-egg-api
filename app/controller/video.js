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
  /**
   * 获取视频信息
   */
  async getVideo() {
    const { ctx, service: { video: videoService, like: likeService, subscription: subscriptionService } } = this;
    const { params: { id }, user } = ctx;

    // ! 1.获取视频信息
    let video = await videoService.findById(id);
    if (!video) {
      ctx.throw(404, '视频不存在');
    }

    video = video?.toJSON();
    video.isLiked = false; // 是否喜欢
    video.isDisliked = false; // 是否不喜欢
    video.user.isSubscribed = false; // 是否已订阅作者

    // ! 2.获取 喜欢/不喜欢/订阅
    if (user) {
      const { _id: userId } = user;
      if (await likeService.findOne({ user: userId, video: id, like: 1 })) {
        video.isLiked = true;
      }
      if (await likeService.findOne({ user: userId, video: id, like: -1 })) {
        video.isDisliked = true;
      }
      if (await subscriptionService.findOne({ user: userId, channel: video?.user?._id })) {
        video.user.isSubscribed = true;
      }
    }
    // ! 3.返回信息
    ctx.body = {
      video,
    };
  }
  /**
   * 获取视频列表
   */
  async getVideos() {
    const { ctx, service: { video: videoService } } = this;
    const { query: { pageNum = 1, pageSize = 10 } } = ctx;

    // ! 1.获取列表
    // ! 2.获取总条数
    const [ videos, videosCount ] = await Promise.all([
      videoService.getVideos({ pageNum, pageSize }),
      videoService.getTotalCount(),
    ]);
    // ! 3.返回响应信息
    ctx.body = {
      videos,
      videosCount,
    };
  }
  /**
   * 获取用户发布的视频列表
   */
  async getUserVideos() {
    const { ctx, service: { video: videoService } } = this;
    const { query: { pageNum = 1, pageSize = 10 }, params: { userId } } = ctx;

    // ! 1.获取列表
    // ! 2.获取总条数
    const [ videos, videosCount ] = await Promise.all([
      videoService.getVideos({ pageNum, pageSize }, { user: userId }),
      videoService.getTotalCount({ user: userId }),
    ]);
    // ! 3.返回响应信息
    ctx.body = {
      videos,
      videosCount,
    };
  }
  /**
   * 获取用户关注的视频列表
   */
  async getUserFeedVideos() {
    const { ctx, service: { video: videoService, subscription: subscriptionService } } = this;
    const { query: { pageNum = 1, pageSize = 10 }, user } = ctx;
    const { _id: userId } = user ?? {};

    // ! 1.获取用户关注的频道列表
    const channels = await subscriptionService.find({ user: userId });
    const channelIds = channels.map(c => c?.channel?._id);

    // ! 2.获取总条数
    const [ videos, videosCount ] = await Promise.all([
      videoService.getVideos({ pageNum, pageSize }, { user: {
        $in: channelIds,
      } }),
      videoService.getTotalCount({ user: {
        $in: channelIds,
      } }),
    ]);
    // ! 3.返回响应信息
    ctx.body = {
      videos,
      videosCount,
    };
  }
  /**
   * 更新视频
   */
  async updaeVideo() {
    const { ctx, service: { video: videoService } } = this;
    const { request: { body }, user, params: { videoId } } = ctx;

    // ! 1.数据校验
    ctx.validate({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
      vodVideoId: { type: 'string', required: false },
      cover: { type: 'string', required: false },
    }, body);

    // ! 2.查询视频
    const video = await videoService.findById(videoId);

    if (!video) {
      ctx.throw(404, '视频不存在');
    }

    if (user.id !== video.user.id) {
      ctx.throw(403);
    }

    // ! 3.更新视频
    Object.assign(video, this.pick([ 'title', 'description', 'vodVideoId', 'cover' ])(body));
    await video.save();

    // ! 4.返回信息
    ctx.body = {
      video,
    };
  }
  /**
   * 删除视频
   */
  async deleteVideo() {
    const { ctx, service: { video: videoService } } = this;
    const { user, params: { videoId } } = ctx;

    // ! 1.查询视频
    const video = await videoService.findById(videoId);

    if (!video) {
      ctx.throw(404, '视频不存在');
    }

    if (user.id !== video.user.id) {
      ctx.throw(403);
    }

    // ! 2.删除视频
    await video.remove();

    // ! 3.返回信息
    ctx.status = 204;
  }
}

module.exports = VideoController;
