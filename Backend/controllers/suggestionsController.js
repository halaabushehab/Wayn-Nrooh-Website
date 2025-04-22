const Suggestion = require('../models/Suggestion');
const Place = require('../models/places');
const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const upload = require('../middleware/uploadMiddleware');
const { addPlace } = require('./placeController'); // تأكد من المسار الصحيح
// Middleware to verify token and permissions
const verifyTokenAndPermissions = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "يجب تسجيل الدخول - لا يوجد توكن" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "يجب تسجيل الدخول - توكن غير موجود" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    return res.status(403).json({ message: "توكن غير صالح أو منتهي الصلاحية" });
  }
};

// Create new suggestion
const createSuggestion = [
  verifyTokenAndPermissions,
  upload.array('images', 5),
  async (req, res) => {
    try {
      // Validate required fields
      const requiredFields = ['name', 'short_description', 'detailed_description', 'city'];
      const missingFields = requiredFields.filter(field => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: 'Missing required fields',
          missingFields
        });
      }

      // Create suggestion object
      const suggestionData = {
        user: req.user.userId,
        placeName: req.body.name,
        description: req.body.short_description + ' ' + req.body.detailed_description,
        city: req.body.city,
        workingHours: req.body.working_hours || "غير محدد",
        rating: Number(req.body.rating) || 0,
        ticketPrice: Number(req.body.ticket_price) || 0,
        price: Number(req.body.price) || 0,
        bestSeason: req.body.best_season || "any",
        requiresTickets: req.body.requires_tickets === 'true',
        isFree: req.body.is_free === 'true',
        status: "pending",
        categories: req.body.categories ? JSON.parse(req.body.categories) : [],
        contact: req.body.contact ? JSON.parse(req.body.contact) : {},
        createdAt: new Date()
      };

      // Process uploaded images
      if (req.files && req.files.length > 0) {
        suggestionData.images = req.files.map(file => ({
          path: `/uploads/suggestions/${file.filename}`,
          caption: file.originalname
        }));
      }

      // Save suggestion
      const suggestion = new Suggestion(suggestionData);
      await suggestion.save();

      // Add points to user
      await User.findByIdAndUpdate(req.user.userId, { $inc: { points: 10 } });

      res.status(201).json({
        message: "تم إنشاء الاقتراح بنجاح",
        suggestion
      });

    } catch (err) {
      console.error("❌ Error creating suggestion:", err);
      res.status(500).json({ 
        message: "حدث خطأ أثناء معالجة الاقتراح",
        error: err.message 
      });
    }
  }
];

// Get suggestions for admin
const getAdminSuggestions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {}; // تأكد من استخدام filter صحيح

    const suggestions = await Suggestion.find(filter);
    res.json(suggestions);
  } catch (err) {
    console.error("❌ Error getting admin suggestions:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// // Get all suggestion
// const getSuggestions = async (req, res) => {
//   try {
//     const { status } = req.query;
//     const filter = { deleted: false }; // التأكد من استبعاد الاقتراحات المحذوفة

//     // إذا تم تمرير status، يمكن إضافة filter إضافي
//     if (status) {
//       filter.status = status;
//     }

//     const suggestions = await Suggestion.find(filter)
//       .populate('user', 'username email')
//       .sort({ createdAt: -1 });

//     res.json(suggestions);
//   } catch (err) {
//     console.error("❌ Error getting suggestions:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// // Update suggestion status
// const updateSuggestionStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     if (!['approved', 'rejected', 'pending'].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const suggestion = await Suggestion.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!suggestion) {
//       return res.status(404).json({ message: "Suggestion not found" });
//     }
//     if (!status) {
//       return res.status(400).json({ message: "Status is required" });
//     }

//     // إذا تمت الموافقة، سيتم نقل بيانات الاقتراح إلى مجموعة الأماكن
//     if (status === 'approved') {
//       const placeData = {
//         name: suggestion.placeName,
//         description: suggestion.description,
//         city: suggestion.city,
//         workingHours: suggestion.workingHours,
//         rating: suggestion.rating,
//         ticket_price: suggestion.ticketPrice,
//         categories: suggestion.categories,
//         contact: suggestion.contact,
//         images: suggestion.images,
//       };

//       // استدعاء دالة addPlace لإضافة المكان الجديد
//       const newPlaceResponse = await addPlace({ body: placeData }); // تأكد من استيراد الدالة

//       // بعد إضافة المكان بنجاح، يمكن حذف الاقتراح من مجموعة suggestions (اختياري)
//       await Suggestion.findByIdAndDelete(id); // إذا أردت حذف الاقتراح بعد الموافقة عليه

//       return res.json({
//         message: 'Suggestion approved and added to places successfully',
//         suggestion,
//         place: newPlaceResponse.place, // إرجاع المكان الجديد
//       });
//     }

//     res.json({
//       message: `Suggestion ${status} successfully`,
//       suggestion,
//     });

//   } catch (err) {
//     console.error("❌ Error updating suggestion status:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Delete suggestion
// const deleteSuggestion = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // العثور على الاقتراح وتحديث حالة الحذف إلى true
//     const suggestion = await Suggestion.findByIdAndUpdate(id, { deleted: true }, { new: true });

//     if (!suggestion) {
//       return res.status(404).json({ message: "Suggestion not found" });
//     }

//     res.json({ message: "Suggestion marked as deleted successfully" });

//   } catch (err) {
//     console.error("❌ Error deleting suggestion:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // دالة لإضافة اقتراح إلى الأماكن
// const addPlaceFromSuggestion = async (req, res) => {
//   const { id } = req.params;  // الحصول على ID الاقتراح من الـ URL

//   try {
//       // إيجاد الاقتراح باستخدام الـ ID
//       const suggestion = await Suggestion.findById(id);

//       if (!suggestion) {
//           return res.status(404).json({ message: 'Suggestion not found' });
//       }

//       // حذف الاقتراح من الكولكشن
//       await Suggestion.findByIdAndDelete(id);

//       // إضافة الاقتراح كمكان جديد
//       const newPlace = new Place({
//           name: suggestion.name,
//           location: suggestion.location,
//           description: suggestion.description,
//           image: suggestion.image,  // يمكنك إضافة بيانات إضافية حسب الحاجة
//       });

//       // حفظ المكان الجديد في الكولكشن
//       await newPlace.save();

//       res.status(201).json({ message: 'Place added successfully' });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// };


module.exports = {
  verifyTokenAndPermissions,
  createSuggestion,
  getAdminSuggestions,
  // getSuggestions,
  // updateSuggestionStatus,
  // deleteSuggestion,
  // addPlaceFromSuggestion
};