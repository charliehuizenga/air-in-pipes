import { createRef } from "react";
import annotationPlugin from "chartjs-plugin-annotation";

import React from "react";
import {
  ChartOptions,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  registerables,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ...registerables,
  annotationPlugin
);

export default function getGraph(topoData, pipeDesign) {
  const createPipeIdentifier = (nominalSize, sdr) => `${nominalSize}-${sdr}`;

  const pipeColorMap = new Map();

  const getPipeColor = (nominalSize, sdr) => {
    const identifier = createPipeIdentifier(nominalSize, sdr);
    if (!pipeColorMap.has(identifier)) {
      const hue = (pipeColorMap.size * 137) % 360;
      const color = `hsl(${hue}, 80%, 50%)`; // Distinct colors
      pipeColorMap.set(identifier, color);
    }
    return pipeColorMap.get(identifier);
  };

  // Create a single dataset with segment coloring
  const data = {
    datasets: [
      {
        label: "Start and End Positions of Pipes",
        data: topoData?.map((point) => ({ x: point.l, y: point.h })),
        borderWidth: 3,
        fill: false,
        tension: 0.1,
        pointRadius: 5,
        segment: {
          borderColor: (ctx) => {
            if (!ctx.p1 || !ctx.p0) return "black"; // Default fallback color
            const segmentStart = ctx.p0.parsed.x;
            const pipe = pipeDesign.find(
              (pipe) =>
                segmentStart >= pipe.start_pos &&
                segmentStart <= pipe.start_pos + pipe.length
            );
            return pipe ? getPipeColor(pipe.nominal_size, pipe.sdr) : "gray"; // Assign pipe color or fallback
          },
        },
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Length (m)",
          font: { size: 20 },
        },
        ticks: { font: { size: 16 } },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Height (m)",
          font: { size: 20 },
        },
        ticks: { font: { size: 16 } },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        titleFont: { size: 18 },
        bodyFont: { size: 16 },
      },
      legend: {
        display: true,
        labels: { font: { size: 16 } },
      },
      title: {
        display: true,
        text: "Topography Graph",
        font: { size: 22 },
      },
    },
  };

  const chartRef = createRef();

  const Legend = () => (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginTop: "10px",
      }}
    >
      {pipeDesign?.map((pipe, index) => {
        const color = getPipeColor(pipe.nominal_size, pipe.sdr);
        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "5px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: color,
                marginRight: "10px",
              }}
            ></div>
            <span>
              {pipe.nominal_size} SDR: {pipe.sdr}
            </span>
          </div>
        );
      })}
    </div>
  );

  return { data, options, Legend, chartRef };
}
