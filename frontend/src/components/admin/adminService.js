import * as adminApi from './adminApi';

export const {
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
  deleteRequest,
  verifyPayment,
  changePassword,
  updateProfile,
  getNotifications,
  markNotificationRead,
  deleteNotification,
  getReports
} = adminApi;

export default adminApi;
