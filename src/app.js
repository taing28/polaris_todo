const Koa = require('koa');
const koaBody = require('koa-body');
const routes = require('./routes/routes.js');
const cors = require('@koa/cors');

const app = new Koa();

app.use(koaBody());
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(routes.routes());
app.use(routes.allowedMethods());

app.listen(5000);