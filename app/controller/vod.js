const Controller = require('egg').Controller;

class VodController extends Controller {
  /**
   * 获取视频上传地址和凭证
   */
  async createUploadVideo() {
    const { ctx, app } = this;
    const { query } = ctx;
    const { request } = app.vodClient;
    ctx.validate(
      {
        Title: { type: 'string' },
        FileName: { type: 'string' },
      },
      query
    );
    ctx.body = await request('CreateUploadVideo', query, {});
  }
  /**
   * 刷新视频上传凭证
   */
  async refreshUploadVideo() {
    const { ctx, app } = this;
    const { query } = ctx;
    const { request } = app.vodClient;
    ctx.validate(
      {
        VideoId: { type: 'string' },
      },
      query
    );

    ctx.body = await request('RefreshUploadVideo', query, {});
  }

  /**
   * 获取视频播放凭证
   */
  async getVideoPlayAuth() {
    const { ctx, app } = this;
    const { query } = ctx;
    const { request } = app.vodClient;
    ctx.validate(
      {
        VideoId: { type: 'string' },
      },
      query
    );

    ctx.body = await request('GetVideoPlayAuth', query, {});
  }
}

module.exports = VodController;
