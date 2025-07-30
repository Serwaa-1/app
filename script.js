// Dummy Data
const dummyData = {
    user: {
        name: "Alex Johnson",
        balance: 2847.50,
        email: "alex@torrentpay.com",
        phone: "+1 (555) 123-4567"
    },
    // Dummy users for authentication
    users: [
        {
            email: "alex@torrentpay.com",
            password: "password123",
            name: "Alex Johnson",
            phone: "+1 (555) 123-4567"
        },
        {
            email: "demo@torrentpay.com",
            password: "demo123",
            name: "Demo User",
            phone: "+1 (555) 999-8888"
        }
    ],
    activities: [
        {
            id: 1,
            type: "sent",
            name: "Sarah Wilson",
            amount: 45.00,
            note: "Coffee ☕",
            time: "2 hours ago",
            avatar: "SW"
        },
        {
            id: 2,
            type: "received",
            name: "Mike Chen",
            amount: 120.00,
            note: "Dinner split",
            time: "Yesterday",
            avatar: "MC"
        },
        {
            id: 3,
            type: "sent",
            name: "Emma Davis",
            amount: 25.50,
            note: "Movie tickets",
            time: "2 days ago",
            avatar: "ED"
        },
        {
            id: 4,
            type: "received",
            name: "David Brown",
            amount: 85.00,
            note: "Concert tickets",
            time: "3 days ago",
            avatar: "DB"
        },
        {
            id: 5,
            type: "sent",
            name: "Lisa Garcia",
            amount: 15.00,
            note: "Lunch",
            time: "1 week ago",
            avatar: "LG"
        }
    ],
    contacts: [
        { id: 1, name: "Sarah Wilson", avatar: "SW", phone: "+1 (555) 111-1111" },
        { id: 2, name: "Mike Chen", avatar: "MC", phone: "+1 (555) 222-2222" },
        { id: 3, name: "Emma Davis", avatar: "ED", phone: "+1 (555) 333-3333" },
        { id: 4, name: "David Brown", avatar: "DB", phone: "+1 (555) 444-4444" },
        { id: 5, name: "Lisa Garcia", avatar: "LG", phone: "+1 (555) 555-5555" },
        { id: 6, name: "John Smith", avatar: "JS", phone: "+1 (555) 666-6666" },
        { id: 7, name: "Maria Rodriguez", avatar: "MR", phone: "+1 (555) 777-7777" },
        { id: 8, name: "Tom Anderson", avatar: "TA", phone: "+1 (555) 888-8888" }
    ],
    investments: [
        { name: "Bitcoin", symbol: "BTC", price: 43250, change: 12.5, icon: "fas fa-bitcoin" },
        { name: "Ethereum", symbol: "ETH", price: 2850, change: 8.3, icon: "fas fa-ethereum" },
        { name: "Apple Stock", symbol: "AAPL", price: 175.50, change: 5.2, icon: "fas fa-chart-pie" },
        { name: "Tesla Stock", symbol: "TSLA", price: 245.80, change: -2.1, icon: "fas fa-chart-pie" }
    ]
};

// Global Variables
let currentBalance = dummyData.user.balance;
let currentActivities = [...dummyData.activities];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
    registerServiceWorker();
});

// Authentication Functions
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showApp();
    } else {
        showAuth();
    }
}

function showAuth() {
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

function showApp() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'block';
    initializeApp();
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('signupScreen').style.display = 'none';
}

function showSignup() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('signupScreen').style.display = 'block';
}

function login(email, password) {
    const user = dummyData.users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        showApp();
        showNotification('Welcome back, ' + user.name + '!', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function signup(userData) {
    // Check if user already exists
    const existingUser = dummyData.users.find(u => u.email === userData.email);
    if (existingUser) {
        showNotification('User already exists with this email', 'error');
        return;
    }

    // Add new user
    const newUser = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        phone: userData.phone
    };
    
    dummyData.users.push(newUser);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    showApp();
    showNotification('Account created successfully!', 'success');
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    showAuth();
    showNotification('You have been signed out', 'info');
}

// Register Service Worker for PWA
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

function initializeApp() {
    populateActivities();
    populateContacts();
    populateActivityFeed();
    populateContactsGrid();
    updateBalance();
    updateUserInfo();
    setupAmountInputs();
}

// Tab Navigation
function switchTab(tabId) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Update user information
function updateUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userPhone').textContent = currentUser.phone;
    }
}

// Activity Feed Functions
function populateActivityFeed() {
    const activityFeed = document.getElementById('activityFeed');
    if (!activityFeed) return;
    
    activityFeed.innerHTML = '';
    currentActivities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityFeed.appendChild(activityItem);
    });
}

function filterActivities(filter) {
    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    const activityFeed = document.getElementById('activityFeed');
    activityFeed.innerHTML = '';
    
    let filteredActivities = currentActivities;
    if (filter !== 'all') {
        filteredActivities = currentActivities.filter(activity => activity.type === filter);
    }
    
    filteredActivities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityFeed.appendChild(activityItem);
    });
}

// Contacts Grid Functions
function populateContactsGrid() {
    const contactsGrid = document.getElementById('contactsGrid');
    if (!contactsGrid) return;
    
    contactsGrid.innerHTML = '';
    dummyData.contacts.forEach(contact => {
        const contactCard = createContactCard(contact);
        contactsGrid.appendChild(contactCard);
    });
}

function createContactCard(contact) {
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.onclick = () => selectContact(contact);
    
    card.innerHTML = `
        <div class="contact-card-avatar">${contact.avatar}</div>
        <div class="contact-card-name">${contact.name}</div>
        <div class="contact-card-email">${contact.phone}</div>
    `;
    
    return card;
}

function searchContacts(query) {
    const contactsGrid = document.getElementById('contactsGrid');
    contactsGrid.innerHTML = '';
    
    const filteredContacts = dummyData.contacts.filter(contact => 
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.phone.includes(query)
    );
    
    filteredContacts.forEach(contact => {
        const contactCard = createContactCard(contact);
        contactsGrid.appendChild(contactCard);
    });
}

// Additional Functions
function showAllActivity() {
    switchTab('activityTab');
}

function showAllContacts() {
    switchTab('contactsTab');
}

function showAddContact() {
    const modal = document.getElementById('addContactModal');
    modal.classList.add('active');
}

function addContact() {
    const name = document.getElementById('contactNameInput').value;
    const email = document.getElementById('contactEmailInput').value;
    const phone = document.getElementById('contactPhoneInput').value;
    
    if (!name || !email || !phone) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    const newContact = {
        id: Date.now(),
        name: name,
        avatar: getInitials(name),
        phone: phone,
        email: email
    };
    
    dummyData.contacts.push(newContact);
    populateContactsGrid();
    closeModal('addContactModal');
    showNotification('Contact added successfully!', 'success');
    
    // Clear form
    document.getElementById('contactNameInput').value = '';
    document.getElementById('contactEmailInput').value = '';
    document.getElementById('contactPhoneInput').value = '';
}

// Profile Functions
function editProfileImage() {
    showNotification('Profile image editing coming soon!', 'info');
}

function showPersonalInfo() {
    showNotification('Personal information settings coming soon!', 'info');
}

function showSecurity() {
    showNotification('Security settings coming soon!', 'info');
}

function showPaymentMethods() {
    showNotification('Payment methods coming soon!', 'info');
}

function showNotifications() {
    showNotification('Notification settings coming soon!', 'info');
}

function showHelp() {
    showNotification('Help & support coming soon!', 'info');
}

function showAbout() {
    showNotification('About Torrent Pay coming soon!', 'info');
}

function showSettings() {
    showNotification('Settings coming soon!', 'info');
}

function setupEventListeners() {
    // Authentication form listeners
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    });

    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('signupPhone').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        signup({ name, email, phone, password });
    });

    // Tab navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterActivities(filter);
        });
    });

    // Contact search
    const contactSearch = document.getElementById('contactSearch');
    if (contactSearch) {
        contactSearch.addEventListener('input', function() {
            searchContacts(this.value);
        });
    }

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Activity Functions
function populateActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';

    currentActivities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityList.appendChild(activityItem);
    });
}

function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    const isPositive = activity.type === 'received';
    const amountClass = isPositive ? 'positive' : 'negative';
    const amountPrefix = isPositive ? '+' : '-';
    
    item.innerHTML = `
        <div class="activity-avatar">${activity.avatar}</div>
        <div class="activity-info">
            <div class="activity-name">${activity.name}</div>
            <div class="activity-details">${activity.note} • ${activity.time}</div>
        </div>
        <div class="activity-amount ${amountClass}">
            ${amountPrefix}$${activity.amount.toFixed(2)}
        </div>
    `;
    
    return item;
}

// Contact Functions
function populateContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';

    dummyData.contacts.forEach(contact => {
        const contactItem = createContactItem(contact);
        contactsList.appendChild(contactItem);
    });
}

function createContactItem(contact) {
    const item = document.createElement('div');
    item.className = 'contact-item';
    item.onclick = () => selectContact(contact);
    
    item.innerHTML = `
        <div class="contact-avatar">${contact.avatar}</div>
        <div class="contact-name">${contact.name}</div>
    `;
    
    return item;
}

function selectContact(contact) {
    const recipientInput = document.getElementById('recipientInput');
    if (recipientInput) {
        recipientInput.value = contact.name;
        showSendMoney();
    }
}

// Modal Functions
function showSendMoney() {
    const modal = document.getElementById('sendMoneyModal');
    modal.classList.add('active');
    document.getElementById('recipientInput').focus();
}

function showRequestMoney() {
    const modal = document.getElementById('requestMoneyModal');
    modal.classList.add('active');
    document.getElementById('requestFromInput').focus();
}

function showInvest() {
    const modal = document.getElementById('investModal');
    modal.classList.add('active');
}

function showCards() {
    const modal = document.getElementById('cardsModal');
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    
    // Clear form inputs
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => input.value = '');
    
    // Reset amount displays
    const amountSpans = modal.querySelectorAll('[id$="Amount"]');
    amountSpans.forEach(span => span.textContent = '0.00');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Transaction Functions
function sendMoney() {
    const recipient = document.getElementById('recipientInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    const note = document.getElementById('noteInput').value;

    if (!recipient || !amount || amount <= 0) {
        showNotification('Please fill in all required fields with valid amounts.', 'error');
        return;
    }

    if (amount > currentBalance) {
        showNotification('Insufficient funds!', 'error');
        return;
    }

    // Simulate API call
    showLoading();
    
    setTimeout(() => {
        // Update balance
        currentBalance -= amount;
        updateBalance();

        // Add to activities
        const newActivity = {
            id: Date.now(),
            type: 'sent',
            name: recipient,
            amount: amount,
            note: note || 'Payment',
            time: 'Just now',
            avatar: getInitials(recipient)
        };

        currentActivities.unshift(newActivity);
        populateActivities();

        // Close modal and show success
        closeModal('sendMoneyModal');
        hideLoading();
        showNotification(`Successfully sent $${amount.toFixed(2)} to ${recipient}!`, 'success');
    }, 1500);
}

function requestMoney() {
    const from = document.getElementById('requestFromInput').value;
    const amount = parseFloat(document.getElementById('requestAmountInput').value);
    const note = document.getElementById('requestNoteInput').value;

    if (!from || !amount || amount <= 0) {
        showNotification('Please fill in all required fields with valid amounts.', 'error');
        return;
    }

    // Simulate API call
    showLoading();
    
    setTimeout(() => {
        // Add to activities as pending
        const newActivity = {
            id: Date.now(),
            type: 'requested',
            name: from,
            amount: amount,
            note: note || 'Money request',
            time: 'Just now',
            avatar: getInitials(from)
        };

        currentActivities.unshift(newActivity);
        populateActivities();

        // Close modal and show success
        closeModal('requestMoneyModal');
        hideLoading();
        showNotification(`Money request sent to ${from}!`, 'success');
    }, 1500);
}

// Utility Functions
function updateBalance() {
    const balanceElement = document.querySelector('.balance-amount');
    if (balanceElement) {
        balanceElement.textContent = `$${currentBalance.toFixed(2)}`;
    }
}

function setupAmountInputs() {
    // Send money amount input
    const amountInput = document.getElementById('amountInput');
    if (amountInput) {
        amountInput.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            document.getElementById('sendAmount').textContent = amount.toFixed(2);
        });
    }

    // Request money amount input
    const requestAmountInput = document.getElementById('requestAmountInput');
    if (requestAmountInput) {
        requestAmountInput.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            document.getElementById('requestAmount').textContent = amount.toFixed(2);
        });
    }
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4757' : '#ffd700'};
        color: ${type === 'success' || type === 'error' ? '#000000' : '#000000'};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

// Loading States
function showLoading() {
    const appContainer = document.querySelector('.app-container');
    appContainer.classList.add('loading');
}

function hideLoading() {
    const appContainer = document.querySelector('.app-container');
    appContainer.classList.remove('loading');
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Investment Functions
function buyInvestment(investment) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showNotification(`Successfully purchased ${investment.name}!`, 'success');
        closeModal('investModal');
    }, 1500);
}

// Add click handlers for investment buttons
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const investmentButtons = document.querySelectorAll('.investment-option .btn-secondary');
        investmentButtons.forEach((button, index) => {
            button.addEventListener('click', function() {
                const investment = dummyData.investments[index];
                buyInvestment(investment);
            });
        });
    }, 100);
});

// Simulate real-time updates
setInterval(() => {
    // Randomly update balance with small changes
    const change = (Math.random() - 0.5) * 10;
    currentBalance += change;
    updateBalance();
    
    // Update balance change indicator
    const balanceChange = document.querySelector('.balance-change');
    if (balanceChange) {
        const isPositive = change >= 0;
        balanceChange.className = `balance-change ${isPositive ? 'positive' : 'negative'}`;
        balanceChange.innerHTML = `
            <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
            ${isPositive ? '+' : ''}$${Math.abs(change).toFixed(2)} this week
        `;
    }
}, 30000); // Update every 30 seconds

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .action-item').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 215, 0, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Export functions for global access
window.showSendMoney = showSendMoney;
window.showRequestMoney = showRequestMoney;
window.showInvest = showInvest;
window.showCards = showCards;
window.closeModal = closeModal;
window.sendMoney = sendMoney;
window.requestMoney = requestMoney;
window.showLogin = showLogin;
window.showSignup = showSignup;
window.logout = logout;
window.showAllActivity = showAllActivity;
window.showAllContacts = showAllContacts;
window.showAddContact = showAddContact;
window.addContact = addContact;
window.editProfileImage = editProfileImage;
window.showPersonalInfo = showPersonalInfo;
window.showSecurity = showSecurity;
window.showPaymentMethods = showPaymentMethods;
window.showNotifications = showNotifications;
window.showHelp = showHelp;
window.showAbout = showAbout;
window.showSettings = showSettings; 
window.requestMoney = requestMoney; 
