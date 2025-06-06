import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function getGraph(report) {
  const pipeDesign = report.pipe_design;
  const pipeColorPalette = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ];

  const pipeColorMap = new Map();
  const getPipeColor = (nominalSize, sdr) => {
    const key = `${nominalSize}-${sdr}`;
    if (!pipeColorMap.has(key)) {
      const color =
        pipeColorPalette[pipeColorMap.size % pipeColorPalette.length];
      pipeColorMap.set(key, color);
    }
    return pipeColorMap.get(key);
  };

  const pipeSegments = report.graph
    .map((point, i) => {
      if (i === 0) return null;
      const prev = report.graph[i - 1];
      const color = getPipeColor(point.nominal_size, point.sdr);

      return {
        label: `${point.nominal_size} SDR: ${point.sdr}`,
        data: [
          { x: prev.l, y: prev.h },
          { x: point.l, y: point.h },
        ],
        borderColor: color,
        borderWidth: 4,
        pointRadius: 0,
        fill: false,
        tension: 0,
      };
    })
    .filter(Boolean);

  const hglPoints = report.hgl?.map(({ l, hgl }) => ({ x: l, y: hgl })) ?? [];

  const valvePoints = report.valves ?? [];

  const manualValves = {
    label: "Manual Valves",
    data: valvePoints
      .filter((v) => v.type === "manual")
      .map((v) => ({ x: v.l, y: v.h })),
    pointRadius: 6,
    pointStyle: "circle",
    borderColor: "black",
    backgroundColor: "black",
    borderWidth: 1,
    showLine: false,
  };

  const automaticValves = {
    label: "Automatic Valves",
    data: valvePoints
      .filter((v) => v.type === "automatic")
      .map((v) => ({ x: v.l, y: v.h })),
    pointRadius: 6,
    pointStyle: "circle",
    borderColor: "black",
    backgroundColor: "white",
    borderWidth: 2,
    showLine: false,
  };

  const data = {
    datasets: [
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
      manualValves,
      automaticValves,
      ...pipeSegments,
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    elements: {
      point: {
        radius: 5, // controls visible point size (optional)
        hitRadius: 12, // expands clickable/hoverable area
        hoverRadius: 8, // how big the point gets on hover
      },
    },
    scales: {
      x: {
        type: "linear" as const,
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
          filter: function (legendItem, data) {
            const label = legendItem.text;
            return (
              label === "HGL" ||
              label === "Manual Valves" ||
              label === "Automatic Valves"
            );
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const point = context.raw;
            if (point.meta) {
              return [
                `Point: (${point.x}, ${point.y})`,
                `Pipe: ${point.meta.type}`,
                `Length: ${point.meta.length}m`,
                `Height: ${point.meta.height}m`,
              ];
            }
            return `(${context.raw.x}, ${context.raw.y})`; // fallback
          },
        },
      },
      title: {
        display: true,
        text: "Pipes",
        font: { size: 20 },
      },
    },
  };

  const Legend = () => (
    <div className="mt-4 space-y-2">
      {Array.from(pipeColorMap.entries()).map(([key, color]) => (
        <div key={key} className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded" style={{ backgroundColor: color }} />
          <span className="text-sm">{key.replace("-", " SDR: ")}</span>
        </div>
      ))}
    </div>
  );

  console.log(pipeSegments, hglPoints);

  return { data, options, Legend };
}
