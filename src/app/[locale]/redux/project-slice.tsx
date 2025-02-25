"use client";
import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PipeData, pipeData } from "../components/tube-data/tube_list";

export interface Topo {
  name?: string;
  l: number;
  h: number | null;
}

export interface Project {
  uuid: string;
  project_name: string;
  json_format: number;
  designer: string;
  description: string;
  notes: string;
  qmax: number;
  qmin: number;
  airvalve_selection: string;
  template: string;
  topo: Topo[];
  nSocks: number;
  valveFlags: boolean[];
  [key: string]: any;
}

export const initialState: Project = {
  uuid: "",
  project_name: "Example Project",
  json_format: 1,
  designer: "Example Designer",
  description: "Test",
  notes: "Testing for web application",
  qmax: 0.25,
  qmin: 0.25,
  airvalve_selection: "auto",
  template: "",
  topo: [{ name: "1", l: 0, h: 0 }],
  nSocks: 0,
  valveFlags: [],
  library: {
    valve_cost: 380,
    pipe_data: pipeData,
  },
};

// Function to user JSON files
export const uploadFile = createAsyncThunk(
    'project/uploadFile',
    async (file: File, thunkAPI) => {
      try {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const jsonData = JSON.parse(reader.result as string);
            thunkAPI.dispatch(setProject(jsonData));
          } catch (error) {
            console.error("Error parsing JSON:", error);
            thunkAPI.rejectWithValue(error);
          }
        };

        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          thunkAPI.rejectWithValue(error);
        };

        reader.readAsText(file);

      } catch (error) {
        return thunkAPI.rejectWithValue(error);
      }
    }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (_state, action) => {
      return action.payload;
    },
    setTopo: (state, action) => {
      state.topo = action.payload.topoData;
      state.nSocks = action.payload.valveCount;
      state.valveFlags = Array(action.payload.valveFlags).fill(false);
    },
    removeTopo: (state, action) => {
      state.topo.splice(action.payload, 1);
    },
    setLibrary: (state, action) => {
      state.library.valve_cost = action.payload.valveCost;
      state.library.pipe_data = action.payload.data;
    },
    togglePipeAvailability: (state, action) => {
      const { pipeId, isChecked } = action.payload;
      state.library.pipe_data = state.library.pipe_data.map((p: PipeData) => {
        if (p.id === pipeId) {
          return { ...p, available: isChecked };
        }
        return p;
      });
    },
  },
});

export const {
  setProject,
  setTopo,
  removeTopo,
  setLibrary,
  togglePipeAvailability,
} = projectSlice.actions;
export default projectSlice.reducer;
