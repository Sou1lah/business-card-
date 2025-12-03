// Mobile-optimized JavaScript for Business Card
document.addEventListener('DOMContentLoaded', function() {
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
    
    // ===== GLOBAL STATISTICS SYSTEM =====
    let viewCount = 0;
    let likeCount = 0;
    let userHasLiked = false;
    let totalLiked = 0;
    
    const STATS_API = 'update_stats.php'; // ONLY ONE PHP FILE
    
    // Load stats from server
    async function loadStats() {
        try {
            console.log('Loading stats from server...');
            const response = await fetch(STATS_API + '?action=get_stats&t=' + Date.now());
            const data = await response.json();
            
            if (data.success) {
                viewCount = data.views;
                likeCount = data.likes;
                totalLiked = data.total_liked;
                userHasLiked = data.has_liked;
                
                console.log('Stats loaded:', data);
                updateCounters();
                
                // Update like button visual state
                const likeBtn = document.getElementById('likeBtn');
                if (userHasLiked) {
                    likeBtn.classList.add('liked');
                } else {
                    likeBtn.classList.remove('liked');
                }
            }
        } catch (error) {
            console.error('Error loading stats:', error);
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
    
    function updateCounters() {
        const viewCountEl = document.getElementById('viewCount');
        const likeCountEl = document.getElementById('likeCount');
        const popupViewCount = document.getElementById('popupViewCount');
        const popupLikeCount = document.getElementById('popupLikeCount');
        const likedByCount = document.getElementById('likedByCount');
    
        if (viewCountEl) viewCountEl.textContent = abbreviateNumber(viewCount);
        if (likeCountEl) likeCountEl.textContent = abbreviateNumber(likeCount);
        if (popupViewCount) popupViewCount.textContent = viewCount.toLocaleString();
        if (popupLikeCount) popupLikeCount.textContent = likeCount.toLocaleString();
        if (likedByCount) likedByCount.textContent = totalLiked.toLocaleString();
    }
    
    function abbreviateNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    // Track view on page load
    async function trackView() {
        try {
            console.log('Tracking view...');
            const response = await fetch(STATS_API + '?action=add_view&t=' + Date.now());
            const data = await response.json();
            
            if (data.success) {
                viewCount = data.views;
                console.log('View tracked:', data);
                updateCounters();
            }
        } catch (error) {
            console.error('Error tracking view:', error);
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
        
        // Show animation immediately
        likeBtn.classList.add('liked');
        
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        
        try {
            console.log('Toggling like...');
            const formData = new FormData();
            formData.append('action', 'toggle_like');
            
            const response = await fetch(STATS_API, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            console.log('Server response:', data);
            
            if (data.success) {
                likeCount = data.likes;
                totalLiked = data.total_liked;
                userHasLiked = data.has_liked;
                
                updateCounters();
                
                if (!userHasLiked) {
                    setTimeout(() => {
                        likeBtn.classList.remove('liked');
                    }, 600);
                }
            } else {
                console.error('Server error:', data);
                toggleLikeLocally(likeBtn);
            }
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
            console.log('Showing stats popup...');
            const response = await fetch(STATS_API + '?action=get_stats&t=' + Date.now());
            const data = await response.json();
            
            if (data.success) {
                const statsPopup = document.getElementById('statsPopup');
                const popupViewCount = document.getElementById('popupViewCount');
                const popupLikeCount = document.getElementById('popupLikeCount');
                const likedByCount = document.getElementById('likedByCount');
            
                if (popupViewCount) popupViewCount.textContent = data.views.toLocaleString();
                if (popupLikeCount) popupLikeCount.textContent = data.likes.toLocaleString();
                if (likedByCount) likedByCount.textContent = data.total_liked.toLocaleString();
            
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
    // Initialize
    loadStats();
    
    setTimeout(() => {
        trackView();
    }, 1000);
    
    const viewBtn = document.getElementById('viewBtn');
    if (viewBtn) {
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showStatsPopup();
        });
    }
    
    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleLike();
        });
    }
    
    const closeStatsBtn = document.getElementById('closeStatsBtn');
    if (closeStatsBtn) {
        closeStatsBtn.addEventListener('click', closeStatsPopup);
    }
    
    const statsPopup = document.getElementById('statsPopup');
    if (statsPopup) {
        statsPopup.addEventListener('click', function(e) {
            if (e.target === statsPopup) {
                closeStatsPopup();
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeStatsPopup();
        }
    });
});