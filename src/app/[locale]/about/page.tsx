"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import { setProject } from "../redux/project-slice";
import { ProjectState } from "../redux/store";
import Summary from "./summary";
import Graph from "./graph";
import Detail from "./detail";
import { createClient } from "@supabase/supabase-js";
import { useProjectLoader } from "../reload_fetch";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function About() {

  const t = useTranslations("about");


  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4"> {t("about-APLV")}</h1>
      <p className="text-gray-600 mb-6 text-left">
        {t("about-APLV-text")}
      </p>
      <p>
        {t("about-learn")} <a href='https://www.aguaparalavida.org' className='text-blue-600' target='_blank' rel='noopener noreferrer'>www.aplv.org</a>.
      </p>
      <p><br></br> </p>


      <div className="flex justify-center">
      <img src="/Programas-APLV_Aire.png" width={600} alt="Pipeline image" />
      </div>

      <h1 className="text-3xl font-bold mb-4" > {t("about-air")}</h1>
      <p className="text-gray-600 mb-6 text-left">

        {t("about-air-text-p1")}
      </p>
      
      <ul className="list-disc list-outside pl-6 text-gray-600 mb-6 text-left">
          <li> {t("about-air-text-bullet1")}</li>
          <li> {t("about-air-text-bullet2")}</li>
          <li> {t("about-air-text-bullet3")}</li>
      </ul>
      <p className="text-gray-600 mb-6 text-left">
        {t("about-air-text-p2")}
        <br /><br />
        {t("about-air-text-p3")}
      </p>

      <p className="text-gray-600 mb-6 text-left">
        {t("about-download-manual")}
        <br />
        <a href="/AirInPipesManual.pdf" className='text-blue-600' target="_blank">Air in Pipes Manual (English)</a>
        <br />
        <a href="/AireEnTuberias.pdf" className='text-blue-600' target="_blank">Aire En Tuberias Manual (Espanol)</a>

 
      </p>

    </div>  )
}
