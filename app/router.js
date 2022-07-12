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
};
