const Course = require('./models/Course');
const { mongoosetoObject } = require('../../util/mongoose');

class CourseController {
  //[GET] /courses/:slug
  show(req, res, next) {
    Course.findOne({ slug: req.params.slug })
      .then((course) => {
        res.render('courses/show', { course: mongoosetoObject(course) });
      })
      .catch(next);
  }

  //[GET] /courses/create
  create(req, res, next) {
    res.render('courses/create');
  }

  //[POST] /courses/store
  store(req, res, next) {
    const formData = req.body;
    formData.img = `https://i.ytimg.com/vi/${req.body.img}/hq720.jpg?sqp=-oaymwEXCNAFEJQDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBPNHhLkUbAXMNx892fF7WRFDlnCw`;
    const course = new Course(formData);
    course
      .save()
      .then(() => res.redireact('/'))
      .catch((error) => {});
  }

  //[GET] /courses/:id/edit
  edit(req, res, next) {
    Course.findById(req.params.id)
      .then((course) =>
        res.render('courses/edit', {
          course: mongoosetoObject(course),
        }),
      )
      .catch(next);
  }

  //[PUT] /courses/:id/
  update(req, res, next) {
    Course.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/me/stored/courses'))
      .catch(next);
  }
}

module.exports = new CourseController();
