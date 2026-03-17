import React from "react";
import { ViroARScene, ViroFlexView, ViroMaterials, ViroText } from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import BlitzCookScene from "./BlitzCookScene";
import PepperScene from "./PepperScene";
import ReportErrorScene from "./ReportErrorScene";

interface GameOverSceneProps {
  sceneNavigator: any;
  message?: string;
}

ViroMaterials.createMaterials({
  panelWhite: { diffuseColor: "rgba(255, 255, 255, 0.4)" },
  panelGrey: { diffuseColor: "#DDDDDD" },
});

const GameOverScene = (props: GameOverSceneProps) => {
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
            text="Exercise Failed"
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
        <ViroText
          text={props.message || "Exercise Ended"}
          width={2}
          height={0.5}
          position={[0, -0.1, -3.5]}
          fontSize={20}
          color="#cccccc"
          style={{
            textAlign: "center",
            textAlignVertical: "center"
          }}
        />

        <ViroFlexView
          position={[0, 0, 0]}
          width={3.4}
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
            text="Try Again"
            styleText={{ fontSize: 20 }}
            onClick={() => props.sceneNavigator.replace({
              scene: PepperScene, passProps: { setIsHovering: setIsHovering }
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

export default GameOverScene;
