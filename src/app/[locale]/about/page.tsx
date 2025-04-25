"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function About() {
  const t = useTranslations("about");

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-center">
      <h1 className="text-4xl font-bold mb-6">{t("about-APLV")}</h1>
      <p className="text-gray-700 mb-10 text-left text-lg leading-relaxed">
        {t("about-APLV-text")}
      </p>

      <p className="text-center text-lg text-gray-700 mb-10 text-left leading-relaxed">
        {t("about-learn")}{" "}
        <a
          href="https://www.aguaparalavida.org"
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.aplv.org
        </a>.
      </p>

      <div className="flex justify-center mb-12">
        <Image
          src="/Programas-APLV_Aire.png"
          width={800}
          height={500}
          alt="Pipeline image"
          className="w-full max-w-3xl h-auto"
        />
      </div>

      <h2 className="text-3xl font-bold mb-6">{t("about-air")}</h2>

      <p className="text-gray-700 mb-8 text-left text-lg leading-relaxed">
        {t("about-air-text-p1")}
      </p>

      <ul className="list-disc list-outside pl-8 text-gray-700 mb-8 text-left text-lg leading-relaxed">
        <li>{t("about-air-text-bullet1")}</li>
        <li>{t("about-air-text-bullet2")}</li>
        <li>{t("about-air-text-bullet3")}</li>
      </ul>

      <p className="text-gray-700 mb-10 text-left text-lg leading-relaxed">
        {t("about-air-text-p2")}
        <br />
        <br />
        {t("about-air-text-p3")}
      </p>

      <div className="text-left text-lg text-gray-700">
        <p className="mb-2">{t("about-download-manual")}</p>
        <a
          href="/AirInPipesManual.pdf"
          className="text-blue-600 underline block mb-1"
          target="_blank"
        >
          Air in Pipes Manual (English)
        </a>
        <a
          href="/AireEnTuberias.pdf"
          className="text-blue-600 underline"
          target="_blank"
        >
          Aire En Tuberias Manual (Español)
        </a>
      </div>
    </div>
  );
}
