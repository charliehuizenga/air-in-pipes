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

  let lastHGL = topoData[0].h; // Initialize with the reference height from the first point of topography data

  // Generate datasets for connected HGL lines of each pipe segment
  const hglDatasets = pipeDesign.map((pipe, index) => {
    // Generate more muted colors by reducing the saturation and increasing the lightness
    const hue = (index * 137) % 360; // Unique hue for each pipe
    const saturation = 60; // Reduced saturation for a more muted color
    const lightness = 50; // Adjust lightness if needed
    const color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`; // Muted color with some transparency

    const dataset = {
      label: `HGL for Pipe ${index + 1}`,
      data: [
        { x: pipe.start_pos, y: lastHGL }, // Start of the HGL at the end of the previous pipe's HGL
        { x: pipe.start_pos + pipe.length, y: pipe.hgl }, // End of the HGL at its value
      ],
      borderColor: color,
      borderWidth: 2,
      pointRadius: 0, // Hide points on the dataset line
      fill: false, // No fill below the line
      tension: 0, // Straight line
      spanGaps: true,
    };

    lastHGL = pipe.hgl; // Update lastHGL to the current pipe's HGL for the next iteration
    return dataset;
  });

  const pipeInfoMap = pipeDesign.map((pipe, index) => ({
    nominalSize: pipe.nominal_size,
    sdr: pipe.sdr,
    hgl: pipe.hgl,
    length: pipe.length,
    start: pipe.start_pos,
  }));

  const data = {
    datasets: [
      ...hglDatasets,
      // Then add the topography data
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
      tooltip: {
        callbacks: {
          title: function (tooltipItems) {
            // Assuming the point's name is in the same order as your data array
            const index = tooltipItems[0].dataIndex;
            return topoData[index].name; // Return the name of the point
          },
          // Adjust the label callback to display pipe information
          label: function (context) {
            const datasetIndex = context.datasetIndex;
            const pipeInfo = pipeInfoMap[datasetIndex];

            // Check if the hovered dataset corresponds to a pipe segment
            if (pipeInfo) {
              return `Pipe Size: ${pipeInfo.nominalSize}, SDR: ${pipeInfo.sdr}, HGL: ${pipeInfo.hgl}`;
            } else {
              // Handle other datasets, e.g., topography
              return `Height: ${context.parsed.y}, Length: ${context.parsed.x}`;
            }
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

  return (
    <div className="hidden sm:block mx-auto max-w-5xl py-12 sm:px-6 lg:px-8">
      <Line data={data} options={options} />
    </div>
  );
}
