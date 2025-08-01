const User = require('./models/User');
const bcrypt = require('bcrypt');
const { multipleMongooseToObject } = require('../../util/mongoose');

class UserController {
  // [GET] /users/register
  // Hiển thị form đăng ký
  renderRegister(req, res, next) {
    res.render('users/register');
  }
  // [GET] /users/login
  // Hiển thị form đăng nhập
  renderLogin(req, res, next) {
    res.render('users/login');
  }

  // [POST] /users/register
  // Xử lý việc tạo tài khoản
  async register(req, res, next) {
    try {
      // Chỉ cần tạo user với dữ liệu thô từ form
      // Model sẽ tự động lo việc mã hóa
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password, // Cứ truyền mật khẩu thuần vào đây
      });

      // Khi .save() được gọi, middleware trong User model sẽ được kích hoạt
      await user.save();

      // Chuyển hướng đến trang đăng nhập
      res.redirect('/users/login');
    } catch (error) {
      // Khối catch này sẽ bắt lỗi, bao gồm cả lỗi trùng username
      if (error.code === 11000) {
        // Lỗi E11000 là lỗi trùng key unique
        return res.render('users/register', {
          error: 'Username already exists.',
          values: req.body,
        });
      }
      next(error);
    }
  }

  // [POST] /users/login
  // Xử lý việc đăng nhập
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // 1. Tìm user trong database
      const user = await User.findOne({ username });
      if (!user) {
        // Nếu không tìm thấy user, báo lỗi
        return res.render('users/login', {
          error: 'Incorrect username or password.',
          values: req.body,
        });
      }

      // 2. So sánh mật khẩu người dùng nhập với mật khẩu đã băm trong DB
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Nếu mật khẩu không khớp, báo lỗi
        return res.render('users/login', {
          error: 'Incorrect username or password.',
          values: req.body,
        });
      }

      // 3. Mật khẩu khớp -> Lưu thông tin user vào session
      // TUYỆT ĐỐI không lưu toàn bộ object user, đặc biệt là mật khẩu!
      req.session.user = {
        _id: user._id,
        username: user.username,
        role: user.role,
      };

      if (req.session.user.role == 'user') {
        // 4. Chuyển hướng đến trang quản lý khóa học
        res.redirect('/me/stored/courses');
      } else if (req.session.user.role == 'admin') {
        res.redirect('/admin/stored/users');
      }
    } catch (error) {
      next(error);
    }
  }

  // [GET] /users/logout
  logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/'); // Chuyển về trang chủ
    });
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
      .then(() => res.redirect('/admin/trash/users'))
      .catch(next);
  }

  //[PATCH] /users/:id/restore
  restore(req, res, next) {
    User.restore({ _id: req.params.id })
      .then(() => res.redirect('/admin/trash/users'))
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

module.exports = new UserController();
