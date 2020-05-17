module.exports = app => {
    const { router, controller } = app;
    router.get('/user/list', controller.user.list);
    router.get('/user/read/:id', controller.user.read)
    router.post('/user/create', controller.user.create)

  };