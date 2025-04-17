const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: 'No token provided' });
console.log(token)
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("JWT Verify Error:", err); // لطباعة تفاصيل الخطأ
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.userId = decoded.id; // تخزين userId في الطلب
        next(); // الانتقال إلى المكون التالي
    });
    
};


const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log("Authorization Header:", authHeader);
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      console.log("Token not provided");
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
      req.user = decoded; 
      next();
    } catch (error) {
      console.log("Token verification failed:", error);
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
  };
  



module.exports = (authMiddleware ,authenticateToken);