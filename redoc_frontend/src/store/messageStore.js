import { create } from 'zustand';
import { messageService } from '../services/messageService';

const useMessageStore = create((set) => ({
  inbox: [],
  sent: [],
  currentMessage: null,
  pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
  loading: false,

  fetchInbox: async (params) => {
    set({ loading: true });
    try {
      const { data } = await messageService.getInbox(params);
      set({ inbox: data.data, pagination: data.pagination, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchSent: async (params) => {
    set({ loading: true });
    try {
      const { data } = await messageService.getSent(params);
      set({ sent: data.data, pagination: data.pagination, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchMessage: async (id) => {
    set({ loading: true });
    try {
      const { data } = await messageService.getById(id);
      set({ currentMessage: data.data.message, loading: false });
      return data.data.message;
    } catch {
      set({ loading: false });
    }
  },

  sendMessage: async (data) => {
    return messageService.send(data);
  },

  replyMessage: async (id, data) => {
    return messageService.reply(id, data);
  },

  deleteMessage: async (id) => {
    await messageService.delete(id);
    set((state) => ({
      inbox: state.inbox.filter((m) => m.id !== parseInt(id)),
      sent: state.sent.filter((m) => m.id !== parseInt(id)),
    }));
  },
}));

export default useMessageStore;
