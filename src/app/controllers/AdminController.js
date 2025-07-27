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

  //[DELETE] /users/:id/
  delete(req, res, next) {
    User.delete({ _id: req.params.id })
      .then(() => res.redirect('/admin/stored/users'))
      .catch(next);
  }

  //[DELETE] /users/:id/force
  forceDelete(req, res, next) {
    User.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('/me/trash/users'))
      .catch(next);
  }

  //[PATCH] /users/:id/restore
  restore(req, res, next) {
    User.restore({ _id: req.params.id })
      .then(() => res.redirect('/me/trash/users'))
      .catch(next);
  }

  //[POST] /users/handle-form-actions
  handleFormActions(req, res, next) {
    switch (req.body.action) {
      case 'delete':
        User.delete({ _id: { $in: req.body.userIds } })
          .then(() => res.redirect('/admin/stored/users'))
          .catch(next);
        break;

      case 'restore':
        User.restore({ _id: { $in: req.body.userIds } })
          .then(() => res.redirect('/admin/trash/users'))
          .catch(next);
        break;

      case 'fDelete':
        User.deleteMany({ _id: { $in: req.body.userIds } })
          .then(() => res.redirect('/admin/trash/users'))
          .catch(next);
        break;

      default:
        res.json({ message: 'Action is invalid' });
    }
  }
}

module.exports = new AdminController();
