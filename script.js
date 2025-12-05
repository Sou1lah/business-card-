// Clean Business Card JavaScript - No Stats
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
    // const canvas = document.getElementById('matrixCanvas');
    
    // if (canvas) {
    //     const ctx = canvas.getContext('2d');
        
    //     function resizeCanvas() {
    //         canvas.width = window.innerWidth;
    //         canvas.height = window.innerHeight;
    //     }
        
    //     function initMatrix() {
    //         resizeCanvas();
            
    //         const letters = 'AZBIBAZIUBAZIUBIZUEABIUZABEIUAZBEIUABZEIUAZBEIUAZBEIZUAB';
    //         const fontSize = 12;
    //         const columns = Math.floor(canvas.width / fontSize);
    //         const drops = [];
            
    //         for (let i = 0; i < columns; i++) {
    //             drops[i] = Math.random() * -100;
    //         }
            
    //         function draw() {
    //             if (document.body.classList.contains('light-theme')) {
    //                 ctx.fillStyle = 'rgba(240, 240, 240, 0.04)';
    //             } else {
    //                 ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    //             }
    //             ctx.fillRect(0, 0, canvas.width, canvas.height);
                
    //             ctx.font = `${fontSize}px monospace`;
                
    //             for (let i = 0; i < drops.length; i++) {
    //                 const char = letters[Math.floor(Math.random() * letters.length)];
                    
    //                 if (document.body.classList.contains('light-theme')) {
    //                     ctx.fillStyle = '#009900';
    //                 } else {
    //                     ctx.fillStyle = '#00ff00';
    //                 }
                    
    //                 ctx.fillText(char, i * fontSize, drops[i] * fontSize);
    //                 drops[i]++;
                    
    //                 if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
    //                     drops[i] = 0;
    //                 }
    //             }
    //         }
            
    //         let lastTime = 0;
    //         function animate(time) {
    //             if (time - lastTime > 50) {
    //                 draw();
    //                 lastTime = time;
    //             }
    //             requestAnimationFrame(animate);
    //         }
    //         requestAnimationFrame(animate);
    //     }
        
    //     let resizeTimeout;
    //     window.addEventListener('resize', function() {
    //         clearTimeout(resizeTimeout);
    //         resizeTimeout = setTimeout(resizeCanvas, 250);
    //     });
        
    //     window.addEventListener('orientationchange', function() {
    //         setTimeout(function() {
    //             resizeCanvas();
    //             initMatrix();
    //         }, 100);
    //     });
        
    //     initMatrix();
    // }
    
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
            fallbackIcon.style.color = '#e0e0e0';
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
    
    // REMOVED THE DUPLICATE QR BTN CODE HERE
    
    const noteBtn = document.querySelector('.note-btn');
    if (noteBtn) {
        noteBtn.addEventListener('click', function() {
            console.log('Leave Note button clicked');
        });
    }
        
    // ===== PANEL FLIP BUTTON =====
    // This button now shows portfolio modal instead of flipping the card
    document.getElementById('panelFlipBtn')?.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        console.log('Portfolio button clicked - showing modal');
        
        // Show portfolio modal
        const portfolioModal = document.getElementById('portfolioModal');
        if (portfolioModal) {
            portfolioModal.classList.add('active');
            if (navigator.vibrate) navigator.vibrate(10);
        }
        
        // Close the sliding panel if it's open
        if (panelOpen) {
            togglePanel();
        }
    });
    
    // ===== ADMIN WARNING (Optional - keep if you want it) =====
    const closeAdminBtn = document.getElementById('closeAdminBtn');
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', function() {
            const adminWarning = document.getElementById('adminWarning');
            if (adminWarning) {
                adminWarning.classList.remove('active');
            }
        });
    }
    
    console.log('✅ Business Card Loaded Successfully');
    
    // ===== QR CODE MODAL =====
    const qrModal = document.getElementById('qrModal');
    const qrBtn = document.querySelector('.qr-btn');  // This is the only declaration needed
    const closeQrBtn = document.getElementById('closeQrBtn');
    
    function showQrModal() {
        if (qrModal) {
            qrModal.classList.add('active');
            if (navigator.vibrate) navigator.vibrate(10);
        }
    }
    
    function hideQrModal() {
        if (qrModal) {
            qrModal.classList.remove('active');
        }
    }
    
    if (qrBtn) {
        qrBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showQrModal();
            // Also close the sliding panel if it's open
            if (panelOpen) {
                togglePanel();
            }
        });
    }
    
    if (closeQrBtn) {
        closeQrBtn.addEventListener('click', hideQrModal);
    }
    
    if (qrModal) {
        qrModal.addEventListener('click', function(e) {
            if (e.target === qrModal) {
                hideQrModal();
            }
        });
    }
    
    // Close QR modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && qrModal && qrModal.classList.contains('active')) {
            hideQrModal();
        }
    });
    
    // Handle QR image loading
    const qrImage = document.querySelector('.qr-image');
    if (qrImage) {
        qrImage.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        qrImage.addEventListener('error', function() {
            console.error('QR code image failed to load');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'qr-error';
            errorMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i><p>QR code image not found</p>';
            errorMsg.style.color = '#ff3333';
            errorMsg.style.textAlign = 'center';
            errorMsg.style.padding = '20px';
            this.parentElement.appendChild(errorMsg);
            this.style.display = 'none';
        });
    }

    // ===== COMING SOON MODALS =====
    const portfolioModal = document.getElementById('portfolioModal');
    const downloadModal = document.getElementById('downloadModal');
    const portfolioBtn = document.getElementById('panelFlipBtn'); // Portfolio button
    const downloadBtn = document.querySelector('.download-btn'); // Download CV button
    const closePortfolioBtn = document.getElementById('closePortfolioBtn');
    const closeDownloadBtn = document.getElementById('closeDownloadBtn');

    // Function to show portfolio modal
    function showPortfolioModal() {
        if (portfolioModal) {
            portfolioModal.classList.add('active');
            if (navigator.vibrate) navigator.vibrate(10);
        }
    }

    // Function to show download modal
    function showDownloadModal() {
        if (downloadModal) {
            downloadModal.classList.add('active');
            if (navigator.vibrate) navigator.vibrate(10);
        }
    }

    // Function to hide portfolio modal
    function hidePortfolioModal() {
        if (portfolioModal) {
            portfolioModal.classList.remove('active');
        }
    }

    // Function to hide download modal
    function hideDownloadModal() {
        if (downloadModal) {
            downloadModal.classList.remove('active');
        }
    }

    // Portfolio button event listener
    if (portfolioBtn) {
        // Remove the existing flip functionality
        portfolioBtn.removeEventListener('click', function() {});

        // Add new functionality
        portfolioBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Portfolio button clicked');
            showPortfolioModal();
            // Close the sliding panel if it's open
            if (panelOpen) {
                togglePanel();
            }
        });
    }

    // Download CV button event listener
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Download CV button clicked');
            showDownloadModal();
            // Close the sliding panel if it's open
            if (panelOpen) {
                togglePanel();
            }
        });
    }

    // Close buttons event listeners
    if (closePortfolioBtn) {
        closePortfolioBtn.addEventListener('click', hidePortfolioModal);
    }

    if (closeDownloadBtn) {
        closeDownloadBtn.addEventListener('click', hideDownloadModal);
    }

    // Close modals when clicking outside
    if (portfolioModal) {
        portfolioModal.addEventListener('click', function(e) {
            if (e.target === portfolioModal) {
                hidePortfolioModal();
            }
        });
    }

    if (downloadModal) {
        downloadModal.addEventListener('click', function(e) {
            if (e.target === downloadModal) {
                hideDownloadModal();
            }
        });
    }

    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (portfolioModal && portfolioModal.classList.contains('active')) {
                hidePortfolioModal();
            }
            if (downloadModal && downloadModal.classList.contains('active')) {
                hideDownloadModal();
            }
        }
    });

    // ===== SUBTLE PARALLAX TILT (desktop only) =====
    const cardContainer = document.querySelector('.card-container');
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const maxTilt = 9;

    if (cardContainer && !prefersReduce && !isTouch) {
        cardContainer.style.transition = 'transform 0.25s ease';
        cardContainer.style.transformStyle = 'preserve-3d';

        function handleMove(event) {
            const { innerWidth, innerHeight } = window;
            const x = (event.clientX / innerWidth - 0.5) * 2;
            const y = (event.clientY / innerHeight - 0.5) * 2;
            const tiltY = x * maxTilt;
            const tiltX = -y * maxTilt;
            cardContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        }

        function resetTilt() {
            cardContainer.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseleave', resetTilt);
    }
});