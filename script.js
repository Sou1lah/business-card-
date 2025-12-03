// Mobile-optimized JavaScript for Business Card - FINAL VERSION
document.addEventListener('DOMContentLoaded', function() {
    // ===== FIREBASE INITIALIZATION =====
    const firebaseConfig = {
        apiKey: "AIzaSyByEj8DX--AVwkmV9nM3NrqPI280EZIEfQ",
        authDomain: "likesandviews-6f8be.firebaseapp.com",
        projectId: "likesandviews-6f8be",
        storageBucket: "likesandviews-6f8be.firebasestorage.app",
        messagingSenderId: "834747682410",
        appId: "1:834747682410:web:7455de4faaf949d68a4413",
        measurementId: "G-BWL04Z0CNZ"
    };

    // Initialize Firebase (using Firebase v8 from CDN)
    let db;
    if (typeof firebase !== 'undefined') {
        try {
            // Check if Firebase is already initialized
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            } else {
                firebase.app(); // if already initialized, use that one
            }
            db = firebase.firestore();
            console.log("Firebase initialized successfully!");
        } catch (error) {
            console.error("Firebase initialization error:", error);
            db = null;
        }
    } else {
        console.error("Firebase is not loaded! Check if scripts are included.");
        db = null;
    }
    
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
    
    // ===== GLOBAL STATISTICS WITH FIREBASE =====
    let viewCount = 0;
    let likeCount = 0;
    let userHasLiked = false;
    let totalLiked = 0;
    let uniqueVisitors = 0;
    
    // Generate unique user ID
    function getUserId() {
        let userId = localStorage.getItem('card_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('card_user_id', userId);
        }
        return userId;
    }
    
    // Update counters display
    function updateCounters() {
        const viewCountEl = document.getElementById('viewCount');
        const likeCountEl = document.getElementById('likeCount');
        const popupViewCount = document.getElementById('popupViewCount');
        const popupLikeCount = document.getElementById('popupLikeCount');
        const likedByCount = document.getElementById('likedByCount');
        const uniqueVisitorsEl = document.getElementById('uniqueVisitors');

        if (viewCountEl) viewCountEl.textContent = abbreviateNumber(viewCount);
        if (likeCountEl) likeCountEl.textContent = abbreviateNumber(likeCount);
        if (popupViewCount) popupViewCount.textContent = viewCount.toLocaleString();
        if (popupLikeCount) popupLikeCount.textContent = likeCount.toLocaleString();
        if (likedByCount) likedByCount.textContent = totalLiked.toLocaleString();
        if (uniqueVisitorsEl) uniqueVisitorsEl.textContent = uniqueVisitors.toLocaleString();
        
        // Update like button visual state
        const likeBtn = document.getElementById('likeBtn');
        if (userHasLiked) {
            likeBtn.classList.add('liked');
        } else {
            likeBtn.classList.remove('liked');
        }
    }
    
    function abbreviateNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    // Load stats from Firebase
    async function loadStats() {
        try {
            if (!db) {
                console.log('Firebase not available, using localStorage');
                loadLocalStats();
                return;
            }
            
            console.log('Loading stats from Firebase...');
            
            // Get stats document
            const statsDoc = await db.collection('stats').doc('card_stats').get();
            
            if (statsDoc.exists) {
                const data = statsDoc.data();
                viewCount = data.views || 0;
                likeCount = data.likes || 0;
                uniqueVisitors = data.uniqueVisitors || 0;
                
                // Count total liked users
                const likesSnapshot = await db.collection('likes').get();
                totalLiked = likesSnapshot.size;
                
                // Check if current user has liked
                const userId = getUserId();
                const userLikeDoc = await db.collection('likes').doc(userId).get();
                userHasLiked = userLikeDoc.exists;
                
                console.log('Stats loaded from Firebase:', { 
                    views: viewCount, 
                    likes: likeCount, 
                    uniqueVisitors: uniqueVisitors,
                    totalLiked, 
                    userHasLiked 
                });
            } else {
                // Create initial stats
                await db.collection('stats').doc('card_stats').set({
                    views: 0,
                    likes: 0,
                    uniqueVisitors: 0,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('Created initial stats in Firebase');
            }
            
            updateCounters();
        } catch (error) {
            console.error('Error loading stats from Firebase:', error);
            console.log('Falling back to localStorage...');
            loadLocalStats();
        }
    }
    
    function loadLocalStats() {
        const savedViews = localStorage.getItem('card_views');
        const savedLikes = localStorage.getItem('card_likes');
        const savedLiked = localStorage.getItem('user_has_liked');

        if (savedViews) viewCount = parseInt(savedViews);
        if (savedLikes) likeCount = parseInt(savedLikes);
        if (savedLiked) userHasLiked = savedLiked === 'true';

        updateCounters();
    }
    
    // Track view (once per session)
    async function trackView() {
        if (sessionStorage.getItem('view_tracked')) {
            console.log('View already tracked this session');
            return;
        }
        
        try {
            if (!db) {
                viewCount++;
                localStorage.setItem('card_views', viewCount);
                updateCounters();
                sessionStorage.setItem('view_tracked', 'true');
                return;
            }
            
            console.log('Tracking view in Firebase...');
            
            const userId = getUserId();
            
            // Check if this is a new visitor
            const visitorDoc = await db.collection('visitors').doc(userId).get();
            const isNewVisitor = !visitorDoc.exists;
            
            // Prepare update data
            const updateData = {
                views: firebase.firestore.FieldValue.increment(1),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // If new visitor, increment unique visitors
            if (isNewVisitor) {
                updateData.uniqueVisitors = firebase.firestore.FieldValue.increment(1);
                
                // Record this visitor
                await db.collection('visitors').doc(userId).set({
                    firstVisit: firebase.firestore.FieldValue.serverTimestamp(),
                    lastVisit: firebase.firestore.FieldValue.serverTimestamp(),
                    userAgent: navigator.userAgent.substring(0, 100)
                });
                
                uniqueVisitors++;
            } else {
                // Update last visit time for returning visitor
                await db.collection('visitors').doc(userId).update({
                    lastVisit: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            // Update stats
            await db.collection('stats').doc('card_stats').update(updateData);
            
            viewCount++;
            sessionStorage.setItem('view_tracked', 'true');
            updateCounters();
            console.log('View tracked successfully. New visitor:', isNewVisitor);
        } catch (error) {
            console.error('Error tracking view:', error);
            viewCount++;
            localStorage.setItem('card_views', viewCount);
            sessionStorage.setItem('view_tracked', 'true');
            updateCounters();
        }
    }
    
    // Handle like/unlike
    async function handleLike() {
        const likeBtn = document.getElementById('likeBtn');
        
        if (likeBtn.classList.contains('animating')) return;
        likeBtn.classList.add('animating');
        
        // Show animation immediately
        likeBtn.classList.add('liked');
        
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        
        try {
            if (!db) {
                throw new Error('Firebase not available');
            }
            
            console.log('Toggling like in Firebase...');
            const userId = getUserId();
            
            if (userHasLiked) {
                // Remove like
                await db.collection('stats').doc('card_stats').update({
                    likes: firebase.firestore.FieldValue.increment(-1)
                });
                await db.collection('likes').doc(userId).delete();
                likeCount = Math.max(0, likeCount - 1);
                totalLiked = Math.max(0, totalLiked - 1);
                userHasLiked = false;
                localStorage.setItem('user_has_liked', 'false');
                
                setTimeout(() => {
                    likeBtn.classList.remove('liked');
                }, 600);
            } else {
                // Add like
                await db.collection('stats').doc('card_stats').update({
                    likes: firebase.firestore.FieldValue.increment(1)
                });
                await db.collection('likes').doc(userId).set({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    userAgent: navigator.userAgent.substring(0, 100)
                });
                likeCount++;
                totalLiked++;
                userHasLiked = true;
                localStorage.setItem('user_has_liked', 'true');
            }
            
            updateCounters();
            console.log('Like toggled successfully:', { likes: likeCount, userHasLiked });
        } catch (error) {
            console.error('Error toggling like:', error);
            toggleLikeLocally(likeBtn);
        }
        
        setTimeout(() => {
            likeBtn.classList.remove('animating');
        }, 600);
    }
    
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
            if (!db) {
                // Show local stats
                const statsPopup = document.getElementById('statsPopup');
                const popupViewCount = document.getElementById('popupViewCount');
                const popupLikeCount = document.getElementById('popupLikeCount');
                const likedByCount = document.getElementById('likedByCount');
                const uniqueVisitorsEl = document.getElementById('uniqueVisitors');
                
                if (popupViewCount) popupViewCount.textContent = viewCount.toLocaleString();
                if (popupLikeCount) popupLikeCount.textContent = likeCount.toLocaleString();
                if (likedByCount) likedByCount.textContent = totalLiked.toLocaleString();
                if (uniqueVisitorsEl) uniqueVisitorsEl.textContent = uniqueVisitors.toLocaleString();
                
                statsPopup.classList.add('active');
                document.body.style.overflow = 'hidden';
                return;
            }
            
            console.log('Showing stats popup from Firebase...');
            
            // Get fresh stats from Firebase
            const statsDoc = await db.collection('stats').doc('card_stats').get();
            const likesSnapshot = await db.collection('likes').get();
            const visitorsSnapshot = await db.collection('visitors').get();
            
            if (statsDoc.exists) {
                const data = statsDoc.data();
                const statsPopup = document.getElementById('statsPopup');
                const popupViewCount = document.getElementById('popupViewCount');
                const popupLikeCount = document.getElementById('popupLikeCount');
                const likedByCount = document.getElementById('likedByCount');
                const uniqueVisitorsEl = document.getElementById('uniqueVisitors');
                
                if (popupViewCount) popupViewCount.textContent = data.views.toLocaleString();
                if (popupLikeCount) popupLikeCount.textContent = data.likes.toLocaleString();
                if (likedByCount) likedByCount.textContent = likesSnapshot.size.toLocaleString();
                if (uniqueVisitorsEl) uniqueVisitorsEl.textContent = visitorsSnapshot.size.toLocaleString();
                
                // Update local variables
                viewCount = data.views || 0;
                likeCount = data.likes || 0;
                totalLiked = likesSnapshot.size;
                uniqueVisitors = visitorsSnapshot.size;
                
                statsPopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.error('Error showing stats:', error);
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
    
    // ===== EVENT LISTENERS =====
    // Initialize stats
    loadStats();
    
    // Track view after a short delay
    setTimeout(() => {
        trackView();
    }, 500);
    
    // View button - show stats popup
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
    
    // Close stats popup button
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
    
    // Debug function
    function testFirebase() {
        console.log('=== Firebase Test ===');
        console.log('Firebase available:', typeof firebase !== 'undefined');
        console.log('Firestore available:', typeof firebase.firestore !== 'undefined');
        console.log('Database instance:', db ? 'Connected' : 'Not connected');
        console.log('User ID:', getUserId());
        console.log('Theme:', localStorage.getItem('theme') || 'dark');
    }
    
    // Uncomment to test
    // testFirebase();
    
    // Handle admin button clicks (for future use)
    document.querySelectorAll('.admin-action').forEach(button => {
        button.addEventListener('click', function() {
            const adminWarning = document.getElementById('adminWarning');
            if (adminWarning) {
                adminWarning.classList.add('active');
            }
        });
    });
});