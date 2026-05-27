"use client";
import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
// import Person1 from "../components/assets/profile/person1.jpg";
// import Person2 from "../components/assets/profile/person2.jpg";
// import Person3 from "../components/assets/profile/person3.jpg";
// import Person4 from "../components/assets/profile/person4.jpg";
// import Person5 from "../components/assets/profile/person5.jpg";
const PhysicsScene = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const {
      Engine,
      Render,
      Runner,
      // Composites,
      MouseConstraint,
      Mouse,
      Composite,
      Bodies,
    } = Matter;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 1 }
    });
    engineRef.current = engine;
    const world = engine.world;

    // Set world bounds and slop
    world.bounds = {
      min: { x: 0, y: 0 },
      max: { x: window.innerWidth, y: window.innerHeight }
    };

    // Configure collision slop
    if (engine.detector) {
      engine.detector.slop = 0; // Fixes sinking
    }

    // Proceed with renderer setup
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: "#000000",
      },
    });

    Render.run(render); // No more error

    // Create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Preload the image
    // Preload multiple images
    // Responsive circle settings
    const isMobile = window.innerWidth < 768; // Same breakpoint as text
    // const circleRadius = isMobile ? 50 : 80; // Smaller on mobile
    // const circleSize = circleRadius * 2; // Diameter for canvas

    // Preload multiple images with responsive sizing
    // const imageUrls = [
    //   Person1.src,
    //   Person2.src,
    //   Person3.src,
    //   Person4.src,
    //   Person5.src,
    // ];
    // const textures = [];
    // let imagesLoaded = 0;

    // imageUrls.forEach((url, index) => {
    //   const img = new Image();
    //   img.src = url;
    //   img.onload = () => {
    //     const scale = circleSize / Math.max(img.width, img.height);

    //     const canvas = document.createElement("canvas");
    //     const ctx = canvas.getContext("2d");
    //     canvas.width = circleSize;
    //     canvas.height = circleSize;

    //     // Draw circular mask
    //     ctx.beginPath();
    //     ctx.arc(circleRadius, circleRadius, circleRadius, 0, Math.PI * 2);
    //     ctx.closePath();
    //     ctx.clip();

    //     // Draw and scale the image
    //     const scaledWidth = img.width * scale;
    //     const scaledHeight = img.height * scale;
    //     ctx.drawImage(
    //       img,
    //       (circleSize - scaledWidth) / 2,
    //       (circleSize - scaledHeight) / 2,
    //       scaledWidth,
    //       scaledHeight
    //     );

    //     textures[index] = canvas.toDataURL();
    //     imagesLoaded++;

    //     if (imagesLoaded === imageUrls.length) {
    //       createStackWithTextures();
    //     }
    //   };
    // });

    // function createStackWithTextures() {
    //   // Adjust stack position for mobile
    //   const stackX = isMobile ? width * 0.2 : 100;
    //   const stackY = isMobile ? height * 0.7 : 100;

    //   // Create circle stack with different images
    //   const stack = Composites.stack(
    //     stackX,
    //     stackY,
    //     5, // columns
    //     1, // rows
    //     0, // columnGap
    //     0, // rowGap
    //     (x, y, column) => {
    //       return Bodies.circle(x, y, circleRadius, {
    //         chamfer: { radius: isMobile ? 5 : 10 }, // Smaller chamfer on mobile
    //         render: {
    //           sprite: {
    //             texture: textures[column % textures.length],
    //             xScale: 1,
    //             yScale: 1,
    //           },
    //         },
    //       });
    //     }
    //   );

    //   Composite.add(world);
    // }
    // Improved helper to create a text texture with perfect rounded corners
    const createTextTexture = (
      text,
      fontSize = 8,
      textColor = "#ffffff",
      bgColor = "#3498db",
      padding = 24,
      borderRadius = 20
    ) => {
      // Scale for high-DPI displays
      const scale = window.devicePixelRatio || 1;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set up canvas dimensions with scaling
      context.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;
      const textWidth = context.measureText(text).width;
      const textHeight = fontSize * 1.2; // Add some line height

      const totalWidth = (textWidth + padding * 4) * scale;
      const totalHeight = (textHeight + padding * 4) * scale;

      canvas.width = totalWidth;
      canvas.height = totalHeight;
      canvas.style.width = `${totalWidth / scale}px`;
      canvas.style.height = `${totalHeight / scale}px`;

      // Scale the context
      context.scale(scale, scale);
      context.textRendering = "optimizeLegibility";
      context.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;

      // Draw background with perfect rounded corners
      context.fillStyle = bgColor;
      context.beginPath();
      context.moveTo(borderRadius, 0);
      context.lineTo(textWidth + padding * 2 - borderRadius, 0);
      context.quadraticCurveTo(
        textWidth + padding * 2,
        0,
        textWidth + padding * 2,
        borderRadius
      );
      context.lineTo(
        textWidth + padding * 2,
        textHeight + padding * 2 - borderRadius
      );
      context.quadraticCurveTo(
        textWidth + padding * 2,
        textHeight + padding * 2,
        textWidth + padding * 2 - borderRadius,
        textHeight + padding * 2
      );
      context.lineTo(borderRadius, textHeight + padding * 2);
      context.quadraticCurveTo(
        0,
        textHeight + padding * 2,
        0,
        textHeight + padding * 2 - borderRadius
      );
      context.lineTo(0, borderRadius);
      context.quadraticCurveTo(0, 0, borderRadius, 0);
      context.closePath();
      context.fill();

      // Draw text with improved rendering
      context.fillStyle = textColor;
      context.textBaseline = "middle";
      context.textAlign = "center";
      context.fillText(
        text,
        (textWidth + padding * 2) / 2,
        (textHeight + padding * 2) / 2 + fontSize * 0.1
      );

      return canvas.toDataURL();
    };

    // Array of colors for word backgrounds
    const colors = [
      "#efb1d9",
      "#e74c3c",
      "#2ecc71",
      "#f1c40f",
      "#9b59b6",
      "#1abc9c",
      "#e67e22",
      "#34495e",
      "#219fd7",
      "#ed2956",
      "#4abfad",
      "#7bc241",
      "#f3b829",
      "#f16864",
      "#66c8f2",
      "#ca67a8",
      "#7fc586",
    ];

    // Add text bodies word-by-word
    const message = "Instincts Quality Hustle Leadership Momentum Curious Rise Creative Strategy Innovation Digital Branding Passionate Experience Collaberative Teamwork Knowledge";
    const words = message.split(" ");

    // Responsive settings
    // const isMobile = window.innerWidth < 768; // Adjust breakpoint as needed
    const fontSize = isMobile ? 12 : 14;
    const padding = isMobile ? 10 : 15;
    const borderRadius = isMobile ? 15 : 20;
    const verticalSpacing = isMobile ? 80 : 50; // Start Y position
    const horizontalGap = isMobile ? 15 : 100;

    let currentX = 50; // Start closer to left edge on mobile
    let currentY = verticalSpacing;
    let rowHeight = 0;
    words.forEach((word, index) => {
      const colorIndex = index % colors.length;
      const bgColor = colors[colorIndex];

      // Create texture with responsive settings
      const texture = createTextTexture(
        word,
        fontSize,
        "#ffffff",
        bgColor,
        padding,
        borderRadius
      );

      // Measure the actual word width with current font settings
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = `300 ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;
      const textWidth = ctx.measureText(word).width;
      const textHeight = fontSize;

      // Calculate body dimensions
      const bodyWidth = textWidth + padding * 2;
      const bodyHeight = textHeight + padding * 2;

      // Track maximum row height
      rowHeight = Math.max(rowHeight, bodyHeight);

      // Check if word fits in current row
      if (currentX + bodyWidth > width - 50) {
        // 50px right margin
        currentX = 50; // Reset to left edge
        currentY += rowHeight + 20; // Move to next row with some spacing
        rowHeight = 0; // Reset row height
      }

      const wordBody = Bodies.rectangle(
        currentX + bodyWidth / 2,
        currentY + bodyHeight / 2,
        bodyWidth, // This should include your padding
        bodyHeight, // This should include your padding
        {
          chamfer: { radius: borderRadius / 2 },
          restitution: 0.6,
          friction: 0.3,
          render: {
            sprite: {
              texture: texture,
              xScale: 1,
              yScale: 1,
            },
          },
        }
      );

      Composite.add(world, wordBody);

      // Move to next position
      currentX += bodyWidth + horizontalGap;
    });

    // Add walls
    Composite.add(world, [
      Bodies.rectangle(width / 2, 0, width, 30, {
        isStatic: true,
        render: {
          fillStyle: "#000000",
        },
      }),
      Bodies.rectangle(width / 2, height, width, 30, {
        isStatic: true,
        render: {
          fillStyle: "#000000",
        },
      }),
      Bodies.rectangle(width, height / 2, 30, height, {
        isStatic: true,
        render: {
          fillStyle: "#000000",
        },
      }),
      Bodies.rectangle(0, height / 2, 30, height, {
        isStatic: true,
        render: {
          fillStyle: "#000000",
        },
      }),
    ]);



    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    // Fit render to full scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: width, y: height },
    });

    const handleWheel = (e) => {
      if (e.ctrlKey) return; // allow zoom with ctrl+wheel
      e.preventDefault();
      window.scrollBy(0, e.deltaY);
    };

    // Add wheel event listener
    render.canvas.addEventListener("wheel", handleWheel);

    // Cleanup
    return () => {
      render.canvas.removeEventListener("wheel", handleWheel);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      if (render.textures) render.textures = {};
    };
  }, []);

  return (
    <div style={{ width: "100vw", overflow: "hidden" }}>
      <div
        ref={sceneRef}
        style={{
          width: "100vw",
          height: "100vh",
          margin: "0 auto",
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  );
};

export default PhysicsScene;
