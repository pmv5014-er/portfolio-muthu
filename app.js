/* ==========================================================================
   MUTHU VENKATESH P - PORTFOLIO INTERACTION LOGIC
   Features: Typewriter, Scroll Progress, Intersection Observers, Modals, Clipboard
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. TYPEWRITER EFFECT (HERO SECTION)
       ---------------------------------------------------------------------- */
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = JSON.parse(typewriterElement.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                currentText = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            typewriterElement.textContent = currentText;

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at full word
                typeSpeed = 1500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400; // pause before typing next word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typewriter
        setTimeout(type, 800);
    }

    /* ----------------------------------------------------------------------
       2. SCROLL PROGRESS BAR & NAVBAR SHRINK
       ---------------------------------------------------------------------- */
    const scrollProgress = document.getElementById('scroll-progress');
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        // Scroll Progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const scrolledPercentage = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrolledPercentage + '%';
        }

        // Navbar class toggle
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Navigation Link Highlight on Scroll
        highlightNavLink();
    });

    // Active Navigation Highlight Logic
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function highlightNavLink() {
        let currentSectionId = 'home';
        const scrollPosition = window.scrollY + 120; // offset for nav bar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    /* ----------------------------------------------------------------------
       3. HAMBURGER MOBILE MENU
       ---------------------------------------------------------------------- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ----------------------------------------------------------------------
       4. INTERSECTION OBSERVER FOR SCROLL REVEALS & METERS
       ---------------------------------------------------------------------- */
    // Select all reveal elements
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    // Select progress bars to animate only when they enter view
    const skillBars = document.querySelectorAll('.skill-bar');
    const langBars = document.querySelectorAll('.progress-bar');

    // Save target widths and set to 0 initially for animation
    const barsData = [];
    
    function initProgressBars(bars) {
        bars.forEach((bar, index) => {
            const targetWidth = bar.style.width || '100%';
            bar.setAttribute('data-target-width', targetWidth);
            bar.style.width = '0%';
        });
    }
    
    initProgressBars(skillBars);
    initProgressBars(langBars);

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // If the intersecting element is a container for progress bars, trigger their animation
                const childSkillBars = entry.target.querySelectorAll('.skill-bar, .progress-bar');
                childSkillBars.forEach(bar => {
                    const target = bar.getAttribute('data-target-width');
                    if (target) {
                        bar.style.width = target;
                    }
                });
                
                // Once visible, stop observing this specific element
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // triggers slightly before scrolling fully into view
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ----------------------------------------------------------------------
       5. PORTFOLIO DIALOGS (MODALS)
       ---------------------------------------------------------------------- */
    const learnMoreButtons = document.querySelectorAll('.btn-learn-more');
    const closeButtons = document.querySelectorAll('.close-modal-btn');
    const modals = document.querySelectorAll('.modal');

    learnMoreButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            const targetModal = document.getElementById(`modal-${projectId}`);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // prevent background scrolling
            }
        });
    });

    // Close modals
    function closeAllModals() {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = ''; // restore scrolling
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Click outside modal content to close
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    /* ----------------------------------------------------------------------
       6. COPY-TO-CLIPBOARD ACTIONS
       ---------------------------------------------------------------------- */
    const copyButtons = document.querySelectorAll('.btn-copy');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Store original HTML content
                const originalHtml = btn.innerHTML;
                
                // Show success status
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                btn.classList.add('success');
                
                // Revert status after 2 seconds
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.classList.remove('success');
                }, 2000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    });

    /* ----------------------------------------------------------------------
       7. CONTACT FORM SUBMISSION (MOCK)
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-send-message');
            const originalBtnHtml = submitBtn.innerHTML;

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending Message...';
            formFeedback.className = 'form-feedback';
            formFeedback.textContent = '';

            const clientName = document.getElementById('name').value;

            // Simulate server network latency
            setTimeout(() => {
                // Success state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                
                formFeedback.classList.add('success');
                formFeedback.textContent = `Thank you, ${clientName}! Your message was sent successfully.`;
                
                // Reset form fields
                contactForm.reset();

                // Clear success message after 5 seconds
                setTimeout(() => {
                    formFeedback.style.opacity = '0';
                    setTimeout(() => {
                        formFeedback.textContent = '';
                        formFeedback.style.opacity = '1';
                        formFeedback.className = 'form-feedback';
                    }, 500);
                }, 5000);

            }, 1800);
        });
    }

    /* ----------------------------------------------------------------------
       8. SCOTCH YOKE KINEMATIC SIMULATOR (FEATURE)
       ---------------------------------------------------------------------- */
    const canvas = document.getElementById('yoke-canvas');
    const speedSlider = document.getElementById('crank-speed');
    const radiusSlider = document.getElementById('crank-radius');
    const toggleSimBtn = document.getElementById('btn-toggle-sim');
    const speedVal = document.getElementById('speed-val');
    const radiusVal = document.getElementById('radius-val');

    const valAngle = document.getElementById('val-angle');
    const valDisp = document.getElementById('val-disp');
    const valVel = document.getElementById('val-vel');
    const valAcc = document.getElementById('val-acc');

    if (canvas && speedSlider && radiusSlider && toggleSimBtn) {
        const ctx = canvas.getContext('2d');
        let angle = 0;
        let isPlaying = true;
        let lastTime = performance.now();

        // Canvas center
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        toggleSimBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                toggleSimBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Simulation';
                lastTime = performance.now();
                requestAnimationFrame(animate);
            } else {
                toggleSimBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume Simulation';
            }
        });

        speedSlider.addEventListener('input', () => {
            speedVal.textContent = speedSlider.value;
        });

        radiusSlider.addEventListener('input', () => {
            radiusVal.textContent = radiusSlider.value;
        });

        function animate(timestamp) {
            if (!isPlaying) return;

            const dt = (timestamp - lastTime) / 1000; // in seconds
            lastTime = timestamp;

            const rpm = parseFloat(speedSlider.value);
            const radiusMm = parseFloat(radiusSlider.value);

            // Angular velocity omega = 2 * pi * RPM / 60
            const omega = (2 * Math.PI * rpm) / 60;

            // Update crank angle
            angle += omega * dt;
            if (angle >= 2 * Math.PI) {
                angle -= 2 * Math.PI;
            }

            // Calculations
            const disp = radiusMm * Math.cos(angle);
            const vel = -radiusMm * omega * Math.sin(angle);
            const acc = -radiusMm * omega * omega * Math.cos(angle);

            // Update readouts
            valAngle.textContent = ((angle * 180) / Math.PI).toFixed(1) + '°';
            valDisp.textContent = disp.toFixed(1) + ' mm';
            valVel.textContent = vel.toFixed(1) + ' mm/s';
            valAcc.textContent = acc.toFixed(1) + ' mm/s²';

            // DRAWING
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Scale for display (1 mm = 1.6 pixels)
            const scale = 1.6;
            const rPx = radiusMm * scale;
            const xPx = disp * scale;

            // Draw guidelines/axes
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
            ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
            ctx.stroke();

            // 1. Draw linear guide slot rods (static)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(cx - 100, cy - 60); ctx.lineTo(cx + 100, cy - 60);
            ctx.moveTo(cx - 100, cy + 60); ctx.lineTo(cx + 100, cy + 60);
            ctx.stroke();

            // 2. Draw rotating crank disc
            ctx.strokeStyle = 'rgba(124, 34, 228, 0.3)';
            ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(124, 34, 228, 0.05)';
            ctx.beginPath();
            ctx.arc(cx - 80, cy, 60 * scale, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();

            // Center pivot
            ctx.fillStyle = '#ab6dff';
            ctx.beginPath();
            ctx.arc(cx - 80, cy, 4, 0, 2 * Math.PI);
            ctx.fill();

            // Crank pin coordinates (relative to crank center)
            const crankX = cx - 80 + rPx * Math.cos(angle);
            const crankY = cy + rPx * Math.sin(angle);

            // Draw crank arm
            ctx.strokeStyle = '#ab6dff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(cx - 80, cy);
            ctx.lineTo(crankX, crankY);
            ctx.stroke();

            // Draw crank pin block
            ctx.fillStyle = '#00d2ff';
            ctx.beginPath();
            ctx.arc(crankX, crankY, 6, 0, 2 * Math.PI);
            ctx.fill();

            // 3. Draw sliding Yoke frame (moved by xPx relative to neutral point)
            // Yoke center is driven horizontally, but must frame the vertical crank pin motion
            const yokeCenter = cx + 50 + xPx;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round';

            // Draw vertical slot in yoke (crank pin slides vertically here)
            // The slot center matches yokeCenter horizontally
            ctx.beginPath();
            ctx.roundRect(yokeCenter - 10, cy - 60, 20, 120, 4);
            ctx.fill();
            ctx.stroke();

            // Connecting link from crank pin to slot
            ctx.strokeStyle = 'rgba(0, 210, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(crankX, crankY);
            ctx.lineTo(yokeCenter, crankY);
            ctx.stroke();

            // Draw pin slider block inside slot
            ctx.fillStyle = '#00d2ff';
            ctx.shadowColor = '#00d2ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.roundRect(yokeCenter - 8, crankY - 12, 16, 24, 2);
            ctx.fill();
            ctx.shadowBlur = 0; // reset shadow

            // 4. Draw slider output rod extending to the right
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(yokeCenter + 10, cy);
            ctx.lineTo(yokeCenter + 80, cy);
            ctx.stroke();

            // Output piston block
            ctx.fillStyle = 'rgba(124, 34, 228, 0.8)';
            ctx.beginPath();
            ctx.roundRect(yokeCenter + 80, cy - 15, 30, 30, 2);
            ctx.fill();
            ctx.strokeStyle = '#ab6dff';
            ctx.lineWidth = 1;
            ctx.stroke();

            requestAnimationFrame(animate);
        }

        // Initialize animation loop
        requestAnimationFrame(animate);
    }

    /* ----------------------------------------------------------------------
       9. SPROCKET FEA MATERIAL TABS (FEATURE)
       ---------------------------------------------------------------------- */
    const feaTabs = document.querySelectorAll('.fea-tab');
    
    const yieldReadout = document.getElementById('fea-yield');
    const stressReadout = document.getElementById('fea-stress');
    const dispReadout = document.getElementById('fea-disp');
    const safetyReadout = document.getElementById('fea-safety');
    const lifeReadout = document.getElementById('fea-life');
    const weightReadout = document.getElementById('fea-weight');
    const meshGlow = document.getElementById('mesh-glow');
    const meshLabel = document.getElementById('mesh-stress-label');

    const materialData = {
        steel: {
            yield: '250 MPa',
            stress: '125.4 MPa',
            disp: '0.042 mm',
            safety: '1.99',
            life: '1.2 x 10⁶ cycles',
            weight: '1.45 kg',
            stressClass: 'stress-ok',
            safetyClass: 'safety-high',
            gradient: 'radial-gradient(circle, rgba(0,210,255,0.4) 0%, rgba(124,34,228,0.2) 60%, rgba(255,0,166,0.1) 90%)'
        },
        castiron: {
            yield: '130 MPa',
            stress: '134.1 MPa',
            disp: '0.098 mm',
            safety: '0.97',
            life: '4.5 x 10⁴ cycles',
            weight: '1.39 kg',
            stressClass: 'stress-fail',
            safetyClass: 'safety-low',
            gradient: 'radial-gradient(circle, rgba(255,0,0,0.6) 0%, rgba(255,100,0,0.4) 50%, rgba(0,0,255,0.1) 85%)'
        },
        aluminum: {
            yield: '276 MPa',
            stress: '128.2 MPa',
            disp: '0.118 mm',
            safety: '2.15',
            life: '8.5 x 10⁵ cycles',
            weight: '0.52 kg',
            stressClass: 'stress-ok',
            safetyClass: 'safety-high',
            gradient: 'radial-gradient(circle, rgba(0,255,160,0.4) 0%, rgba(0,210,255,0.2) 60%, rgba(124,34,228,0.1) 90%)'
        }
    };

    if (feaTabs.length > 0 && yieldReadout) {
        feaTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Toggle active tab
                feaTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Get material key
                const matKey = tab.getAttribute('data-material');
                const data = materialData[matKey];

                if (data) {
                    // Update readouts
                    yieldReadout.textContent = data.yield;
                    
                    stressReadout.textContent = data.stress;
                    stressReadout.className = data.stressClass;

                    dispReadout.textContent = data.disp;
                    
                    safetyReadout.textContent = data.safety;
                    safetyReadout.className = data.safetyClass;

                    lifeReadout.textContent = data.life;
                    weightReadout.textContent = data.weight;

                    // Update visual stress mesh color indicator
                    meshGlow.style.background = data.gradient;
                    meshLabel.textContent = `Max Stress: ${data.stress}`;
                }
            });
        });
    }

    /* ----------------------------------------------------------------------
       10. CERTIFICATE MODAL LOGIC (FEATURE)
       ---------------------------------------------------------------------- */
    const certCards = document.querySelectorAll('.cert-interactive');
    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const certId = card.getAttribute('data-cert');
            const targetModal = document.getElementById(`modal-cert-${certId}`);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
});

