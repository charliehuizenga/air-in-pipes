"use client";
import { configureStore } from "@reduxjs/toolkit";
import projectReducer from "./project-slice";
import reportReducer from "./report-slice";
import userReducer from "./auth-slice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    report: reportReducer,
    user: userReducer,
  },
});

export type ProjectState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
