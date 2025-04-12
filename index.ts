import express from 'express';
import upload from './config/multerConfig';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Cho phép CORS từ tất cả các nguồn
app.use(cors());

// Phục vụ file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// Phục vụ ảnh từ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Route để upload file
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có file được upload' });
    }
    
    res.json({
        message: 'Upload thành công',
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
    });
});

// Route để lấy danh sách file đã upload
app.get('/uploads', (req, res) => {
    const files = fs.readdirSync(uploadsDir);
    res.json(files);
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});
