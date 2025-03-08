import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportReportToPDF(report) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Project Report", 14, 20);

  // Project Details
  doc.setFontSize(12);
  doc.text(`Project Name: ${report.project_name}`, 14, 30);
  doc.text(`Designer: ${report.designer}`, 14, 38);
  doc.text(`Description: ${report.description}`, 14, 46);
  doc.text(`Qmin: ${report.qmin}`, 14, 54);
  doc.text(`Qmax: ${report.qmax}`, 14, 62);
  doc.text(`Air Valve Selection: ${report.airvalve_selection}`, 14, 70);

  // Topology Table
  autoTable(doc, {
    startY: 80,
    head: [["Name", "Height (h)", "Length (l)"]],
    body: report.topo.map(({ name, h, l }) => [name, h, l]),
    theme: "grid",
  });

  let finalY = (doc as any).autoTable.previous.finalY || 90;

  // Design Summary
  autoTable(doc, {
    startY: finalY + 10,
    head: [["Design Case", "Calculation Version", "Design Cost", "Valve Count", "Total Head Available"]],
    body: [[
      report.design.design_case,
      report.design.calculation_version,
      report.design.cost.toFixed(2),
      report.design.valve_count,
      report.design.total_head_available,
    ]],
    theme: "grid",
  });

  finalY = (doc as any).autoTable.previous.finalY || finalY + 10;

  // Pipe Design Table
  autoTable(doc, {
    startY: finalY + 10,
    head: [["Nominal Size", "SDR", "Start Pos", "Length", "Constraints", "HGL"]],
    body: report.pipe_design.map(({ nominal_size, sdr, start_pos, length, constraints, hgl }) => [
      nominal_size, sdr, start_pos, length.toFixed(2), constraints, hgl.toFixed(2),
    ]),
    theme: "grid",
  });

  finalY = (doc as any).autoTable.previous.finalY || finalY + 10;

  // Design Summary Table
  autoTable(doc, {
    startY: finalY + 10,
    head: [["Nominal Size", "SDR", "Length", "Cost"]],
    body: report.design_summary.map(({ nominal_size, sdr, length, cost }) => [
      nominal_size, sdr, length.toFixed(2), cost.toFixed(2),
    ]),
    theme: "grid",
  });

  // Save the PDF
  doc.save(`${report.project_name.replace(/\s+/g, "_")}_Report.pdf`);
}
