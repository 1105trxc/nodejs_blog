module.exports = {
  // Middleware kiểm tra xem người dùng đã đăng nhập chưa
  requireAuth: function (req, res, next) {
    if (req.session.user) {
      // Nếu đã đăng nhập, cho phép đi tiếp
      next();
    } else {
      // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
      res.redirect('/users/login');
    }
  },

  requireAdmin: function (req, res, next) {
    // Kiem tra xem đã đăng nhập chưa
    if (!req.session.user) {
      return res.redirect('/users/login');
    }
    // Nếu đã đăng nhập, kiểm tra xem có phải admin không
    if (req.session.user.role === 'admin') {
      // Nếu là admin, cho đi tiếp
      return next();
    }
    // Nếu không phải admin, chuyển hướng về trang chủ
    res.redirect('/');
  },
};
