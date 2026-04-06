const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// Upload 1 file ảnh (bắt buộc phải là admin)
router.post('/image', protect, adminOnly, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Không tìm thấy file tải lên' });
        }
        res.json({
            message: 'Tải ảnh lên thành công',
            imageUrl: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
