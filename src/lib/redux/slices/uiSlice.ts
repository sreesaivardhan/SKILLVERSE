import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }>;
  searchQuery: string;
  skillFilter: string[];
  levelFilter: string[];
  dateFilter: string | null;
}

const initialState: UIState = {
  theme: typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  sidebarOpen: false,
  notifications: [],
  searchQuery: '',
  skillFilter: [],
  levelFilter: [],
  dateFilter: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (
      state,
      action: PayloadAction<{ type: 'success' | 'error' | 'info' | 'warning'; message: string }>
    ) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        type: action.payload.type,
        message: action.payload.message,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSkillFilter: (state, action: PayloadAction<string[]>) => {
      state.skillFilter = action.payload;
    },
    setLevelFilter: (state, action: PayloadAction<string[]>) => {
      state.levelFilter = action.payload;
    },
    setDateFilter: (state, action: PayloadAction<string | null>) => {
      state.dateFilter = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = '';
      state.skillFilter = [];
      state.levelFilter = [];
      state.dateFilter = null;
    },
  },
});

export const {
  toggleTheme,
  toggleSidebar,
  addNotification,
  removeNotification,
  setSearchQuery,
  setSkillFilter,
  setLevelFilter,
  setDateFilter,
  clearFilters,
} = uiSlice.actions;
export default uiSlice.reducer;
