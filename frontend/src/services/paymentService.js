import { api } from './api';

export const paymentService = {
  async createChapaPayment(payload) {
    return await api.post('/payments/chapa/create', payload);
  },

  async verifyChapaPayment(txRef) {
    return await api.get(`/payments/chapa/verify/${txRef}`);
  }
};
