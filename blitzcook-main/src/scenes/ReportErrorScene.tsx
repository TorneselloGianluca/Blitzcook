import React, { useEffect, useState } from "react";
import { ViroARScene, ViroFlexView, ViroMaterials, ViroText, ViroNode } from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import BlitzCookScene from "./BlitzCookScene";
import ReviewBox from "../components/ReviewBox";
import GazeImageButton from "../components/GazeImageButton";
import Voice from "@react-native-voice/voice";
import SuccessScene from "./SuccessScene";

interface ReportErrorSceneProps {
    sceneNavigator: any;
}

ViroMaterials.createMaterials({
    panelWhite: { diffuseColor: "rgba(255, 255, 255, 0.4)" },
    panelGrey: { diffuseColor: "#DDDDDD" }
});

const ReportErrorScene = (props: ReportErrorSceneProps) => {
    const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;

    const [searchText, setSearchText] = useState("What was wrong in the exercise?");
    const [isListening, setIsListening] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    useEffect(() => {
        Voice.onSpeechStart = () => setIsListening(true);
        Voice.onSpeechEnd = () => setIsListening(false);
        Voice.onSpeechResults = (e: any) => {
            if (e.value && e.value.length > 0) {
                setSearchText(e.value[0]);
                console.log("Heard:", e.value[0]);
            } else {
                setSearchText("Please try again");
            }
        };

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const startListening = async () => {
        try {
            setSearchText("Listening...");
            await Voice.start('en-US');
        } catch (e) {
            console.error(e);
        }
    };

    // Funzione per gestire l'invio e il redirect
    const handleSubmit = () => {
        setIsSubmitted(true);
        if (setIsHovering) setIsHovering(false); // Resetta hover per evitare click accidentali

        setTimeout(() => {
            props.sceneNavigator.replace({
                scene: BlitzCookScene,
                passProps: { setIsHovering: setIsHovering }
            });
        }, 3000);
    };

    return (
        <ViroARScene>
            {!isSubmitted ? (
                <>
                    {/* Title */}
                    <ViroFlexView
                        position={[0, 1.3, -4]}
                        width={2.2}
                        height={0.5}
                        materials={["bg"]}
                        style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", paddingTop: 0.2 }}
                    >
                        <ViroText
                            text="Report an error"
                            width={10}
                            height={10}
                            fontSize={120}
                            scale={[0.25, 0.25, 0.25]}
                            color="#10121b"
                            style={{ textAlign: "center", textAlignVertical: "center" }}
                        />
                    </ViroFlexView>

                    <ReviewBox
                        position={[0, 0.2, -4]}
                        width={2.6} height={1.5}
                        text={searchText}
                        styleText={{
                            fontSize: 14,
                            color: isListening ? "#d80032" : "#2b2d42"
                        }}
                        onClick={() => null}
                    />

                    {!isListening ? (
                        <GazeImageButton
                            position={[0, -0.36, -3.9]}
                            width={0.3} height={0.3}
                            source={require("../../assets/textures/micIcon.png")}
                            onClick={startListening}
                            onHoverChange={(hovering) => {
                                if (setIsHovering) setIsHovering(hovering);
                            }}
                        />
                    ) : (
                        <GazeImageButton
                            position={[0, -0.36, -3.9]}
                            width={0.3} height={0.3}
                            source={require("../../assets/textures/micIconActive.png")}
                            onClick={() => null}
                        />
                    )}

                    <ViroFlexView
                        position={[0, -0.9, -4]}
                        width={2.6}
                        height={0.5}
                        style={{ alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}
                    >
                        <GazeButton
                            position={[0, 0, 0]}
                            width={1}
                            height={0.6}
                            text="Cancel"
                            styleText={{ fontSize: 20 }}
                            onClick={() => props.sceneNavigator.replace({
                                scene: SuccessScene, passProps: { setIsHovering: setIsHovering }
                            })}
                            onHoverChange={(hovering) => {
                                if (setIsHovering) setIsHovering(hovering);
                            }}
                        />

                        {/* Logica abilitazione pulsante Submit */}
                        {!isListening && searchText !== "What was wrong in the exercise?" && searchText.length > 0 && searchText !== "Listening..." && searchText !== "Please try again" ? (
                            <GazeButton
                                position={[0, 0, 0]}
                                width={1}
                                height={0.6}
                                text="Submit"
                                styleText={{ fontSize: 20 }}
                                onClick={handleSubmit} // Chiama la nuova funzione
                                onHoverChange={(hovering) => {
                                    if (setIsHovering) setIsHovering(hovering);
                                }}
                            />
                        ) : (
                            <GazeButton
                                position={[0, 0, 0]}
                                width={1}
                                height={0.6}
                                text="Submit"
                                opacity={0.5}
                                styleText={{ fontSize: 20 }}
                                onClick={() => null}
                            />
                        )}
                    </ViroFlexView>
                </>
            ) : (
                <>
                    <ViroFlexView
                        position={[0, 0, -4]}
                        width={3.5} height={2.1}
                        materials={["bg"]}
                        style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}
                    >
                    </ViroFlexView>

                    <ViroText
                        text="Thank you for your feedback!"
                        width={12}
                        height={1}
                        scale={[0.26, 0.26, 0.26]}
                        position={[0, 0.35, -3.9]}
                        style={{ fontFamily: "Arial", fontSize: 84, fontWeight: "bold", color: "white", textAlign: "center" }}
                    />
                    <ViroText
                        text="Future exercises will take your report into account!"
                        width={12}
                        height={2.1}
                        scale={[0.25, 0.25, 0.25]}
                        position={[0, -0.2, -3.9]}
                        style={{ fontFamily: "Arial", fontSize: 60, color: "white", textAlign: "center" }}
                    />
                </>
            )}

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

export default ReportErrorScene;