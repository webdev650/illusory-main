"use client";
import React, { Suspense} from "react";
import { Canvas } from "@react-three/fiber";
// import { Background } from "./Background";
import { BackgroundFoot } from "./BackgroundFoot";
import Footer from "./Footer";

const FooterGrad = () => {
  return (
    <>
      <div className="h-[898px] md:h-screen" id="footer-section" style={{ position: "relative", width: "100vw"}}>
        <Footer />

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
            <BackgroundFoot/>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};
export default FooterGrad;