const direction = require('google-maps-direction');
const Koa = require('koa');
const router = require('koa-router')();
const koaBody = require('koa-body');

const app = new Koa();
const PORT = 1337;

app.use(koaBody());

router.get('/', hello)
  .post('/route', directions);

app.use(router.routes());

async function hello(ctx) {
  ctx.body = { hello: 'world' };
}

async function directions(ctx) {

  const post = ctx.request.body;

  console.log(post);

  if(typeof post.origin != 'string') {
    return ctx.body = {
      error: 2,
      message: '`origin` missing.'
    };
  }

  if(typeof post.destination != 'string') {
    return ctx.body = {
      error: 3,
      message: '`destination` missing.'
    };
  }

  if(!Array.isArray(post.waypoints)) {
    return ctx.body = {
      error: 4,
      message: '`waypoints` isnt an array.'
    };
  }

  await direction({
    origin: post.origin,
    destination: post.destination,
    waypoints: post.waypoints.join('|')
  })
  .then(function(result) {
    ctx.body = result;
  });

}

app.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
