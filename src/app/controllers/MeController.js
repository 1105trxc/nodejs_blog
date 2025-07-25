const Course = require('./models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class MeController {
  //[GET] //me//stored/courses
  storedCourses(req, res, next) {
    let coursesQuery = Course.find({});

    if (Object.prototype.hasOwnProperty.call(req.query, '_sort')) {
      coursesQuery = coursesQuery.sort({
        [req.query.column]: req.query.type,
      });
    }

    Promise.all([coursesQuery, Course.countDocumentsDeleted()])
      .then(([courses, deletedCount]) =>
        res.render('me/stored-courses', {
          deletedCount,
          courses: multipleMongooseToObject(courses),
        }),
      )
      .catch(next);
  }

  //[GET] //me//trash/courses
  trashCourses(req, res, next) {
    Course.findWithDeleted({ deleted: true })
      .then((courses) =>
        res.render('me/trash-courses', {
          courses: multipleMongooseToObject(courses),
        }),
      )
      .catch(next);
  }
}

module.exports = new MeController();
