import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const size = useWindowSize();

  return (
    <div className="App">
      <canvas
        width={size.width}
        height={size.height}
        style={{ display: "block" }}
      />
    </div>
  );
}

export default App;

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
