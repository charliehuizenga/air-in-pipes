"use client";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./project-slice";
import reportReducer from "./report-slice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    report: reportReducer,
  },
});

export type ProjectState = ReturnType<typeof store.getState>;
