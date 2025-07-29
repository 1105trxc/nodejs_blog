const User = require('./models/User');
const { multipleMongooseToObject } = require('../../util/mongoose');

class AdminController {
  // [GET] /admin/users
  // Hiển thị danh sách tất cả người dùng
  storedUsers(req, res, next) {
    User.find({}, '-password')
      .then((users) => {
        res.render('admin/stored-users', {
          users: multipleMongooseToObject(users),
        });
      })
      .catch(next);
  }

  // [GET] /admin/users
  // Hiển thị danh sách tất cả người dùng
  trashUsers(req, res, next) {
    User.findWithDeleted({ deleted: true }, '-password')
      .then((users) => {
        res.render('admin/trash-users', {
          users: multipleMongooseToObject(users),
        });
      })
      .catch(next);
  }
}

module.exports = new AdminController();
