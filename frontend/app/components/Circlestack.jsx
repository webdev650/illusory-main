"use client";
import * as Matter from "matter-js";
import React, { useEffect, useRef, useState } from "react";

const CircleStack = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 800
  );
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initialize on first render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Initialize Matter.js modules
    const {
      Engine,
      Render,
      Runner,
      Composites,
      MouseConstraint,
      Mouse,
      Composite,
      Bodies,
    } = Matter;

    // create engine
    const engine = Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    // create renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: width,
        height: 600,
        showAngleIndicator: true,
        wireframes: false,
        background: "#000000",
      },
    });
    renderRef.current = render;
    Render.run(render);

    // create runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Function to create ellipse with text
    const createTextEllipse = (x, y, radiusX, radiusY, text) => {
      // Create canvas for text
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const width = radiusX * 2;
      const height = radiusY * 2;
      canvas.width = width;
      canvas.height = height;

      // Draw ellipse background
      context.beginPath();
      context.ellipse(radiusX, radiusY, radiusX, radiusY, 0, 0, Math.PI * 2);
      context.fillStyle = getRandomPastelColor();
      context.fill();

      // Draw text (fixed font size regardless of ellipse size)
      const fontSize = isMobile ? 12 : 18;
      context.font = `${fontSize}px Arial`;
      context.fillStyle = "#000000";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, radiusX, radiusY);

      // Create the ellipse body using polygon approximation
      const points = [];
      const segments = 32;
      for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push({
          x: radiusX * Math.cos(angle),
          y: radiusY * Math.sin(angle),
        });
      }

      return Bodies.fromVertices(x, y, [points], {
        restitution: 0.6,
        friction: 0.1,
        chamfer: { radius: 5 },
        render: {
          sprite: {
            texture: canvas.toDataURL(),
            xScale: 1,
            yScale: 1,
          },
        },
      });
    };

    // Sample texts for ellipses
    const ellipseTexts = [
      "Calculated Instincts",
      "Relentless Quality",
      "Impact Guaranteed",
      "Momentum First",
      "Elegent Team",
      "Smart Leadership",
      "Raw before refined",
      "Rise Together",
      "Boldly Original",
      "Lead fearlessly",
      "Heartfelt Hustle",
      "Craft, Don’t Copy",
    ];

    // add bodies with text
    const radiusX = isMobile ? 64 : 120;
    const radiusY = isMobile ? 24 : 45;
    let textIndex = 0;

    const stack = isMobile
      ? Composites.stack(
        width / 2 - radiusX,
        50,
        1,
        ellipseTexts.length,
        0,
        radiusY * 0.5,
        function (x, y) {
          const text = ellipseTexts[textIndex % ellipseTexts.length];
          textIndex++;
          return createTextEllipse(x, y, radiusX, radiusY, text);
        }
      )
      : Composites.stack(
        100,
        600 - 21 - radiusY * 15,
        4,
        4,
        radiusX * 0.5,
        radiusY * 1.5,
        function (x, y) {
          const text = ellipseTexts[textIndex % ellipseTexts.length];
          textIndex++;
          return createTextEllipse(x, y, radiusX, radiusY, text);
        }
      );

    Composite.add(world, [
      // walls
      Bodies.rectangle(width / 2, 0, width, 30, {
        isStatic: true,
        render: {
          fillStyle: "#000000", // Red
        },
      }),
      Bodies.rectangle(width / 2, 600, width, 30, {
        isStatic: true,
        render: {
          fillStyle: "#000000", // Teal
        },
      }),
      Bodies.rectangle(width, 300, 30, 600, {
        isStatic: true,
        render: {
          fillStyle: "#000000", // Yellow
        },
      }),
      Bodies.rectangle(0, 300, 30, 600, {
        isStatic: true,
        render: {
          fillStyle: "#000000", // Purple
        },
      }),
      stack,
    ]);

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: width, y: 600 },
    });

    const handleWheel = (e) => {
      if (e.ctrlKey) return; // allow zoom with ctrl+wheel
      e.preventDefault();
      window.scrollBy(0, e.deltaY);
    };

    // Add wheel event listener
    render.canvas.addEventListener("wheel", handleWheel);

    return () => {
      render.canvas.removeEventListener("wheel", handleWheel);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(world, false);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      if (render.textures) {
        render.textures = {};
      }
    };
  }, [width, isMobile]);

  // Helper function for random pastel colors
  function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 100%, 85%)`;
  }

  return (
    <div
      ref={sceneRef}
      style={{
        width: "100vw",
        height: "600px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    />
  );
};

export default CircleStack;
