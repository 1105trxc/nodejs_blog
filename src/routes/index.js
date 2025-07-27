const newRouter = require('./news');
const coursesRouter = require('./courses');
const siteRouter = require('./site');
const meRouter = require('./me');
const userRouter = require('./users');
const adminRouter = require('./admin');

function route(app) {
  app.use('/news', newRouter);
  app.use('/courses', coursesRouter);
  app.use('/me', meRouter);
  app.use('/admin', adminRouter);
  app.use('/users', userRouter);
  app.use('/', siteRouter);
}

module.exports = route;
