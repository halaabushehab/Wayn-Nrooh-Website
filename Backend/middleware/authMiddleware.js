const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  let token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'لم يتم توفير توكن المصادقة',
      code: 'MISSING_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId || decoded.id,
      userId: decoded.userId || decoded.id,
      username: decoded.username,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.clearCookie('token');
    return res.status(401).json({
      success: false,
      message: 'توكن المصادقة غير صالح أو منتهي الصلاحية',
      code: 'INVALID_TOKEN'
    });
  }
};

// دالة للتحقق من الصلاحيات
const authorize = (...roles) => {
  return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return res.status(403).json({
              success: false,
              message: `User role ${req.user.role} is not authorized to access this route`
          });
      }
      next();
  };
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  const user = req.user;  // User attached after JWT verification
  if (user && user.isAdmin) {
    return next();  // Proceed to the next handler if the user is admin
  }
  res.status(403).json({ message: "Forbidden, Admin access only" });
};




module.exports = { isAdmin,requireAuth  ,authorize};



