const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const statsFile = path.join(__dirname, 'stats.txt');

// Initialize stats file
async function initStats() {
    try {
        await fs.access(statsFile);
    } catch {
        const defaultStats = {
            views: 0,
            likes: 0,
            liked_ips: []
        };
        await fs.writeFile(statsFile, JSON.stringify(defaultStats));
    }
}

// Load stats
async function loadStats() {
    try {
        const data = await fs.readFile(statsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading stats:', error);
        return { views: 0, likes: 0, liked_ips: [] };
    }
}

// Save stats
async function saveStats(stats) {
    await fs.writeFile(statsFile, JSON.stringify(stats));
}

// Get client IP
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.connection.remoteAddress || 
           req.ip || 
           '127.0.0.1';
}

// API Routes
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await loadStats();
        const clientIP = getClientIP(req);
        const hasLiked = stats.liked_ips.includes(clientIP);
        
        res.json({
            success: true,
            views: stats.views,
            likes: stats.likes,
            total_liked: stats.liked_ips.length,
            has_liked: hasLiked
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/view', async (req, res) => {
    try {
        const stats = await loadStats();
        stats.views++;
        await saveStats(stats);
        
        res.json({ 
            success: true, 
            views: stats.views 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/like', async (req, res) => {
    try {
        const stats = await loadStats();
        const clientIP = getClientIP(req);
        const hasLiked = stats.liked_ips.includes(clientIP);
        
        if (hasLiked) {
            // Remove like
            stats.liked_ips = stats.liked_ips.filter(ip => ip !== clientIP);
            stats.likes = Math.max(0, stats.likes - 1);
        } else {
            // Add like
            stats.liked_ips.push(clientIP);
            stats.likes++;
        }
        
        await saveStats(stats);
        
        res.json({
            success: true,
            likes: stats.likes,
            total_liked: stats.liked_ips.length,
            has_liked: !hasLiked
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialize and start server
initStats().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Stats file: ${statsFile}`);
    });
});