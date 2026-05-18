// Neelveda Custom Alert Override
(function() {
    window.alert = function(message) {
        let alertModal = document.getElementById('neelveda-custom-alert');
        if (!alertModal) {
            alertModal = document.createElement('div');
            alertModal.id = 'neelveda-custom-alert';
            alertModal.className = 'custom-alert-modal';
            
            const contentHTML = `
                <div class="custom-alert-content">
                    <div class="custom-alert-header">
                        <img src="images/logo/logo.png" alt="Neelveda Logo" class="custom-alert-logo">
                        <span class="custom-alert-title">NEELVEDA</span>
                    </div>
                    <div class="custom-alert-divider"></div>
                    <div class="custom-alert-body">
                        <p id="custom-alert-message"></p>
                    </div>
                    <div class="custom-alert-footer">
                        <button class="btn btn-secondary custom-alert-btn" id="custom-alert-close-btn">
                            <span>OK</span>
                        </button>
                    </div>
                </div>
            `;
            alertModal.innerHTML = contentHTML;
            document.body.appendChild(alertModal);
            
            const closeBtn = document.getElementById('custom-alert-close-btn');
            closeBtn.addEventListener('click', closeCustomAlert);
            
            alertModal.addEventListener('click', function(e) {
                if (e.target === alertModal) {
                    closeCustomAlert();
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && alertModal.classList.contains('active')) {
                    closeCustomAlert();
                }
            });
        }
        
        document.getElementById('custom-alert-message').textContent = message;
        alertModal.style.display = 'flex';
        alertModal.offsetHeight;
        alertModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (window.gsap) {
            gsap.fromTo('#neelveda-custom-alert', 
                { opacity: 0 }, 
                { opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
            gsap.fromTo('.custom-alert-content', 
                { scale: 0.85, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' }
            );
        }
    };

    function closeCustomAlert() {
        const alertModal = document.getElementById('neelveda-custom-alert');
        if (!alertModal) return;
        
        if (window.gsap) {
            gsap.to('.custom-alert-content', {
                scale: 0.85,
                opacity: 0,
                duration: 0.25,
                ease: 'power2.in'
            });
            
            gsap.to('#neelveda-custom-alert', {
                opacity: 0,
                duration: 0.25,
                delay: 0.05,
                ease: 'power2.in',
                onComplete: () => {
                    alertModal.classList.remove('active');
                    alertModal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        } else {
            alertModal.classList.remove('active');
            setTimeout(() => {
                alertModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
})();

// Preloader Logic — Only on index.html and only on mobile
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const preloaderText = document.querySelector('.preloader-text');
    const preloaderUnderline = document.querySelector('.preloader-underline');
    const body = document.body;

    if (preloader) {
        // Check if we are on the homepage (index.html) AND on a mobile device
        const isHomePage = window.location.pathname === '/' 
            || window.location.pathname.endsWith('/index.html') 
            || window.location.pathname.endsWith('/index.htm')
            || window.location.pathname === '';
        const isMobile = window.innerWidth <= 768;

        if (isHomePage && isMobile) {
            // Show preloader animation on mobile homepage
            const tl = gsap.timeline();

            // Animate underline loading
            tl.to(preloaderUnderline, {
                width: "100%",
                duration: 2,
                ease: "power2.inOut"
            });

            // Small pause
            tl.to({}, { duration: 0.3 });

            // Fade out preloader
            tl.to(preloader, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    body.classList.remove('loading');
                    
                    // Trigger hero typing if on home page
                    if (window.startHeroTyping) {
                        window.startHeroTyping();
                    }
                    
                    // Trigger scroll animations once loaded
                    ScrollTrigger.refresh();

                    // Animate hero content as well
                    gsap.from(".hero-content", {
                        y: 50,
                        opacity: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        delay: 0.2
                    });
                }
            });
        } else {
            // Not mobile homepage — skip preloader instantly
            preloader.style.display = 'none';
            body.classList.remove('loading');

            // Still trigger hero typing if on homepage (desktop)
            if (window.startHeroTyping) {
                window.startHeroTyping();
            }

            // Trigger scroll animations
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }

            // Animate hero content on desktop homepage
            if (isHomePage) {
                gsap.from(".hero-content", {
                    y: 50,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    delay: 0.2
                });
            }
        }
    }
});

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);


// Navbar Scroll Effect & Scroll Spy
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Background effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll Spy
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    if (current) {
        const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
        allNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + current || href.endsWith('#' + current)) {
                link.classList.add('active');
            }
        });
    }
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

menuToggle.addEventListener('click', () => {
    const isActive = mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    navbar.classList.toggle('menu-open', isActive);
    document.body.style.overflow = isActive ? 'hidden' : 'auto';
});

const closeButton = document.getElementById('mobile-menu-close');
if (closeButton) {
    closeButton.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        navbar.classList.remove('menu-open');
        document.body.style.overflow = 'auto';
    });
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        navbar.classList.remove('menu-open');
        document.body.style.overflow = 'auto';
    });
});

// Qty Update
let currentQty = 1;
const qtyVal = document.getElementById('qty');
const whatsappLink = document.getElementById('whatsapp-link');
let currentSize = '200ml';
let currentPrice = '₹249.00';
let productName = "Neelveda Herbal Oil";
const whatsappNumber = "918156924839"; // Updated WhatsApp number

function updateSize(size, price) {
    currentSize = size;
    currentPrice = price;
    
    // Update Size Buttons UI
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === size);
    });
    
    // Update Price Display
    const priceDisplay = document.getElementById('product-price-display');
    if (priceDisplay) {
        priceDisplay.textContent = price;
    }
}

function updateQty(val) {
    currentQty = Math.max(1, currentQty + val);
    if (qtyVal) {
        qtyVal.textContent = currentQty;
    }
    updateWhatsAppLink();
}

function updateWhatsAppLink() {
    if (whatsappLink) {
        const message = `Hello Neelveda! I would like to order ${currentQty} x ${productName}. Please let me know the next steps.`;
        const encodedMessage = encodeURIComponent(message);
        whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    }
}

// Initial update
updateWhatsAppLink();

// GSAP Animations
let mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
    // Hero Parallax
    gsap.to(".hero-image-wrapper", {
        y: 100,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Reveal Section Animation
    gsap.from(".reveal-image img", {
        scale: 1.2,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".reveal-section",
            start: "top 80%",
            end: "bottom top",
            toggleActions: "play none none reverse"
        }
    });

    gsap.from(".reveal-info", {
        opacity: 0,
        x: 50,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".reveal-section",
            start: "top 70%"
        }
    });

    // Story Section Animation
    gsap.from(".story-content", {
        opacity: 0,
        y: 50,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".story-section",
            start: "top 70%"
        }
    });

    gsap.from(".story-image", {
        opacity: 0,
        scale: 1.1,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".story-section",
            start: "top 70%"
        }
    });

    // Ingredient Cards Stagger
    if (document.querySelector('.ingredient-card')) {
        gsap.from(".ingredient-card", {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".ingredients",
                start: "top 90%",
                once: true
            },
            onComplete: () => {
                gsap.set(".ingredient-card", { clearProps: "all", opacity: 1, visibility: "visible" });
            }
        });
    }

    // Benefit Cards Stagger
    if (document.querySelector('.benefit-card')) {
        gsap.from(".benefit-card", {
            opacity: 0,
            y: 20,
            stagger: 0.08,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".benefits-section",
                start: "top 95%",
                once: true
            },
            onComplete: () => {
                gsap.set(".benefit-card", { clearProps: "all", opacity: 1, visibility: "visible" });
            }
        });
    }

    // Ad Banner Animations - REMOVED TO PREVENT BOUNDARY ISSUES
    /*
    if (document.querySelector('.ad-clean-banner')) {
        gsap.utils.toArray('.ad-clean-banner').forEach(banner => {
            gsap.from(banner, {
                opacity: 0,
                y: 50,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: banner,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
            
            // Product Float Effect
            const img = banner.querySelector('.ad-clean-image img');
            if (img) {
                gsap.to(img, {
                    y: -15,
                    duration: 3 + Math.random(),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            }
        });
    }

    // Desktop Only: Parallax Product Effect
    mm.add("(min-width: 993px)", () => {
        gsap.utils.toArray('.ad-clean-image img').forEach(img => {
            gsap.to(img, {
                y: -60,
                ease: "none",
                scrollTrigger: {
                    trigger: img,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        });
    });
    */
});

// Force refresh ScrollTrigger on load to fix position issues
window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    // Initialize Scroll Spy
    window.dispatchEvent(new Event('scroll'));
});

// Smooth Scroll for Nav Links with Header Offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            const navbarHeight = document.getElementById('navbar').offsetHeight;
            const announcementHeight = document.querySelector('.announcement-bar').offsetHeight;
            const totalOffset = navbarHeight + announcementHeight;
            
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - totalOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Checkout handling is now managed on the product-detail page.

// Combo Selection Handler
document.querySelectorAll('.ad-clean-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const comboName = btn.getAttribute('data-combo');
        const comboPrice = btn.getAttribute('data-price');
        
        // Find the image source associated with this combo pack
        const cardInner = btn.closest('.ad-card-inner');
        let imageSrc = "images/products/main/100ml-main.png"; // Default fallback
        if (cardInner) {
            const imgEl = cardInner.querySelector('.ad-clean-image img');
            if (imgEl) {
                imageSrc = imgEl.getAttribute('src');
            }
        }
        
        // Save to current checkout selection instead of overwriting admin/general settings
        const checkoutData = {
            productName: comboName,
            price: comboPrice,
            image: imageSrc
        };
        localStorage.setItem('neelvedaCheckout', JSON.stringify(checkoutData));
        
        // Reset qty to 1 for combos
        localStorage.setItem('checkoutQty', 1);
    });
});

function updateWhatsAppLink() {
    const whatsappLink = document.querySelector('.whatsapp-link'); // Assuming an identifier
    if (whatsappLink) {
        // Temporarily decoupled from localStorage admin settings
        const activeNumber = "918156924839";
        const productName = "Neelveda Herbal Oil";
        const currentQty = localStorage.getItem('checkoutQty') || 1;
        const message = `Hello Neelveda! I would like to order ${currentQty} x ${productName}. Please let me know the next steps.`;
        const encodedMessage = encodeURIComponent(message);
        whatsappLink.href = `https://wa.me/${activeNumber}?text=${encodedMessage}`;
    }
}

// Admin Settings Loader (Simulated) - TEMPORARILY DECOUPLED FROM ADMIN PANEL
function loadSettings() {
    // Temporarily decoupled from localStorage admin settings for direct premium layout display
    const settings = {
        productName: "Neelveda Herbal Oil",
        price: "₹249.00",
        whatsapp: "918156924839",
        heroHeadline: "100% ORGANIC",
        heroSubtext: "Nourished Roots. Stronger, Shinier You.",
        announcementText: "Cashback in three days • Free shipping • Best offers",
        promoBadge: "Limited Time Offers",
        tickerSpeed: "30s"
    };
    
    if (document.getElementById('product-name-display')) {
        document.getElementById('product-name-display').textContent = settings.productName;
    }
    if (document.getElementById('product-price-display')) {
        document.getElementById('product-price-display').textContent = settings.price;
    }

    if (document.querySelector('.hero-subtext')) {
        document.querySelector('.hero-subtext').textContent = settings.heroSubtext;
    }

    // Update Hero Tagline dynamically
    const heroTaglineEl = document.querySelector('.hero-content .hero-tagline');
    if (heroTaglineEl) {
        heroTaglineEl.textContent = settings.heroHeadline;
    }

    // Update Bundle Tagline badge dynamically
    const bundleTaglineEl = document.querySelector('.ad-clean-tagline');
    if (bundleTaglineEl) {
        bundleTaglineEl.textContent = settings.promoBadge;
    }

    // Update Dynamic Announcement loops
    const tracks = document.querySelectorAll('.announcement-content');
    if (tracks.length > 0) {
        let loopHtml = '';
        const items = settings.announcementText.split('•');
        for (let i = 0; i < 4; i++) {
            items.forEach((item, idx) => {
                const trimmed = item.trim();
                if (trimmed) {
                    loopHtml += `<span>${trimmed}</span>`;
                    if (idx < items.length - 1 || i < 3) {
                        loopHtml += `<span class="dot">•</span>`;
                    }
                }
            });
        }
        tracks.forEach(t => {
            t.innerHTML = loopHtml;
        });

        // Set animation duration
        const marqueeTrack = document.querySelector('.announcement-track');
        if (marqueeTrack) {
            marqueeTrack.style.animationDuration = settings.tickerSpeed;
        }
    }
    
    updateWhatsAppLink();
}

loadSettings();

// Typing Animation + Synced Herbal Oil Fade
const typingElement = document.querySelector('.typing-animation');
const herbalOilText = document.querySelector('.herbal-oil-text');

if (typingElement) {
    const textToType = "Neelveda";
    
    let index = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!isDeleting) {
            // Typing phase
            typingElement.textContent = textToType.substring(0, index);
            index++;

            if (index > textToType.length) {
                // Word fully typed — fade in herbal oil
                if (herbalOilText) herbalOilText.classList.add('visible');
                // Pause before deleting
                isDeleting = true;
                setTimeout(typeEffect, 2500);
                return;
            }
            setTimeout(typeEffect, 150);
        } else {
            // Deleting phase — fade out herbal oil immediately
            if (herbalOilText) herbalOilText.classList.remove('visible');
            typingElement.textContent = textToType.substring(0, index);
            index--;

            if (index < 0) {
                // Fully deleted — pause before typing again
                isDeleting = false;
                index = 0;
                setTimeout(typeEffect, 600);
                return;
            }
            setTimeout(typeEffect, 100);
        }
    }

    function startHeroTyping() {
        setTimeout(typeEffect, 500);
    }
    
    // Export to window so preloader can call it
    window.startHeroTyping = startHeroTyping;
}

// Advertisement Section Slider Logic
const adWrapper = document.querySelector('.ad-clean-wrapper');
const adBanners = document.querySelectorAll('.ad-clean-banner');
const adDots = document.querySelectorAll('.ad-dot');
let currentAdIndex = 0;
let adInterval;

function updateAdSlider(isMobile) {
    if (!adWrapper) return;
    
    if (!isMobile) {
        // On desktop, we use transform for auto-swipe
        const offset = currentAdIndex * -100;
        adBanners.forEach(banner => {
            banner.style.transform = `translateX(${offset}%)`;
        });
    }
    
    adDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentAdIndex);
    });
}

function startAdAutoSwipe() {
    if (window.innerWidth <= 992) return; // Don't auto-swipe on mobile
    
    stopAdAutoSwipe(); // Clear existing
    adInterval = setInterval(() => {
        currentAdIndex = (currentAdIndex + 1) % adBanners.length;
        updateAdSlider(false);
    }, 5000);
}

function stopAdAutoSwipe() {
    if (adInterval) clearInterval(adInterval);
}

if (adWrapper && adBanners.length > 0) {
    // Initial call
    updateAdSlider(window.innerWidth <= 992);
    startAdAutoSwipe();

    // Dot Clicks
    adDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentAdIndex = index;
            const isMobile = window.innerWidth <= 992;
            if (isMobile) {
                const bannerWidth = adBanners[0].offsetWidth;
                adWrapper.scrollTo({
                    left: index * (bannerWidth + 19.2), // index * (width + gap)
                    behavior: 'smooth'
                });
            } else {
                updateAdSlider(false);
                stopAdAutoSwipe();
                startAdAutoSwipe();
            }
        });
    });

    // Mobile Scroll Listener to update dots
    adWrapper.addEventListener('scroll', () => {
        if (window.innerWidth <= 992) {
            const bannerWidth = adBanners[0].offsetWidth + 19.2; // width + gap (1.2rem)
            const index = Math.round(adWrapper.scrollLeft / bannerWidth);
            if (index !== currentAdIndex && index < adBanners.length) {
                currentAdIndex = index;
                adDots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentAdIndex);
                });
            }
        }
    });

    // Pause on Hover (Desktop)
    adWrapper.addEventListener('mouseenter', stopAdAutoSwipe);
    adWrapper.addEventListener('mouseleave', startAdAutoSwipe);
    
    // Arrow Navigation (Desktop Only)
    const nextArrow = document.querySelector('.ad-nav-arrow.next');
    const prevArrow = document.querySelector('.ad-nav-arrow.prev');
    
    if (nextArrow && prevArrow) {
        nextArrow.addEventListener('click', () => {
            currentAdIndex = (currentAdIndex + 1) % adBanners.length;
            updateAdSlider(false);
            stopAdAutoSwipe();
            startAdAutoSwipe();
        });
        
        prevArrow.addEventListener('click', () => {
            currentAdIndex = (currentAdIndex - 1 + adBanners.length) % adBanners.length;
            updateAdSlider(false);
            stopAdAutoSwipe();
            startAdAutoSwipe();
        });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const isMobile = window.innerWidth <= 992;
        if (isMobile) {
            stopAdAutoSwipe();
            // Reset transforms for mobile
            adBanners.forEach(banner => banner.style.transform = '');
        } else {
            startAdAutoSwipe();
            updateAdSlider(false);
        }
    });
}



// Mini FAQ Accordion Toggles on Homepage
document.querySelectorAll('.mini-faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const item = trigger.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close other FAQ items
        document.querySelectorAll('.mini-faq-item').forEach(faq => {
            faq.classList.remove('active');
        });
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Premium Blog FAQ Accordion Toggles
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Toggle active class on clicked item
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

