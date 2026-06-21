import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ContractEvent, EventType } from '@/types';

interface EventState {
  events: ContractEvent[];
  unreadCount: number;

  addEvent: (event: ContractEvent) => void;
  addEvents: (events: ContractEvent[]) => void;
  clearEvents: () => void;
  markAllRead: () => void;
  getEventsByType: (type: EventType) => ContractEvent[];
  getEventsByProject: (projectId: number) => ContractEvent[];
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: [],
      unreadCount: 0,

      addEvent: (event: ContractEvent) => {
        set((state) => ({
          events: [event, ...state.events],
          unreadCount: state.unreadCount + 1,
        }));
      },

      addEvents: (events: ContractEvent[]) => {
        set((state) => ({
          events: [...events, ...state.events],
          unreadCount: state.unreadCount + events.length,
        }));
      },

      clearEvents: () => {
        set({ events: [], unreadCount: 0 });
      },

      markAllRead: () => {
        set({ unreadCount: 0 });
      },

      getEventsByType: (type: EventType) => {
        return get().events.filter((event) => event.type === type);
      },

      getEventsByProject: (projectId: number) => {
        return get().events.filter((event) => event.projectId === projectId);
      },
    }),
    {
      name: 'event-store',
      partialize: (state) => ({
        events: state.events,
        // unreadCount intentionally excluded — resets on page load
      }),
    },
  ),
);
