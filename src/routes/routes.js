const Router = require('koa-router');
const todoHandler = require('../handlers/todos/todoHandler');
const todoInputMiddleware = require('../middlewares/todoInputMiddleware')

// Prefix all routes with /books
const router = new Router({
  prefix: '/api'
});

// Routes will go here
router.get('/todos', todoHandler.getTodos);
router.get('/todos/:id', todoHandler.getTodo);
router.post('/todos', todoInputMiddleware, todoHandler.addTodo);
router.put('/todos/:id', todoHandler.updateTodo);
router.put('/todos', todoHandler.updateTodos);
router.del('/todos/:id', todoHandler.deleteById);
router.post('/todos/delete-many', todoHandler.deleteTodos);

module.exports = router;
