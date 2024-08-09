import React, { useEffect, useState } from "react";
import "./rainbowTrail.css";

function RainbowTrail() {
    const [trails, setTrails] = useState([]);
  
    useEffect(() => {
      const handleMouseMove = (event) => {
        const newTrail = {
          id: Date.now(),
          x: event.clientX,
          y: event.clientY,
        };
        setTrails((prevTrails) => [...prevTrails, newTrail]);
  
        // 일정 시간이 지난 후 트레일을 제거
        setTimeout(() => {
          setTrails((prevTrails) => prevTrails.filter(trail => trail.id !== newTrail.id));
        }, 1000); // 트레일이 유지되는 시간 (1초)
      };
  
      window.addEventListener("mousemove", handleMouseMove);
  
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }, []);
  
    return (
      <div>
        {trails.map((trail) => (
          <div
            key={trail.id}
            className="rainbow-trail"
            style={{
              top: trail.y,
              left: trail.x,
            }}
          />
        ))}
      </div>
    );
  }
  
  export default RainbowTrail;