// Loading Animation
let count = 0;
const fill = document.querySelector('.fill');
const percent = document.getElementById('percent');
const loader = document.getElementById('loader');

const interval = setInterval(() => {
    count++;
    percent.innerText = count + "%";
    fill.style.width = count + "%";
    if(count === 100) {
        clearInterval(interval);
        loader.style.transform = "translateY(-100%)";
    }
}, 30);

// Menu button functionality
document.querySelector('.menu-btn').addEventListener('click', () => {
    document.querySelector('.skills').scrollIntoView({ behavior: 'smooth' });
});

// Full Stack button functionality
if (document.getElementById('full-stack-btn')) {
    document.getElementById('full-stack-btn').addEventListener('click', () => {
        const uploadSection = document.getElementById('upload-section');
        uploadSection.classList.toggle('hidden');
        const btn = document.getElementById('full-stack-btn');
        btn.textContent = uploadSection.classList.contains('hidden') ? 'Full Stack' : 'Hide Upload';
    });
}

// Video functionality
const API_BASE = 'http://localhost:3000/api';

async function loadVideos() {
    try {
        const response = await fetch(`${API_BASE}/videos`);
        const videos = await response.json();
        displayVideos(videos);
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

function displayVideos(videos) {
    const gallery = document.getElementById('video-gallery');
    gallery.innerHTML = '';

    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <video controls>
                <source src="/uploads/${video.filename}" type="${video.mimetype}">
                Your browser does not support the video tag.
            </video>
            <div class="video-info">
                <h4>${video.title}</h4>
                <p>${video.description}</p>
                <div class="video-meta">
                    <span>${new Date(video.uploadDate).toLocaleDateString()}</span>
                    <span>${(video.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <button class="delete-btn" onclick="deleteVideo('${video._id}')">Delete</button>
            </div>
        `;
        gallery.appendChild(videoCard);
    });
}

async function deleteVideo(id) {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
        const response = await fetch(`${API_BASE}/videos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadVideos(); // Reload videos
        } else {
            alert('Error deleting video');
        }
    } catch (error) {
        console.error('Error deleting video:', error);
        alert('Error deleting video');
    }
}

// Video upload
document.getElementById('video-upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('video-title').value;
    const description = document.getElementById('video-description').value;
    const file = document.getElementById('video-file').files[0];

    if (!file) {
        alert('Please select a video file');
        return;
    }

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
        const response = await fetch(`${API_BASE}/videos`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            document.getElementById('video-upload-form').reset();
            loadVideos(); // Reload videos
            alert('Video uploaded successfully!');
        } else {
            const error = await response.json();
            alert('Error uploading video: ' + error.error);
        }
    } catch (error) {
        console.error('Error uploading video:', error);
        alert('Error uploading video');
    }
});

// Load videos when page loads
document.addEventListener('DOMContentLoaded', loadVideos);

// Three.js 3D Particles
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const vertices = [];
const colors = [];
const color = new THREE.Color();
for (let i = 0; i < 5000; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(10)); // X
    vertices.push(THREE.MathUtils.randFloatSpread(10)); // Y
    vertices.push(THREE.MathUtils.randFloatSpread(10)); // Z
    color.setHSL(Math.random(), 0.7, 0.5);
    colors.push(color.r, color.g, color.b);
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({ 
    size: 0.02, 
    vertexColors: true,
    transparent: true,
    opacity: 0.8
});
const points = new THREE.Points(geometry, material);
scene.add(points);

// Mouse interaction
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.002;
    points.rotation.x += 0.001;
    
    // Mouse influence
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}
animate();