const Service = require('egg').Service;

class UserService extends Service {
  get User() {
    return this.app.model.User;
  }
  async findByUsername(username) {
    return await this.User.findOne({
      username,
    });
  }
  async findByEmail(email) {
    return await this.User.findOne({
      email,
    });
  }
  async createUser(user) {
    user.password = this.ctx.helper.md5(user.password);
    return await this.User.create(user);
  }
  async createToken(data) {
    const { secret, expiresIn } = this.app.config.jwt;
    return await this.ctx.helper.sign(data, secret, { expiresIn });
  }
}

module.exports = UserService;
