import React, { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  ViroFlexView,
  ViroText,
  ViroMaterials
} from "@reactvision/react-viro";

interface GazeButtonProps {
  position: [number, number, number];
  width: number;
  height: number;
  text: string;
  onClick: () => void;
  onHoverChange?: (isHovering: boolean) => void;
  styleText?: any;
  opacity?: any;
}

const GazeButton: React.FC<GazeButtonProps> = ({
  position, width, height, text, onClick, onHoverChange, styleText, opacity
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleHover = (hovering: boolean) => {
    if (hovering === isHovering) return;
    setIsHovering(hovering);

    if (onHoverChange) {
      onHoverChange(hovering);
    }

    if (hovering) {
      timerRef.current = setTimeout(() => {
        onClick();
        setIsHovering(false);
        if (onHoverChange) onHoverChange(false);
      }, 2900);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const FONT_SCALE = 4;
  const displayWidth = width * FONT_SCALE;
  const displayHeight = height * FONT_SCALE;
  const fontSize = (styleText?.fontSize || 20) * FONT_SCALE;

  return (
    <ViroFlexView
      width={width}
      height={height}
      style={{ ...styles.container, paddingTop: 0.3 * height }}
      materials={isHovering ? ["btnHover"] : ["btnNormal"]}
      onHover={handleHover}
      position={position}
      opacity={opacity}
    >
      <ViroText
        text={text}
        width={displayWidth*0.9}
        height={displayHeight*0.9}
        scale={[1 / FONT_SCALE, 1 / FONT_SCALE, 1 / FONT_SCALE]}
        style={{
          ...styles.baseText,
          ...styleText,
          fontSize: fontSize
        }}
      />
    </ViroFlexView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontFamily: "Arial",
    color: "#2b2d42",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
  },
});

export default GazeButton;