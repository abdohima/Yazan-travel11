// Dashboard JavaScript

// Current section
let currentSection = 'dashboard';
let currentData = {
    hotels: [],
    tours: [],
    bookings: [],
    offers: [],
    reviews: []
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// Initialize Dashboard
async function initializeDashboard() {
    try {
        // Check admin authentication
        if (!checkAdminAuth()) {
            window.location.href = 'login.html';
            return;
        }
        
        // Initialize components
        initializeNavigation();
        initializeData();
        
        // Load initial data
        await loadDashboardData();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 500);
        }, 1000);
        
        console.log('✅ Dashboard initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing dashboard:', error);
    }
}

// Check Admin Authentication
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true' || 
                      sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        const adminEmail = localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail');
        document.getElementById('adminName').textContent = adminEmail || 'مدير النظام';
        return true;
    }
    
    return false;
}

// Initialize Navigation
function initializeNavigation() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('onclick').match(/showSection\('(\w+)'\)/)[1];
            showSection(section);
        });
    });
}

// Initialize Data
function initializeData() {
    // Set current date for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.value) {
            input.value = today;
        }
        input.min = today;
    });
}

// Show Section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove active class from all sidebar items
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionName + 'Section');
    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('fade-in');
    }
    
    // Add active class to selected sidebar item
    const activeSidebarItem = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeSidebarItem) {
        activeSidebarItem.classList.add('active');
    }
    
    // Update page title
    const titles = {
        dashboard: 'الإحصائيات',
        hotels: 'إدارة الفنادق',
        tours: 'إدارة الرحلات',
        bookings: 'إدارة الحجوزات',
        offers: 'إدارة العروض',
        reviews: 'إدارة التقييمات',
        settings: 'الإعدادات'
    };
    
    document.getElementById('pageTitle').textContent = titles[sectionName] || 'لوحة التحكم';
    
    currentSection = sectionName;
    
    // Load data for the section
    loadSectionData(sectionName);
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        const [hotelsResponse, toursResponse, bookingsResponse, offersResponse] = await Promise.all([
            fetch('../tables/hotels'),
            fetch('../tables/tours'),
            fetch('../tables/bookings'),
            fetch('../tables/offers')
        ]);
        
        const hotelsData = await hotelsResponse.json();
        const toursData = await toursResponse.json();
        const bookingsData = await bookingsResponse.json();
        const offersData = await offersResponse.json();
        
        // Store data globally
        currentData.hotels = hotelsData.data;
        currentData.tours = toursData.data;
        currentData.bookings = bookingsData.data;
        currentData.offers = offersData.data;
        
        // Update dashboard stats
        document.getElementById('dashboardHotels').textContent = currentData.hotels.length;
        document.getElementById('dashboardTours').textContent = currentData.tours.length;
        document.getElementById('dashboardBookings').textContent = currentData.bookings.length;
        document.getElementById('dashboardOffers').textContent = currentData.offers.length;
        
        // Display recent bookings
        displayRecentBookings();
        
        // Initialize chart
        initializeChart();
        
        console.log('✅ Dashboard data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        // Load sample data
        loadSampleDashboardData();
    }
}

// Load Sample Dashboard Data (Fallback)
function loadSampleDashboardData() {
    // Sample data for demo
    currentData.hotels = [
        { id: 'hotel1', name: 'فندق هيلتون شرم الشيخ', available: true },
        { id: 'hotel2', name: 'منتجع صن رايز الغردقة', available: true },
        { id: 'hotel3', name: 'فندق موفنبيك الإسكندرية', available: true }
    ];
    
    currentData.tours = [
        { id: 'tour1', title: 'سفاري الصحراء الغربية', available: true },
        { id: 'tour2', title: 'رحلة الغوص في البحر الأحمر', available: true }
    ];
    
    currentData.bookings = [
        { id: 'booking1', customer_name: 'أحمد محمد', status: 'confirmed', total_price: 2500 },
        { id: 'booking2', customer_name: 'سارة أحمد', status: 'pending', total_price: 1800 },
        { id: 'booking3', customer_name: 'محمود علي', status: 'confirmed', total_price: 3200 }
    ];
    
    currentData.offers = [
        { id: 'offer1', title: 'عرض الصيف', active: true }
    ];
    
    // Update dashboard stats
    document.getElementById('dashboardHotels').textContent = currentData.hotels.length;
    document.getElementById('dashboardTours').textContent = currentData.tours.length;
    document.getElementById('dashboardBookings').textContent = currentData.bookings.length;
    document.getElementById('dashboardOffers').textContent = currentData.offers.length;
    
    displayRecentBookings();
    initializeChart();
}

// Display Recent Bookings
function displayRecentBookings() {
    const recentBookings = currentData.bookings
        .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()))
        .slice(0, 5);
    
    const container = document.getElementById('recentBookings');
    
    if (!recentBookings.length) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">لا توجد حجوزات حتى الآن</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>اسم العميل</th>
                <th>نوع الحجز</th>
                <th>الحالة</th>
                <th>السعر</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
            </tr>
        </thead>
        <tbody>
            ${recentBookings.map(booking => `
                <tr>
                    <td>${booking.customer_name}</td>
                    <td>${booking.item_type}</td>
                    <td><span class="status-badge ${booking.status}">${getStatusText(booking.status)}</span></td>
                    <td>${booking.total_price} ج.م</td>
                    <td>${new Date(booking.created_at || Date.now()).toLocaleDateString('ar-EG')}</td>
                    <td>
                        <button onclick="viewBookingDetails('${booking.id}')" class="btn-action btn-view">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editBooking('${booking.id}')" class="btn-action btn-edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteBooking('${booking.id}')" class="btn-action btn-delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    container.innerHTML = '';
    container.appendChild(table);
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('bookingsChart');
    if (!ctx) return;
    
    // Sample data for chart
    const chartData = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
            label: 'عدد الحجوزات',
            data: [12, 19, 15, 25, 20, 30],
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
            borderColor: 'rgba(37, 99, 235, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'إحصائيات الحجوزات الشهرية',
                    font: {
                        family: 'Tajawal',
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Tajawal'
                        }
                    }
                }
            }
        }
    });
}

// Load Section Data
async function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'hotels':
            await loadHotelsTable();
            break;
        case 'tours':
            await loadToursTable();
            break;
        case 'bookings':
            await loadBookingsTable();
            break;
        case 'offers':
            await loadOffersTable();
            break;
        case 'reviews':
            await loadReviewsTable();
            break;
        case 'settings':
            await loadSettings();
            break;
    }
}

// Load Hotels Table
async function loadHotelsTable() {
    const container = document.getElementById('hotelsTable');
    
    if (!currentData.hotels.length) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">لا توجد فنادق</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>اسم الفندق</th>
                <th>الموقع</th>
                <th>السعر/ليلة</th>
                <th>التقييم</th>
                <th>الحالة</th>
                <th>إجراءات</th>
            </tr>
        </thead>
        <tbody>
            ${currentData.hotels.map(hotel => `
                <tr>
                    <td>${hotel.name}</td>
                    <td>${hotel.location}</td>
                    <td>${hotel.price_per_night} ج.م</td>
                    <td>${hotel.rating} ⭐</td>
                    <td><span class="status-badge ${hotel.available ? 'active' : 'inactive'}">${hotel.available ? 'متاح' : 'غير متاح'}</span></td>
                    <td>
                        <button onclick="editHotel('${hotel.id}')" class="btn-action btn-edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteHotel('${hotel.id}')" class="btn-action btn-delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    container.innerHTML = '';
    container.appendChild(table);
}

// Load Tours Table
async function loadToursTable() {
    const container = document.getElementById('toursTable');
    
    if (!currentData.tours.length) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">لا توجد رحلات</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>عنوان الرحلة</th>
                <th>النوع</th>
                <th>الوجهة</th>
                <th>السعر</th>
                <th>الحالة</th>
                <th>إجراءات</th>
            </tr>
        </thead>
        <tbody>
            ${currentData.tours.map(tour => `
                <tr>
                    <td>${tour.title}</td>
                    <td>${tour.type}</td>
                    <td>${tour.destination}</td>
                    <td>${tour.price} ج.م</td>
                    <td><span class="status-badge ${tour.available ? 'active' : 'inactive'}">${tour.available ? 'متاح' : 'غير متاح'}</span></td>
                    <td>
                        <button onclick="editTour('${tour.id}')" class="btn-action btn-edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteTour('${tour.id}')" class="btn-action btn-delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    container.innerHTML = '';
    container.appendChild(table);
}

// Load Bookings Table
async function loadBookingsTable() {
    const container = document.getElementById('bookingsTable');
    
    if (!currentData.bookings.length) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280;">لا توجد حجوزات</p>';
        return;
    }
    
    const table = document.createElement('table');
    table.className = 'data-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>اسم العميل</th>
                <th>البريد الإلكتروني</th>
                <th>نوع الحجز</th>
                <th>الحالة</th>
                <th>السعر</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
            </tr>
        </thead>
        <tbody>
            ${currentData.bookings.map(booking => `
                <tr>
                    <td>${booking.customer_name}</td>
                    <td>${booking.customer_email}</td>
                    <td>${booking.item_type}</td>
                    <td><span class="status-badge ${booking.status}">${getStatusText(booking.status)}</span></td>
                    <td>${booking.total_price} ج.م</td>
                    <td>${new Date(booking.created_at || Date.now()).toLocaleDateString('ar-EG')}</td>
                    <td>
                        <button onclick="viewBookingDetails('${booking.id}')" class="btn-action btn-view">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button onclick="editBooking('${booking.id}')" class="btn-action btn-edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteBooking('${booking.id}')" class="btn-action btn-delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    container.innerHTML = '';
    container.appendChild(table);
}

// Utility Functions
function getStatusText(status) {
    const statusMap = {
        'pending': 'قيد الانتظار',
        'confirmed': 'مؤكد',
        'cancelled': 'ملغي',
        'completed': 'مكتمل'
    };
    
    return statusMap[status] || status;
}

function logout() {
    if (confirm('هل أنت متأكد من أنك تريد تسجيل الخروج؟')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminEmail');
        
        window.location.href = 'login.html';
    }
}

// Add CSS for status badges
const style = document.createElement('style');
style.textContent = `
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: capitalize;
    }
    
    .status-badge.active {
        background: #10b981;
        color: white;
    }
    
    .status-badge.inactive {
        background: #ef4444;
        color: white;
    }
    
    .status-badge.pending {
        background: #f59e0b;
        color: white;
    }
    
    .status-badge.confirmed {
        background: #10b981;
        color: white;
    }
    
    .status-badge.cancelled {
        background: #ef4444;
        color: white;
    }
    
    .status-badge.completed {
        background: #3b82f6;
        color: white;
    }
`;
document.head.appendChild(style);