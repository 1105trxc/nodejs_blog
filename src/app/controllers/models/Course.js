const mongoose = require('mongoose');
const slugify = require('slugify');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

// Đổi tên biến Schema thành "CourseSchema" cho rõ ràng
const CourseSchema = new Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    vdID: { type: String, required: true },
    level: { type: String },
    slug: { type: String, unique: true },
  },
  {
    _id: false,
    timestamps: true,
  },
);

// Gọi plugin và middleware trên đúng đối tượng "CourseSchema"
CourseSchema.plugin(mongooseDelete, {
  deletedAt: true, // Thêm trường lưu thời gian xóa
  overrideMethods: 'all', // Ghi đè các phương thức để tự động lọc các mục đã xóa
});

CourseSchema.plugin(AutoIncrement);

CourseSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
    strict: true,
    locale: 'vi',
  });
  next();
});

// 3. Biên dịch Model từ "CourseSchema"
module.exports = mongoose.model('Course', CourseSchema);
