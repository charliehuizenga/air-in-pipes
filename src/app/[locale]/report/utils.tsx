import { createRef } from "react";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  ChartOptions,
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend as ChartLegend,
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
  ChartLegend,
  Filler,
  ...registerables,
  annotationPlugin
);

export default function getGraph(topoData, pipeDesign) {
  const pipeColorPalette = [
    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728",
    "#9467bd", "#8c564b", "#e377c2", "#7f7f7f",
    "#bcbd22", "#17becf",
  ];

  const pipeColorMap = new Map();

  const getPipeColor = (nominalSize, sdr) => {
    const key = `${nominalSize}-${sdr}`;
    if (!pipeColorMap.has(key)) {
      const color = pipeColorPalette[pipeColorMap.size % pipeColorPalette.length];
      pipeColorMap.set(key, color);
    }
    return pipeColorMap.get(key);
  };

  const chartRef = createRef();

  // Topography data
  const topoPoints = topoData.map((point) => ({ x: point.l, y: point.h }));

  // HGL data
  const hglPoints = [];
  pipeDesign.forEach((pipe) => {
    const start = pipe.start_pos;
    const end = pipe.start_pos + pipe.length;
    hglPoints.push({ x: start, y: pipe.hgl });
    hglPoints.push({ x: end, y: pipe.hgl });
  });

  // Pipe datasets by segment
  const pipeDatasets = pipeDesign.map((pipe, i) => {
    const color = getPipeColor(pipe.nominal_size, pipe.sdr);
    return {
      label: `${pipe.nominal_size} SDR: ${pipe.sdr}`,
      data: [
        { x: pipe.start_pos, y: null },
        { x: pipe.start_pos + pipe.length, y: null },
      ],
      borderColor: color,
      borderWidth: 3,
      segment: {
        borderColor: color,
      },
      showLine: true,
      fill: false,
      pointRadius: 0,
    };
  });

  const data = {
    datasets: [
      // Topography
      {
        label: "Topography",
        data: topoPoints,
        borderColor: "grey",
        backgroundColor: "rgba(100, 100, 100, 0.1)", // shaded fill
        borderWidth: 1.5,
        pointRadius: 4,
        fill: true,
        tension: 0.2,
      },      
      // HGL
      {
        label: "HGL",
        data: hglPoints,
        borderColor: "gray",
        borderDash: [6, 4],
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0,
      },
      // All pipe segments
      ...pipeDesign.map((pipe) => {
        const color = getPipeColor(pipe.nominal_size, pipe.sdr);
        const start = pipe.start_pos;
        const end = pipe.start_pos + pipe.length;

        // Interpolate height at start and end from topoData
        const getHeight = (x) => {
          for (let i = 0; i < topoData.length - 1; i++) {
            const p0 = topoData[i];
            const p1 = topoData[i + 1];
            if (x >= p0.l && x <= p1.l) {
              const ratio = (x - p0.l) / (p1.l - p0.l);
              return p0.h + ratio * (p1.h - p0.h);
            }
          }
          return null;
        };

        return {
          label: `${pipe.nominal_size} SDR: ${pipe.sdr}`,
          data: [
            { x: start, y: getHeight(start) },
            { x: end, y: getHeight(end) },
          ],
          borderColor: color,
          borderWidth: 4,
          pointRadius: 0,
          fill: false,
          tension: 0,
        };
      }),
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    scales: {
      x: {
        type: "linear",
        title: {
          display: true,
          text: "Length (m)",
          font: { size: 18 },
        },
        ticks: { font: { size: 14 } },
      },
      y: {
        title: {
          display: true,
          text: "Height (m)",
          font: { size: 18 },
        },
        ticks: { font: { size: 14 } },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 14 },
          usePointStyle: true,
        },
      },
      tooltip: {
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
      },
      title: {
        display: true,
        text: "Topography, Pipe Segments, and HGL",
        font: { size: 20 },
      },
    },
  };

  const Legend = () => (
    <div className="mt-4 space-y-2">
      {Array.from(pipeColorMap.entries()).map(([key, color]) => (
        <div key={key} className="flex items-center space-x-2">
          <div
            className="w-5 h-5 rounded"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm">{key.replace("-", ' SDR: ')}</span>
        </div>
      ))}
    </div>
  );

  return { data, options, chartRef, Legend };
}
