// 产品数据 - 添加销量和标签
const products = [
    { id: 1, name: '苹果', price: 5, image: 'images/apple.jpg', category: '水果', description: '新鲜红富士苹果，甜脆可口，适合一家人分享。', rating: 4.8, sales: 528, tag: 'hot' },
    { id: 2, name: '香蕉', price: 3, image: 'images/banana.jpg', category: '水果', description: '优质香蕉，营养丰富，产自热带阳光地带。', rating: 4.6, sales: 412, tag: '' },
    { id: 3, name: '西红柿', price: 4, image: 'images/tomato.jpg', category: '蔬菜', description: '新鲜西红柿，酸甜适口，适合沙拉和烹饪。', rating: 4.7, sales: 389, tag: '' },
    { id: 4, name: '黄瓜', price: 2, image: 'images/cucumber.jpg', category: '蔬菜', description: '清脆黄瓜，爽口解暑，夏日清凉佳品。', rating: 4.5, sales: 256, tag: '' },
    { id: 5, name: '猪肉', price: 25, image: 'images/pork.jpg', category: '肉类', description: '新鲜猪肉，品质保证，适合家庭日常烹饪。', rating: 4.4, sales: 634, tag: 'hot' },
    { id: 6, name: '鸡肉', price: 20, image: 'images/chicken.jpg', category: '肉类', description: '嫩滑鸡肉，健康美味，适合多种菜式。', rating: 4.5, sales: 521, tag: '' },
    { id: 7, name: '牛奶', price: 8, image: 'images/milk.jpg', category: '乳制品', description: '纯牛奶，营养丰富，可直接饮用或搭配早餐。', rating: 4.9, sales: 892, tag: 'sale' },
    { id: 8, name: '鸡蛋', price: 6, image: 'images/eggs.jpg', category: '蛋类', description: '新鲜鸡蛋，蛋白质来源，适合煎、炒、蒸。', rating: 4.7, sales: 745, tag: 'new' },
];

let cart = loadCart();
let currentUser = null;
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentSlide = 0;
let currentSort = 'default';
let currentCategory = 'all';
let currentSearch = '';

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) {
        alert(message);
        return;
    }
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2500);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function saveCurrentUser(user, remember = false) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (remember) {
        localStorage.setItem('rememberUser', user.username);
    } else {
        localStorage.removeItem('rememberUser');
    }
}

function loadCurrentUser() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) return user;
    const remembered = localStorage.getItem('rememberUser');
    if (remembered) {
        return users.find(item => item.username === remembered) || null;
    }
    return null;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const button = document.getElementById('dark-mode-toggle');
    if (button) button.textContent = isDark ? '日间模式' : '夜间模式';
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    const button = document.getElementById('dark-mode-toggle');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (button) button.textContent = '日间模式';
    } else if (button) {
        button.textContent = '夜间模式';
    }
}

function displayCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        dateElement.textContent = now.toLocaleDateString('zh-CN');
    }
}

function renderUserStatus() {
    const status = document.getElementById('user-status');
    if (!status) return;
    if (currentUser) {
        status.innerHTML = `<span>欢迎, ${currentUser.username}</span><button id="logout-btn" type="button">退出</button>`;
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn?.addEventListener('click', logout);
    } else {
        status.innerHTML = `<a class="user-link" href="login.html">登录</a> | <a class="user-link" href="register.html">注册</a>`;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    renderUserStatus();
    showToast('已退出登录', 'info');
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    navbar.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && window.location.href.includes(href.replace('./', ''))) {
            link.classList.add('active');
        }
    });
}

function initCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    if (!carouselContainer || slides.length === 0) return;
    function showSlide(index) {
        carouselContainer.style.transform = `translateX(-${index * 100}%)`;
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    showSlide(currentSlide);
    prevBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });
    nextBtn?.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
}

function displayProducts(category = 'all', searchValue = '') {
    const productList = document.querySelector('.product-list');
    if (!productList) return;
    productList.innerHTML = '';
    currentCategory = category;
    currentSearch = searchValue;

    let filtered = products;
    if (category !== 'all') filtered = filtered.filter(product => product.category === category);
    if (searchValue) {
        const keyword = searchValue.trim().toLowerCase();
        filtered = filtered.filter(product => product.name.includes(keyword) || product.description.includes(keyword));
    }

    // 应用排序和筛选
    filtered = sortProducts(filtered);

    renderProductsWithTags(filtered);
}

function displayRecommend() {
    const recommendContainer = document.querySelector('.recommend-list');
    if (!recommendContainer) return;
    recommendContainer.innerHTML = '';
    const topItems = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
    topItems.forEach(product => {
        const item = document.createElement('div');
        item.className = 'recommend-item';
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="recommend-info">
                <h3>${product.name}</h3>
                <p>¥${product.price}</p>
                <button type="button" onclick="viewProductDetail(${product.id})">查看详情</button>
            </div>
        `;
        recommendContainer.appendChild(item);
    });
}

function filterProducts(category) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
    const searchValue = document.getElementById('search-input')?.value || '';
    displayProducts(category, searchValue);
}

function searchProducts() {
    const category = document.querySelector('.category-btn.active')?.getAttribute('data-category') || 'all';
    const searchValue = document.getElementById('search-input')?.value || '';
    displayProducts(category, searchValue);
}

function viewProductDetail(productId) {
    addToRecentlyViewed(productId);
    window.location.href = `product-detail.html?id=${productId}`;
}

function displayProductDetail() {
    const detailContent = document.getElementById('product-detail-content');
    if (!detailContent) return;
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'), 10);
    const product = products.find(p => p.id === productId);
    if (!product) {
        detailContent.innerHTML = '<p class="empty-message">未找到该商品。</p>';
        return;
    }
    detailContent.innerHTML = `
        <div class="detail-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="info">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p class="product-price">价格: ¥${product.price}</p>
                <p class="product-meta">分类: ${product.category} | 评分: ⭐ ${product.rating.toFixed(1)}</p>
                <div class="quantity-controls">
                    <button type="button" onclick="decreaseQuantity()">-</button>
                    <span id="quantity">1</span>
                    <button type="button" onclick="increaseQuantity()">+</button>
                </div>
                <button class="primary" type="button" onclick="addToCart(${product.id}, parseInt(document.getElementById('quantity').textContent))">加入购物车</button>
            </div>
        </div>
    `;

    // 显示相关推荐
    displayRelatedProducts(product);
}

function displayRelatedProducts(currentProduct) {
    const relatedList = document.getElementById('related-list');
    if (!relatedList) return;

    // 获取同类别或同评分的其他商品
    const related = products
        .filter(p => p.id !== currentProduct.id && (p.category === currentProduct.category || p.rating >= 4.5))
        .slice(0, 4);

    if (related.length === 0) {
        relatedList.innerHTML = '<p class="empty-message">暂无相关推荐</p>';
        return;
    }

    relatedList.innerHTML = related.map(product => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-body">
                <h3>${product.name}</h3>
                <p class="product-price">¥${product.price}</p>
                <div class="product-meta">
                    <span class="badge">${product.category}</span>
                    <span class="rating">⭐ ${product.rating.toFixed(1)}</span>
                </div>
            </div>
            <div class="product-actions">
                <button type="button" onclick="viewProductDetail(${product.id})">查看详情</button>
            </div>
        </div>
    `).join('');
}

function increaseQuantity() {
    const quantityElement = document.getElementById('quantity');
    if (!quantityElement) return;
    const quantity = parseInt(quantityElement.textContent, 10) || 1;
    quantityElement.textContent = quantity + 1;
}

function decreaseQuantity() {
    const quantityElement = document.getElementById('quantity');
    if (!quantityElement) return;
    const quantity = parseInt(quantityElement.textContent, 10) || 1;
    if (quantity > 1) quantityElement.textContent = quantity - 1;
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('商品不存在', 'error');
        return;
    }
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    saveCart();
    updateCartDisplay();
    showToast('已添加到购物车');
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    cartItems.innerHTML = '';
    let total = 0;

    // 更新全选按钮状态
    const selectAllBtn = document.getElementById('select-all');
    const deleteSelectedBtn = document.getElementById('delete-selected');
    if (selectAllBtn) selectAllBtn.checked = false;
    if (deleteSelectedBtn) deleteSelectedBtn.style.display = 'none';

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart-illustration">
                <div class="illustration-icon">🛒</div>
                <p>购物车空空如也，快去添加商品吧</p>
                <a href="index.html#products" class="hero-btn">去选购</a>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <label class="cart-item-checkbox">
                    <input type="checkbox" class="cart-item-select" data-id="${item.id}">
                </label>
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">单价: ¥${item.price}</p>
                    <p class="cart-item-subtotal">小计: <span>¥${item.price * item.quantity}</span></p>
                </div>
                <div class="cart-item-quantity">
                    <button type="button" onclick="changeCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" onclick="changeCartQuantity(${item.id}, 1)">+</button>
                </div>
                <button type="button" onclick="removeFromCart(${item.id})" class="cart-item-remove" title="删除">
                    <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
            `;
            cartItems.appendChild(itemDiv);
            total += item.price * item.quantity;
        });

        // 绑定单个复选框事件
        document.querySelectorAll('.cart-item-select').forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectedActions);
        });
    }
    const totalElement = document.getElementById('total-price');
    if (totalElement) totalElement.textContent = total;
}

// 更新选中操作按钮状态
function updateSelectedActions() {
    const checkedItems = document.querySelectorAll('.cart-item-select:checked');
    const deleteSelectedBtn = document.getElementById('delete-selected');
    const selectAllBtn = document.getElementById('select-all');

    if (deleteSelectedBtn) {
        deleteSelectedBtn.style.display = checkedItems.length > 0 ? 'inline-flex' : 'none';
    }

    // 更新全选状态
    if (selectAllBtn) {
        selectAllBtn.checked = checkedItems.length === cart.length && cart.length > 0;
    }
}

// 全选/取消全选
function toggleSelectAll() {
    const selectAllBtn = document.getElementById('select-all');
    if (!selectAllBtn) return;

    const isChecked = selectAllBtn.checked;
    document.querySelectorAll('.cart-item-select').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    updateSelectedActions();
}

// 删除选中的商品
function deleteSelectedItems() {
    const checkedItems = document.querySelectorAll('.cart-item-select:checked');
    if (checkedItems.length === 0) {
        showToast('请先选择要删除的商品', 'info');
        return;
    }

    if (!confirm(`确定要删除选中的 ${checkedItems.length} 件商品吗？`)) return;

    const idsToRemove = Array.from(checkedItems).map(cb => parseInt(cb.dataset.id));
    cart = cart.filter(item => !idsToRemove.includes(item.id));
    saveCart();
    updateCartDisplay();
    showToast('已删除选中的商品', 'info');
}

// 初始化购物车控件
function initCartControls() {
    const selectAllBtn = document.getElementById('select-all');
    const deleteSelectedBtn = document.getElementById('delete-selected');

    selectAllBtn?.addEventListener('change', toggleSelectAll);
    deleteSelectedBtn?.addEventListener('click', deleteSelectedItems);
}

function displayCartPage() {
    const cartSection = document.querySelector('.cart-page');
    if (!cartSection) return;
    updateCartDisplay();
    const shippingAddress = document.getElementById('shipping-address');
    if (shippingAddress) {
        shippingAddress.value = localStorage.getItem('shippingAddress') || '';
        shippingAddress.addEventListener('input', () => {
            localStorage.setItem('shippingAddress', shippingAddress.value);
        });
    }
    document.getElementById('clear-cart')?.addEventListener('click', clearCart);
}

function changeCartQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    saveCart();
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showToast('已从购物车移除', 'info');
}

function clearCart() {
    if (!confirm('确认要清空购物车吗？')) return;
    cart = [];
    saveCart();
    updateCartDisplay();
    showToast('购物车已清空', 'info');
}

function checkout() {
    if (cart.length === 0) {
        showToast('购物车为空，无法结算', 'error');
        return;
    }
    if (!currentUser) {
        showToast('请先登录再提交订单', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1200);
        return;
    }
    const address = document.getElementById('shipping-address')?.value.trim();
    if (!address) {
        showToast('请输入收货地址', 'error');
        return;
    }
    const order = {
        id: Date.now(),
        items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toLocaleString('zh-CN'),
        address,
        status: '待发货',
        username: currentUser.username,
    };
    orders.unshift(order);
    saveOrders();
    cart = [];
    saveCart();
    updateCartDisplay();
    showToast('订单提交成功', 'success');
    setTimeout(() => {
        window.location.href = 'orders.html';
    }, 800);
}

function displayOrders() {
    const orderList = document.getElementById('order-list');
    if (!orderList) return;

    // 如果未登录，显示提示
    if (!currentUser) {
        orderList.innerHTML = '<div class="empty-order-msg"><p>请先 <a href="login.html">登录</a> 查看订单</p></div>';
        return;
    }

    const userOrders = orders.filter(order => order.username === currentUser.username);
    orderList.innerHTML = '';

    if (userOrders.length === 0) {
        orderList.innerHTML = `
            <div class="empty-order-illustration">
                <div class="illustration-icon">📦</div>
                <p>暂无订单记录</p>
                <a href="index.html#products" class="hero-btn">去选购</a>
            </div>
        `;
        return;
    }

    // 订单状态筛选（可选）
    const statusFilters = ['全部', '待发货', '待收货', '已完成'];
    let activeFilter = '全部';

    // 按状态分类显示
    userOrders.forEach(order => {
        const statusClass = getStatusClass(order.status);
        const orderDiv = document.createElement('div');
        orderDiv.className = `order-item ${statusClass}`;

        orderDiv.innerHTML = `
            <div class="order-header">
                <div class="order-info">
                    <span class="order-id">订单号: ${order.id}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
            <div class="order-timeline">
                <div class="timeline-item active">
                    <span class="timeline-dot"></span>
                    <span>已下单</span>
                </div>
                <div class="timeline-item ${order.status !== '待发货' ? 'active' : ''}">
                    <span class="timeline-dot"></span>
                    <span>已发货</span>
                </div>
                <div class="timeline-item ${order.status === '已完成' ? 'active' : ''}">
                    <span class="timeline-dot"></span>
                    <span>已完成</span>
                </div>
            </div>
            <div class="order-products">
                ${order.items.map(item => `
                    <div class="order-product-item">
                        <span class="product-name">${item.name}</span>
                        <span class="product-qty">x${item.quantity}</span>
                        <span class="product-price">¥${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-address">
                    <span class="address-label">收货地址:</span>
                    <span>${order.address}</span>
                </div>
                <div class="order-total">
                    <span>合计:</span>
                    <span class="total-amount">¥${order.total}</span>
                </div>
            </div>
            <div class="order-actions">
                ${order.status === '待发货' ? `<button class="secondary" onclick="cancelOrder(${order.id})">取消订单</button>` : ''}
                ${order.status === '待发货' ? `<button class="primary" onclick="confirmReceive(${order.id})">确认收货</button>` : ''}
                ${order.status === '待收货' ? `<button class="primary" onclick="confirmReceive(${order.id})">确认收货</button>` : ''}
                ${order.status === '已完成' ? `<button class="secondary" onclick="reorder(${order.id})">再次购买</button>` : ''}
            </div>
        `;
        orderList.appendChild(orderDiv);
    });
}

function getStatusClass(status) {
    switch(status) {
        case '待发货': return 'order-pending';
        case '待收货': return 'order-shipped';
        case '已完成': return 'order-completed';
        default: return '';
    }
}

function cancelOrder(orderId) {
    if (!confirm('确定要取消该订单吗？')) return;
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = '已取消';
        saveOrders();
        displayOrders();
        showToast('订单已取消', 'info');
    }
}

function confirmReceive(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = '已完成';
        saveOrders();
        displayOrders();
        showToast('已确认收货，感谢您的购买！', 'success');
    }
}

function reorder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order && order.items) {
        order.items.forEach(item => {
            addToCart(item.id, item.quantity);
        });
        showToast('商品已添加到购物车', 'success');
        setTimeout(() => window.location.href = 'cart.html', 800);
    }
}

function validateLoginForm() {
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;
    const remember = document.getElementById('remember-me')?.checked;
    if (!username || !password) {
        showToast('请填写用户名和密码', 'error');
        return false;
    }
    if (username.length < 3) {
        showToast('用户名至少需要3个字符', 'error');
        return false;
    }
    if (password.length < 6) {
        showToast('密码至少需要6个字符', 'error');
        return false;
    }
    const user = users.find(item => item.username === username && item.password === password);
    if (!user) {
        showToast('用户名或密码错误', 'error');
        return false;
    }
    saveCurrentUser(user, remember);
    renderUserStatus();
    showToast('登录成功', 'success');
    return true;
}

function validateRegisterForm() {
    const username = document.getElementById('reg-username')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const password = document.getElementById('reg-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    if (!username || !email || !phone || !password || !confirmPassword) {
        showToast('请填写完整注册信息', 'error');
        return false;
    }
    if (username.length < 3) {
        showToast('用户名至少需要3个字符', 'error');
        return false;
    }
    if (password.length < 6) {
        showToast('密码至少需要6个字符', 'error');
        return false;
    }
    if (password !== confirmPassword) {
        showToast('两次密码不一致', 'error');
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('请输入有效邮箱地址', 'error');
        return false;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        showToast('请输入有效手机号（11位）', 'error');
        return false;
    }
    if (users.some(item => item.username === username)) {
        showToast('该用户名已被占用', 'error');
        return false;
    }
    const newUser = { username, email, phone, password };
    users.push(newUser);
    saveUsers();
    showToast('注册成功，请登录', 'success');
    return true;
}

// ========== 新增功能函数 ==========

// 排序和筛选功能
function sortProducts(productsArray) {
    let filtered = [...productsArray];

    // 筛选高评分
    const filterHighRating = document.getElementById('filter-high-rating');
    if (filterHighRating?.checked) {
        filtered = filtered.filter(p => p.rating >= 4);
    }

    // 排序
    switch (currentSort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'sales':
            filtered.sort((a, b) => b.sales - a.sales);
            break;
    }
    return filtered;
}

// 初始化排序控件
function initSortControls() {
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSort = btn.getAttribute('data-sort');
            displayProducts(currentCategory, currentSearch);
        });
    });

    document.getElementById('filter-high-rating')?.addEventListener('change', () => {
        displayProducts(currentCategory, currentSearch);
    });
}

// 搜索建议
function initSearchSuggestions() {
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('search-suggestions');
    const historyBox = document.getElementById('search-history');

    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
        const value = searchInput.value.trim();
        if (value.length > 0) {
            showSearchSuggestions(value);
            hideSearchHistory();
        } else {
            hideSearchSuggestions();
            showSearchHistory();
        }
    });

    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length === 0) {
            showSearchHistory();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.hero-search')) {
            hideSearchSuggestions();
            hideSearchHistory();
        }
    });
}

function showSearchSuggestions(keyword) {
    const suggestionsBox = document.getElementById('search-suggestions');
    if (!suggestionsBox) return;

    const matches = products.filter(p =>
        p.name.includes(keyword) || p.category.includes(keyword)
    ).slice(0, 6);

    if (matches.length === 0) {
        suggestionsBox.classList.remove('active');
        return;
    }

    suggestionsBox.innerHTML = matches.map(p => `
        <div class="suggestion-item" onclick="viewProductDetail(${p.id})">
            <img src="${p.image}" alt="${p.name}">
            <div>
                <strong>${p.name}</strong>
                <span>¥${p.price}</span>
            </div>
        </div>
    `).join('');
    suggestionsBox.classList.add('active');
}

function hideSearchSuggestions() {
    const suggestionsBox = document.getElementById('search-suggestions');
    suggestionsBox?.classList.remove('active');
}

// 搜索历史
function showSearchHistory() {
    const historyBox = document.getElementById('search-history');
    if (!historyBox) return;

    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];

    if (history.length === 0) {
        historyBox.classList.remove('active');
        return;
    }

    historyBox.innerHTML = `
        <div class="history-header">
            <span>搜索历史</span>
            <span class="clear-all-history" onclick="clearSearchHistory(event)">清空</span>
        </div>
        ${history.slice(0, 5).map(item => `
            <div class="history-item" onclick="searchFromHistory('${item}')">
                <span class="history-text">${item}</span>
                <button class="delete-history" onclick="deleteHistoryItem(event, '${item}')">×</button>
            </div>
        `).join('')}
    `;
    historyBox.classList.add('active');
}

function hideSearchHistory() {
    const historyBox = document.getElementById('search-history');
    historyBox?.classList.remove('active');
}

function searchFromHistory(keyword) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = keyword;
    searchProducts();
    hideSearchHistory();
}

function deleteHistoryItem(event, keyword) {
    event.stopPropagation();
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history = history.filter(item => item !== keyword);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    showSearchHistory();
}

function clearSearchHistory(event) {
    event.stopPropagation();
    localStorage.removeItem('searchHistory');
    hideSearchHistory();
}

// 公告栏功能
function initAnnouncement() {
    const announcementBar = document.getElementById('announcement-bar');
    const closeBtn = document.getElementById('announcement-close');

    if (!announcementBar) return;

    // 检查是否已关闭
    const closed = localStorage.getItem('announcementClosed');
    if (closed) {
        announcementBar.classList.add('hidden');
        document.querySelector('main')?.classList.add('no-announcement');
    }

    closeBtn?.addEventListener('click', () => {
        announcementBar.classList.add('hidden');
        localStorage.setItem('announcementClosed', 'true');
    });
}

// 移动端菜单
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navbar = document.getElementById('navbar');

    if (!menuBtn || !navbar) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
}

// 最近浏览功能
function addToRecentlyViewed(productId) {
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    viewed = viewed.filter(id => id !== productId);
    viewed.unshift(productId);
    viewed = viewed.slice(0, 8);
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
}

function displayRecentlyViewed() {
    const container = document.getElementById('recently-viewed-list');
    if (!container) return;

    const viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

    if (viewed.length === 0) {
        container.innerHTML = '<p class="empty-message">暂无浏览记录</p>';
        return;
    }

    const viewedProducts = viewed.map(id => products.find(p => p.id === id)).filter(Boolean);

    container.innerHTML = viewedProducts.map(product => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-body">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">¥${product.price}</p>
                <div class="product-meta">
                    <span class="badge">${product.category}</span>
                    <span class="rating">⭐ ${product.rating.toFixed(1)}</span>
                </div>
            </div>
            <div class="product-actions">
                <button type="button" onclick="viewProductDetail(${product.id})">查看详情</button>
                <button type="button" onclick="addToCart(${product.id})">加入购物车</button>
            </div>
        </div>
    `).join('');
}

// 购物车飞入动画
function animateAddToCart(productId, event) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartLink = document.querySelector('nav a[href="cart.html"]');
    if (!cartLink) return;

    const rect = event.target.getBoundingClientRect();
    const cartRect = cartLink.getBoundingClientRect();

    const flyItem = document.createElement('img');
    flyItem.src = product.image;
    flyItem.className = 'cart-fly-item';
    flyItem.style.left = rect.left + rect.width / 2 + 'px';
    flyItem.style.top = rect.top + 'px';
    flyItem.style.setProperty('--target-x', (cartRect.left - rect.left) + 'px');
    flyItem.style.setProperty('--target-y', (cartRect.top - rect.top) + 'px');

    document.body.appendChild(flyItem);

    setTimeout(() => flyItem.remove(), 800);
}

// 更新商品显示（支持标签和排序）
function renderProductsWithTags(filteredProducts) {
    const productList = document.querySelector('.product-list');
    if (!productList) return;

    productList.innerHTML = '';

    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p class="empty-message">未找到符合条件的商品。</p>';
        return;
    }

    filteredProducts.forEach(product => {
        let badgeHtml = '';
        if (product.tag === 'hot') badgeHtml = '<span class="badge hot">热卖</span>';
        else if (product.tag === 'new') badgeHtml = '<span class="badge new">新品</span>';
        else if (product.tag === 'sale') badgeHtml = '<span class="badge sale">特价</span>';
        else badgeHtml = `<span class="badge">${product.category}</span>`;

        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-body">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="product-price">¥${product.price}</p>
                <div class="product-meta">
                    ${badgeHtml}
                    <span class="rating">⭐ ${product.rating.toFixed(1)}</span>
                    <span class="sales">销量 ${product.sales}</span>
                </div>
            </div>
            <div class="product-actions">
                <button type="button" onclick="viewProductDetail(${product.id})">查看详情</button>
                <button type="button" onclick="addToCartWithAnimation(${product.id}, event)">加入购物车</button>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

// 带动画的添加到购物车
function addToCartWithAnimation(productId, event) {
    addToCart(productId);
    animateAddToCart(productId, event);
}

// 订单确认模态框
function showOrderConfirmModal() {
    if (cart.length === 0) {
        showToast('购物车为空', 'error');
        return;
    }

    let modal = document.getElementById('order-confirm-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'order-confirm-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>订单确认</h3>
                    <button class="modal-close" onclick="closeOrderConfirmModal()">×</button>
                </div>
                <div class="modal-body" id="order-confirm-body"></div>
                <div class="modal-footer">
                    <button class="secondary" onclick="closeOrderConfirmModal()">取消</button>
                    <button class="primary" onclick="confirmCheckout()">确认下单</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const body = document.getElementById('order-confirm-body');
    body.innerHTML = `
        <div class="order-summary-items">
            ${cart.map(item => `
                <div class="order-summary-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>¥${item.price * item.quantity}</span>
                </div>
            `).join('')}
        </div>
        <div class="order-summary-total">
            <span>合计</span>
            <span>¥${total}</span>
        </div>
    `;

    modal.classList.add('active');
}

function closeOrderConfirmModal() {
    const modal = document.getElementById('order-confirm-modal');
    modal?.classList.remove('active');
}

function confirmCheckout() {
    closeOrderConfirmModal();
    checkout();
}

function initPage() {
    currentUser = loadCurrentUser();
    renderUserStatus();
    displayCurrentDate();
    loadTheme();
    initNavbar();
    initCarousel();
    initAnnouncement();
    initMobileMenu();
    initSortControls();
    initSearchSuggestions();

    // 搜索功能
    const searchBtn = document.getElementById('search-btn');
    searchBtn?.addEventListener('click', () => {
        addSearchHistory();
        searchProducts();
    });
    document.getElementById('search-input')?.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            addSearchHistory();
            searchProducts();
        }
    });

    // 分类过滤
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => filterProducts(btn.getAttribute('data-category')));
    });

    // 主题切换
    document.getElementById('dark-mode-toggle')?.addEventListener('click', toggleDarkMode);

    // 显示内容
    displayProducts();
    displayRecommend();
    displayRecentlyViewed();
    updateCartDisplay();
    displayCartPage();
    displayOrders();
    displayProductDetail();

    // 购物车统计
    updateCartCount();

    // 结算功能 - 使用订单确认模态框
    document.getElementById('checkout')?.addEventListener('click', showOrderConfirmModal);

    // 初始化购物车控件
    initCartControls();

    // 登录表单
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', event => {
            event.preventDefault();
            if (validateLoginForm()) {
                showToast('跳转中...', 'info');
                setTimeout(() => { window.location.href = 'index.html'; }, 500);
            }
        });
    }

    // 注册表单
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', event => {
            event.preventDefault();
            if (validateRegisterForm()) {
                showToast('跳转中...', 'info');
                setTimeout(() => { window.location.href = 'login.html'; }, 500);
            }
        });
    }
}

function updateCartCount() {
    const cartLink = document.querySelector('nav a[href="cart.html"]');
    if (cartLink && cart.length > 0) {
        cartLink.innerHTML = `购物车 <span class="cart-count">${cart.length}</span>`;
    }
}

function addSearchHistory() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const currentValue = searchInput.value;
        if (currentValue.trim()) {
            let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
            if (!history.includes(currentValue)) {
                history.unshift(currentValue);
                if (history.length > 10) history.pop();
                localStorage.setItem('searchHistory', JSON.stringify(history));
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', initPage);
