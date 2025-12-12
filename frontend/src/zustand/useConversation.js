import { create } from "zustand";
import { persist } from "zustand/middleware";

const useConversation = create(
  persist(
    (set) => ({
      selectedConversation: null,
      messages: [],

      setSelectedConversation: (conversation) =>
        set({ selectedConversation: conversation }),

      // FIXED: now it supports functional updates
      setMessages: (update) =>
        set((state) => ({
          messages:
            typeof update === "function"
              ? update(state.messages)
              : update,
        })),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        selectedConversation: state.selectedConversation,
      }),
    }
  )
);

export default useConversation;
