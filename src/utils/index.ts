export const getRandomColor = () => {
  const getRandomHex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");

  const color = `#${getRandomHex()}${getRandomHex()}${getRandomHex()}`;

  return color;
};
