// const mongoose = require("mongoose");

// const placeSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   short_description: { type: String, required: true }, 
//   detailed_description: { type: String, required: true }, 
//   city: { type: String, required: true },
//   location: {
//     latitude: { type: Number, required: false },
//     longitude: { type: Number, required: false },
//   },
//   working_hours: { type: String, required: true },
//   rating: { type: Number, default: 0 },
//   ticket_price: { type: Number, required: true },
//   categories: [{ type: String, required: true }], // قائمة الفئات (منتزهات، طبيعة..)
//   best_season: { type: String, required: true }, // الموسم الأنسب للزيارة
//   is_free: { type: Boolean, required: true },
//   suitable_for: [{ type: String, required: true }], // الفئات المستهدفة (عائلات، أطفال..)
//   contact: {
//     phone: { type: String, required: false }, // رقم الهاتف
//     website: { type: String, required: false } // الموقع الإلكتروني
//   },
//   map_link: { type: String, required: false }, // رابط خرائط جوجل
//   images: [{ type: String, required: true }], // صور للمكان
//   gallery: [{ type: String, required: false }], // ألبوم صور إضافي
//   status: { 
//     type: String, 
//     enum: ["pending", "approved", "rejected"], 
//     default: "pending" 
//   }, // حالة المكان: معلق، موافق عليه، مرفوض
//   isDeleted: { type: Boolean, default: false } // ✅ الحقل الجديد للحذف الناعم
// }, { timestamps: true });

// const Place = mongoose.model("Place", placeSchema);
// module.exports = Place;



const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  short_description: { type: String, required: true }, 
  detailed_description: { type: String, required: true }, 
  city: { type: String, required: true },
  location: {
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
  },
  working_hours: { type: String, required: true },
  rating: { type: Number, default: 0 },
  ticket_price: { type: Number, required: true },
  categories: [{ type: String, required: true }], // قائمة الفئات (منتزهات، طبيعة..)
  best_season: { type: String, required: true }, // الموسم الأنسب للزيارة
  is_free: { type: Boolean, required: true },
  suitable_for: [{ type: String, required: true }], // الفئات المستهدفة (عائلات، أطفال..)
  contact: {
    phone: { type: String, required: false }, // رقم الهاتف
    website: { type: String, required: false } // الموقع الإلكتروني
  },
  map_link: { type: String, required: false }, // رابط خرائط جوجل
  images: [{ type: String, required: true }], // صور للمكان
  gallery: [{ type: String, required: false }], // ألبوم صور إضافي
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  }, // حالة المكان: معلق، موافق عليه، مرفوض
  isDeleted: { type: Boolean, default: false }, // ✅ الحقل الجديد للحذف الناعم
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // هنا نشير إلى نموذج المستخدم الذي أنشأ المكان
    required: true 
  }
}, { timestamps: true });

placeSchema.plugin(mongoosePaginate);

const Place = mongoose.model("Place", placeSchema);
module.exports = Place;
