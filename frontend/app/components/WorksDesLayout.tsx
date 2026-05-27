"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Background } from "./Background";
import Navbar from "./Navbar";
import WorksDesHome from "./WorksDesHome";
import { StaticImageData } from "next/image";

interface WorksDesHomeProps {
    logo?: StaticImageData | string | null;
    title: string;
    subtitle: string;
}

export const WorksDesLayout: React.FC<WorksDesHomeProps> = ({logo,title,subtitle}) => {
  return (
    <>
      <div
        className=""
        style={{ position: "relative", width: "100vw", height: "100vh" }}
      >
        <div className="absolute top-0 left-0 z-10 w-full pointer-events-none">
          <Navbar />
         <WorksDesHome
         logo={logo}
         title={title}
        subtitle={subtitle}
         />
        </div>

        {/* Canvas Component */}
        <Canvas
          dpr={typeof window !== "undefined" ? window.devicePixelRatio : 1}
          orthographic // Enables an Orthographic Camera
          camera={{
            position: [0, 0, 5], // Position the camera
            zoom: 1, // Adjust zoom level to control the view
            near: -10,
            far: 10,
            left: -1,
            right: 1,
            top: 1,
            bottom: -1,
          }}
        >
          <Suspense fallback={null}>
            <Background />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};
