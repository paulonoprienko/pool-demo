import { useEffect, useRef, useState } from "react";
import { getRandomColor } from "./utils";
import { Ball } from "./ball";
import { ColorResult } from "react-color";
import "./App.css";
import ColorMenu from "./ColorMenu";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);

  const colorPickerRef = useRef<HTMLDivElement>(null);

  const [selectedBallIndex, setSelectedBallIndex] = useState(-1);
  const [currentColor, setCurrentColor] = useState("");

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isDragging: boolean = false;
    let selectedBallIndex = -1;

    const createBalls = () => {
      const newBalls: Ball[] = [];
      for (let i = 0; i < 5; i++) {
        const radius = Math.random() * 10 + 30;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = getRandomColor();
        newBalls.push(new Ball(x, y, radius, color));
      }
      ballsRef.current = newBalls;
    };

    createBalls();

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ballsRef.current.forEach((ball, i) => {
        ball.draw(ctx);
        ball.update(canvas);
        // Проверка столкновения
        for (let j = i + 1; j < ballsRef.current.length; j++) {
          ball.checkCollision(ballsRef.current[j]);
        }
      });
      requestAnimationFrame(animate);
    };

    const canvasMousedownListener = (e: MouseEvent) => {
      if (e.button === 2) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ballsRef.current.forEach((ball, index) => {
        const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
        if (distance < ball.radius) {
          isDragging = true;
          selectedBallIndex = index;
        }
      });
    };
    const canvasMousemoveListener = (e: MouseEvent) => {
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ball = ballsRef.current[selectedBallIndex];
        ball.dx = (x - ball.x) * 0.5;
        ball.dy = (y - ball.y) * 0.5;
      }
    };
    const canvasMouseupListener = () => {
      isDragging = false;
      selectedBallIndex = -1;
    };
    const canvasContextListener = (e: MouseEvent) => {
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ballsRef.current.forEach((ball, index) => {
        const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
        if (distance < ball.radius) {
          setSelectedBallIndex(index);
          setCurrentColor(ballsRef.current[index].color);
          if (colorPickerRef.current) {
            colorPickerRef.current.style.left = `${x}px`;
            colorPickerRef.current.style.top = `${y}px`;
            colorPickerRef.current.classList.remove("visually-hidden");
            if (
              colorPickerRef.current.clientWidth + e.clientX >
                window.innerWidth &&
              colorPickerRef.current.clientHeight + e.clientY >
                window.innerHeight
            ) {
              colorPickerRef.current.style.translate = `-100% -100%`;
            } else if (
              colorPickerRef.current.clientWidth + e.clientX >
              window.innerWidth
            ) {
              colorPickerRef.current.style.translate = `-100% `;
            } else if (
              colorPickerRef.current.clientHeight + e.clientY >
              window.innerHeight
            ) {
              colorPickerRef.current.style.translate = `0 -100%`;
            } else {
              colorPickerRef.current.style.translate = `0`;
            }
          }
        }
      });
    };

    canvas.addEventListener("mousedown", canvasMousedownListener);
    canvas.addEventListener("mousemove", canvasMousemoveListener);
    canvas.addEventListener("mouseup", canvasMouseupListener);
    canvas.addEventListener("contextmenu", canvasContextListener);

    animate();

    return () => {
      canvas.removeEventListener("mousedown", canvasMousedownListener);
      canvas.removeEventListener("mousemove", canvasMousemoveListener);
      canvas.removeEventListener("mouseup", canvasMouseupListener);
      canvas.removeEventListener("contextmenu", canvasContextListener);
    };
  }, []);

  const changeColorHandler = (color: ColorResult) => {
    setCurrentColor(color.hex);
    ballsRef.current[selectedBallIndex].color = color.hex;
  };

  return (
    <>
      <div className="canvas-wrapper">
        <ColorMenu
          colorPickerRef={colorPickerRef}
          currentColor={currentColor}
          resetBallIndex={() => setSelectedBallIndex(-1)}
          changeColorHandler={changeColorHandler}
        />
        <canvas ref={canvasRef} width="800" height="500"></canvas>
      </div>
    </>
  );
}

export default App;
