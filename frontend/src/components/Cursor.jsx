import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Cursor() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const circle = useRef();
  const svgRef = useRef();
  const size = 150;

  const lerp = (x, y, a) => x * (1 - a) + y * a;

  const manageMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouse.current = { x: clientX, y: clientY };
  };

  const animate = () => {
    const { x, y } = delayedMouse.current;
    delayedMouse.current = {
      x: lerp(x, mouse.current.x, 0.075),
      y: lerp(y, mouse.current.y, 0.075),
    };
    moveCircle(delayedMouse.current.x, delayedMouse.current.y);
    requestAnimationFrame(animate);
  };

  const moveCircle = (x, y) => {
    if (circle.current) {
      gsap.set(circle.current, { x, y, xPercent: -50, yPercent: -50 });
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    if (!isMobile) {
      animate();
      window.addEventListener("mousemove", manageMouseMove);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", manageMouseMove);
    };
  }, [isMobile]);

  useLayoutEffect(() => {
    if (!isMobile) {
      const startAnimation = () => {
        if (svgRef.current) {
          gsap.to(svgRef.current, {
            rotation: 360,
            duration: 10,
            repeat: -1,
            ease: "linear",
          });
        }
      };
      requestAnimationFrame(() => setTimeout(startAnimation, 100));
    }
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="absolute z-[200]">
      <div
        style={{ width: size, height: size }}
        className="top-0 left-0 fixed rounded-full pointer-events-none"
        ref={circle}
      >
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="absolute top-0 left-0"
        >
          <defs>
            <path
              id="circlePath"
              d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"
            />
          </defs>
          <text
            fill="white"
            fontSize="12"
            textAnchor="middle"
            style={{ letterSpacing: "1px" }}
          >
            <textPath
              href="#circlePath"
              startOffset="50%"
              textLength="248"
              lengthAdjust="spacing"
            >
              <tspan>SCROLL DOWN</tspan>
              <tspan> * </tspan>
              <tspan>SCROLL DOWN</tspan>
              <tspan> * </tspan>
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
