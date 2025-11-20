// Hotel Details JavaScript

let currentHotel = null;
let currentHotelId = null;
let hotelMap = null;
let currentRating = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeHotelDetails();
});

// Initialize Hotel Details Page
async function initializeHotelDetails() {
    try {
        // Get hotel ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        currentHotelId = urlParams.get('id');
        
        if (!currentHotelId) {
            showError('لم يتم تحديد الفندق');
            return;
        }
        
        // Initialize components
        initializeAudio();
        initializeParticles();
        initializeNavigation();
        initializeRatingInput();
        
        // Load hotel data
        await loadHotelData();
        
        // Display hotel information
        displayHotelHeader();
        displayHotelGallery();
        displayHotelInfo();
        displayReviews();
        
        // Initialize booking form
        initializeBookingForm();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 500);
        }, 1000);
        
        console.log('✅ Hotel details initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing hotel details:', error);
        showError('حدث خطأ أثناء تحميل بيانات الفندق');
    }
}

// Load Hotel Data
async function loadHotelData() {
    try {
        const response = await fetch(`tables/hotels/${currentHotelId}`);
        const data = await response.json();
        currentHotel = data;
        
        if (!currentHotel) {
            throw new Error('Hotel not found');
        }
        
        console.log('✅ Hotel data loaded:', currentHotel);
    } catch (error) {
        console.error('❌ Error loading hotel data:', error);
        // Load sample data for demo
        loadSampleHotelData();
    }
}

// Load Sample Hotel Data (Fallback)
function loadSampleHotelData() {
    currentHotel = {
        id: currentHotelId,
        name: 'فندق هيلتون شرم الشيخ',
        description: 'فندق فاخر يقع على شاطئ البحر الأحمر مع إطلالات خلابة وخدمات عالمية. يتميز الفندق بتصميمه المعماري الراقي وغرفه الواسعة المطلة على البحر، بالإضافة إلى مجموعة متنوعة من المطاعم التي تقدم أشهى المأكولات العالمية والمحلية. يوفر الفندق أيضاً مرافق ترفيهية متكاملة تشمل مركزاً للياقة البدنية، وسبا فاخر، وحمامات سباحة متعددة، بالإضافة إلى شاطئ خاص رملي يمتد على مسافة طويلة.',
        location: 'شرم الشيخ، مصر',
        latitude: 27.9167,
        longitude: 34.3333,
        price_per_night: 800,
        features: 'واي فاي, مكيف, جيم, سبا, مطاعم متعددة, شاطئ خاص, حمامات سباحة, خدمة الغرف, موقف سيارات, نادي أطفال',
        rating: 4.8,
        category: 'فاخر',
        available: true,
        images: 'https://j.top4top.io/p_3608n4joc2.png'
    };
    
    console.log('✅ Sample hotel data loaded');
}

// Display Hotel Header
function displayHotelHeader() {
    const header = document.getElementById('hotelHeader');
    
    header.innerHTML = `
        <h1 class="hotel-title">${currentHotel.name}</h1>
        <p class="hotel-subtitle">${currentHotel.description.substring(0, 150)}...</p>
        <div class="hotel-meta">
            <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${currentHotel.location}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-star"></i>
                <span>${currentHotel.rating} من 5</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-building"></i>
                <span>${currentHotel.category}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-money-bill-wave"></i>
                <span>${currentHotel.price_per_night} ج.م / ليلة</span>
            </div>
        </div>
    `;
}

// Display Hotel Gallery
function displayHotelGallery() {
    const gallery = document.getElementById('hotelGallery');
    const images = currentHotel.images ? currentHotel.images.split(',') : [currentHotel.images];
    
    let currentImageIndex = 0;
    
    gallery.innerHTML = `
        <div class="gallery-container">
            <img src="${images[0]}" alt="${currentHotel.name}" class="gallery-main" id="galleryMain">
            
            <div class="gallery-nav" id="galleryNav">
                ${images.map((image, index) => `
                    <div class="gallery-dot ${index === 0 ? 'active' : ''}" onclick="changeGalleryImage(${index})"></div>
                `).join('')}
            </div>
            
            <button class="gallery-arrow prev" onclick="previousGalleryImage()">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="gallery-arrow next" onclick="nextGalleryImage()">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    // Store images globally for navigation
    window.galleryImages = images;
    window.currentImageIndex = currentImageIndex;
}

// Gallery Navigation Functions
function changeGalleryImage(index) {
    const mainImage = document.getElementById('galleryMain');
    const dots = document.querySelectorAll('.gallery-dot');
    
    mainImage.src = window.galleryImages[index];
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    window.currentImageIndex = index;
}

function nextGalleryImage() {
    const nextIndex = (window.currentImageIndex + 1) % window.galleryImages.length;
    changeGalleryImage(nextIndex);
}

function previousGalleryImage() {
    const prevIndex = (window.currentImageIndex - 1 + window.galleryImages.length) % window.galleryImages.length;
    changeGalleryImage(prevIndex);
}

// Display Hotel Info
function displayHotelInfo() {
    // Description
    document.getElementById('hotelDescription').textContent = currentHotel.description;
    
    // Features
    const featuresContainer = document.getElementById('hotelFeatures');
    const features = currentHotel.features.split(',');
    
    featuresContainer.innerHTML = features.map(feature => `
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-check"></i>
            </div>
            <div class="feature-text">${feature.trim()}</div>
        </div>
    `).join('');
    
    // Initialize map
    initializeHotelMap();
}

// Initialize Hotel Map
function initializeHotelMap() {
    if (!currentHotel.latitude || !currentHotel.longitude) return;
    
    hotelMap = L.map('hotelMap').setView([currentHotel.latitude, currentHotel.longitude], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(hotelMap);
    
    L.marker([currentHotel.latitude, currentHotel.longitude])
        .addTo(hotelMap)
        .bindPopup(`
            <div style="text-align: center;">
                <h4>${currentHotel.name}</h4>
                <p>${currentHotel.location}</p>
            </div>
        `);
}

// Initialize Booking Form
function initializeBookingForm() {
    const form = document.getElementById('bookingForm');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkIn').min = today;
    document.getElementById('checkOut').min = today;
    
    // Date change handlers
    document.getElementById('checkIn').addEventListener('change', updatePriceSummary);
    document.getElementById('checkOut').addEventListener('change', updatePriceSummary);
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await submitBooking();
    });
    
    // Initialize price summary
    updatePriceSummary();
}

// Update Price Summary
function updatePriceSummary() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const pricePerNight = currentHotel.price_per_night;
    
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalPrice = numberOfNights * pricePerNight;
        
        document.getElementById('pricePerNight').textContent = `${pricePerNight} ج.م`;
        document.getElementById('numberOfNights').textContent = `${numberOfNights} ليلة`;
        document.getElementById('totalPrice').textContent = `${totalPrice} ج.م`;
    } else {
        document.getElementById('pricePerNight').textContent = `${pricePerNight} ج.م`;
        document.getElementById('numberOfNights').textContent = '- ليلة';
        document.getElementById('totalPrice').textContent = '- ج.م';
    }
}

// Submit Booking
async function submitBooking() {
    try {
        const formData = new FormData(document.getElementById('bookingForm'));
        const bookingData = {
            customer_name: formData.get('customerName'),
            customer_email: formData.get('customerEmail'),
            customer_phone: formData.get('customerPhone'),
            item_type: 'فندق',
            item_name: currentHotel.name,
            check_in: formData.get('checkIn'),
            check_out: formData.get('checkOut'),
            guests: parseInt(formData.get('guests')),
            total_price: calculateTotalPrice(),
            status: 'pending',
            notes: formData.get('notes')
        };
        
        // Submit to API
        const response = await fetch('tables/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        if (response.ok) {
            const result = await response.json();
            
            // Send WhatsApp notification
            sendWhatsAppNotification(bookingData);
            
            // Show success message
            showSuccess('تم إرسال طلب الحجز بنجاح! سنتواصل معك قريباً للتأكيد.');
            
            // Reset form
            document.getElementById('bookingForm').reset();
            
            console.log('✅ Booking submitted successfully:', result);
        } else {
            throw new Error('Failed to submit booking');
        }
    } catch (error) {
        console.error('❌ Error submitting booking:', error);
        showError('حدث خطأ أثناء إرسال الحجز. يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.');
    }
}

// Calculate Total Price
function calculateTotalPrice() {
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    const pricePerNight = currentHotel.price_per_night;
    
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        return numberOfNights * pricePerNight;
    }
    
    return 0;
}

// Send WhatsApp Notification
function sendWhatsAppNotification(bookingData) {
    const message = `
مرحباً! تم استلام حجز جديد.

تفاصيل الحجز:
- الاسم: ${bookingData.customer_name}
- الفندق: ${bookingData.item_name}
- التواريخ: من ${new Date(bookingData.check_in).toLocaleDateString('ar-EG')} إلى ${new Date(bookingData.check_out).toLocaleDateString('ar-EG')}
- عدد الضيوف: ${bookingData.guests}
- السعر الإجمالي: ${bookingData.total_price} ج.م

للتواصل: ${bookingData.customer_phone}
    `;
    
    const whatsappUrl = `https://wa.me/201273426669?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
}

// Initialize Rating Input
function initializeRatingInput() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            currentRating = parseInt(this.dataset.rating);
            updateRatingDisplay();
            document.getElementById('reviewRating').value = currentRating;
        });
        
        star.addEventListener('mouseenter', function() {
            const hoverRating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                s.classList.toggle('active', index < hoverRating);
            });
        });
    });
    
    document.getElementById('ratingInput').addEventListener('mouseleave', function() {
        updateRatingDisplay();
    });
}

// Update Rating Display
function updateRatingDisplay() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < currentRating);
    });
}

// Display Reviews
function displayReviews() {
    const reviewsGrid = document.getElementById('reviewsGrid');
    
    // Sample reviews (in real app, these would come from API)
    const reviews = [
        {
            name: 'أحمد محمد',
            rating: 5,
            date: '2024-11-15',
            comment: 'فندق رائع وخدمة ممتازة! الغرفة كانت نظيفة جداً والإطلالة كانت خلابة. الموظفون متعاونون وودودون. أنصح به بشدة!'
        },
        {
            name: 'سارة أحمد',
            rating: 4,
            date: '2024-11-10',
            comment: 'الموقع ممتاز والفندق جميل. الإفطار كان متنوعاً وشهياً. السبا كان رائعاً للاسترخاء.'
        },
        {
            name: 'محمود علي',
            rating: 5,
            date: '2024-11-05',
            comment: 'تجربة رائعة! الفندق يوفر كل ما تحتاجه لقضاء عطلة ممتازة. الشاطئ الخاص كان نظيفاً والخدمة كانت سريعة.'
        }
    ];
    
    if (!reviews.length) {
        reviewsGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">لا توجد تقييمات حتى الآن</p>';
        return;
    }
    
    reviewsGrid.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-name">${review.name}</div>
                <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
            </div>
            <div class="review-date">${new Date(review.date).toLocaleDateString('ar-EG')}</div>
            <div class="review-comment">${review.comment}</div>
        </div>
    `).join('');
}

// Submit Review
document.getElementById('reviewForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const reviewerName = document.getElementById('reviewerName').value;
    const reviewComment = document.getElementById('reviewComment').value;
    
    if (currentRating === 0) {
        showError('يرجى اختيار تقييم');
        return;
    }
    
    // Here you would normally send the review to your API
    const reviewData = {
        name: reviewerName,
        rating: currentRating,
        comment: reviewComment,
        date: new Date().toISOString().split('T')[0]
    };
    
    showSuccess('تم إرسال تقييمك بنجاح! شكراً لك.');
    
    // Reset form
    this.reset();
    currentRating = 0;
    updateRatingDisplay();
    
    console.log('✅ Review submitted:', reviewData);
});

// Utility Functions
function showSuccess(message) {
    alert(`✅ ${message}`);
}

function showError(message) {
    alert(`❌ ${message}`);
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