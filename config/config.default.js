/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1657548294141_5964';

  // mongoose 配置
  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/youtube',
      options: {
        useUnifiedTopology: true,
      },
      // mongoose global plugins, expected a function or an array of function and options
      plugins: [],
    },
  };

  // web安全配置
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // CORS
  config.cors = {
    origin: '*',
    allowMethods: 'GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS',
  };

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  // add your user config here
  const userConfig = {
    jwt: {
      secret: '7f26b6c7-0c6b-43a5-a473-bfdbfd71a053',
      expiresIn: '7d',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
