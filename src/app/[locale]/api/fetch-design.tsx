import { Project } from "../redux/project-slice";

export async function getDesign(project: Project) {
  const res = await fetch("https://twordle.fun/air/", {
    method: "POST", // Use POST method
    headers: {
      "Content-Type": "application/json", // Specify JSON content type
    },
    body: JSON.stringify(project), // Convert your JSON data to a string
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return await res.json();
}
