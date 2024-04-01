export const getRandomColor = () => {
  const getRandomHex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");

  const color = `#${getRandomHex()}${getRandomHex()}${getRandomHex()}`;

  return color;
};

export const getPoint = (
  e: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement
) => {
  const rect = canvas.getBoundingClientRect();
  let x: number;
  let y: number;
  if ("touches" in e) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
  return { x, y };
};

export const calculateColorMenuPosition = (
  elem: HTMLElement,
  e: MouseEvent | TouchEvent,
  canvas: HTMLCanvasElement
) => {
  const { x, y } = getPoint(e, canvas);
  elem.style.left = `${x}px`;
  elem.style.top = `${y}px`;
  elem.classList.remove("visually-hidden");

  let clientX: number;
  let clientY: number;
  if ("touches" in e) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  if (
    elem.clientWidth + clientX > window.innerWidth &&
    elem.clientHeight + clientY > window.innerHeight
  ) {
    elem.style.translate = `-100% -100%`;
  } else if (elem.clientWidth + clientX > window.innerWidth) {
    elem.style.translate = `-100% `;
  } else if (elem.clientHeight + clientY > window.innerHeight) {
    elem.style.translate = `0 -100%`;
  } else {
    elem.style.translate = `0`;
  }
};
