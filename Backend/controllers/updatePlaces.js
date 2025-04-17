const mongoose = require('mongoose');

// ✅ عدل رابط الاتصال حسب رابط MongoDB تبعك
mongoose.connect('mongodb://localhost:9527/places', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 👇 استخدم سكيمه فاضي لأنك مش مهتم بالتحقق من الحقول
const Place = mongoose.model('Place', new mongoose.Schema({}, { strict: false }));

async function updatePlaces() {
  try {
    const result = await Place.updateMany({}, {
      $set: {
        status: 'approved',
        isDeleted: false
      }
    });
    console.log('✅ Documents updated:', result.modifiedCount);
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error updating documents:', err);
  }
}

updatePlaces();
