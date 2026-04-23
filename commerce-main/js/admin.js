// Dashboard statistics
async function loadDashboardStats() {
  const products = await getProducts();
  const orders = await getOrders();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  
  document.getElementById('totalProducts').textContent = products.length;
  document.getElementById('totalOrders').textContent = orders.length;
  document.getElementById('totalRevenue').textContent = `₦${totalRevenue.toLocaleString()}`;
  document.getElementById('pendingOrders').textContent = pendingOrders;
  
  // Recent orders table
  const tbody = document.querySelector('#recentOrdersTable tbody');
  if (tbody) {
    tbody.innerHTML = orders.slice(-5).reverse().map(order => `
      <tr>
        <td>#${order.id}</td>
        <td>${order.customer}</td>
        <td>₦${order.total.toLocaleString()}</td>
        <td><span class="status-badge status-${order.status}">${order.status}</span></td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
      </tr>
    `).join('');
  }
}

// Product management functions
async function renderProductTable() {
  const products = await getProducts();
  const tbody = document.querySelector('#productsTable tbody');
  
  if (tbody) {
    tbody.innerHTML = products.map(product => `
      <tr>
        <td>${product.id}</td>
        <td><img src="${product.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
        <td>${product.name}</td>
        <td>₦${product.price.toLocaleString()}</td>
        <td>${product.category}</td>
        <td>
          <button class="edit-btn" onclick="editProduct(${product.id})">Edit</button>
          <button class="delete-btn" onclick="deleteProductItem(${product.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }
}

// Order management
async function renderOrdersTable() {
  const orders = await getOrders();
  const tbody = document.querySelector('#ordersTable tbody');
  
  if (tbody) {
    tbody.innerHTML = orders.map(order => `
      <tr>
        <td>#${order.id}</td>
        <td>${order.customer}</td>
        <td>${order.items.map(i => i.name).join(', ')}</td>
        <td>₦${order.total.toLocaleString()}</td>
        <td>
          <select class="status-select" data-id="${order.id}">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
      </tr>
    `).join('');
  }
  
  // Add event listeners for status changes
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const orderId = parseInt(select.dataset.id);
      await updateOrderStatus(orderId, select.value);
      await renderOrdersTable();
    });
  });
}

// User management
async function renderUsersTable() {
  const users = await getAllUsers();
  const currentUser = await getCurrentUser();
  const tbody = document.querySelector('#usersTable tbody');
  
  if (tbody) {
    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <select class="role-select" data-id="${user.id}" ${user.id === currentUser?.id ? 'disabled' : ''}>
            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
            <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>Manager</option>
            <option value="editor" ${user.role === 'editor' ? 'selected' : ''}>Editor</option>
            <option value="viewer" ${user.role === 'viewer' ? 'selected' : ''}>Viewer</option>
          </select>
        </td>
        <td><span style="color: green;">● Active</span></td>
        <td>${user.lastLogin || 'Never'}</td>
        <td>
          ${user.id !== currentUser?.id ? `<button class="delete-btn" data-id="${user.id}">Delete</button>` : 'Current'}
        </td>
      </tr>
    `).join('');
  }
  
  // Add role change handlers
  document.querySelectorAll('.role-select').forEach(select => {
    if (!select.disabled) {
      select.addEventListener('change', async (e) => {
        const userId = parseInt(select.dataset.id);
        await updateUserRole(userId, select.value);
        await renderUsersTable();
      });
    }
  });
  
  // Add delete handlers
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const userId = parseInt(btn.dataset.id);
      if (confirm('Delete this user?')) {
        await deleteUser(userId);
        await renderUsersTable();
      }
    });
  });
}