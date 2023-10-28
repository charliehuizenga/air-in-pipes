import { createSlice } from "@reduxjs/toolkit";

export interface Report {
  design_summary: DesignSummary[];
  [key: string]: any;
}

interface DesignSummary {
  nominal_size: string;
  sdr: number;
  length: number;
  cost: number;
}

const initialState: Report = {
  design_summary: [] as DesignSummary[],
  // other fields...
};
const reportSlice = createSlice({
  name: "data",
  initialState: initialState, // or whatever initial state structure you need
  reducers: {
    setData: (state, action) => {
      return action.payload;
    },
    setError: (state, action) => {
      // Handle error, possibly store error message or set a boolean flag
    },
  },
});

export const { setData, setError } = reportSlice.actions;
export default reportSlice.reducer;
