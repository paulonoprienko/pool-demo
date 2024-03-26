export class Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  color: string;

  static friction: number = 0.98;
  static loss: number = 0.5;

  constructor(x: number, y: number, radius: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = 0;
    this.dy = 0;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(canvas: HTMLCanvasElement): void {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx * Ball.loss;
      this.x =
        this.x + this.radius > canvas.width
          ? canvas.width - this.radius
          : this.radius;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy * Ball.loss;
      this.y =
        this.y + this.radius > canvas.height
          ? canvas.height - this.radius
          : this.radius;
    }

    this.dx *= Ball.friction;
    this.dy *= Ball.friction;
  }

  checkCollision(ball2: Ball): void {
    const dx = this.x - ball2.x;
    const dy = this.y - ball2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.radius + ball2.radius) {
      const angle = Math.atan2(dy, dx);
      const speed1 = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      const speed2 = Math.sqrt(ball2.dx * ball2.dx + ball2.dy * ball2.dy);

      const direction1 = Math.atan2(this.dy, this.dx);
      const direction2 = Math.atan2(ball2.dy, ball2.dx);

      const velocityX1 = speed1 * Math.cos(direction1 - angle);
      let velocityY1 = speed1 * Math.sin(direction1 - angle);
      const velocityX2 = speed2 * Math.cos(direction2 - angle);
      let velocityY2 = speed2 * Math.sin(direction2 - angle);

      let final_velocityX1 =
        ((this.radius - ball2.radius) * velocityX1 +
          (ball2.radius + ball2.radius) * velocityX2) /
        (this.radius + ball2.radius);
      let final_velocityX2 =
        ((this.radius + this.radius) * velocityX1 +
          (ball2.radius - this.radius) * velocityX2) /
        (this.radius + ball2.radius);

      // Применяем коэффициент потери импульса
      final_velocityX1 *= Ball.loss;
      final_velocityX2 *= Ball.loss;
      velocityY1 *= Ball.loss;
      velocityY2 *= Ball.loss;

      this.dx =
        Math.cos(angle) * final_velocityX1 +
        Math.cos(angle + Math.PI / 2) * velocityY1;
      this.dy =
        Math.sin(angle) * final_velocityX1 +
        Math.sin(angle + Math.PI / 2) * velocityY1;
      ball2.dx =
        Math.cos(angle) * final_velocityX2 +
        Math.cos(angle + Math.PI / 2) * velocityY2;
      ball2.dy =
        Math.sin(angle) * final_velocityX2 +
        Math.sin(angle + Math.PI / 2) * velocityY2;

      // Разделяем шары после столкновения, чтобы избежать "залипания" шаров
      const overlap = 0.5 * (distance - this.radius - ball2.radius);
      this.x -= (overlap * (this.x - ball2.x)) / distance;
      this.y -= (overlap * (this.y - ball2.y)) / distance;
      ball2.x += (overlap * (this.x - ball2.x)) / distance;
      ball2.y += (overlap * (this.y - ball2.y)) / distance;
    }
  }
}
