const path = require('path');
const fs = require('fs');

function view(app, opts = {}) {
  const {baseDir = ''} = opts;

  // 将需要的属性或者方法 `view` 挂载在 `app.context` 上，`app.context.view`
  app.context.view = function(page = '', obj = {}) {
    let ctx = this;
    let filePath = path.join(baseDir, page);
    if (fs.existsSync(filePath)) {
      let tpl = fs.readFileSync(filePath, 'binary');
      ctx.body = tpl;
    } else {
      ctx.throw(404);
    }
  };
}

module.exports = view;