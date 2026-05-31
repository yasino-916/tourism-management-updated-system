import { api } from '../../services/api';

export const authenticate = async (email, password) => {

  return await api.post('/auth/login', { email, password });
};

export const signout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getSummary = async () => {

  const [users, sites, requests, payments] = await Promise.all([
    getUsers(),
    getSites(),
    getRequests(),
    getPayments(),
  ]);
  return {
    totalUsers: users?.length ?? 0,
    totalSites: sites?.length ?? 0,
    totalVisits: requests?.filter(r => !['rejected', 'cancelled'].includes(r.request_status)).length ?? 0,
    totalPaymentsCount: payments?.length ?? 0,
    totalRevenue: payments?.filter(p => p.payment_status === 'confirmed').reduce((acc, p) => acc + (Number(p.total_amount) || Number(p.amount) || 0), 0),
  };
};

export const getUsers = async () => {
  const res = await api.get('/admin/users');
  const payload = res?.data ?? res;

  let users = [];
  if (Array.isArray(payload)) users = payload;
  else if (Array.isArray(payload?.users)) users = payload.users;

  return users.map(u => ({
    ...u,
    user_type_label: (u?.user_type === 'guide') ? 'Site Agent' : u?.user_type,
  }));
};

export const getSites = async () => {
  const res = await api.get('/sites');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const getRequests = async () => {
  const res = await api.get('/requests');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.requests)) return payload.requests;
  return [];
};

export const getPayments = async () => {
  const res = await api.get('/payments');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.payments)) return payload.payments;
  return [];
};

export const createSite = async (site) => {
  return await api.post('/sites', site);
};

export const createUser = async (user) => {
  return await api.post('/admin/users', user);
};

export const toggleUserStatus = async (userId, isActive) => {
  return await api.put(`/admin/users/${userId}/status`, { is_active: isActive });
};

export const deleteUser = async (userId) => {
  return await api.delete(`/admin/users/${userId}`);
};

export const deleteSite = async (siteId) => {
  return await api.delete(`/sites/${siteId}`);
};

export const updateSite = async (site) => {
  return await api.patch(`/sites/${site.site_id}`, site);
};

export const updateSiteStatus = async (siteId, isApproved) => {
  if (isApproved) {

    return await api.patch(`/sites/${siteId}/approve`, {});
  } else {

    return await api.patch(`/sites/${siteId}`, {
      status: 'rejected',
      is_approved: 0
    });
  }
};

export const approveRequest = async (requestId) => {
  return await api.patch(`/requests/${requestId}/approve`, {});
};

export const rejectRequest = async (requestId) => {
  return await api.patch(`/requests/${requestId}/reject`, {});
};

export const assignGuide = async (requestId, payload = {}) => {
  return await api.patch(`/requests/${requestId}/assign-guide`, payload);
};

export const deleteRequest = async (requestId) => {
  return await api.delete(`/requests/${requestId}`);
};

export const verifyPayment = async (paymentId) => {
  return await api.patch(`/payments/${paymentId}/verify`, {});
};

export const changePassword = async (_username, currentPassword, newPassword) => {

  return await api.patch('/users/me', { password: newPassword, current_password: currentPassword });
};

export const updateProfile = async (_username, data) => {
  return await api.patch('/users/me', data);
};

export const getNotifications = async () => {
  const res = await api.get('/notifications');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export const markNotificationRead = async (id) => {
  return await api.patch(`/notifications/${id}/read`, {});
};

export const deleteNotification = async (id) => {
  return await api.delete(`/notifications/${id}`);
};

export const getReports = async () => {
  const res = await api.get('/admin/reports');
  const payload = res?.data ?? res;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

export default {
  authenticate,
  signout,
  getSummary,
  getUsers,
  getSites,
  getRequests,
  getPayments,
  createSite,
  createUser,
  toggleUserStatus,
  deleteUser,
  deleteSite,
  updateSite,
  updateSiteStatus,
  approveRequest,
  rejectRequest,
  assignGuide,
  verifyPayment,
  changePassword,
  updateProfile,
  getNotifications,
  markNotificationRead,
};
