'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.prefix('/api/v1'); // 设置基础路径

  // ! 用户相关
  router.post('/users', controller.user.create);
  router.post('/users/login', controller.user.login);
};
