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

  let cumulativeL = 0;
  const graphWithAdjustedL = report.graph.map((point) => {
    cumulativeL += point.l ?? 0;
    return { ...point, l: cumulativeL };
  });

  const pipeSegments = graphWithAdjustedL
    .map((point, i) => {
      if (i === 0) return null; // skip the first point (no previous segment)

      const prev = graphWithAdjustedL[i - 1];
      const color = getPipeColor(point.nominal_size, point.sdr); // color from *current* segment info

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
    .filter(Boolean); // remove nulls

  const pipeEndpoints = graphWithAdjustedL.flatMap((point, i) => {
    if (i === 0) return [];

    const prev = graphWithAdjustedL[i - 1];
    const segmentLength = point.l - prev.l;
    const label = `${prev.nominal_size} SDR: ${prev.sdr}`;

    return [
      {
        x: point.l,
        y: point.h,
        meta: {
          type: label,
          length: segmentLength.toFixed(2),
          height: point.h,
        },
      },
    ];
  });

  const hollowDotsDataset = {
    label: "Pipe Endpoints",
    data: pipeEndpoints,
    pointRadius: 5,
    pointStyle: "circle",
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "transparent",
    showLine: false,
  };
  
  const hglPoints = [];
  if (pipeDesign.length > 0 && graphWithAdjustedL.length > 0) {
    let cumulativeX = 0;
    const initialH = graphWithAdjustedL[0].h;
  
    // First point: start of the system
    hglPoints.push({ x: 0, y: initialH });
  
    for (const pipe of pipeDesign) {
      cumulativeX += pipe.length;
      const hglY = pipe.hgl;
  
      hglPoints.push({ x: cumulativeX, y: hglY });
    }
  }
  
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
      hollowDotsDataset,
      ...pipeSegments,
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    elements: {
      point: {
        radius: 5,            // controls visible point size (optional)
        hitRadius: 12,        // expands clickable/hoverable area
        hoverRadius: 8,       // how big the point gets on hover
      }
    },
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

  console.log(report.graph, report.pipe_design, graphWithAdjustedL, hglPoints);

  return { data, options, Legend };
}
