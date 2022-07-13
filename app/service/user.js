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
  get verify() {
    return this.ctx.helper.verify;
  }
  /**
   * 根据用户名查询
   * @param {string} username 用户名
   * @return {User} 用户
   */
  async findByUsername(username) {
    return await this.User.findOne({
      username,
    });
  }
  /**
   * 根据邮箱查询
   * @param {string} email 邮箱
   * @return {User} 用户
   */
  async findByEmail(email) {
    return await this.User.findOne({
      email,
    }).select('+password');
  }
  /**
   * 根据id查询
   * @param {string} id 用户ID
   * @return {User} 用户
   */
  async findById(id) {
    return await this.User.findById(id);
  }
  /**
   * 创建用户
   * @param {User} user 用户
   * @return {User} 用户
   */
  async createUser(user) {
    user.password = this.md5(user.password);
    return await this.User.create(user);
  }
  /**
   * 跟新用户
   * @param {*} user 用户
   * @return {User} 用户
   */
  async updateUser(user) {
    const { _id: id } = this.ctx?.user ?? {};
    return await this.User.findByIdAndUpdate(id, user, {
      new: true,
    }).select('+password');
  }
  /**
   * 生成 Token
   * @param {string} data 用户id
   * @return {string} token
   */
  async createToken(data) {
    const { secret, expiresIn } = this.jwt;
    return await this.sign(data, secret, { expiresIn });
  }
  /**
   * 获取 Token
   * @param {string} token token
   * @return {User} 用户
   */
  async getToken(token) {
    const { secret } = this.jwt;
    return await this.verify(token, secret);
  }
}

module.exports = UserService;
