// Mobile-optimized JavaScript for Business Card - FIREBASE VERSION
document.addEventListener('DOMContentLoaded', function() {
    // ===== FIREBASE CONFIGURATION =====
    // Replace these with YOUR actual Firebase config values
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY_HERE",
        authDomain: "YOUR_PROJECT.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (error) {
        console.log("Firebase already initialized");
    }
    
    const db = firebase.firestore();
    console.log("Firebase initialized successfully!");

    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    let themeIcon;
    
    if (themeToggle) {
        themeIcon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleTheme();
            if (navigator.vibrate) navigator.vibrate(10);
        });
        
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
    }
    
    function toggleTheme() {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            if (themeIcon) themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            if (themeIcon) themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
    
    // ===== CARD FLIP =====
    const flipCard = document.getElementById('flipCard');
    let isFlipped = false;
    let flipTimeout = null;
    
    if (flipCard) {
        function handleCardFlip() {
            if (flipTimeout) return;
            
            if (navigator.vibrate) navigator.vibrate(20);
            
            if (!isFlipped) {
                flipCard.classList.add('flipped');
                isFlipped = true;
            } else {
                flipCard.classList.remove('flipped');
                isFlipped = false;
            }
            
            flipTimeout = setTimeout(() => {
                flipTimeout = null;
            }, 600);
        }
        
        flipCard.addEventListener('click', handleCardFlip);
        flipCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handleCardFlip();
        });
        
        flipCard.setAttribute('tabindex', '0');
        flipCard.setAttribute('role', 'button');
        flipCard.setAttribute('aria-label', 'Business card - tap or click to flip');
    }
    
    // Prevent card flip when clicking on icons
    document.querySelectorAll('.social-icon, .language-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        icon.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            if (navigator.vibrate) navigator.vibrate(10);
        });
    });
    
    // ===== MATRIX EFFECT =====
    const canvas = document.getElementById('matrixCanvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        function initMatrix() {
            resizeCanvas();
            
            const letters = '01';
            const fontSize = 12;
            const columns = Math.floor(canvas.width / fontSize);
            const drops = [];
            
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
            
            function draw() {
                if (document.body.classList.contains('light-theme')) {
                    ctx.fillStyle = 'rgba(240, 240, 240, 0.04)';
                } else {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
                }
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.font = `${fontSize}px monospace`;
                
                for (let i = 0; i < drops.length; i++) {
                    const char = letters[Math.floor(Math.random() * letters.length)];
                    
                    if (document.body.classList.contains('light-theme')) {
                        ctx.fillStyle = '#009900';
                    } else {
                        ctx.fillStyle = '#00ff00';
                    }
                    
                    ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                    drops[i]++;
                    
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                }
            }
            
            let lastTime = 0;
            function animate(time) {
                if (time - lastTime > 50) {
                    draw();
                    lastTime = time;
                }
                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        }
        
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 250);
        });
        
        window.addEventListener('orientationchange', function() {
            setTimeout(function() {
                resizeCanvas();
                initMatrix();
            }, 100);
        });
        
        initMatrix();
    }
    
    // ===== ORIENTATION WARNING =====
    const orientationWarning = document.getElementById('orientationWarning');
    
    function checkOrientation() {
        if (window.innerHeight < 500 && window.innerWidth > window.innerHeight) {
            if (orientationWarning) orientationWarning.style.display = 'flex';
        } else {
            if (orientationWarning) orientationWarning.style.display = 'none';
        }
    }
    
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    checkOrientation();
    
    // ===== IMAGE LOADING =====
    const profileImage = document.querySelector('.profile-pic img');
    if (profileImage) {
        profileImage.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        profileImage.addEventListener('error', function() {
            this.style.display = 'none';
            const fallbackIcon = document.createElement('i');
            fallbackIcon.className = 'fas fa-user-secret';
            fallbackIcon.style.fontSize = '50px';
            fallbackIcon.style.color = '#0f0';
            this.parentElement.appendChild(fallbackIcon);
        });
    }
    
    // ===== SLIDING PANEL =====
    const panelToggle = document.getElementById('panelToggle');
    const slidingPanel = document.getElementById('slidingPanel');
    const panelClose = document.getElementById('panelClose');
    const panelThemeToggle = document.getElementById('panelThemeToggle');
    let panelOpen = false;
    
    const overlay = document.createElement('div');
    overlay.className = 'panel-overlay';
    document.body.appendChild(overlay);
    
    function togglePanel() {
        panelOpen = !panelOpen;
        if (panelOpen) {
            slidingPanel.classList.add('open');
            overlay.classList.add('active');
            if (panelToggle) panelToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
        } else {
            slidingPanel.classList.remove('open');
            overlay.classList.remove('active');
            if (panelToggle) panelToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
        }
    }
    
    if (panelToggle) {
        panelToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePanel();
        });
    }
    
    if (panelClose) {
        panelClose.addEventListener('click', togglePanel);
    }
    
    overlay.addEventListener('click', togglePanel);
    
    document.addEventListener('click', function(e) {
        if (panelOpen && slidingPanel && !slidingPanel.contains(e.target) && e.target !== panelToggle) {
            togglePanel();
        }
    });
    
    if (panelThemeToggle) {
        panelThemeToggle.addEventListener('click', toggleTheme);
    }
    
    const qrBtn = document.querySelector('.qr-btn');
    if (qrBtn) {
        qrBtn.addEventListener('click', function() {
            console.log('QR Code button clicked');
        });
    }
    
    const noteBtn = document.querySelector('.note-btn');
    if (noteBtn) {
        noteBtn.addEventListener('click', function() {
            console.log('Leave Note button clicked');
        });
    }
    
    // ===== FIREBASE STATISTICS SYSTEM =====
    let viewCount = 0;
    let likeCount = 0;
    let userHasLiked = false;
    let uniqueVisitors = 0;
    let likedBy = 0;
    
    // Generate a unique user ID
    function getUserId() {
        let userId = localStorage.getItem('card_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('card_user_id', userId);
        }
        return userId;
    }
    
    // Update counters on the page
    function updateCounters() {
        const viewCountEl = document.getElementById('viewCount');
        const likeCountEl = document.getElementById('likeCount');
        const popupViewCount = document.getElementById('popupViewCount');
        const popupLikeCount = document.getElementById('popupLikeCount');
        const uniqueVisitorsEl = document.getElementById('uniqueVisitors');
        const likedByCount = document.getElementById('likedByCount');
        
        if (viewCountEl) viewCountEl.textContent = abbreviateNumber(viewCount);
        if (likeCountEl) likeCountEl.textContent = abbreviateNumber(likeCount);
        if (popupViewCount) popupViewCount.textContent = viewCount.toLocaleString();
        if (popupLikeCount) popupLikeCount.textContent = likeCount.toLocaleString();
        if (uniqueVisitorsEl) uniqueVisitorsEl.textContent = uniqueVisitors.toLocaleString();
        if (likedByCount) likedByCount.textContent = likedBy.toLocaleString();
    }
    
    function abbreviateNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    // Load stats from Firebase
    async function loadStats() {
        try {
            console.log('Loading stats from Firebase...');
            
            // Get the stats document
            const statsDoc = await db.collection('stats').doc('cardStats').get();
            
            if (statsDoc.exists) {
                const data = statsDoc.data();
                viewCount = data.views || 0;
                likeCount = data.likes || 0;
                uniqueVisitors = data.uniqueVisitors || 0;
                
                // Check if user has already liked
                const userId = getUserId();
                const likeDoc = await db.collection('likes').doc(userId).get();
                userHasLiked = likeDoc.exists;
                
                // Get liked count
                const likesSnapshot = await db.collection('likes').get();
                likedBy = likesSnapshot.size;
                
                console.log('Stats loaded from Firebase:', { viewCount, likeCount, userHasLiked });
                updateCounters();
                
                // Update like button visual state
                const likeBtn = document.getElementById('likeBtn');
                if (userHasLiked) {
                    likeBtn.classList.add('liked');
                } else {
                    likeBtn.classList.remove('liked');
                }
            } else {
                // Create initial stats document
                await db.collection('stats').doc('cardStats').set({
                    views: 0,
                    likes: 0,
                    uniqueVisitors: 0,
                    updatedAt: new Date()
                });
                console.log('Created initial stats document');
            }
        } catch (error) {
            console.error('Error loading stats from Firebase:', error);
            loadLocalStats();
        }
    }
    
    // Fallback to localStorage if Firebase fails
    function loadLocalStats() {
        const savedViews = localStorage.getItem('card_views');
        const savedLikes = localStorage.getItem('card_likes');
        const savedLiked = localStorage.getItem('user_has_liked');
        
        if (savedViews) viewCount = parseInt(savedViews);
        if (savedLikes) likeCount = parseInt(savedLikes);
        if (savedLiked) userHasLiked = savedLiked === 'true';
        
        console.log('Loaded local stats:', { viewCount, likeCount, userHasLiked });
        updateCounters();
    }
    
    // Track a view
    async function trackView() {
        try {
            const today = new Date().toDateString();
            const lastView = localStorage.getItem('card_last_view');
            
            // Only count one view per day per user
            if (lastView !== today) {
                console.log('Tracking view in Firebase...');
                
                // Update views count
                await db.collection('stats').doc('cardStats').update({
                    views: firebase.firestore.FieldValue.increment(1),
                    updatedAt: new Date()
                });
                
                viewCount++;
                localStorage.setItem('card_last_view', today);
                updateCounters();
                
                console.log('View tracked successfully');
            } else {
                console.log('View already counted today');
            }
        } catch (error) {
            console.error('Error tracking view:', error);
            // Fallback to localStorage
            viewCount++;
            localStorage.setItem('card_views', viewCount);
            updateCounters();
        }
    }
    
    // Handle like/unlike
    async function handleLike() {
        const likeBtn = document.getElementById('likeBtn');
        
        if (likeBtn.classList.contains('animating')) return;
        likeBtn.classList.add('animating');
        
        // Show animation immediately for better UX
        likeBtn.classList.add('liked');
        
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        
        try {
            const userId = getUserId();
            
            // Check if user has already liked
            const likeDoc = await db.collection('likes').doc(userId).get();
            const alreadyLiked = likeDoc.exists;
            
            if (alreadyLiked) {
                // Unlike: remove from likes collection and decrement count
                await db.collection('likes').doc(userId).delete();
                await db.collection('stats').doc('cardStats').update({
                    likes: firebase.firestore.FieldValue.increment(-1),
                    updatedAt: new Date()
                });
                
                likeCount = Math.max(0, likeCount - 1);
                userHasLiked = false;
                likedBy--;
                
                // Remove liked class after animation
                setTimeout(() => {
                    likeBtn.classList.remove('liked');
                }, 600);
            } else {
                // Like: add to likes collection and increment count
                await db.collection('likes').doc(userId).set({
                    timestamp: new Date(),
                    userId: userId
                });
                await db.collection('stats').doc('cardStats').update({
                    likes: firebase.firestore.FieldValue.increment(1),
                    updatedAt: new Date()
                });
                
                likeCount++;
                userHasLiked = true;
                likedBy++;
            }
            
            updateCounters();
            console.log('Like toggled successfully:', { userHasLiked, likeCount });
        } catch (error) {
            console.error('Error toggling like:', error);
            toggleLikeLocally(likeBtn);
        }
        
        setTimeout(() => {
            likeBtn.classList.remove('animating');
        }, 600);
    }
    
    // Fallback for like/unlike
    function toggleLikeLocally(likeBtn) {
        userHasLiked = !userHasLiked;
        
        if (userHasLiked) {
            likeCount++;
        } else {
            likeCount = Math.max(0, likeCount - 1);
            setTimeout(() => {
                likeBtn.classList.remove('liked');
            }, 600);
        }
        
        localStorage.setItem('card_likes', likeCount);
        localStorage.setItem('user_has_liked', userHasLiked);
        updateCounters();
    }
    
    // Show stats popup
    async function showStatsPopup() {
        try {
            console.log('Showing stats popup...');
            
            // Refresh stats from Firebase
            const statsDoc = await db.collection('stats').doc('cardStats').get();
            if (statsDoc.exists) {
                const data = statsDoc.data();
                viewCount = data.views || 0;
                likeCount = data.likes || 0;
                uniqueVisitors = data.uniqueVisitors || 0;
                
                // Get current liked count
                const likesSnapshot = await db.collection('likes').get();
                likedBy = likesSnapshot.size;
                
                updateCounters();
            }
            
            const statsPopup = document.getElementById('statsPopup');
            statsPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Error showing stats popup:', error);
            const statsPopup = document.getElementById('statsPopup');
            statsPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeStatsPopup() {
        const statsPopup = document.getElementById('statsPopup');
        statsPopup.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // ===== INITIALIZE EVERYTHING =====
    console.log('Initializing business card...');
    
    // Load stats first
    loadStats();
    
    // Track view after a short delay
    setTimeout(() => {
        trackView();
    }, 500);
    
    // ===== EVENT LISTENERS =====
    // View button
    const viewBtn = document.getElementById('viewBtn');
    if (viewBtn) {
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showStatsPopup();
        });
    }
    
    // Like button
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleLike();
        });
    }
    
    // Close stats popup
    const closeStatsBtn = document.getElementById('closeStatsBtn');
    if (closeStatsBtn) {
        closeStatsBtn.addEventListener('click', closeStatsPopup);
    }
    
    // Close stats popup when clicking outside
    const statsPopup = document.getElementById('statsPopup');
    if (statsPopup) {
        statsPopup.addEventListener('click', function(e) {
            if (e.target === statsPopup) {
                closeStatsPopup();
            }
        });
    }
    
    // Close stats popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeStatsPopup();
        }
    });
    
    // Admin warning button
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', function() {
            const adminWarning = document.getElementById('adminWarning');
            adminWarning.classList.remove('active');
        });
    }
    
    // Panel flip button
    const panelFlipBtn = document.getElementById('panelFlipBtn');
    if (panelFlipBtn && flipCard) {
        panelFlipBtn.addEventListener('click', function() {
            if (flipTimeout) return;
            
            if (!isFlipped) {
                flipCard.classList.add('flipped');
                isFlipped = true;
            } else {
                flipCard.classList.remove('flipped');
                isFlipped = false;
            }
            
            flipTimeout = setTimeout(() => {
                flipTimeout = null;
            }, 600);
        });
    }
});