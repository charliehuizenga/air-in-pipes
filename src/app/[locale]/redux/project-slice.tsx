"use client";
import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PipeData, pipeData } from "../components/tube-data/tube_list";
import { Report } from "./report-slice";

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
  user_id: string;
  org_id: string;
  library: any;
  report: Report;
  [key: string]: any;
}

export const initialState: Project = {
  uuid: "",
  project_name: "Example Project",
  json_format: 1,
  designer: "Example Designer",
  description: "1.0.0",
  notes: "This is an example project!",
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
  report: null,
  user_id: "",
  org_id: ""
};

export const fileToState = createAsyncThunk(
  "project/fileToState",
  async (file: File, thunkAPI) => {
    try {
      const jsonData = await new Promise<any>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result as string);
            resolve(parsed);
          } catch (err) {
            reject(err);
          }
        };

        reader.onerror = () => {
          reject(reader.error);
        };

        reader.readAsText(file);
      });

      // Optional: if you want to update project state right away
      // thunkAPI.dispatch(setProject(jsonData));

      return jsonData; // Pass to calling component
    } catch (error) {
      console.error("uploadFile error:", error);
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
