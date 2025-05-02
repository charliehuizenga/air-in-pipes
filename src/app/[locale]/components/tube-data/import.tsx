import { useEffect, useState } from "react";
import { fetchProjects } from "../../projects/fetch-proj";
import { useDispatch } from "react-redux";
import { setLibrary } from "../../redux/project-slice";

export default function ImportPipeData({ isOpen, setIsOpen, invalidateReport }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const dispatch = useDispatch();

  const handleSelectChange = (event) => {
    const project = projects.find((p) => p.uuid === event.target.value);
    console.log(project);
    setSelectedProject(project);
  };

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      if (data.length > 0) {
        setSelectedProject(data[0]); // Set the first project as the default selection
      }
    });
  }, []);

  const importData = () => {
    if (selectedProject) {
      dispatch(
        setLibrary({
          data: selectedProject.library.pipe_data,
          valveCost: selectedProject.library.valve_cost,
        })
      ); // Dispatch selected project to Redux store
      console.log(selectedProject.library);
      setIsOpen(false);
    }
    invalidateReport();
  };

  return (
    <div>
      <button
        className="rounded-md bg-sky-500 px-3 py-1 text-l font-semibold text-white shadow-sm hover:bg-sky-600 focus:ring-2 focus:ring-inset focus:ring-sky-600"
        onClick={() => setIsOpen(true)}
      >
        Import from Project
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative z-50">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Import Pipe Data
            </h2>
            <p className="text-gray-700">
              Select a project to import pipe data from:
            </p>
            <select
              className="mt-3 w-full p-2 border rounded"
              onChange={handleSelectChange}
              value={selectedProject?.uuid || ""}
            >
              {projects.map((project) => (
                <option value={project.uuid} key={project.uuid}>
                  {project.project_name}
                </option>
              ))}
            </select>
            <button
              className="mt-4 w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600"
              onClick={importData}
              disabled={!selectedProject}
            >
              Import
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
