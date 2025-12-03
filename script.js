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
    
    // ===== STATISTICS SYSTEM =====
    let viewCount = 0;
    let likeCount = 0;
    let uniqueVisitors = 0;
    let userHasLiked = false;
    let isAdmin = false;

    const ADMIN_PASSWORD = 'your_secret_password_here'; // CHANGE THIS!
    const STATS_API = 'update_stats.php';
    const GET_STATS_API = 'get_stats.php';

    async function loadStats() {
        try {
            const response = await fetch(GET_STATS_API);
            const data = await response.json();

            if (data.success) {
                viewCount = data.views;
                likeCount = data.likes;
                uniqueVisitors = data.unique_visitors;
                userHasLiked = data.has_liked || false;
                updateCounters();
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            loadLocalStats();
        }
    }

    function loadLocalStats() {
        const savedViews = localStorage.getItem('card_views');
        const savedLikes = localStorage.getItem('card_likes');

        if (savedViews) viewCount = parseInt(savedViews);
        if (savedLikes) likeCount = parseInt(savedLikes);

        updateCounters();
    }

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
        if (likedByCount) likedByCount.textContent = 'N/A'; // Will be updated when admin views

        const likeBtn = document.getElementById('likeBtn');
        if (likeBtn) {
            if (userHasLiked) {
                likeBtn.style.background = 'rgba(255, 50, 50, 0.3)';
                likeBtn.style.borderColor = 'rgba(255, 50, 50, 0.6)';
                likeBtn.innerHTML = '<i class="fas fa-heart" style="color:#ff3333"></i>' + 
                                   (likeCountEl ? `<span class="stat-badge">${abbreviateNumber(likeCount)}</span>` : '');
            } else {
                likeBtn.style.background = '';
                likeBtn.style.borderColor = '';
                likeBtn.innerHTML = '<i class="fas fa-heart"></i>' + 
                                   (likeCountEl ? `<span class="stat-badge">${abbreviateNumber(likeCount)}</span>` : '');
            }
        }
    }

    function abbreviateNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    async function trackView() {
        try {
            const formData = new FormData();
            formData.append('action', 'add_view');

            const response = await fetch(STATS_API, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                viewCount = data.views;
                updateCounters();
            }
        } catch (error) {
            console.error('Error tracking view:', error);
            viewCount++;
            localStorage.setItem('card_views', viewCount);
            updateCounters();
        }
    }

    async function handleLike() {
        try {
            const formData = new FormData();
            formData.append('action', 'toggle_like');

            const response = await fetch(STATS_API, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                likeCount = data.likes;
                userHasLiked = data.has_liked;

                if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

                const likeBtn = document.getElementById('likeBtn');
                likeBtn.classList.add('pulse');
                setTimeout(() => {
                    likeBtn.classList.remove('pulse');
                }, 300);

                updateCounters();
            }
        } catch (error) {
            console.error('Error handling like:', error);
            userHasLiked = !userHasLiked;
            if (userHasLiked) {
                likeCount++;
            } else {
                likeCount = Math.max(0, likeCount - 1);
            }
            localStorage.setItem('card_likes', likeCount);
            localStorage.setItem('user_has_liked', userHasLiked);
            updateCounters();
        }
    }

    async function getDetailedStats() {
        try {
            const formData = new FormData();
            formData.append('action', 'get_detailed_stats');
            formData.append('admin_password', ADMIN_PASSWORD);

            const response = await fetch(STATS_API, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success && data.is_admin) {
                showStatsPopup(data);
            } else {
                showAdminWarning();
            }
        } catch (error) {
            console.error('Error getting detailed stats:', error);
            showAdminWarning();
        }
    }

    function showStatsPopup(data) {
        const popupViewCount = document.getElementById('popupViewCount');
        const popupLikeCount = document.getElementById('popupLikeCount');
        const uniqueVisitorsEl = document.getElementById('uniqueVisitors');
        const likedByCount = document.getElementById('likedByCount');
        const adminActions = document.getElementById('adminActions');

        if (popupViewCount) popupViewCount.textContent = data.views.toLocaleString();
        if (popupLikeCount) popupLikeCount.textContent = data.likes.toLocaleString();
        if (uniqueVisitorsEl) uniqueVisitorsEl.textContent = data.unique_visitors.toLocaleString();
        if (likedByCount) likedByCount.textContent = data.total_liked_users.toLocaleString();
        if (adminActions) adminActions.style.display = 'block';

        const statsPopup = document.getElementById('statsPopup');
        statsPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    async function resetStats() {
        if (confirm('Are you sure you want to reset all statistics? This cannot be undone!')) {
            try {
                const formData = new FormData();
                formData.append('action', 'reset_stats');
                formData.append('admin_password', ADMIN_PASSWORD);

                const response = await fetch(STATS_API, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    alert('Statistics have been reset!');
                    loadStats();
                    closeStatsPopup();
                } else {
                    alert('Failed to reset stats: ' + data.message);
                }
            } catch (error) {
                console.error('Error resetting stats:', error);
                alert('Error resetting statistics');
            }
        }
    }

    function showAdminWarning() {
        const adminWarning = document.getElementById('adminWarning');
        adminWarning.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }

    function closeStatsPopup() {
        const statsPopup = document.getElementById('statsPopup');
        statsPopup.classList.remove('active');
        document.body.style.overflow = '';
        
        const adminActions = document.getElementById('adminActions');
        if (adminActions) adminActions.style.display = 'none';
    }

    function closeAdminWarning() {
        const adminWarning = document.getElementById('adminWarning');
        adminWarning.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===== EVENT LISTENERS FOR STATS =====
    loadStats();
    
    setTimeout(() => {
        trackView();
    }, 1000);

    const viewBtn = document.getElementById('viewBtn');
    if (viewBtn) {
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            getDetailedStats();
        });
    }

    const likeBtn = document.getElementById('likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleLike();
        });

        let longPressTimer;
        likeBtn.addEventListener('touchstart', function(e) {
            longPressTimer = setTimeout(() => {
                adminLogin();
            }, 3000);
        });

        likeBtn.addEventListener('touchend', () => clearTimeout(longPressTimer));
        likeBtn.addEventListener('touchmove', () => clearTimeout(longPressTimer));
    }

    const closeStatsBtn = document.getElementById('closeStatsBtn');
    if (closeStatsBtn) {
        closeStatsBtn.addEventListener('click', closeStatsPopup);
    }

    const closeAdminBtn = document.getElementById('closeAdminBtn');
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', closeAdminWarning);
    }

    const statsPopup = document.getElementById('statsPopup');
    if (statsPopup) {
        statsPopup.addEventListener('click', function(e) {
            if (e.target === statsPopup) {
                closeStatsPopup();
            }
        });
    }

    const adminWarning = document.getElementById('adminWarning');
    if (adminWarning) {
        adminWarning.addEventListener('click', function(e) {
            if (e.target === adminWarning) {
                closeAdminWarning();
            }
        });
    }

    // Admin login function
    window.adminLogin = function() {
        const password = prompt("Enter admin password:");
        if (password === ADMIN_PASSWORD) {
            isAdmin = true;
            alert("Admin access granted! You can now view detailed statistics.");
            if (viewBtn) {
                viewBtn.style.background = 'rgba(0, 255, 255, 0.3)';
                viewBtn.style.borderColor = 'rgba(0, 255, 255, 0.6)';
            }
        } else {
            alert("Incorrect password!");
        }
    };

    window.resetStats = resetStats;

    // ===== KEYBOARD SUPPORT =====
    document.addEventListener('keydown', function(e) {
        if (flipCard && (e.key === ' ' || e.key === 'Enter') && document.activeElement === flipCard) {
            e.preventDefault();
            flipCard.click();
        }
        if (e.key === 'Escape') {
            if (orientationWarning && orientationWarning.style.display === 'flex') {
                orientationWarning.style.display = 'none';
            }
            if (statsPopup.classList.contains('active')) {
                closeStatsPopup();
            }
            if (adminWarning.classList.contains('active')) {
                closeAdminWarning();
            }
            if (panelOpen) {
                togglePanel();
            }
        }
    });

    // ===== SERVICE WORKER (OPTIONAL) =====
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').catch(function(error) {
                console.log('ServiceWorker registration failed:', error);
            });
        });
    }
});