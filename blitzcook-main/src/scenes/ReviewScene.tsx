import React from "react";
import { ViroARScene, ViroFlexView, ViroMaterials, ViroText } from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import BlitzCookScene from "./BlitzCookScene";
import PepperScene from "./PepperScene";
import GazeImageButton from "../components/GazeImageButton";

interface ReviewSceneProps {
    sceneNavigator: any;
}

ViroMaterials.createMaterials({
    panelWhite: { diffuseColor: "rgba(255, 255, 255, 0.4)" },
    panelGrey: { diffuseColor: "#DDDDDD" },
});

const ReviewScene = (props: ReviewSceneProps) => {
    const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;

    return (
        <ViroARScene>
            {/* Title */}
            <ViroFlexView
                position={[0, 0.5, -3.5]}
                width={2}
                height={0.5}
                materials={["bg"]}
                style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingTop: 0.2 }}
            >
                <ViroText
                    text="Exercise Failed"
                    width={2}
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
                height={1}
                position={[0, -0.1, -3.5]}
                fontSize={20}
                color="#cccccc"
                style={{
                    textAlign: "center",
                    textAlignVertical: "center"
                }}
            />

            <ViroFlexView
                position={[0, -0.5, -3.5]}
                width={4}
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
                    text="Review"
                    styleText={{ fontSize: 28 }}
                    onClick={() => props.sceneNavigator.replace({
                        scene: PepperScene, passProps: { setIsHovering: setIsHovering }
                    })}
                    onHoverChange={(hovering) => {
                        if (setIsHovering) setIsHovering(hovering);
                    }}
                />
            </ViroFlexView>

            <GazeImageButton
                source={require("../../assets/textures/buttons/homeIcon.png")}
                position={[0, -8, -8]}
                width={2} height={2}
                onClick={() => props.sceneNavigator.replace({ scene: BlitzCookScene, passProps: { setIsHovering } })}
                onHoverChange={setIsHovering}
            />
        </ViroARScene>
    );
};

export default ReviewScene;
