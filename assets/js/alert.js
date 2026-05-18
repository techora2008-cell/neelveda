(function() {
    // Save original alert in case it's ever needed
    const originalAlert = window.alert;

    // Define the styled custom alert
    window.alert = function(message) {
        // Check if custom alert already exists in DOM
        let alertModal = document.getElementById('neelveda-custom-alert');
        
        if (!alertModal) {
            // Create the alert modal container
            alertModal = document.createElement('div');
            alertModal.id = 'neelveda-custom-alert';
            alertModal.className = 'custom-alert-modal';
            
            // Build the luxury modal content
            const contentHTML = `
                <div class="custom-alert-content">
                    <div class="custom-alert-header">
                        <img src="images/logo.png" alt="Neelveda Logo" class="custom-alert-logo">
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
            
            // Wire up event listeners
            const closeBtn = document.getElementById('custom-alert-close-btn');
            closeBtn.addEventListener('click', closeCustomAlert);
            
            // Allow closing by clicking on the background overlay
            alertModal.addEventListener('click', function(e) {
                if (e.target === alertModal) {
                    closeCustomAlert();
                }
            });

            // Close on Escape key press
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && alertModal.classList.contains('active')) {
                    closeCustomAlert();
                }
            });
        }
        
        // Update message text
        document.getElementById('custom-alert-message').textContent = message;
        
        // Display the modal
        alertModal.style.display = 'flex';
        // Force reflow
        alertModal.offsetHeight;
        alertModal.classList.add('active');
        
        // Disable scroll on the underlying page
        document.body.style.overflow = 'hidden';
        
        // Premium GSAP animation if GSAP is available on the current page
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
        
        // Premium GSAP animation if available
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
            // Native CSS Transition Fallback
            alertModal.classList.remove('active');
            setTimeout(() => {
                alertModal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
})();
