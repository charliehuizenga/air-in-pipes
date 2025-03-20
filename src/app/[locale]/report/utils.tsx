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
      const color = `hsla(${hue}, 60%, 70%, 0.3)`;
      pipeColorMap.set(identifier, color);
    }
    return pipeColorMap.get(identifier);
  };

  const annotations = pipeDesign.map((pipe) => ({
    type: "box",
    xMin: pipe.start_pos,
    xMax: pipe.start_pos + pipe.length,
    backgroundColor: getPipeColor(pipe.nominal_size, pipe.sdr),
    borderColor: getPipeColor(pipe.nominal_size, pipe.sdr),
    borderWidth: 1,
  }));

  const data = {
    datasets: [
      {
        label: "Topo Data",
        data: topoData.map((point) => ({ x: point.l, y: point.h })),
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 5,
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
      annotation: { annotations },
      tooltip: {
        enabled: true,
        titleFont: { size: 18 },
        bodyFont: { size: 16 },
      },
      legend: {
        display: false,
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
      {pipeDesign.map((pipe, index) => {
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
