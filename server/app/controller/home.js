const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'Hello world';
  }

  async list() {
    this.ctx.body = {
      code: 200,
      msg: "success",
      list: [
        { 
          id: 0,
          title: "我是标题"
        },
        {
          id: 1,
          title: "我是副标题"
        }
      ]
    }
  }

  
}

module.exports = HomeController;