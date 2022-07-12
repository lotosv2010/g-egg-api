const Service = require('egg').Service;

class UserService extends Service {
  get User() {
    return this.app.model.User;
  }
  get md5() {
    return this.ctx.helper.md5;
  }
  get jwt() {
    return this.app.config.jwt;
  }
  get sign() {
    return this.ctx.helper.sign;
  }
  async findByUsername(username) {
    return await this.User.findOne({
      username,
    });
  }
  async findByEmail(email) {
    return await this.User.findOne({
      email,
    }).select('+password');
  }
  async createUser(user) {
    user.password = this.md5(user.password);
    return await this.User.create(user);
  }
  async createToken(data) {
    const { secret, expiresIn } = this.jwt;
    return await this.sign(data, secret, { expiresIn });
  }
}

module.exports = UserService;
