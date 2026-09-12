import { createSlice } from "@reduxjs/toolkit";

const complaintSlice = createSlice({
  name: "complaint",

  initialState: {
    analysis: null,
  },

  reducers: {
    setAnalysis: (state, action) => {
      state.analysis = action.payload;
    },

    clearAnalysis: (state) => {
      state.analysis = null;
    },
  },
});

export const { setAnalysis, clearAnalysis } = complaintSlice.actions;

export default complaintSlice.reducer;