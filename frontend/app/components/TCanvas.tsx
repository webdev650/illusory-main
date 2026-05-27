"use client";
import React, { Suspense, FC } from "react";
import { Canvas } from "@react-three/fiber";
import { Background } from "./Background";
import HeroPage from "./HeroPage";
import Navbar from "./Navbar";

type TCanvasProps = {
  head1: string;
  head2: string;
  head3: string;
  head4: string;
};

export const TCanvas: FC<TCanvasProps> = ({ head1, head2, head3, head4 }) => {
  return (
    <>
      <div
        className=""
        style={{ position: "relative", width: "100vw", height: "100vh" }}
      >
        <div className="absolute top-0 left-0 z-10 w-full pointer-events-none">
          <Navbar />
          <HeroPage
            head1={head1}
            head2={head2}
            head3={head3}
            head4={head4}
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
