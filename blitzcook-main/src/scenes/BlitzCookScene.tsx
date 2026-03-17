import React, { useCallback, useEffect, useState } from "react";
import { ViroARScene, ViroFlexView, ViroImage, ViroMaterials } from "@reactvision/react-viro";
import Voice from "@react-native-voice/voice";
import GazeButton from "../components/GazeButton";
import SettingsScene from "./SettingsScene";
import CategoryScene from "./CategoryScene";
import GazeImageButton from "../components/GazeImageButton";
import SearchScene from "./SearchScene";
import RoundGazeButton from "../components/RoundGazeButton";
import SearchBar from "../components/SearchBar";
import ShoppingListScene from "./ShoppingScene"; // Assicurati che il file si chiami ShoppingScene.tsx
import CompletedExercisesScene from "./CompletedExerciseScene";
import DailyExercisesScene from "./DailyExercisesScene";
import SendButton from "../components/SendButton";

interface BlitzCookSceneProps {
  sceneNavigator?: any;
  setIsHovering?: any;
}

const BlitzCookScene = (props: BlitzCookSceneProps = {}) => {
  const [searchText, setSearchText] = useState("What are we training for?");
  const [isListening, setIsListening] = useState(false);
  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;
  const [canSend, setCanSend] = useState(false)

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

    // Pulizia quando si smonta la scena
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

  useEffect(() => {
    if (!isListening && searchText !== "What are we training for?" && searchText.length > 0 && searchText != "Listening..." && searchText != "Please try again")
      setCanSend(true);
    else
      setCanSend(false)
  }, [isListening, searchText]);

  const handleSelection = (elementName: string) => {
    console.log(`SELECTED: ${elementName}`);
  };

  const goToDailyExercises = useCallback(() => {
    props.sceneNavigator.replace({
      scene: DailyExercisesScene,
      passProps: { searchText: "Daily Exercises", setIsHovering: setIsHovering, searching: true }
    });
  }, [props.sceneNavigator]);

  const goToTryAgain = useCallback(() => {
    props.sceneNavigator.replace({
      scene: CompletedExercisesScene,
      passProps: { searchText: "Completed Exercises", setIsHovering: setIsHovering, searching: false }
    });
  }, [props.sceneNavigator]);

  return (
    <ViroARScene>

      {/* Settings */}
      <GazeImageButton
        position={[-1.3, 0.65, -4]}
        width={0.4} height={0.4}
        source={require("../../assets/textures/buttons/settingsIcon.png")}
        onClick={() => props.sceneNavigator.replace({ scene: SettingsScene, passProps: { setIsHovering: setIsHovering } })}
        onHoverChange={(hovering) => {
          if (setIsHovering) setIsHovering(hovering);
        }}
      />

      {/* Logo */}
      <ViroImage
        position={[0, 0.8, -4]}
        source={require("../../assets/BlitzCookLogo.png")}
        width={2} height={1}
      />

      {/* --- MODIFICA EFFETTUATA QUI SOTTO --- */}
      {/* Cart Button (Apre la ShoppingListScene) */}
      <GazeImageButton
        position={[1.3, 0.65, -4]}
        width={0.4} height={0.4}
        source={require("../../assets/textures/buttons/cartIcon.png")}
        onClick={() => props.sceneNavigator.replace({ scene: ShoppingListScene, passProps: { setIsHovering: setIsHovering } })}
        onHoverChange={(hovering) => {
          if (setIsHovering) setIsHovering(hovering);
        }}
      />
      {/* ------------------------------------- */}

      {/* --- SEARCH BAR CON VOCE --- */}
      <SearchBar
        position={[-0.3, 0.13, -4]}
        width={1.205} height={0.3}
        text={searchText}
        styleText={{
          fontSize: 9,
          color: isListening ? "#d80032" : "#2b2d42"
        }}
        onClick={() => null}
      />
      {!isListening ?
        <GazeImageButton
          position={[0.45, 0.13, -4]}
          width={0.3} height={0.3}
          source={require("../../assets/textures/micIconBg.png")}
          onClick={startListening}
          onHoverChange={(hovering) => {
            if (setIsHovering) setIsHovering(hovering);
          }}
        />
        : <GazeImageButton
          position={[0.45, 0.13, -4]}
          width={0.3} height={0.3}
          source={require("../../assets/textures/micIconActiveBg.png")}
          onClick={() => null}
        />
      }

      <SendButton
        position={[0.75, 0.13, -4]}
        width={0.3} height={0.3}
        active={canSend}
        source={canSend ? require("../../assets/textures/sendIconFull.png") : require("../../assets/textures/sendIconInactive.png")}
        onClick={
          canSend ? () => props.sceneNavigator.replace({ scene: SearchScene, passProps: { searchText: searchText, searching: true, setIsHovering: setIsHovering } }) : () => null}
        onHoverChange={(hovering) => {
          if (setIsHovering) setIsHovering(hovering);
        }}
      />
      {/* Grid Buttons */}
      <GazeButton
        position={[-0.5, -0.35, -4]}
        width={0.8} height={0.35}
        text="Daily Exercises"
        styleText={{ fontSize: 13 }}
        onClick={goToDailyExercises}
        onHoverChange={(hovering) => {
          if (setIsHovering) setIsHovering(hovering);
        }}
      />

      <GazeButton
        position={[0.5, -0.35, -4]}
        width={0.8} height={0.35}
        text="Completed Exercises"
        styleText={{ fontSize: 12 }}
        onClick={goToTryAgain}
        onHoverChange={(hovering) => {
          if (setIsHovering) setIsHovering(hovering);
        }}
      />

    </ViroARScene>
  );
};

export default BlitzCookScene;