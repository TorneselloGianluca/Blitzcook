import React from "react";
import { ViroARScene, ViroFlexView, ViroMaterials, ViroText } from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import BlitzCookScene from "./BlitzCookScene";
import PepperScene from "./PepperScene";
import ReportErrorScene from "./ReportErrorScene";

interface SuccessSceneProps {
  sceneNavigator: any;
}

ViroMaterials.createMaterials({
  panelWhite: { diffuseColor: "rgba(255, 255, 255, 0.4)" },
  panelGrey: { diffuseColor: "#DDDDDD" },
});

const SuccessScene = (props: SuccessSceneProps) => {
  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;

  return (
    <ViroARScene>

      <ViroFlexView
        position={[0, 0.5, -4]}
        width={3.5}
        height={2.1}
        materials={["bg"]}
        style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingTop: 0.2 }}
      >
        {/* Title */}
        <ViroFlexView
          position={[0, 0, 0]}
          width={3}
          height={0.5}
          style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}
        >
          <ViroText
            text="Exercise Complete!"
            width={3}
            height={0.5}
            fontSize={30}
            color="#10121b"
            style={{
              textAlign: "center",
              textAlignVertical: "center"
            }}
          />
        </ViroFlexView>

        <ViroFlexView
          position={[0, 0, 0]}
          width={2.5}
          height={0.2}
          style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}
        />

        <ViroFlexView
          position={[0, 0, 0]}
          width={2.5}
          height={0.5}
          style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}
        >
          <GazeButton
            position={[0, 0, 0]}
            width={1}
            height={0.6}
            text="Home"
            styleText={{ fontSize: 28 }}
            onClick={() => props.sceneNavigator.replace({
              scene: BlitzCookScene, passProps: { setIsHovering: setIsHovering }
            })}
            onHoverChange={(hovering) => {
              if (setIsHovering) setIsHovering(hovering);
            }}
          />
          <GazeButton
            position={[0, 0, 0]}
            width={1}
            height={0.6}
            text="Report an error"
            styleText={{ fontSize: 20 }}
            onClick={() => props.sceneNavigator.replace({
              scene: ReportErrorScene, passProps: { setIsHovering: setIsHovering }
            })}
            onHoverChange={(hovering) => {
              if (setIsHovering) setIsHovering(hovering);
            }}
          />
        </ViroFlexView>

      </ViroFlexView>
    </ViroARScene>
  );
};

export default SuccessScene;
