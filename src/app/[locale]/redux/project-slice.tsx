"use client";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { PipeData, pipeData } from "../tube-data/tube_list";
import example0 from '../../../../examples/Example0.json';
import example1 from '../../../../examples/Example1.json';
import example2 from '../../../../examples/Example2.json'
import example3 from '../../../../examples/Example3.json';
import example6 from '../../../../examples/Example6.json';
import example7 from '../../../../examples/Example7.json';


export interface Topo {
  name?: string;
  l: number;
  h: number | null;
}

export interface Project {
  project_name: string;
  json_format: number;
  designer: string;
  description: string;
  date: string;
  notes: string;
  qmax: number;
  qmin: number;
  airvalve_selection: string;
  topo: Topo[];
  nSocks: number;
  valveFlags: boolean[];
  [key: string]: any;
  examples: any[];
}

const initialState: Project = {
  project_name: "Example Project",
  json_format: 1,
  designer: "Example Designer",
  description: "Test",
  date: "10/23/2023",
  notes: "Testing for web application",
  qmax: 0.25,
  qmin: 0.25,
  airvalve_selection: "auto",
  topo: [{ name: "1", l: 0, h: 0 }],
  nSocks: 0,
  valveFlags: [],
  library: {
    valve_cost: 380,
    pipe_data: pipeData,
  },
  examples: [example0, example1, example2, example3, example6, example7],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action) => {
      return action.payload;
    },
    setTopo: (state, action) => {
      state.topo = action.payload.topoData;
      state.nSocks = action.payload.valveCount;
      state.valveFlags = Array(action.payload.nvalvesCount).fill(false);
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
    loadExample: (state, action: PayloadAction<number>) => {
      const exampleIndex = action.payload;
      return {
        ...state,
        ...state.examples[exampleIndex],
      };
    },
  },
});

export const {
  setProject,
  setTopo,
  removeTopo,
  setLibrary,
  togglePipeAvailability,
  loadExample,
} = projectSlice.actions;
export default projectSlice.reducer;
