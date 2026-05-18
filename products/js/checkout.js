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

document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    const preloader = document.getElementById('preloader');
    const preloaderUnderline = document.querySelector('.preloader-underline');
    const body = document.body;

    if (preloader) {
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
            }
        });
    }


    // Load Order Data
    const checkoutData = JSON.parse(localStorage.getItem('neelvedaCheckout')) || {};
    
    // Temporarily decoupled from localStorage admin settings
    const storedSettings = {
        productName: "Neelveda Herbal Oil",
        price: "₹249.00",
        whatsapp: "919544181503"
    };

    // settings holds the details for this specific checkout transaction
    const settings = {
        productName: checkoutData.productName || storedSettings.productName || "Neelveda Herbal Oil",
        price: checkoutData.price || storedSettings.price || "₹249.00",
        whatsapp: storedSettings.whatsapp || "919544181503"
    };
    
    const checkoutQty = parseInt(localStorage.getItem('checkoutQty')) || 1;
    
    // Robustly extract the currency symbol and base price
    let currencySymbol = "₹";
    const symbolMatch = settings.price.match(/[^\d\s,.]+/);
    if (symbolMatch) {
        currencySymbol = symbolMatch[0];
    }
    
    // Remove all non-digits to get the exact value in cents/paise
    const digitsOnly = settings.price.replace(/[^\d]/g, '');
    let totalAmount = 249 * checkoutQty; // default fallback
    
    if (digitsOnly.length > 0) {
        // Assume the last two digits are decimals (e.g., 24900 -> 249.00)
        // Check if original price string has a decimal point or comma for cents
        if (settings.price.match(/[.,]\d{2}$/)) {
            totalAmount = (parseInt(digitsOnly, 10) / 100) * checkoutQty;
        } else {
            totalAmount = parseInt(digitsOnly, 10) * checkoutQty;
        }
    }
    
    // Check for abnormal calculations (like 0.13) and reset to fallback
    if (totalAmount < 1 || isNaN(totalAmount)) {
        totalAmount = 249 * checkoutQty;
    }

    const formatPrice = (amount) => {
        return `${currencySymbol}${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // Update Summary UI
    const itemNameElement = document.querySelector('.item-name');
    if (itemNameElement) itemNameElement.textContent = settings.productName;
    document.getElementById('summary-qty').textContent = checkoutQty;
    document.getElementById('summary-subtotal').textContent = formatPrice(totalAmount);
    document.getElementById('subtotal-val').textContent = formatPrice(totalAmount);
    document.getElementById('total-val').textContent = formatPrice(totalAmount);

    // Update Product/Combo Image
    const summaryThumb = document.querySelector('.summary-thumb');
    if (summaryThumb) {
        if (checkoutData.image) {
            summaryThumb.src = checkoutData.image;
        } else if (settings.productName.includes("3 Combo Pack")) {
            summaryThumb.src = "images/clean-combo-3.png";
        } else if (settings.productName.includes("5 Combo Pack")) {
            summaryThumb.src = "images/clean-combo-5.png";
        } else if (settings.productName.includes("10 Combo Pack")) {
            summaryThumb.src = "images/clean-combo-10.png";
        } else {
            summaryThumb.src = "images/100ml-main.jpg";
        }
    }

    // --- Form UI Interactions ---
    const addAltPhoneBtn = document.getElementById('add-alt-phone');
    const altPhoneRow = document.getElementById('alt-phone-row');
    const addLandmarkBtn = document.getElementById('add-landmark');
    const landmarkRow = document.getElementById('landmark-row');

    if (addAltPhoneBtn) {
        addAltPhoneBtn.addEventListener('click', () => {
            altPhoneRow.style.display = 'block';
            addAltPhoneBtn.style.display = 'none';
        });
    }

    if (addLandmarkBtn) {
        addLandmarkBtn.addEventListener('click', () => {
            landmarkRow.style.display = 'block';
            addLandmarkBtn.style.display = 'none';
        });
    }

    // Geolocation Logic
    const useLocationBtn = document.getElementById('use-location');
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', () => {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser.");
                return;
            }

            useLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
            
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const data = await response.json();
                    
                    if (data.address) {
                        const addr = data.address;
                        if (addr.postcode) document.getElementById('pincode').value = addr.postcode;
                        if (addr.city || addr.town || addr.village) {
                            document.getElementById('city').value = addr.city || addr.town || addr.village;
                        }
                        if (addr.state) {
                            updateStateDropdown(addr.state);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching location details:", error);
                } finally {
                    useLocationBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Use my location';
                }
            }, (error) => {
                console.error("Geolocation error:", error);
                alert("Could not fetch location. Please enter manually.");
                useLocationBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Use my location';
            });
        });
    }

    // === Pincode Auto-fill Logic ===
    const pincodeInput = document.getElementById('pincode');
    const cityInput = document.getElementById('city');

    if (pincodeInput) {
        pincodeInput.addEventListener('input', async (e) => {
            const pincode = e.target.value.trim();
            if (pincode.length === 6) {
                try {
                    // Add loading state
                    pincodeInput.classList.add('loading-pincode');
                    
                    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                    const data = await response.json();

                    if (data && data[0].Status === "Success") {
                        const postOffice = data[0].PostOffice[0];
                        const district = postOffice.District;
                        const state = postOffice.State;

                        // Update City/District
                        if (cityInput) {
                            cityInput.value = district;
                        }

                        // Update State Dropdown
                        if (typeof updateStateDropdown === 'function') {
                            updateStateDropdown(state);
                        }

                        // Subtle success animation
                        gsap.to(pincodeInput, { 
                            borderColor: "rgba(37, 211, 102, 0.5)", 
                            duration: 0.3, 
                            yoyo: true, 
                            repeat: 1 
                        });
                    } else {
                        // Optional: show error state if pincode is invalid
                        console.warn("Pincode not found");
                    }
                } catch (error) {
                    console.error("Error fetching pincode details:", error);
                } finally {
                    pincodeInput.classList.remove('loading-pincode');
                }
            }
        });
    }

    // Form Handling
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const addressTypeEl = document.querySelector('input[name="address-type"]:checked');
        const addressType = addressTypeEl ? addressTypeEl.value : 'Not Specified';
        
        const details = {
            name: document.getElementById('fullname').value,
            email: document.getElementById('email').value || "Not provided",
            phone: document.getElementById('phone').value,
            altPhone: document.getElementById('alt-phone').value,
            house: document.getElementById('house').value,
            street: document.getElementById('street').value,
            landmark: document.getElementById('landmark').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            pincode: document.getElementById('pincode').value,
            type: addressType
        };

        // Build full address string
        let fullAddress = details.house;
        if (details.street) fullAddress += `, ${details.street}`;
        if (details.landmark) fullAddress += ` (Landmark: ${details.landmark})`;

        // Save order to history for Admin Panel before redirecting
        try {
            const orderLog = {
                id: 'NV-' + Math.floor(100000 + Math.random() * 900000),
                date: new Date().toISOString(),
                product: settings.productName,
                qty: checkoutQty,
                price: formatPrice(totalAmount),
                amount: totalAmount,
                currency: currencySymbol,
                name: details.name,
                phone: details.phone,
                city: details.city,
                state: details.state,
                pincode: details.pincode,
                type: details.type,
                status: 'WhatsApp Clicked'
            };
            const existingOrders = JSON.parse(localStorage.getItem('neelvedaOrders')) || [];
            existingOrders.unshift(orderLog);
            localStorage.setItem('neelvedaOrders', JSON.stringify(existingOrders));
        } catch (err) {
            console.error("Failed to log order:", err);
        }

        const message = `*NEW ORDER FROM WEBSITE*%0A%0A` +
                      `*Product:* ${settings.productName}%0A` +
                      `*Quantity:* ${checkoutQty}%0A` +
                      `*Total:* ${formatPrice(totalAmount)}%0A%0A` +
                      `*SHIPPING DETAILS*%0A` +
                      `*Name:* ${details.name}%0A` +
                      `*Phone:* ${details.phone}${details.altPhone ? ` / ${details.altPhone}` : ''}%0A` +
                      `*Address:* ${fullAddress}%0A` +
                      `*Address Type:* ${details.type}%0A` +
                      `*City:* ${details.city}%0A` +
                      `*State:* ${details.state} - ${details.pincode}%0A` +
                      `*Email:* ${details.email}%0A%0A` +
                      `Please confirm my order.`;

        window.location.href = `https://wa.me/${settings.whatsapp}?text=${message}`;
    });

    // Reusable function to update state input programmatically
    function updateStateDropdown(stateValue) {
        if (!stateValue) return;
        const stateInput = document.getElementById('state');
        if (stateInput) {
            stateInput.value = stateValue;
            // Close suggestions if open
            const suggestions = document.getElementById('state-suggestions');
            if (suggestions) suggestions.classList.remove('active');
            return true;
        }
        return false;
    }


    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const districtSuggestions = document.getElementById('district-suggestions');
            const streetSuggestions = document.getElementById('street-suggestions');
            const landmarkSuggestions = document.getElementById('landmark-suggestions');
            if (districtSuggestions) districtSuggestions.classList.remove('active');
            if (streetSuggestions) streetSuggestions.classList.remove('active');
            if (landmarkSuggestions) landmarkSuggestions.classList.remove('active');
        }
    });

    // === Generic Autocomplete System ===
    function initRitualAutocomplete(config) {
        const {
            input,
            suggestionsList,
            data,
            onSelect,
            subtextKey = null,
            maxResults = 10
        } = config;

        let highlightedIndex = -1;

        function highlightMatch(text, query) {
            if (!query) return text;
            const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${q})`, 'gi');
            return text.replace(regex, '<span class="match-highlight">$1</span>');
        }

        function showSuggestions(query) {
            const q = query.toLowerCase().trim();
            suggestionsList.innerHTML = '';
            highlightedIndex = -1;

            if (q.length < 1) {
                suggestionsList.classList.remove('active');
                return;
            }

            const matches = data.filter(item => {
                const name = (typeof item === 'string' ? item : item.name).toLowerCase();
                const subtext = subtextKey && item[subtextKey] ? item[subtextKey].toLowerCase() : '';
                return name.includes(q) || subtext.includes(q);
            }).slice(0, maxResults);

            if (matches.length === 0) {
                if (config.hideIfNoMatch) {
                    suggestionsList.classList.remove('active');
                    return;
                }
                suggestionsList.innerHTML = '<li class="no-results">No suggestions found</li>';
                suggestionsList.classList.add('active');
                return;
            }

            matches.forEach((item, index) => {
                const li = document.createElement('li');
                const name = typeof item === 'string' ? item : item.name;
                const subtext = subtextKey && item[subtextKey] ? item[subtextKey] : '';
                
                let content = highlightMatch(name, q);
                if (subtext) {
                    content += `<span class="suggestion-subtext">${subtext}</span>`;
                }
                
                li.innerHTML = content;
                li.addEventListener('click', () => {
                    selectItem(item);
                });

                suggestionsList.appendChild(li);
            });

            suggestionsList.classList.add('active');
        }

        function selectItem(item) {
            const value = typeof item === 'string' ? item : item.name;
            input.value = value;
            suggestionsList.classList.remove('active');
            if (onSelect) onSelect(item);
        }

        function updateHighlight(items) {
            items.forEach(item => item.classList.remove('highlighted'));
            if (items[highlightedIndex]) {
                items[highlightedIndex].classList.add('highlighted');
                items[highlightedIndex].scrollIntoView({ block: 'nearest' });
            }
        }

        input.addEventListener('input', () => showSuggestions(input.value));
        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 1) showSuggestions(input.value);
        });

        input.addEventListener('keydown', (e) => {
            const items = suggestionsList.querySelectorAll('li:not(.no-results)');
            if (!items.length) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
                updateHighlight(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                highlightedIndex = Math.max(highlightedIndex - 1, 0);
                updateHighlight(items);
            } else if (e.key === 'Enter') {
                if (highlightedIndex >= 0 && items[highlightedIndex]) {
                    e.preventDefault();
                    const q = input.value.toLowerCase().trim();
                    const currentMatches = data.filter(item => {
                        const name = (typeof item === 'string' ? item : item.name).toLowerCase();
                        const subtext = subtextKey && item[subtextKey] ? item[subtextKey].toLowerCase() : '';
                        return name.includes(q) || subtext.includes(q);
                    }).slice(0, maxResults);
                    
                    if (currentMatches[highlightedIndex]) {
                        selectItem(currentMatches[highlightedIndex]);
                    }
                }
            } else if (e.key === 'Escape') {
                suggestionsList.classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!input.parentElement.contains(e.target)) {
                suggestionsList.classList.remove('active');
            }
        });
    }

    // === Datasets (Middle Kerala Focused) ===

    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
        "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
        "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
        "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
        "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
        "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
    ];

    // Priority Districts (Middle Kerala first)
    const indianDistricts = [
        { name: "Palakkad", state: "Kerala" },
        { name: "Malappuram", state: "Kerala" },
        { name: "Kozhikode", state: "Kerala" },
        { name: "Ernakulam", state: "Kerala" },
        { name: "Thrissur", state: "Kerala" },
        { name: "Wayanad", state: "Kerala" },
        { name: "Kannur", state: "Kerala" },
        { name: "Kasaragod", state: "Kerala" },
        { name: "Idukki", state: "Kerala" },
        { name: "Kottayam", state: "Kerala" },
        { name: "Alappuzha", state: "Kerala" },
        { name: "Pathanamthitta", state: "Kerala" },
        { name: "Kollam", state: "Kerala" },
        { name: "Thiruvananthapuram", state: "Kerala" },
        // Major National Districts
        { name: "Bangalore Urban", state: "Karnataka" },
        { name: "Chennai", state: "Tamil Nadu" },
        { name: "Mumbai", state: "Maharashtra" },
        { name: "Coimbatore", state: "Tamil Nadu" }
    ];

    // Highly Granular Area List for Middle Kerala & Beyond
    const streetAreas = [
        // === MALAPPURAM AREAS ===
        { name: "Manjeri", city: "Malappuram" }, { name: "Perinthalmanna", city: "Malappuram" }, { name: "Tirur", city: "Malappuram" },
        { name: "Ponnani", city: "Malappuram" }, { name: "Kottakkal", city: "Malappuram" }, { name: "Nilambur", city: "Malappuram" },
        { name: "Kondotty", city: "Malappuram" }, { name: "Tirurangadi", city: "Malappuram" }, { name: "Valanchery", city: "Malappuram" },
        { name: "Edappal", city: "Malappuram" }, { name: "Tanur", city: "Malappuram" }, { name: "Parappanangadi", city: "Malappuram" },
        { name: "Areacode", city: "Malappuram" }, { name: "Wandoor", city: "Malappuram" }, { name: "Vengara", city: "Malappuram" },
        { name: "Malappuram Town", city: "Malappuram" },

        // === PALAKKAD AREAS ===
        { name: "Ottapalam", city: "Palakkad" }, { name: "Shoranur", city: "Palakkad" }, { name: "Mannarkkad", city: "Palakkad" },
        { name: "Chittur", city: "Palakkad" }, { name: "Alathur", city: "Palakkad" }, { name: "Cherpulassery", city: "Palakkad" },
        { name: "Pattambi", city: "Palakkad" }, { name: "Vadakkencherry", city: "Palakkad" }, { name: "Kollengode", city: "Palakkad" },
        { name: "Nemmara", city: "Palakkad" }, { name: "Kuzhalmannam" , city: "Palakkad" }, { name: "Palakkad Town", city: "Palakkad" },

        // === KOZHIKODE AREAS ===
        { name: "Mananchira", city: "Kozhikode" }, { name: "Nadakkavu", city: "Kozhikode" }, { name: "Mavoor Road", city: "Kozhikode" },
        { name: "West Hill", city: "Kozhikode" }, { name: "Vatakara", city: "Kozhikode" }, { name: "Quilandy", city: "Kozhikode" },
        { name: "Ramanattukara", city: "Kozhikode" }, { name: "Koduvally", city: "Kozhikode" }, { name: "Mukkam", city: "Kozhikode" },
        { name: "Feroke", city: "Kozhikode" }, { name: "Kunnamangalam", city: "Kozhikode" }, { name: "Balussery", city: "Kozhikode" },
        { name: "Thamarassery", city: "Kozhikode" }, { name: "Perambra", city: "Kozhikode" }, { name: "Payyoli", city: "Kozhikode" },

        // === OTHER KEY KERALA AREAS ===
        { name: "Kakkanad", city: "Ernakulam" }, { name: "Edappally", city: "Ernakulam" }, { name: "Vyttila", city: "Ernakulam" },
        { name: "Palarivattom", city: "Ernakulam" }, { name: "Aluva", city: "Ernakulam" }, { name: "Tripunithura", city: "Ernakulam" },
        { name: "Thampanoor", city: "Thiruvananthapuram" }, { name: "Kazhakkoottam", city: "Thiruvananthapuram" }, { name: "Guruvayur", city: "Thrissur" },
        { name: "Chalakudy", city: "Thrissur" }, { name: "Thiruvalla", city: "Pathanamthitta" }, { name: "Pala", city: "Kottayam" },
        { name: "Thalassery", city: "Kannur" }, { name: "Kalpetta", city: "Wayanad" }, { name: "Cherthala", city: "Alappuzha" },
        { name: "Kottarakkara", city: "Kollam" }
    ];

    // Landmarks Data (Common prefixes and types)
    const commonLandmarks = [
        "Opposite to SBI Bank", "Near Temple", "Near Mosque", "Near Church",
        "Opposite Petrol Pump", "Near Government Hospital", "Beside Post Office", "Near Main Market",
        "Opposite Government School", "Behind Central Plaza", "Near Bus Stand", "Opposite Police Station",
        "Near Civil Station", "Near Railway Station", "Next to Bakery"
    ];

    // Initialize Autocompletes
    initRitualAutocomplete({
        input: document.getElementById('state'),
        suggestionsList: document.getElementById('state-suggestions'),
        data: indianStates
    });

    initRitualAutocomplete({
        input: document.getElementById('city'),
        suggestionsList: document.getElementById('district-suggestions'),
        data: indianDistricts,
        subtextKey: 'state',
        onSelect: (item) => {
            // Auto-fill state
            updateStateDropdown(item.state);
        }
    });

    initRitualAutocomplete({
        input: document.getElementById('street'),
        suggestionsList: document.getElementById('street-suggestions'),
        data: streetAreas,
        subtextKey: 'city',
        onSelect: (item) => {
            // Auto-fill city/district
            const cityInput = document.getElementById('city');
            if (cityInput) {
                cityInput.value = item.city;
                
                // Now auto-fill state based on this city
                const district = indianDistricts.find(d => d.name === item.city);
                if (district) {
                    updateStateDropdown(district.state);
                }
            }
        }
    });

    initRitualAutocomplete({
        input: document.getElementById('landmark'),
        suggestionsList: document.getElementById('landmark-suggestions'),
        data: commonLandmarks
    });
});
