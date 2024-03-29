import { RefObject, useEffect } from "react";
import { ChromePicker, ColorChangeHandler } from "react-color";

type Props = {
  colorPickerRef: RefObject<HTMLDivElement>;
  currentColor: string;
  resetBallIndex: () => void;
  changeColorHandler: ColorChangeHandler;
};

const ColorMenu = ({
  colorPickerRef,
  currentColor,
  resetBallIndex,
  changeColorHandler,
}: Props) => {
  const closeEventHandler = (e: MouseEvent) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(e.target as Node)
    ) {
      colorPickerRef.current.classList.add("visually-hidden");
      resetBallIndex();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeEventHandler);
    return () => {
      document.removeEventListener("mousedown", closeEventHandler);
    };
  }, []);

  return (
    <div
      ref={colorPickerRef}
      style={{ position: "absolute" }}
      className="visually-hidden color-input"
    >
      <ChromePicker
        color={currentColor}
        onChange={changeColorHandler}
        disableAlpha
      />
    </div>
  );
};

export default ColorMenu;
