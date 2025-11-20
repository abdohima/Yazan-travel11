// Booking JavaScript

// Current booking data
let currentBooking = {
    step: 1,
    itemType: '',
    itemId: '',
    itemName: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    roomType: 'standard',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    totalPrice: 0,
    paymentMethod: 'instapay'
};

// Initialize booking page
document.addEventListener('DOMContentLoaded', function() {
    initializeBooking();
});

// Initialize Booking Page
async function initializeBooking() {
    try {
        // Get booking parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        currentBooking.itemType = urlParams.get('type') || 'hotel';
        currentBooking.itemId = urlParams.get('id') || 'hotel1';
        
        // Initialize components
        initializeAudio();
        initializeParticles();
        initializeNavigation();
        
        // Load item data
        await loadItemData();
        
        // Initialize forms
        initializeForms();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 500);
        }, 1000);
        
        console.log('✅ Booking page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing booking page:', error);
        showError('حدث خطأ أثناء تحميل صفحة الحجز');
    }
}

// Load Item Data
async function loadItemData() {
    try {
        let response;
        
        if (currentBooking.itemType === 'hotel') {
            response = await fetch(`tables/hotels/${currentBooking.itemId}`);
        } else if (currentBooking.itemType === 'tour') {
            response = await fetch(`tables/tours/${currentBooking.itemId}`);
        }
        
        const itemData = await response.json();
        
        if (itemData) {
            currentBooking.itemName = itemData.name || itemData.title;
            displayItemCard(itemData);
            updatePriceSummary();
        } else {
            throw new Error('Item not found');
        }
        
        console.log('✅ Item data loaded:', itemData);
    } catch (error) {
        console.error('❌ Error loading item data:', error);
        // Load sample data for demo
        loadSampleItemData();
    }
}

// Load Sample Item Data (Fallback)
function loadSampleItemData() {
    const sampleData = {
        name: 'فندق هيلتون شرم الشيخ',
        description: 'فندق فاخر يقع على شاطئ البحر الأحمر مع إطلالات خلابة وخدمات عالمية',
        location: 'شرم الشيخ، مصر',
        price_per_night: 800,
        rating: 4.8,
        features: 'واي فاي, مكيف, جيم, سبا, مطاعم متعددة'
    };
    
    currentBooking.itemName = sampleData.name;
    displayItemCard(sampleData);
    updatePriceSummary();
    
    console.log('✅ Sample item data loaded');
}

// Display Item Card
function displayItemCard(item) {
    const card = document.getElementById('bookingItemCard');
    
    card.innerHTML = `
        <div class="item-header">
            <div>
                <h2 class="item-title">${item.name || item.title}</h2>
                <div class="item-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${item.location || item.destination}</span>
                </div>
            </div>
            <div class="item-rating">
                ${'★'.repeat(Math.floor(item.rating))}
                <span>${item.rating}</span>
            </div>
        </div>
        
        <p class="item-description">${item.description}</p>
        
        <div class="item-meta">
            <div class="meta-item">
                <i class="fas fa-money-bill-wave"></i>
                <span>${item.price_per_night || item.price} ج.م</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-star"></i>
                <span>${item.rating} تقييم</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-calendar-alt"></i>
                <span>${item.features ? item.features.split(',').length : 0} ميزة</span>
            </div>
        </div>
    `;
}

// Initialize Forms
function initializeForms() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').min = today;
    document.getElementById('checkOut').min = today;
    
    // Add event listeners
    document.getElementById('checkIn').addEventListener('change', updatePriceSummary);
    document.getElementById('checkOut').addEventListener('change', updatePriceSummary);
    document.getElementById('guests').addEventListener('change', updatePriceSummary);
    document.getElementById('roomType').addEventListener('change', updatePriceSummary);
    
    // Form submissions
    document.getElementById('bookingInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        nextStep();
    });
    
    document.getElementById('customerInfoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        nextStep();
    });
}

// Update Price Summary
function updatePriceSummary() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const guests = parseInt(document.getElementById('guests').value);
    const roomType = document.getElementById('roomType').value;
    
    let pricePerNight = 800; // Base price
    
    // Adjust price based on room type
    const roomTypeMultiplier = {
        'standard': 1,
        'deluxe': 1.3,
        'suite': 1.8,
        'villa': 2.5
    };
    
    pricePerNight *= roomTypeMultiplier[roomType] || 1;
    
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const subtotal = numberOfNights * pricePerNight;
        const taxesAndFees = subtotal * 0.14; // 14% taxes and fees
        const totalPrice = subtotal + taxesAndFees;
        
        // Update display
        document.getElementById('pricePerNight').textContent = `${pricePerNight.toFixed(0)} ج.م`;
        document.getElementById('numberOfNights').textContent = `${numberOfNights} ليلة`;
        document.getElementById('taxesAndFees').textContent = `${taxesAndFees.toFixed(0)} ج.م`;
        document.getElementById('totalPrice').textContent = `${totalPrice.toFixed(0)} ج.م`;
        
        // Store in current booking
        currentBooking.checkIn = checkIn;
        currentBooking.checkOut = checkOut;
        currentBooking.guests = guests;
        currentBooking.roomType = roomType;
        currentBooking.totalPrice = totalPrice;
    } else {
        document.getElementById('pricePerNight').textContent = `${pricePerNight.toFixed(0)} ج.م`;
        document.getElementById('numberOfNights').textContent = '- ليلة';
        document.getElementById('taxesAndFees').textContent = '- ج.م';
        document.getElementById('totalPrice').textContent = '- ج.م';
    }
}

// Navigation Functions
function nextStep() {
    if (!validateCurrentStep()) {
        return;
    }
    
    if (currentBooking.step < 4) {
        // Save current step data
        saveStepData();
        
        // Move to next step
        currentBooking.step++;
        updateStepDisplay();
        
        if (currentBooking.step === 4) {
            // Final step - show confirmation
            showConfirmation();
        }
    }
}

function previousStep() {
    if (currentBooking.step > 1) {
        currentBooking.step--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Hide all step contents
    document.querySelectorAll('.booking-step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step content
    const currentContent = document.getElementById(`step${currentBooking.step}Content`);
    if (currentContent) {
        currentContent.classList.add('active');
    }
    
    // Mark current step as active
    const currentStep = document.getElementById(`step${currentBooking.step}`);
    if (currentStep) {
        currentStep.classList.add('active');
    }
    
    // Update final prices if we're on step 3 or 4
    if (currentBooking.step >= 3) {
        updateFinalPrices();
    }
}

// Validate Current Step
function validateCurrentStep() {
    switch (currentBooking.step) {
        case 1:
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;
            
            if (!checkIn || !checkOut) {
                showError('يرجى اختيار تواريخ الوصول والمغادرة');
                return false;
            }
            
            if (new Date(checkOut) <= new Date(checkIn)) {
                showError('تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول');
                return false;
            }
            break;
            
        case 2:
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const terms = document.getElementById('terms').checked;
            
            if (!firstName || !lastName || !email || !phone) {
                showError('يرجى ملء جميع الحقول المطلوبة');
                return false;
            }
            
            if (!terms) {
                showError('يرجى الموافقة على الشروط والأحكام');
                return false;
            }
            break;
            
        case 3:
            // Payment step - no validation needed as user can choose payment method
            break;
    }
    
    return true;
}

// Save Step Data
function saveStepData() {
    switch (currentBooking.step) {
        case 1:
            // Data already saved in updatePriceSummary()
            break;
            
        case 2:
            currentBooking.customerName = document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value;
            currentBooking.customerEmail = document.getElementById('email').value;
            currentBooking.customerPhone = document.getElementById('phone').value;
            break;
            
        case 3:
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
            if (paymentMethod) {
                currentBooking.paymentMethod = paymentMethod.value;
            }
            break;
    }
}

// Update Final Prices
function updateFinalPrices() {
    document.getElementById('finalPricePerNight').textContent = `${(currentBooking.totalPrice / (Math.ceil((new Date(currentBooking.checkOut) - new Date(currentBooking.checkIn)) / (1000 * 60 * 60 * 24)))).toFixed(0)} ج.م`;
    document.getElementById('finalNumberOfNights').textContent = `${Math.ceil((new Date(currentBooking.checkOut) - new Date(currentBooking.checkIn)) / (1000 * 60 * 60 * 24))} ليلة`;
    document.getElementById('finalTaxesAndFees').textContent = `${(currentBooking.totalPrice * 0.14).toFixed(0)} ج.م`;
    document.getElementById('finalTotalPrice').textContent = `${currentBooking.totalPrice.toFixed(0)} ج.م`;
}

// Process Payment
async function processPayment() {
    try {
        // Show loading state
        showLoadingState(true);
        
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Submit booking
        await submitBooking();
        
        // Move to confirmation step
        currentBooking.step = 4;
        updateStepDisplay();
        
        console.log('✅ Payment processed successfully');
    } catch (error) {
        console.error('❌ Error processing payment:', error);
        showError('حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.');
    } finally {
        showLoadingState(false);
    }
}

// Submit Booking
async function submitBooking() {
    try {
        const bookingData = {
            customer_name: currentBooking.customerName,
            customer_email: currentBooking.customerEmail,
            customer_phone: currentBooking.customerPhone,
            item_type: currentBooking.itemType === 'hotel' ? 'فندق' : 'رحلة',
            item_name: currentBooking.itemName,
            check_in: currentBooking.checkIn,
            check_out: currentBooking.checkOut,
            guests: currentBooking.guests,
            total_price: currentBooking.totalPrice,
            status: 'pending',
            notes: `طريقة الدفع: ${currentBooking.paymentMethod}, نوع الغرفة: ${currentBooking.roomType}`
        };
        
        const response = await fetch('../tables/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Booking submitted successfully:', result);
            
            // Send WhatsApp notification
            sendWhatsAppBookingNotification(bookingData);
            
            return result;
        } else {
            throw new Error('Failed to submit booking');
        }
    } catch (error) {
        console.error('❌ Error submitting booking:', error);
        throw error;
    }
}

// Show Confirmation
function showConfirmation() {
    const summary = document.getElementById('bookingSummary');
    const numberOfNights = Math.ceil((new Date(currentBooking.checkOut) - new Date(currentBooking.checkIn)) / (1000 * 60 * 60 * 24));
    
    summary.innerHTML = `
        <div class="summary-item">
            <span><strong>الاسم:</strong></span>
            <span>${currentBooking.customerName}</span>
        </div>
        <div class="summary-item">
            <span><strong>البريد الإلكتروني:</strong></span>
            <span>${currentBooking.customerEmail}</span>
        </div>
        <div class="summary-item">
            <span><strong>رقم الهاتف:</strong></span>
            <span>${currentBooking.customerPhone}</span>
        </div>
        <div class="summary-item">
            <span><strong>العنصر:</strong></span>
            <span>${currentBooking.itemName}</span>
        </div>
        <div class="summary-item">
            <span><strong>تواريخ الحجز:</strong></span>
            <span>من ${new Date(currentBooking.checkIn).toLocaleDateString('ar-EG')} إلى ${new Date(currentBooking.checkOut).toLocaleDateString('ar-EG')}</span>
        </div>
        <div class="summary-item">
            <span><strong>عدد الضيوف:</strong></span>
            <span>${currentBooking.guests} أشخاص</span>
        </div>
        <div class="summary-item">
            <span><strong>عدد الليالي:</strong></span>
            <span>${numberOfNights} ليلة</span>
        </div>
        <div class="summary-item total">
            <span><strong>السعر الإجمالي:</strong></span>
            <span>${currentBooking.totalPrice.toFixed(0)} ج.م</span>
        </div>
        <div class="summary-item">
            <span><strong>طريقة الدفع:</strong></span>
            <span>${getPaymentMethodText(currentBooking.paymentMethod)}</span>
        </div>
    `;
}

// Utility Functions
function getPaymentMethodText(method) {
    const methods = {
        'instapay': 'إنستا باي',
        'vodafone-cash': 'فودافون كاش',
        'bank-transfer': 'تحويل بنكي',
        'cash': 'دفع نقدي'
    };
    
    return methods[method] || method;
}

function sendWhatsAppBookingNotification(bookingData) {
    const message = `
مرحباً! تم تأكيد حجز جديد.

تفاصيل الحجز:
👤 الاسم: ${bookingData.customer_name}
📧 البريد: ${bookingData.customer_email}
📱 الهاتف: ${bookingData.customer_phone}
🏨 العنصر: ${bookingData.item_name}
📅 التواريخ: من ${new Date(bookingData.check_in).toLocaleDateString('ar-EG')} إلى ${new Date(bookingData.check_out).toLocaleDateString('ar-EG')}
👥 الضيوف: ${bookingData.guests} أشخاص
💰 السعر: ${bookingData.total_price} ج.م
📝 الحالة: ${bookingData.status}

شكراً لاختياركم يزن ترافل!
    `;
    
    const whatsappUrl = `https://wa.me/201273426669?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

function sendWhatsAppConfirmation() {
    const customerMessage = `
مرحباً ${currentBooking.customerName}!

تم تأكيد حجزكم بنجاح ✅

تفاصيل الحجز:
🏨 ${currentBooking.itemName}
📅 من ${new Date(currentBooking.checkIn).toLocaleDateString('ar-EG')} إلى ${new Date(currentBooking.checkOut).toLocaleDateString('ar-EG')}
👥 ${currentBooking.guests} أشخاص
💰 ${currentBooking.totalPrice.toFixed(0)} ج.م

شكراً لاختياركم يزن ترافل! سنتواصل معكم قريباً.
    `;
    
    const whatsappUrl = `https://wa.me/${currentBooking.customerPhone}?text=${encodeURIComponent(customerMessage)}`;
    window.open(whatsappUrl, '_blank');
}

function printBooking() {
    window.print();
}

function goToHome() {
    window.location.href = 'index.html';
}

function showLoadingState(loading) {
    // Implementation for showing loading state
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        btn.disabled = loading;
        btn.style.opacity = loading ? '0.7' : '1';
    });
}

function showError(message) {
    alert(`❌ ${message}`);
}

function showSuccess(message) {
    alert(`✅ ${message}`);
}

// Initialize Navigation (same as main.js)
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Initialize Audio (same as main.js)
function initializeAudio() {
    const audio = document.getElementById('music');
    
    function playMusic() {
        audio.play().catch(() => {});
        document.removeEventListener('click', playMusic);
        document.removeEventListener('touchstart', playMusic);
    }
    
    document.addEventListener('click', playMusic, { once: true });
    document.addEventListener('touchstart', playMusic, { once: true });
}