// ============================================
// SUPABASE CLIENT - CLEAN WORKING VERSION
// REPLACE WITH YOUR ACTUAL CREDENTIALS
// ============================================

// TODO: REPLACE THESE WITH YOUR SUPABASE CREDENTIALS
const SUPABASE_URL = 'https://yaurmgcbhdcyoguywbku.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UYmpq98WaFMo3awuOsAEkw_qEGodNac';

// Create Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// PRODUCTS
// ============================================

window.getProducts = async function() {
  try {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

window.addProduct = async function(product) {
  try {
    const { data, error } = await supabase.from('products').insert([{
      name: product.name,
      price: parseInt(product.price),
      description: product.description || '',
      category: product.category,
      image: product.image || ''
    }]).select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

window.updateProduct = async function(id, product) {
  try {
    const { data, error } = await supabase.from('products').update({
      name: product.name,
      price: parseInt(product.price),
      description: product.description || '',
      category: product.category,
      image: product.image
    }).eq('id', id).select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

window.deleteProduct = async function(id) {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ============================================
// ORDERS
// ============================================

window.getOrders = async function() {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

window.updateOrderStatus = async function(id, status) {
  try {
    const { error } = await supabase.from('orders').update({ status: status }).eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// ============================================
// USERS & AUTHENTICATION
// ============================================

window.loginUser = async function(email, password) {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password', password).single();
    if (error || !data) {
      throw new Error('Invalid email or password');
    }
    const session = {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('luxe_current_user', JSON.stringify(session));
    return session;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

window.getCurrentUser = function() {
  const userStr = localStorage.getItem('luxe_current_user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    const hoursDiff = (new Date() - new Date(user.loginTime)) / (1000 * 60 * 60);
    if (hoursDiff > 24) {
      localStorage.removeItem('luxe_current_user');
      return null;
    }
    return user;
  } catch (e) {
    return null;
  }
};

window.logoutUser = function() {
  localStorage.removeItem('luxe_current_user');
};

window.getAllUsers = async function() {
  try {
    const { data, error } = await supabase.from('users').select('*').order('id', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// For backward compatibility
window.luxeDB = {
  getProducts: window.getProducts,
  addProduct: window.addProduct,
  updateProduct: window.updateProduct,
  deleteProduct: window.deleteProduct,
  getOrders: window.getOrders,
  updateOrderStatus: window.updateOrderStatus,
  loginUser: window.loginUser,
  getCurrentUser: window.getCurrentUser,
  logoutUser: window.logoutUser,
  getAllUsers: window.getAllUsers
};

console.log('✅ Supabase client loaded successfully');