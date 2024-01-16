import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
  activeSection: number;
}

const initialState: NavigationState = {
  activeSection: 0,
};

const NavigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<number>) => {
      console.log("Setting active section to:", action.payload);
      state.activeSection = action.payload;
    },
  },
});

export const { setActiveSection } = NavigationSlice.actions;
export const selectActiveSection = (state: { navigation: NavigationState }) =>
  state.navigation.activeSection;

export default NavigationSlice;
