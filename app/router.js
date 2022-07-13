'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth();
  router.prefix('/api/v1'); // 设置基础路径

  // ! 用户相关
  router.post('/users', controller.user.create); // 用户注册
  router.post('/users/login', controller.user.login); // 用户登录
  router.get('/user', auth, controller.user.getCurrentUser); // 获取当前登录用户
  router.put('/user', auth, controller.user.update); // 更新当前登录用户
  router.get('/users/:userId', app.middleware.auth({ required: false }), controller.user.getUser); // 获取用户资料

  // ! 用户订阅相关
  router.post('/users/:userId/subscribe', auth, controller.user.subscribe); // 订阅频道
  router.delete('/users/:userId/subscribe', auth, controller.user.unsubscribe); // 订阅频道
  router.get('/users/:userId/subscriptions', controller.subscription.getSubscriptions); // 获取用户订阅的频道列表

  // ! VOD
  router.get('/vod/CreateUploadVideo', auth, controller.vod.createUploadVideo); // 获取视频上传地址和凭证
  router.get('/vod/RefreshUploadVideo', auth, controller.vod.refreshUploadVideo); // 刷新视频上传凭证
  router.get('/vod/GetVideoPlayAuth', controller.vod.getVideoPlayAuth); // 获取视频播放凭证
};
