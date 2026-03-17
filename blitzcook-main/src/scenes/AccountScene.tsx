import React from "react";
import { ViroARScene, ViroText } from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import BlitzCookScene from "./BlitzCookScene";

const AccountScene = (props: any) => {
  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;
  
  return (
    <ViroARScene>
      {/* Title */}
      <ViroText
        text="Account"
        position={[0, 0.8, -3.5]}
        fontSize={40}
        color="#ffffff"
      />

      {/* Back Button */}
      <GazeButton
        position={[-1.3, 0.65, -3.5]}
        width={0.4}
        height={0.4}
        text="←"
        styleText={{ fontSize: 30 }}
        onClick={() => props.sceneNavigator.replace({ scene: BlitzCookScene, passProps: { setIsHovering: setIsHovering } })}
        onHoverChange={(hovering) => {
             if (setIsHovering) setIsHovering(hovering);
        }}
      />

      {/* Account info placeholder */}
      <ViroText
        text="Account information coming soon"
        position={[0, 0, -3.5]}
        fontSize={20}
        color="#cccccc"
      />
    </ViroARScene>
  );
};

export default AccountScene;
