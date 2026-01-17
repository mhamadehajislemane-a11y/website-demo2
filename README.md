# Software Engineering Class Website

A full-stack web application for the Software Engineering class featuring a stunning 3D particle background and video upload/sharing functionality.

## Features

- **Interactive 3D Background**: Animated particle system with mouse interaction
- **Video Upload**: Upload and share videos with the class
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Gallery**: View all uploaded videos in a grid layout

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Three.js
- **Backend**: Node.js, Express.js
- **Storage**: File system (videos stored locally)
- **Data**: JSON file for video metadata

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

### Viewing the Site
- The homepage features an animated 3D background
- Scroll down to see class information and tracks
- Use the "Join Devs" button to navigate to the video section

### Uploading Videos
1. Scroll to the "Video Gallery" section
2. Fill in the video title and description (optional)
3. Select a video file (up to 100MB)
4. Click "Upload Video"
5. The video will appear in the gallery below

### Managing Videos
- Videos are displayed in a responsive grid
- Each video shows title, description, upload date, and file size
- Click the "Delete" button to remove a video

## File Structure

```
├── a.html          # Main HTML file
├── style.css       # Stylesheet
├── script.js       # Frontend JavaScript
├── server.js       # Backend server
├── package.json    # Node.js dependencies
├── uploads/        # Uploaded video files
├── videos.json     # Video metadata
└── README.md       # This file
```

## API Endpoints

- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload a new video
- `GET /api/videos/:id` - Get specific video
- `DELETE /api/videos/:id` - Delete a video
- `GET /uploads/:filename` - Serve video file

## Development

For development with auto-restart:
```bash
npm install -g nodemon
npm run dev
```

## Notes

- Videos are stored locally in the `uploads/` directory
- Video metadata is stored in `videos.json`
- Maximum video size: 100MB
- Supported formats: All video formats accepted by browsers