const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // محاولة الحصول على التوكن من الكوكيز أولاً
    let token = req.cookies.token;
    
    // إذا لم يوجد في الكوكيز، جرب الهيدر
    if (!token) {
        const authHeader = req.header('Authorization');
        token = authHeader?.replace('Bearer ', '');
    }

    if (!token) {
        console.log("No token provided");
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verify Error:", err);
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // تعيين معلومات المستخدم في req.user
        req.user = {
            id: decoded.userId || decoded.id,
            userId: decoded.userId || decoded.id,
            isAdmin: decoded.isAdmin,
            username: decoded.username,
            email: decoded.email
        };
        
        next();
    });
};


const authenticateToken = (req, res, next) => {
  // محاولة الحصول على التوكن من الكوكيز أولاً
  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'لم يتم توفير توكن المصادقة',
      code: 'MISSING_TOKEN'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    // تنظيف الكوكي إذا كان غير صالح
    res.clearCookie('token');
    
    return res.status(401).json({ 
      success: false,
      message: 'توكن المصادقة غير صالح أو منتهي الصلاحية',
      code: 'INVALID_TOKEN'
    });
  }
};

const checkAuth = (req, res) => {
  // إذا وصلنا إلى هنا يعني أن authenticateToken نجح
  res.json({
    success: true,
    user: req.user
  });
};


module.exports = { authMiddleware, authenticateToken,checkAuth };



