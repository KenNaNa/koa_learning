const path = require('path');
const compose = require('./017_compose_middleware');

function mount(prefix, app) {
  let middleware = app.middleware;
  let middlewareStream = compose(middleware || []);
  if( prefix === '/' ) {
    return middlewareStream;
  }

  return async function( ctx, next ) {
    let mountPath = matchPath(ctx.path); 
    if( !mountPath ) {
      return await next();
    }

    let originPath = ctx.path;
    ctx.path = mountPath;

    await middlewareStream(ctx, async () => {
      ctx.path = originPath;
      await next();
      ctx.path = mountPath
    });

    ctx.path =  originPath;
  }

  function matchPath( originPath ) {
    if( originPath.indexOf(prefix) < 0 ) {
      return false;
    }
    const mountPath = originPath.replace(prefix, '') || '/';
    if( mountPath[0] !== '/' ) {
      return false;
    }
    return mountPath;
  }

}

module.exports = mount;