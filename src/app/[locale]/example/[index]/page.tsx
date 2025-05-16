"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Demo from "../../demo/page";
import { initialState } from "../../redux/project-slice";

export default function Example() {
  const { index } = useParams();
  const [initial, setInitial] = useState(initialState);

  useEffect(() => {
    const fetchExampleFile = async () => {
      try {
        const res = await fetch(`/examples/Example${index}.json`);
        const json = await res.json();
        setInitial({ ...json });
      } catch (e) {
        console.error("Failed to fetch example file", e);
      }
    };

    fetchExampleFile();
  }, [index]);

  return <Demo initial={initial} />;
}
