// Authentication and session management
async function checkAuth() {
  const user = await getCurrentUser();
  const protectedPages = ['dashboard.html', 'products.html', 'orders.html', 'users.html', 'security.html'];
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage) && !user) {
    window.location.href = 'login.html';
    return false;
  }
  
  if (user && currentPage === 'login.html') {
    window.location.href = 'dashboard.html';
    return false;
  }
  
  return true;
}

async function requireRole(allowedRoles) {
  const user = await getCurrentUser();
  if (!user || !allowedRoles.includes(user.role)) {
    alert('Access denied. Insufficient permissions.');
    window.location.href = 'dashboard.html';
    return false;
  }
  return true;
}

// Display user info in header
async function updateUserUI() {
  const user = await getCurrentUser();
  const userNameEl = document.getElementById('userName');
  const userRoleEl = document.getElementById('userRole');
  const userAvatarEl = document.getElementById('userAvatar');
  
  if (user && userNameEl) {
    userNameEl.textContent = user.name;
    userRoleEl.textContent = user.role;
    userAvatarEl.textContent = user.name.charAt(0).toUpperCase();
  }
}

// Logout function
async function logout() {
  await logoutUser();
  window.location.href = '../index.html';
}