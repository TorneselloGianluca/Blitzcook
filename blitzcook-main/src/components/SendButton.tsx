import React, { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  ViroFlexView,
  ViroImage,
  ViroMaterials
} from "@reactvision/react-viro";

interface GazeImageButtonProps {
  position: [number, number, number];
  width: number;
  height: number;
  source: any;
  onClick: () => void;
  onHoverChange?: (isHovering: boolean) => void;
  styleImage?: any;
  opacity?: any;
  active: boolean;
}

const SendButton: React.FC<GazeImageButtonProps> = ({
  position, width, height, source, onClick, onHoverChange, styleImage, opacity, active
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

  return (
    <ViroFlexView
      width={width}
      height={height}
      style={styles.container}
      onHover={handleHover}
      position={position}
      opacity={opacity}
    >
      <ViroImage
        source={source}
        width={width}
        height={height}
        resizeMode="ScaleToFit"
        style={styleImage}
        materials={isHovering && active ? ["btnHover"] : []}
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
});

export default SendButton;