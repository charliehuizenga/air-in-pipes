"use client";
import { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { setData } from "../redux/report-slice";
import getGraph from "./utils"; // Ensure correct path
import { ProjectState } from "../redux/store";


export default function Graph({ report, project }) {
  const { data, options, Legend } = getGraph(report);

  return (
    <div className="hidden sm:block mx-auto max-w-5xl py-12 sm:px-6 lg:px-8">
      <Line data={data} options={options} />
      <div style={{ width: "25%" }}>
        <Legend />
      </div>
    </div>
  );
}
