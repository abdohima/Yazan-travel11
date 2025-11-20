// Global Variables
let map;
let markers = [];
let hotels = [];
let tours = [];
let offers = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize App
async function initializeApp() {
    try {
        await loadData();
        initializeMap();
        initializeAudio();
        initializeParticles();
        initializeNavigation();
        initializeAnimations();
        
        // Display data
        displayHotels();
        displayTours();
        displayOffers();
        
        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
    }
}

// Load Data from API
async function loadData() {
    try {
        // Load hotels
        const hotelsResponse = await fetch('tables/hotels');
        const hotelsData = await hotelsResponse.json();
        hotels = hotelsData.data;
        
        // Load tours
        const toursResponse = await fetch('tables/tours');
        const toursData = await toursResponse.json();
        tours = toursData.data;
        
        // Load offers
        const offersResponse = await fetch('tables/offers');
        const offersData = await offersResponse.json();
        offers = offersData.data;
        
        console.log('✅ Data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading data:', error);
        // Load sample data for demo
        loadSampleData();
    }
}

// Load Sample Data (Fallback)
function loadSampleData() {
    hotels = [
        {
            id: 'hotel1',
            name: 'فندق هيلتون شرم الشيخ',
            description: 'فندق فاخر يقع على شاطئ البحر الأحمر مع إطلالات خلابة وخدمات عالمية',
            location: 'شرم الشيخ، مصر',
            latitude: 27.9167,
            longitude: 34.3333,
            price_per_night: 800,
            features: 'واي فاي, مكيف, جيم, سبا, مطاعم متعددة, شاطئ خاص',
            rating: 4.8,
            category: 'فاخر',
            available: true,
            images: 'https://j.top4top.io/p_3608n4joc2.png'
        },
        {
            id: 'hotel2',
            name: 'منتجع صن رايز الغردقة',
            description: 'منتجع شامل جميع الخدمات مع شاطئ رملي خاص ومرافق ترفيهية متكاملة',
            location: 'الغردقة، مصر',
            latitude: 27.2579,
            longitude: 33.8116,
            price_per_night: 650,
            features: 'واي فاي, مكيف, حمام سباحة, شاطئ خاص, رياضات مائية',
            rating: 4.6,
            category: 'منتجع',
            available: true,
            images: 'https://j.top4top.io/p_3608n4joc2.png'
        }
    ];
    
    tours = [
        {
            id: 'tour1',
            title: 'سفاري الصحراء الغربية',
            description: 'رحلة سفاري مميزة إلى الصحراء المصرية مع تجربة ركوب الجمل ومشاهدة النجوم',
            type: 'سفاري',
            destination: 'الصحراء الغربية',
            duration: 3,
            price: 1200,
            available_dates: '2024-12-25',
            features: 'وجبات, مواصلات, مرشد سياحي, خيام',
            rating: 4.7,
            available: true
        }
    ];
    
    offers = [
        {
            id: 'offer1',
            title: 'عرض الصيف',
            description: 'خصم خاص على حجوزات الصيف',
            discount_percentage: 25,
            original_price: 2000,
            discounted_price: 1500,
            valid_until: '2024-12-31',
            featured: true,
            active: true
        }
    ];
}

// Initialize Map
function initializeMap() {
    try {
        map = L.map('map').setView([26.8206, 30.8025], 6); // Center on Egypt
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add hotel markers
        hotels.forEach(hotel => {
            if (hotel.latitude && hotel.longitude) {
                const marker = L.marker([hotel.latitude, hotel.longitude])
                    .addTo(map)
                    .bindPopup(`
                        <div style="text-align: center; min-width: 200px;">
                            <h3>${hotel.name}</h3>
                            <p>${hotel.location}</p>
                            <p><strong>${hotel.price_per_night} ج.م</strong> / ليلة</p>
                            <div style="color: #fbbf24;">${'★'.repeat(Math.floor(hotel.rating))}</div>
                            <button onclick="viewHotelDetails('${hotel.id}')" class="btn btn-primary" style="margin-top: 10px;">
                                عرض التفاصيل
                            </button>
                        </div>
                    `);
                
                markers.push(marker);
            }
        });
        
        console.log('✅ Map initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing map:', error);
    }
}

// Initialize Audio
function initializeAudio() {
    const audio = document.getElementById('music');
    
    function playMusic() {
        audio.play().catch(() => {});
        document.removeEventListener('click', playMusic);
        document.removeEventListener('touchstart', playMusic);
    }
    
    // تشغيل عند لمس أو الضغط في أي مكان
    document.addEventListener('click', playMusic, { once: true });
    document.addEventListener('touchstart', playMusic, { once: true });
    
    console.log('✅ Audio initialized successfully');
}

// Initialize Particles
function initializeParticles() {
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles = [];
    
    // Create particles
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            r: Math.random() * 2 + 1
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = '#2563eb';
            ctx.fill();
            
            // Draw connections
            particles.forEach(q => {
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(37, 99, 235, ${1 - dist / 100})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off walls
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
        
        requestAnimationFrame(draw);
    }
    
    draw();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize Navigation
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                scrollToSection(targetId.substring(1));
            }
        });
    });
}

// Initialize Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.hotel-card, .tour-card, .offer-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Display Hotels
function displayHotels() {
    const hotelsGrid = document.getElementById('hotelsGrid');
    
    if (!hotels.length) {
        hotelsGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">لا توجد فنادق متاحة حالياً</p>';
        return;
    }
    
    hotelsGrid.innerHTML = hotels.map(hotel => `
        <div class="hotel-card">
            <img src="${hotel.images || 'https://j.top4top.io/p_3608n4joc2.png'}" alt="${hotel.name}" class="hotel-image">
            <div class="hotel-content">
                <h3 class="hotel-title">${hotel.name}</h3>
                <div class="hotel-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${hotel.location}</span>
                </div>
                <p class="hotel-description">${hotel.description}</p>
                <div class="hotel-features">
                    ${hotel.features.split(',').map(feature => `
                        <span class="feature-tag">${feature.trim()}</span>
                    `).join('')}
                </div>
                <div class="hotel-footer">
                    <div class="hotel-price">${hotel.price_per_night} ج.م</div>
                    <div class="hotel-rating">
                        <div class="stars">${'★'.repeat(Math.floor(hotel.rating))}</div>
                        <span>${hotel.rating}</span>
                    </div>
                </div>
                <button onclick="viewHotelDetails('${hotel.id}')" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                    عرض التفاصيل والحجز
                </button>
            </div>
        </div>
    `).join('');
}

// Display Tours
function displayTours() {
    const toursGrid = document.getElementById('toursGrid');
    
    if (!tours.length) {
        toursGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">لا توجد رحلات متاحة حالياً</p>';
        return;
    }
    
    toursGrid.innerHTML = tours.map(tour => `
        <div class="tour-card">
            <div class="tour-image">
                <i class="fas fa-route"></i>
            </div>
            <div class="tour-content">
                <h3 class="tour-title">${tour.title}</h3>
                <span class="tour-type">${tour.type}</span>
                <p class="tour-description">${tour.description}</p>
                <div class="tour-details">
                    <div class="tour-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${tour.destination}</span>
                    </div>
                    <div class="tour-detail">
                        <i class="fas fa-clock"></i>
                        <span>${tour.duration} أيام</span>
                    </div>
                    <div class="tour-detail">
                        <i class="fas fa-calendar"></i>
                        <span>${new Date(tour.available_dates).toLocaleDateString('ar-EG')}</span>
                    </div>
                    <div class="tour-detail">
                        <i class="fas fa-star"></i>
                        <span>${tour.rating}</span>
                    </div>
                </div>
                <div class="tour-price">${tour.price} ج.م</div>
                <button onclick="viewTourDetails('${tour.id}')" class="btn btn-secondary" style="width: 100%; margin-top: 1rem;">
                    عرض التفاصيل والحجز
                </button>
            </div>
        </div>
    `).join('');
}

// Display Offers
function displayOffers() {
    const offersGrid = document.getElementById('offersGrid');
    
    if (!offers.length) {
        offersGrid.innerHTML = '<p style="text-align: center; color: #6b7280;">لا توجد عروض متاحة حالياً</p>';
        return;
    }
    
    offersGrid.innerHTML = offers.filter(offer => offer.active && offer.featured).map(offer => `
        <div class="offer-card">
            <div class="offer-title">${offer.title}</div>
            <div class="offer-discount">${offer.discount_percentage}% خصم</div>
            <p style="margin-bottom: 1rem;">${offer.description}</p>
            <div class="offer-prices">
                <div class="original-price">${offer.original_price} ج.م</div>
                <div class="discounted-price">${offer.discounted_price} ج.م</div>
            </div>
            <div class="offer-validity">
                صالح حتى: ${new Date(offer.valid_until).toLocaleDateString('ar-EG')}
            </div>
            <button onclick="viewOfferDetails('${offer.id}')" class="btn btn-secondary" style="width: 100%;">
                استفيد من العرض
            </button>
        </div>
    `).join('');
}

// Navigation Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function viewHotelDetails(hotelId) {
    window.location.href = `hotel-details.html?id=${hotelId}`;
}

function viewTourDetails(tourId) {
    window.location.href = `tour-details.html?id=${tourId}`;
}

function viewOfferDetails(offerId) {
    window.location.href = `offer-details.html?id=${offerId}`;
}

// Search Functionality
document.getElementById('searchForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const destination = document.getElementById('destination').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;
    
    // Filter hotels based on search criteria
    const filteredHotels = hotels.filter(hotel => 
        hotel.location.toLowerCase().includes(destination.toLowerCase()) &&
        hotel.available
    );
    
    // Display filtered results
    displayFilteredHotels(filteredHotels);
    
    // Show WhatsApp contact for inquiries
    setTimeout(() => {
        if (confirm('هل ترغب في التواصل عبر واتساب للاستفسار عن الحجز؟')) {
            window.open('https://wa.me/201273426669', '_blank');
        }
    }, 1000);
});

function displayFilteredHotels(filteredHotels) {
    const hotelsGrid = document.getElementById('hotelsGrid');
    
    if (!filteredHotels.length) {
        hotelsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <h3>لم يتم العثور على فنادق</h3>
                <p>حاول تغيير معايير البحث أو تواصل معنا عبر واتساب للمساعدة</p>
                <a href="https://wa.me/201273426669" class="btn btn-primary" target="_blank">
                    تواصل عبر واتساب
                </a>
            </div>
        `;
        return;
    }
    
    // Display filtered hotels
    hotelsGrid.innerHTML = filteredHotels.map(hotel => `
        <div class="hotel-card">
            <img src="${hotel.images || 'https://j.top4top.io/p_3608n4joc2.png'}" alt="${hotel.name}" class="hotel-image">
            <div class="hotel-content">
                <h3 class="hotel-title">${hotel.name}</h3>
                <div class="hotel-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${hotel.location}</span>
                </div>
                <p class="hotel-description">${hotel.description}</p>
                <div class="hotel-features">
                    ${hotel.features.split(',').map(feature => `
                        <span class="feature-tag">${feature.trim()}</span>
                    `).join('')}
                </div>
                <div class="hotel-footer">
                    <div class="hotel-price">${hotel.price_per_night} ج.م</div>
                    <div class="hotel-rating">
                        <div class="stars">${'★'.repeat(Math.floor(hotel.rating))}</div>
                        <span>${hotel.rating}</span>
                    </div>
                </div>
                <button onclick="viewHotelDetails('${hotel.id}')" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                    عرض التفاصيل والحجز
                </button>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-EG', {
        style: 'currency',
        currency: 'EGP'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add user-friendly error handling here
});

// Service Worker Registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('✅ ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('❌ ServiceWorker registration failed:', error);
            });
    });
}