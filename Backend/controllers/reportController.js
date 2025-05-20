const Report = require('../models/Report');
const Rating = require('../models/Rating');

// الإبلاغ عن تعليق
exports.reportComment = async (req, res) => {
  try {
    const { commentId, reason, details } = req.body;
    const userId = req.user.id;

    const comment = await Rating.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "التعليق غير موجود" });
    }

    const existingReport = await Report.findOne({ commentId, userId });
    if (existingReport) {
      return res.status(400).json({ error: "لقد قمت بالإبلاغ عن هذا التعليق سابقاً" });
    }

    // إنشاء البلاغ الجديد
    const newReport = new Report({
      commentId,
      userId,
      reason,
      details
    });

    await newReport.save();

    // تحديث عدد البلاغات على التعليق
    await Rating.findByIdAndUpdate(commentId, {
      $inc: { reportsCount: 1 }
    });

    res.status(201).json({ message: "تم إرسال البلاغ بنجاح", report: newReport });
  } catch (error) {
    console.error("Error reporting comment:", error);
    res.status(500).json({ error: "حدث خطأ أثناء إرسال البلاغ" });
  }
};

// جلب جميع البلاغات (للمشرفين)
exports.getAllReports = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .populate('commentId', 'comment rating')
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب البلاغات" });
  }
};

// تحديث حالة البلاغ (للمشرفين)
exports.resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const adminId = req.user.id;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: "البلاغ غير موجود" });
    }

    let update = {
      status: 'resolved',
      resolvedBy: adminId,
      resolvedAt: new Date()
    };

    if (action === 'hide_comment') {
      await Rating.findByIdAndUpdate(report.commentId, { isHidden: true });
    } else if (action === 'no_action') {
      update.status = 'reviewed';
    }

    const updatedReport = await Report.findByIdAndUpdate(id, update, { new: true });

    res.status(200).json({ message: "تم تحديث حالة البلاغ", report: updatedReport });
  } catch (error) {
    console.error("Error resolving report:", error);
    res.status(500).json({ error: "حدث خطأ أثناء تحديث حالة البلاغ" });
  }
};