const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt để mã hóa
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const UserSchema = new Schema(
  {
    // ObjectId mặc định của Mongoose sẽ được tự động tạo, không cần định nghĩa _id

    username: {
      type: String,
      required: true,
      unique: true, // Tên đăng nhập phải là duy nhất
      maxLength: 255,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
  },
  {
    timestamps: true, // Giữ lại timestamps để biết user được tạo khi nào
  },
);

UserSchema.plugin(mongooseDelete, {
  deletedAt: true, // Thêm trường lưu thời gian xóa
  overrideMethods: 'all',
});

// Thêm Middleware để tự động MÃ HÓA MẬT KHẨU trước khi lưu
// Đây là chức năng quan trọng nhất của User model
UserSchema.pre('save', async function (next) {
  // Chỉ băm mật khẩu nếu nó được tạo mới hoặc bị thay đổi
  // `this` ở đây chính là document (user) đang được lưu
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Tạo một "muối" ngẫu nhiên
    this.password = await bcrypt.hash(this.password, salt); // Băm mật khẩu với muối
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
