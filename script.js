// Mobile-optimized JavaScript for Business Card
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    let themeIcon;
    
    if (themeToggle) {
        themeIcon = themeToggle.querySelector('i');
        
        // Touch event for theme toggle (mobile)
        themeToggle.addEventListener('touchstart', function(e) {
            e.preventDefault();
            toggleTheme();
            // Add haptic feedback if available
            if (navigator.vibrate) navigator.vibrate(10);
        });
        
        // Click event for theme toggle (desktop/fallback)
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
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
    
    // Card Flip - Mobile optimized
    const flipCard = document.getElementById('flipCard');
    let isFlipped = false;
    let flipTimeout = null;
    
    if (flipCard) {
        function handleCardFlip() {
            if (flipTimeout) return;
            
            // Add haptic feedback if available
            if (navigator.vibrate) navigator.vibrate(20);
            
            if (!isFlipped) {
                flipCard.classList.add('flipped');
                isFlipped = true;
            } else {
                flipCard.classList.remove('flipped');
                isFlipped = false;
            }
            
            // Prevent rapid flipping
            flipTimeout = setTimeout(() => {
                flipTimeout = null;
            }, 600);
        }
        
        // Use both click and touch for maximum compatibility
        flipCard.addEventListener('click', handleCardFlip);
        flipCard.addEventListener('touchstart', function(e) {
            e.preventDefault();
            handleCardFlip();
        });
        
        // Make flip card focusable for keyboard users
        flipCard.setAttribute('tabindex', '0');
        flipCard.setAttribute('role', 'button');
        flipCard.setAttribute('aria-label', 'Business card - tap or click to flip');
    }
    
    // Prevent card flip when clicking on social icons or language icons
    document.querySelectorAll('.social-icon, .language-icon').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        icon.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            // Add haptic feedback for icon taps
            if (navigator.vibrate) navigator.vibrate(10);
        });
    });
    
    // Matrix Effect - Optimized for mobile performance
    const canvas = document.getElementById('matrixCanvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        function initMatrix() {
            resizeCanvas();
            
            // Simplified for mobile performance
            const letters = '01';
            const fontSize = 12;
            const columns = Math.floor(canvas.width / fontSize);
            const drops = [];
            
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
            
            function draw() {
                // Clear with trail effect
                if (document.body.classList.contains('light-theme')) {
                    ctx.fillStyle = 'rgba(240, 240, 240, 0.04)';
                } else {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
                }
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw characters
                ctx.font = `${fontSize}px monospace`;
                
                for (let i = 0; i < drops.length; i++) {
                    const char = letters[Math.floor(Math.random() * letters.length)];
                    
                    // Simple green color for performance
                    if (document.body.classList.contains('light-theme')) {
                        ctx.fillStyle = '#009900';
                    } else {
                        ctx.fillStyle = '#00ff00';
                    }
                    
                    ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                    drops[i]++;
                    
                    // Reset drop randomly
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                }
            }
            
            // Use requestAnimationFrame for smoother animation on mobile
            let lastTime = 0;
            function animate(time) {
                if (time - lastTime > 50) { // Limit to 20fps for mobile performance
                    draw();
                    lastTime = time;
                }
                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        }
        
        // Handle orientation changes and resize
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
        
        // Initialize matrix
        initMatrix();
    }
    
    // Handle orientation warning
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
    
    // Initialize orientation check
    checkOrientation();
    
    // Add loading state for images
    const profileImage = document.querySelector('.profile-pic img');
    if (profileImage) {
        profileImage.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        profileImage.addEventListener('error', function() {
            // Fallback if image fails to load
            this.style.display = 'none';
            const fallbackIcon = document.createElement('i');
            fallbackIcon.className = 'fas fa-user-secret';
            fallbackIcon.style.fontSize = '50px';
            fallbackIcon.style.color = '#0f0';
            this.parentElement.appendChild(fallbackIcon);
        });
    }
    
    // Prevent context menu on long press
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.flip-card') || e.target.closest('.social-icon') || e.target.closest('.language-icon')) {
            e.preventDefault();
        }
    });
    
    // Add keyboard support for accessibility
    document.addEventListener('keydown', function(e) {
        // Space or Enter to flip card
        if (flipCard && (e.key === ' ' || e.key === 'Enter') && document.activeElement === flipCard) {
            e.preventDefault();
            flipCard.click();
        }
        // Escape to close orientation warning
        if (e.key === 'Escape' && orientationWarning && orientationWarning.style.display === 'flex') {
            orientationWarning.style.display = 'none';
        }
    });
    
    // Performance monitoring - log any performance issues
    if ('performance' in window) {
        setTimeout(function() {
            const perfEntries = performance.getEntriesByType('navigation');
            if (perfEntries.length > 0) {
                const navEntry = perfEntries[0];
                console.log('Page loaded in:', navEntry.loadEventEnd - navEntry.startTime, 'ms');
            }
        }, 1000);
    }
    
    // ===== SLIDING PANEL FUNCTIONALITY =====
    const panelToggle = document.getElementById('panelToggle');
    const slidingPanel = document.getElementById('slidingPanel');
    const panelClose = document.getElementById('panelClose');
    const panelThemeToggle = document.getElementById('panelThemeToggle');
    let panelOpen = false;
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'panel-overlay';
    document.body.appendChild(overlay);
    
    // Toggle panel function
    function togglePanel() {
        panelOpen = !panelOpen;
        if (panelOpen) {
            slidingPanel.classList.add('open');
            overlay.classList.add('active');
            // Update toggle button arrow
            if (panelToggle) panelToggle.innerHTML = '<i class="fas fa-chevron-right"></i>';
        } else {
            slidingPanel.classList.remove('open');
            overlay.classList.remove('active');
            // Update toggle button arrow
            if (panelToggle) panelToggle.innerHTML = '<i class="fas fa-chevron-left"></i>';
        }
    }
    
    // Event Listeners for panel
    if (panelToggle) {
        panelToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePanel();
        });
    }
    
    if (panelClose) {
        panelClose.addEventListener('click', togglePanel);
    }
    
    // Close panel when clicking on overlay
    overlay.addEventListener('click', togglePanel);
    
    // Close panel when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (panelOpen && slidingPanel && !slidingPanel.contains(e.target) && e.target !== panelToggle) {
            togglePanel();
        }
    });
    
    // Theme toggle from panel
    if (panelThemeToggle) {
        panelThemeToggle.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    // Close panel with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && panelOpen) {
            togglePanel();
        }
    });
    
    // Handle QR Code button (empty for now)
    const qrBtn = document.querySelector('.qr-btn');
    if (qrBtn) {
        qrBtn.addEventListener('click', function() {
            console.log('QR Code button clicked');
            // Add QR code functionality here
        });
    }
    
    // Handle Note button (empty for now)
    const noteBtn = document.querySelector('.note-btn');
    if (noteBtn) {
        noteBtn.addEventListener('click', function() {
            console.log('Leave Note button clicked');
            // Add note functionality here
        });
    }
    
    // Add service worker for offline support (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').catch(function(error) {
                console.log('ServiceWorker registration failed:', error);
            });
        });
    }
});