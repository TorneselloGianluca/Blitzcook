import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroFlexView,
  ViroMaterials,
  ViroARSceneNavigator,
  ViroCamera,
  Viro3DObject,
  ViroAmbientLight,
  ViroARImageMarker,
  ViroARTrackingTargets,
} from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import BlitzCookScene from "./BlitzCookScene";
import RoundGazeButton from "../components/RoundGazeButton";
import GazeImageButton from "../components/GazeImageButton";

interface CookingSceneProps {
  sceneNavigator: ViroARSceneNavigator;
  setTime: any;
}

const CookingScene = (props: CookingSceneProps) => {
  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;

  // --- TIMER ---
  const [secondsLeft, setSecondsLeft] = useState(20 * 60); // 20 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  const [pepperTracking, setPepperTracking] = useState(false);
  const [panTracking, setPanTracking] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [cookingTimer, setCookingTimer] = useState(10);

  useEffect(() => {
    console.log("TRACKING PEPPER: " + pepperTracking)
  }, [pepperTracking]);


  useEffect(() => {
    console.log("TRACKING PAN: " + panTracking)
  }, [panTracking]);

  useEffect(() => {
    if (pepperTracking && panTracking && !exerciseStarted) {
      console.log("EXERCISE STARTED");
      setExerciseStarted(true);
    }
  }, [pepperTracking, panTracking]);

  useEffect(() => {
    if (exerciseStarted) {
      console.log("COOKING TIMER STARTED");
      const timer = setInterval(() => {
        setCookingTimer((prev) => {
          if (prev <= 0) {
            console.log("COOKING COMPLETE!");
          }
          if (prev <= -5) {
            console.log("YOU BURNT THE PEPPER!");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [exerciseStarted]);


  const handleQuit = useCallback(() => {
    props.sceneNavigator.replace({
      scene: BlitzCookScene,
      passProps: { setIsHovering: setIsHovering }
    });
  }, [props.sceneNavigator]);

  const handleHint = useCallback(() => {
    console.log("SHOW HINT");
  }, []);

  const TIMER_SCALE_FACTOR = 4;

  return (
    <ViroARScene>
      {/* HUD CONTAINER */}

      <ViroAmbientLight color="#FFFFFF" />
      <ViroARImageMarker target={"pepperMarker"}
        onAnchorUpdated={(anchor) => {
          if (anchor.trackingMethod === 'tracking') {
            setPepperTracking(true);
          }
          else {
            setPepperTracking(false);
          }
        }}>
        <Viro3DObject
          source={require('../../assets/models/red-bell-pepper/scene.gltf')}
          position={[0.0, 0.0, 0]}
          scale={[0.02, 0.02, 0.02]}
          type="GLTF"
        />
      </ViroARImageMarker>

      <ViroARImageMarker target={"panMarker"}
        onAnchorUpdated={(anchor) => {
          if (anchor.trackingMethod === 'tracking') {
            setPanTracking(true);
          }
          else {
            setPanTracking(false);
          }
        }}>
      </ViroARImageMarker>


      <ViroFlexView
        style={styles.hudContainer}
        position={[0, 0.2, -5]}
        width={3}
        height={0.5}
        materials={["hudBackground"]}
      >

        {/* HINT BUTTON */}
        <ViroFlexView style={styles.leftSection} width={0.8} height={0.5}>
          <GazeImageButton
            position={[0, 0, 0]}
            width={0.3}
            height={0.3}
            source={require("../../assets/textures/buttons/hintIcon.png")}
            onClick={handleHint}
            onHoverChange={(hovering) => {
              if (setIsHovering) setIsHovering(hovering);
            }}
          />
        </ViroFlexView>

        {/* QUIT */}
        <ViroFlexView style={styles.rightSection} width={0.8} height={0.5}>
          <GazeButton
            position={[0, 0, 0]}
            width={0.6}
            height={0.3}
            text="QUIT"
            styleText={{ fontSize: 16, color: "red", fontWeight: "bold" }}
            onClick={handleQuit}
            onHoverChange={(hovering) => {
              if (setIsHovering) setIsHovering(hovering);
            }}
          />
        </ViroFlexView>

      </ViroFlexView>

    </ViroARScene>
  );
};

ViroARTrackingTargets.createTargets({
  "pepperMarker": {
    source: require('../../assets/pepperCode.jpg'),
    orientation: "Up",
    physicalWidth: 0.08 // real world width in meters  
  },
});

ViroARTrackingTargets.createTargets({
  "panMarker": {
    source: require('../../assets/panCode.png'),
    orientation: "Up",
    physicalWidth: 0.08 // real world width in meters  
  },
});

const styles = StyleSheet.create({
  hudContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  rightSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontFamily: "Arial",
    fontSize: 40 * 4,
    color: "#10121b",
    fontWeight: "bold",
    textAlignVertical: "center",
    textAlign: "center",
  },
});



export default CookingScene;