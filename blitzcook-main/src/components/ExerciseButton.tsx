import React, { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  ViroFlexView,
  ViroText,
  ViroMaterials,
  ViroImage
} from "@reactvision/react-viro";

interface ExerciseButtonProps {
  position: [number, number, number];
  width: number;
  height: number;
  text: string;
  onClick: () => void;
  onHoverChange?: (isHovering: boolean) => void;
  styleText?: any;
  opacity?: any;
  image: any;
}

const ExerciseButton: React.FC<ExerciseButtonProps> = ({
  position, width, height, text, onClick, onHoverChange, styleText, opacity, image
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
    <>
      <ViroFlexView
        width={width}
        height={height}
        style={styles.container}
        onHover={handleHover}
        opacity={opacity}
      >
        <ViroFlexView>
          <ViroImage
            source={image}
            width={width}
            height={height}
            resizeMode="ScaleToFit"
            materials={isHovering ? ["imgBtnHover"] : []}
          />
        </ViroFlexView>
      </ViroFlexView>

      <ViroFlexView
        width={width}
        height={height}
      >
        <ViroText
          text={text}
          width={displayWidth * 0.9}
          height={displayHeight * 0.9}
          scale={[1 / FONT_SCALE, 1 / FONT_SCALE, 1 / FONT_SCALE]}
          style={{
            ...styles.baseText,
            ...styleText,
            fontSize: fontSize
          }} />
      </ViroFlexView>
    </>
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
    color: "#10121b",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
  },
});

export default ExerciseButton;