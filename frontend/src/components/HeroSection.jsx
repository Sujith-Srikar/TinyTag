import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "../App.css"

const COOLDOWN = 1000;

const Tile = ({ row, col, isFlipped }) => {
  const tileRef = useRef(null);
  let lastEnterTime = 0;

  const animateTile = (tiltY) => {
    gsap
      .timeline()
      .set(tileRef.current, { rotateX: isFlipped ? 180 : 0, rotateY: 0 })
      .to(tileRef.current, {
        rotateX: isFlipped ? 450 : 270,
        rotateY: tiltY,
        duration: 0.5,
        ease: "power2.out",
      })
      .to(
        tileRef.current,
        {
          rotateX: isFlipped ? 540 : 360,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.25"
      );
  };

  const handleMouseEnter = () => {
    const currentTime = Date.now();
    if (currentTime - lastEnterTime > COOLDOWN) {
      lastEnterTime = currentTime;
      const tiltValues = [-40, -20, -10, 10, 20, 40];
      const tiltY = tiltValues[col % 6];
      animateTile(tiltY);
    }
  };

  return (
    <>
      <div ref={tileRef} className="tile" onMouseEnter={handleMouseEnter}>
        <div
          className="tile-face tile-front"
          style={{ backgroundPosition: `${col * 20}% ${row * 20}%` }}
        ></div>
        <div
          className="tile-face tile-back"
          style={{ backgroundPosition: `${col * 20}% ${row * 20}%` }}
        ></div>
      </div>
    </>
  );
};

const Board = ({ isFlipped, ROWS, COLS }) => {
  return (
    <>
      <div className="board">
        {Array.from({ length: ROWS }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: COLS }).map((_, colIndex) => (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                isFlipped={isFlipped}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

function HeroSection() {
  const [isflipped, setIsFlipped] = useState(false);
  const [ROWS, setROWS] = useState(6);
  const [COLS, setCOLS] = useState(6);
  const lastScrollY = useRef(0)

  const updateGrid = () =>{
    if(window.innerWidth < 600){
      setROWS(3);
      setCOLS(3);
    }
    else{
      setROWS(6);
      setCOLS(6);
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setIsFlipped(true); // Flip when scrolling down
      } else {
        setIsFlipped(false); // Flip back when scrolling up
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      console.log("Unmounted")
      window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  },[]);

  useEffect(() => {
    const tiles = document.querySelectorAll(".tile");
    gsap.to(tiles, {
      rotateX: isflipped ? 180 : 0,
      duration: 1,
      stagger: {
        amount: 0.5,
        from: "random",
      },
      ease: "power2.inOut",
    });
  }, [isflipped]);

  return (
    <>
      <div>
        <nav>
          <Link to="/">Tiny Tag</Link>
          {/* <button onClick={() => setIsFlipped(!isflipped)}>Flip Tiles</button> */}
        </nav>
      </div>
      <Board isFlipped={isflipped} ROWS={ROWS} COLS={COLS} />
    </>
  );
}

export default HeroSection;