// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const slug = require('mongoose-slug-generator');

// mongoose.plugin(slug);

// const Course = new Schema(
//   {
//     name: { type: String, required: true },
//     description: { type: String },
//     img: { type: String },
//     vdID: { type: String, required: true },
//     level: { type: String },
//     slug: { type: String, slug: 'name', unique: true },
//   },
//   {
//     timestamps: true,
//   },
// );

// module.exports = mongoose.model('Course', Course);

// src/app/models/Course.js (CODE ĐÚNG)

const mongoose = require('mongoose');
const slugify = require('slugify'); // Import thư viện mới

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    // Tôi đã thấy bạn dùng vdID và giữ nguyên tên này
    vdID: { type: String, required: true },
    level: { type: String },
    // Sửa lại trường slug - không cần cấu hình của plugin cũ nữa
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  },
);

// Xóa dòng mongoose.plugin(slug); cũ đi

// Thêm Middleware để tự động tạo slug trước khi lưu
CourseSchema.pre('save', function (next) {
  // this ở đây chính là document (khóa học) đang được lưu
  // Tạo slug từ trường 'name' và gán vào trường 'slug'
  this.slug = slugify(this.name, {
    lower: true, // Chuyển thành chữ thường
    strict: true, // Xóa các ký tự đặc biệt
    locale: 'vi', // Hỗ trợ tiếng Việt
  });
  next(); // Gọi next() để tiếp tục quá trình lưu
});

module.exports = mongoose.model('Course', CourseSchema);
