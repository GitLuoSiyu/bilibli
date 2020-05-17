const Controller = require('egg').Controller;

let demo = [{
    id: "1",
    username: "用户名1",
    nickname: "密码",
    sex: "男"
},{
    id: "2",
    username: "用户名2",
    nickname: "密码",
    sex: "男"
},{
    id: "3",
    username: "用户名3",
    nickname: "密码",
    sex: "男"
},{
    id: "4",
    username: "用户名4",
    nickname: "密码",
    sex: "男"
}]

class UserController extends Controller {
    // list
    async list() {
        let result = demo;
        this.ctx.query.page;
        this.ctx.status = 200;

        this.ctx.body = {
           msg: "success",
           data: result
        }
    }

    async read() {
        let id = this.ctx.params.id
        let detail = demo.find(item => item.id === id)
        this.ctx.body = {
            msg: "success",
            data: detail
        }
    }


    async create() {
        console.log(this.ctx.request.body)
        let createRes = {
            username: "用户名称",
            password: "昵称"
        }

        this.ctx.status = 200;
        this.ctx.body = {
            msg: "success",
            data: createRes
        }
    }



}

module.exports = UserController;