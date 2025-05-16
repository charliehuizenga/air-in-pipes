"use client";
import { Line } from "react-chartjs-2";
import getGraph from "./utils";


export default function Graph({ report, project }) {
  const { data, options, Legend } = getGraph(report);

  return (
    <div className="hidden sm:block mx-auto max-w-5xl py-12 sm:px-6 lg:px-8">
      <Line data={data} options={options}/>
      <div style={{ width: "25%" }}>
        <Legend />
      </div>
    </div>
  );
}
