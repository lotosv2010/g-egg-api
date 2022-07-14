'use strict';

const Controller = require('egg').Controller;

class LikeController extends Controller {
  get pick() {
    return this.ctx.helper.pick;
  }
  /**
   * 点赞
   */
  async likeVideo() {
    const { ctx, service: { like: likeService, video: videoService } } = this;
    const { user, params: { videoId } } = ctx;

    // ! 1.获取视频
    const video = await videoService.findById(videoId);
    if (!video) {
      ctx.throw(404, '视频不存在');
    }

    // ! 2.点赞
    const doc = await likeService.findOne({
      user: user._id,
      video: videoId,
    });
    let isLiked = true;

    if (doc && doc.like === 1) {
      await doc.remove();
      isLiked = false;
    } else if (doc && doc.like === -1) {
      doc.like = 1;
      await doc.save();
    } else {
      await likeService.create({
        like: 1,
        user: user._id,
        video: videoId,
      });
    }

    // ! 3.更新点赞和取消点赞数
    video.likesCount = await likeService.getCount({
      video: videoId,
      like: 1,
    });

    video.dislikesCount = await likeService.getCount({
      video: videoId,
      like: -1,
    });
    await video.save();

    // ! 4.返回信息

    ctx.body = {
      video: {
        ...video.toJSON(),
        isLiked,
      },
    };
  }
  /**
   * 取消点赞
   */
  async dislikeVideo() {
    const { ctx, service: { like: likeService, video: videoService } } = this;
    const { user, params: { videoId } } = ctx;

    // ! 1.获取视频
    const video = await videoService.findById(videoId);
    if (!video) {
      ctx.throw(404, '视频不存在');
    }

    // ! 2.取消点赞
    const doc = await likeService.findOne({
      user: user._id,
      video: videoId,
    });
    let isDisLiked = true;

    if (doc && doc.like === -1) {
      await doc.remove();
      isDisLiked = false;
    } else if (doc && doc.like === 1) {
      doc.like = -1;
      await doc.save();
    } else {
      await likeService.create({
        like: -1,
        user: user._id,
        video: videoId,
      });
    }

    // ! 3.更新点赞和取消点赞数
    video.likesCount = await likeService.getCount({
      video: videoId,
      like: 1,
    });

    video.dislikesCount = await likeService.getCount({
      video: videoId,
      like: -1,
    });
    await video.save();

    // ! 4.返回信息

    ctx.body = {
      video: {
        ...video.toJSON(),
        isDisLiked,
      },
    };
  }
}

module.exports = LikeController;
