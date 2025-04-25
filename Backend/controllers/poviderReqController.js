const User = require("../models/User");
const jwt = require("jsonwebtoken");

const requestProviderRole = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // التحقق من أن المستخدم ليس مقدم خدمة بالفعل
    if (user.role === "provider" && user.isApproved) {
      return res
        .status(400)
        .json({ message: "You are already an approved provider" });
    }

    // التحقق من وجود طلب معلق
    if (user.providerStatus === "pending") {
      return res
        .status(400)
        .json({ message: "You already have a pending request" });
    }

    // تحديث البيانات دون تغيير الدور بعد
    user.providerStatus = "pending";
    user.profileImage = req.files["profileImage"]
      ? req.files["profileImage"][0].path
      : "";
    user.identityDocument = req.files["identityDocument"]
      ? req.files["identityDocument"][0].path
      : "";

    await user.save();

    res.status(200).json({
      message:
        "Provider request submitted successfully, awaiting admin approval.",
      status: "pending",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Get pending provider requests
// const getProviderRequests = async (req, res) => {
//   try {
//     const requests = await User.find({
//       role: "provider",
//       isApproved: false,
//     }).select("-password -cart -orders -likedProducts");
//     res.status(200).json(requests);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
const getProviderRequests = async (req, res) => {
  try {
    const requests = await User.find({
      providerStatus: "pending",
    }).select("-password -cart -orders -likedProducts");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Approve/Reject provider request
// const updateProviderRequestStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     // Only proceed if status is either 'approved' or 'rejected'
//     if (!["approved", "rejected"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const update =
//       status === "approved"
//         ? { isApproved: true }
//         : { role: "end-user", isApproved: false }; // Revert to end-user if rejected

//     const user = await User.findByIdAndUpdate(req.params.id, update, {
//       new: true,
//     }).select("-password -cart -orders -likedProducts");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: `Provider request ${status}`,
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
const updateProviderRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // تحديث حالة المستخدم بناءً على القرار
    user.providerStatus = status;

    if (status === "approved") {
      user.role = "provider";
      user.isApproved = true;
    } else {
      user.role = "end-user";
      user.isApproved = false;
    }

    await user.save();

    // إذا تمت الموافقة، نرسل توكنًا جديدًا
    if (status === "approved") {
      const updatedToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("token", updatedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    res.status(200).json({
      message: `Provider request ${status}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        providerStatus: user.providerStatus,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports = {
  requestProviderRole,
  getUserDetails,
  updateProviderRequestStatus,
  getProviderRequests,
};
