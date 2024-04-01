import { useEffect, useRef, useState } from "react";
import { calculateColorMenuPosition, getPoint, getRandomColor } from "./utils";
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

    const handleCanvasStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      if ("button" in e && e.button === 2) {
        return;
      }

      const { x, y } = getPoint(e, canvas);

      ballsRef.current.forEach((ball, index) => {
        const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
        if (distance < ball.radius) {
          isDragging = true;
          selectedBallIndex = index;
        }
      });
    };
    const handleCanvasMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        const { x, y } = getPoint(e, canvas);
        const ball = ballsRef.current[selectedBallIndex];
        ball.dx = (x - ball.x) * 0.5;
        ball.dy = (y - ball.y) * 0.5;
      }
    };
    const handleCanvasEnd = () => {
      isDragging = false;
      selectedBallIndex = -1;
    };
    const handleContext = (e: MouseEvent) => {
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
            calculateColorMenuPosition(colorPickerRef.current, e, canvas);
          }
        }
      });
    };

    let lastTapTime = 0;

    const handleDoubleTap = (e: TouchEvent) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;
      if (tapLength < 300 && tapLength > 0 && colorPickerRef.current) {
        calculateColorMenuPosition(colorPickerRef.current, e, canvas);
      }
      lastTapTime = currentTime;
    };

    canvas.addEventListener("mousedown", handleCanvasStart);
    canvas.addEventListener("mousemove", handleCanvasMove);
    canvas.addEventListener("mouseup", handleCanvasEnd);
    canvas.addEventListener("contextmenu", handleContext);

    canvas.addEventListener("touchstart", handleCanvasStart);
    canvas.addEventListener("touchmove", handleCanvasMove);
    canvas.addEventListener("touchend", handleCanvasEnd);
    canvas.addEventListener("touchstart", handleDoubleTap);

    animate();

    return () => {
      canvas.removeEventListener("mousedown", handleCanvasStart);
      canvas.removeEventListener("mousemove", handleCanvasMove);
      canvas.removeEventListener("mouseup", handleCanvasEnd);
      canvas.removeEventListener("touchstart", handleCanvasStart);
      canvas.removeEventListener("touchmove", handleCanvasMove);
      canvas.removeEventListener("touchend", handleCanvasEnd);
      canvas.removeEventListener("contextmenu", handleContext);
      canvas.removeEventListener("touchstart", handleDoubleTap);
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
