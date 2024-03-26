import { useEffect, useRef, useState } from "react";
import { getRandomColor } from "./utils";
import { Ball } from "./ball";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const ballsRef = useRef<Ball[]>([]);

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

    canvas.addEventListener("mousedown", (e) => {
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
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ball = ballsRef.current[selectedBallIndex];
        ball.dx = (x - ball.x) * 0.5;
        ball.dy = (y - ball.y) * 0.5;
      }
    });

    canvas.addEventListener("mouseup", () => {
      isDragging = false;
      selectedBallIndex = -1;
    });

    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ballsRef.current.forEach((ball, index) => {
        const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
        if (distance < ball.radius) {
          setSelectedBallIndex(index);
          setCurrentColor(ballsRef.current[index].color);
        }
      });
    });

    animate();
  }, []);

  useEffect(() => {
    if (currentColor && colorInputRef.current) {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      colorInputRef.current.dispatchEvent(clickEvent);
    }
  }, [currentColor]);

  return (
    <>
      <input
        type="color"
        className="visually-hidden color-input"
        onChange={(e) => {
          ballsRef.current[selectedBallIndex].color = e.target.value;
        }}
        ref={colorInputRef}
        value={currentColor}
      />
      <canvas ref={canvasRef} width="800" height="500"></canvas>
    </>
  );
}

export default App;
