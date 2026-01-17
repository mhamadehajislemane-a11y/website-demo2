const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'a.html'));
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Path to videos data file
const videosFile = path.join(__dirname, 'videos.json');

// Helper function to read videos
function readVideos() {
    if (!fs.existsSync(videosFile)) {
        return [];
    }
    const data = fs.readFileSync(videosFile, 'utf8');
    return JSON.parse(data);
}

// Helper function to write videos
function writeVideos(videos) {
    fs.writeFileSync(videosFile, JSON.stringify(videos, null, 2));
}

// Multer configuration for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

// Routes
app.get('/api/videos', (req, res) => {
    try {
        const videos = readVideos();
        res.json(videos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/videos', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }

        const videos = readVideos();
        const video = {
            _id: Date.now().toString(),
            title: req.body.title || req.file.originalname,
            description: req.body.description || '',
            filename: req.file.filename,
            originalName: req.file.originalname,
            uploadDate: new Date().toISOString(),
            size: req.file.size,
            mimetype: req.file.mimetype
        };

        videos.push(video);
        writeVideos(videos);

        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/videos/:id', (req, res) => {
    try {
        const videos = readVideos();
        const video = videos.find(v => v._id === req.params.id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/videos/:id', (req, res) => {
    try {
        const videos = readVideos();
        const videoIndex = videos.findIndex(v => v._id === req.params.id);
        if (videoIndex === -1) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const video = videos[videoIndex];

        // Delete file from filesystem
        const filePath = path.join(uploadsDir, video.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        videos.splice(videoIndex, 1);
        writeVideos(videos);

        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve uploaded videos
app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(uploadsDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});