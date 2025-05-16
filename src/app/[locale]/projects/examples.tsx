"use client";

import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { setProject } from "../redux/project-slice";
import { ProjectState } from "../redux/store";
import ProjectTable from "./table";

const examples = [0, 1, 2, 3, 6, 7].map((i) => ({
  uuid: `example-${i}`,
  project_name: `Example ${i}`,
  filename: `/examples/Example${i}.json`,
  isExample: true,
}));

export default function ExampleTable() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const user = useSelector((state: ProjectState) => state.user);
  const t = useTranslations("projects");

  const handleSelectExample = async (uuid: string) => {
    const index = parseInt(uuid.split("-")[1], 10);
    const path = `/examples/Example${index}.json`;

    try {
      const res = await fetch(path);
      const json = await res.json();

      dispatch(
        setProject({
          ...json,
          uuid: `example-${index}`,
          user_id: user.id,
        })
      );

      router.push(`/${locale}/example/${index}`);
    } catch (err) {
      console.error("Failed to load example:", err);
      alert("Could not load the example project.");
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {t("example-projects")}
      </h3>
      <ProjectTable
        projects={examples}
        onSelect={handleSelectExample}
        onDelete={() => {}} // no-op to disable delete
        toggleDelete={false}
      />
    </div>
  );
}
