/** The report graph **/
"use client";
import { useTranslations } from "next-intl";
import { Project } from "../redux/project-slice";
import { Report } from "../redux/report-slice";
import annotationPlugin from "chartjs-plugin-annotation";

import React from "react";
import { Line } from "react-chartjs-2";
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

interface GraphProps {
  report: Report;
  project: Project;
}

export default function Summary({ report, project }: GraphProps) {
  // Access topo_data from the project
  const topoData = project.topo;
  const pipeDesign = report.pipe_design;

  // Function to create a unique identifier for each pipe type
  const createPipeIdentifier = (nominalSize: any, sdr: any) => `${nominalSize}-${sdr}`;

  // Map to store colors for each pipe type
  const pipeColorMap = new Map();

  // Function to get color for a pipe type
  const getPipeColor = (nominalSize: any, sdr: any) => {
    const identifier = createPipeIdentifier(nominalSize, sdr);
    if (!pipeColorMap.has(identifier)) {
      // Generate a new color if not already present
      const hue = (pipeColorMap.size * 137) % 360; // Using golden angle for color spread
      const color = `hsla(${hue}, 60%, 70%, 0.3)`;
      pipeColorMap.set(identifier, color);
    }
    return pipeColorMap.get(identifier);
  };

  // Generate annotations for each pipe segment
  const annotations = pipeDesign.map((pipe: { start_pos: any; length: any; nominal_size: any; sdr: any; }) => ({
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
        data: project.topo.map((point) => ({ x: point.l, y: point.h })),
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 5,
      },
    ],
  };

  // Define the options with the correct type
  const options: ChartOptions<"line"> = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Length (m)",
        },
      },
      y: {
        beginAtZero: true, // This could be optional depending on your data
        title: {
          display: true,
          text: "Height (m)",
        },
      },
    },
    plugins: {
      annotation: {
        annotations: annotations,
      },

      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            return context.label;
          },
        },
      },
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: true,
        text: "Topography Graph",
      },
    },
  };

  const CustomLegend = () => (
    <div
      style={{
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginTop: "10px",
      }}
    >
      {pipeDesign.map((pipe: { nominal_size: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; sdr: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; }, index: React.Key | null | undefined) => {
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

  return (
    <div className="hidden sm:block mx-auto max-w-5xl py-12 sm:px-6 lg:px-8">
      <Line data={data} options={options} />
      <div style={{ width: "25%" }}>
        <CustomLegend />
      </div>
    </div>
  );
}
