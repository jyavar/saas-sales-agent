// Mock extendido de Resend para tests
export const resend = {
  emails: {
    send: async () => ({
      id: 'mock-id',
      status: 'success',
    }),
  },
};
export const mockResendService = resend;
export default resend; 