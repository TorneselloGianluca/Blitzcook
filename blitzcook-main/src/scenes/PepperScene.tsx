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
  ViroBox,
  ViroImage,
  ViroParticleEmitter,
} from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import GameOverScene from "./GameOverScene";
import RecipeDetailScene from "./RecipeDetailsScene";
import SuccessScene from "./SuccessScene";
import GazeImageButton from "../components/GazeImageButton";

ViroMaterials.createMaterials({
  hudBackground: {
    diffuseColor: "rgba(255, 255, 255, 0.2)",
  },
  promptMaterial: {
    diffuseColor: "rgba(255, 255, 255, 0.2)",
  },
  panFlame: {
    diffuseColor: "hsla(7, 100%, 64%, 0.80)",
  },
});

interface CookingSceneProps {
  sceneNavigator: ViroARSceneNavigator;
}

const PepperScene = (props: CookingSceneProps) => {
  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;
  // --- TIMER ---
  const [secondsLeft, setSecondsLeft] = useState(2 * 60); // 2 minutes

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    if ((props.sceneNavigator as any).viroAppProps?.setTopText) {
      (props.sceneNavigator as any).viroAppProps.setTopText("Frame the pan Code and the Pepper code to start the exercise!");
    }
  }, []);

  const [pepperTracking, setPepperTracking] = useState(false);
  const [panTracking, setPanTracking] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [cookingTimer, setCookingTimer] = useState(20);
  const [pepperStatus, setPepperStatus] = useState(0);
  const [cooking, setCooking] = useState(false);

  const [quitting, setQuitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (exerciseStarted) {
        setSecondsLeft((prev) => {
          const nextValue = prev <= 0 ? 0 : prev - 1;

          if ((props.sceneNavigator as any).viroAppProps?.setTopText) {
            (props.sceneNavigator as any).viroAppProps.setTopText("");
          }

          if (nextValue === 0) {
            clearInterval(timer);
            props.sceneNavigator.replace({
              scene: GameOverScene,
              passProps: { message: "Time's up!", setIsHovering: setIsHovering, }
            });
          }

          return nextValue;
        });
      }
    }, 1000); return () => clearInterval(timer);
  }, [exerciseStarted]);

  useEffect(() => {
    console.log("TRACKING PEPPER: " + pepperTracking)
  }, [pepperTracking]);


  useEffect(() => {
    console.log("TRACKING PAN: " + panTracking)
  }, [panTracking]);

  useEffect(() => {
    if (pepperTracking && panTracking && !exerciseStarted) {
      setExerciseStarted(true);
    }
    if (pepperTracking && !panTracking && exerciseStarted) {
      setCooking(true);
    } else {
      setCooking(false);
    }
    if (pepperTracking && panTracking && exerciseStarted && cookingTimer > 0 && cookingTimer < 10) {
      props.sceneNavigator.replace({
        scene: SuccessScene,
        passProps: { setIsHovering: setIsHovering }
      });
    }
  }, [pepperTracking, panTracking, cookingTimer]);

  useEffect(() => {
    if (cooking) {
      const timer = setInterval(() => {
        setCookingTimer((prev) => {
          console.log(prev);
          if (prev >= 0 && prev < 10) {
            setPepperStatus(1);
          }
          if (prev <= 0) {
            setCooking(false);
            props.sceneNavigator.replace({
              scene: GameOverScene,
              passProps: { message: "You burnt the pepper!", setIsHovering: setIsHovering, }
            });
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooking]);

  const handleQuit = useCallback(() => {
    props.sceneNavigator.replace({
      scene: RecipeDetailScene,
      passProps: {
        recipeName: "Roasted Peppers",
        recipeDescription: "Roast a red bell pepper, making sure not to burn it!",
        recipeIngredients: ["1 Red Bell Pepper"],
        recipeDifficulty: 1,
        recipeTime: 1,
        setIsHovering: setIsHovering
      }
    });
  }, [props.sceneNavigator]);

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
        {pepperStatus === 1 ?
          <Viro3DObject
            source={require('../../assets/models/cooked-bell-pepper/scene.gltf')}
            position={[0.0, 0.0, 0]}
            scale={[0.01, 0.01, 0.01]}
            type="GLTF"
          />
          :

          <Viro3DObject
            source={require('../../assets/models/red-bell-pepper/scene.gltf')}
            position={[0.0, 0.0, 0]}
            scale={[0.01, 0.01, 0.01]}
            type="GLTF"
          />
        }
        <ViroParticleEmitter
          position={[0, 0, 0]}
          duration={1000}
          visible={true}
          run={cooking} // Emitting only if cooking
          loop={true}
          fixedToEmitter={true}
          image={{
            source: require("../../assets/textures/smoke.png"),
            height: 0.3,
            width: 0.3,
            bloomThreshold: -1.0
          }}
          spawnBehavior={{
            particleLifetime: [500, 1000],
            emissionRatePerSecond: [15, 20], // Smoke quantity
            spawnVolume: {
              shape: "box",
              params: [0.1, 0, 0.1],
              spawnOnSurface: false
            },
            maxParticles: 50
          }}
          particleAppearance={{
            opacity: {
              initialRange: [0.1, 0.1],
              interpolation: [
                { endValue: 0.0, interval: [0, 1000] } // Disappearing
              ]
            },
            scale: {
              initialRange: [[0.2, 0.2, 0.2], [0.22, 0.22, 0.22]],
              interpolation: [
                { endValue: [0.1, 0.1, 0.1], interval: [0, 1500] } // Growing while rising
              ]
            }
          }}
          particlePhysics={{
            velocity: {
              initialRange: [[-0.02, 0.1, -0.02], [0.02, 0.2, 0.02]] // Rising
            },
          }}
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
        <ViroBox
          position={[0, 0, 0]}
          scale={[0.1, 0.001, 0.1]}
          materials={["panFlame"]}
        />
      </ViroARImageMarker>

      <ViroFlexView
        style={styles.hudContainer}
        position={[0, 0.8, -4]}
        width={3.8}
        height={0.49}
        materials={["hudBackground"]}
      >

        {/* HINT BUTTON */}
        <ViroFlexView style={styles.leftSection} width={0.6} height={0.6}>
          <GazeImageButton
            position={[-0, 0, 0]}
            width={0.5}
            height={0.5}
            source={showHint ? require("../../assets/textures/buttons/closeHintIcon.png") : require("../../assets/textures/buttons/hintIcon.png")}
            styleImage={{ resizeMode: "contain" }}
            onClick={setShowHint.bind(null, (prev) => !prev)}
            onHoverChange={(hovering) => {
              if (setIsHovering) setIsHovering(hovering);
            }}
          />
        </ViroFlexView>

        <ViroFlexView style={styles.centerSection} width={0.9} height={0.5}>
          <ViroImage
            source={require("../../assets/textures/timer.png")}
            width={0.35}
            height={0.32}
            transformBehaviors={["billboard"]}
          />
          <ViroText
            text={formatTime(secondsLeft)}
            style={styles.timerText}
            width={0.5}
            height={0.52}
            transformBehaviors={["billboard"]}
          />
        </ViroFlexView>

        {/* QUIT */}
        <ViroFlexView style={styles.rightSection} width={0.9} height={0.6}>
          <GazeButton
            position={[0, 0, 0]}
            width={0.9}
            height={0.5}
            text="QUIT"
            styleText={{ fontSize: 30, color: "red", fontWeight: "bold" }}
            onClick={() => setQuitting(true)}
            onHoverChange={(hovering) => {
              if (setIsHovering) setIsHovering(hovering);
            }}
          />
        </ViroFlexView>

      </ViroFlexView>

      {quitting && (
        <ViroFlexView width={2} height={1.2}
          materials={["bg"]}
          position={[0, -0.4, -3.5]}
          style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}
        >
          <ViroText
            text="Are you sure you want to quit?"
            width={2}
            height={0.5}
            style={{ color: "#2b2d42", fontSize: 16, textAlign: "center" }}
            transformBehaviors={["billboard"]}
          />
          <ViroFlexView width={1.8} height={0.5}
            position={[0, 0, 0]}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <GazeButton
              position={[0, 0, 0]}
              width={0.8}
              height={0.4}
              text="Cancel"
              styleText={{ fontSize: 20 }}
              onClick={() => setQuitting(false)}
              onHoverChange={(hovering) => {
                if (setIsHovering) setIsHovering(hovering);
              }}
            />
            <GazeButton
              position={[0, 0, 0]}
              width={0.8}
              height={0.4}
              text="Quit"
              styleText={{ fontSize: 20, color: "red", fontWeight: "bold" }}
              onClick={() => handleQuit()}
              onHoverChange={(hovering) => {
                if (setIsHovering) setIsHovering(hovering);
              }}
            />
          </ViroFlexView>
        </ViroFlexView>
      )}

      {showHint && (
        <ViroFlexView width={2} height={1}
          materials={["bg"]}
          position={[0, -0.2, -4]}
        >
          <ViroText
            text="Pay attention to visual clues: when the pepper starts to cook, it changes color and smoke appears."
            width={2}
            height={1}
            style={{ color: "#2b2d42", fontSize: 16, textAlign: "center" }}
            transformBehaviors={["billboard"]}
          />

        </ViroFlexView>
      )}
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
    paddingRight: 0.5
  },
  centerSection: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  rightSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 0.5
  },
  timerText: {
    fontFamily: "Arial",
    fontSize: 8 * 4,
    color: "#2b2d42",
    fontWeight: "bold"
  }
});



export default PepperScene;