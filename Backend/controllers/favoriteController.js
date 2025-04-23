
const Favorite = require("../models/Favorite");
const Place = require("../models/places");

// إضافة مكان إلى المفضلة
const addFavorite = async (req, res) => {
  const { userId, placeId } = req.body;
  
  try {
    let favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      favorite = new Favorite({ userId, places: [placeId] });
    } else {
      if (!favorite.places.includes(placeId)) {
        favorite.places.push(placeId);
      } else {
        return res.status(400).json({ message: "المكان موجود بالفعل في المفضلة." });
      }
    }

    await favorite.save();
    res.status(200).json({ message: "تم إضافة المكان إلى المفضلة!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ، يرجى المحاولة لاحقاً." });
  }
};

// إزالة مكان من المفضلة
const removeFavorite = async (req, res) => {
  const { userId, placeId } = req.body;

  try {
    const favorite = await Favorite.findOne({ userId });

    if (!favorite) {
      return res.status(404).json({ message: "لا توجد مفضلة لهذا المستخدم." });
    }

    favorite.places = favorite.places.filter(place => place.toString() !== placeId);
    await favorite.save();

    res.status(200).json({ message: "تم إزالة المكان من المفضلة!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ، يرجى المحاولة لاحقاً." });
  }
};

// الحصول على المفضلات للمستخدم
const getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const favorite = await Favorite.findOne({ userId }).populate("places");

    if (!favorite) {
      return res.status(404).json({ message: "لا توجد مفضلات لهذا المستخدم." });
    }

    res.status(200).json(favorite.places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "حدث خطأ، يرجى المحاولة لاحقاً." });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
