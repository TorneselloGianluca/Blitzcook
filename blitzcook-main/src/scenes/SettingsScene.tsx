import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroFlexView,
  ViroMaterials,
} from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import BlitzCookScene from "./BlitzCookScene";
import GazeImageButton from "../components/GazeImageButton";

ViroMaterials.createMaterials({
  bg: {
    diffuseTexture: require('../../assets/textures/screenBG.png'),
    diffuseColor: "rgba(255, 140, 153, 0.9)",
  },
  btnSelected: {
    diffuseColor: "#2ecc71", 
  },
  btnUnselected: {
    diffuseColor: "#ecf0f1", 
  },
  btnDisabled: {
    diffuseColor: "#bdc3c7",
  }
});

interface SettingsSceneProps {
  sceneNavigator?: any;
}

const SettingsScene = (props: SettingsSceneProps) => {
  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;

  const [isMetric, setIsMetric] = useState(true);

  const goBack = useCallback(() => {
    props.sceneNavigator.replace({ scene: BlitzCookScene, passProps: { setIsHovering: setIsHovering } });
  }, [props.sceneNavigator]);

  return (
    <ViroARScene>
      <ViroFlexView
        position={[0, 0, -4]}
        width={3.5} height={2.2}
        materials={["bg"]}
        style={styles.containerColumn}
      >

        <ViroFlexView style={styles.headerRow} width={3.5} height={0.4}>
          <GazeImageButton width={0.4} height={0.4}
            source={require("../../assets/textures/buttons/backButton.png")}
            onClick={goBack}
            onHoverChange={(hovering) => {
              if (setIsHovering) setIsHovering(hovering);
            }} position={[0, 0, 0]}
          />
          <ViroFlexView width={3} height={0.28}>
            <ViroText
              text={`SETTINGS`}
              style={styles.titleText}
              width={2.5} height={0.4}
            />
          </ViroFlexView>
        </ViroFlexView>

        {/* --- CONTENT --- */}
        <ViroFlexView style={styles.contentColumn} width={3.0} height={1.8}>

          <ViroFlexView width={3.0} height={0.6} style={styles.sectionContainer}>
            <ViroText text="LINKED ACCOUNTS" style={styles.sectionTitle} width={3} height={0.2} />

            <ViroFlexView width={2.5} height={0.6}>
              <GazeButton
                width={2.5}
                height={0.5}
                text="Amazon Account: Linked"
                onClick={() => { console.log("Already linked"); }}
                onHoverChange={setIsHovering}
                position={[0, 0, 0]}
                styleText={{ color: "green" }}
              />
            </ViroFlexView>
            <ViroText text="Automatic checkout enabled" style={styles.subText} width={3} height={0.1} />
          </ViroFlexView>
          
          <ViroFlexView width={3.0} height={0.8} style={styles.sectionContainer}>
            <ViroText text="UNITS OF MEASUREMENT" style={styles.sectionTitle} width={3} height={0.2} />

            <ViroFlexView style={styles.row} width={2.8} height={0.5}>

              {/* Tasto METRIC */}
              <ViroFlexView width={1.3} height={0.4} style={styles.toggleWrapper}>
                <GazeButton
                  width={1.2}
                  height={0.4}
                  text={isMetric ? "Metric (kg/g)" : "Metric (kg/g)"}
                  onClick={() => setIsMetric(true)}
                  onHoverChange={setIsHovering}
                  position={[0, 0, 0]}
                  styleText={{ color: isMetric ? "green" : "black", fontWeight: isMetric ? "bold" : "normal" }}
                />
              </ViroFlexView>

              {/* Tasto IMPERIAL */}
              <ViroFlexView width={1.3} height={0.5} style={styles.toggleWrapper}>
                <GazeButton
                  width={1.2}
                  height={0.4}
                  text={!isMetric ? "Imperial (lb/oz)" : "Imperial (lb/oz)"}
                  onClick={() => setIsMetric(false)}
                  onHoverChange={setIsHovering}
                  position={[0, 0, 0]}
                  styleText={{ color: !isMetric ? "green" : "black", fontWeight: !isMetric ? "bold" : "normal" }}
                />
              </ViroFlexView>

            </ViroFlexView>
          </ViroFlexView>

        </ViroFlexView>

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

const styles = StyleSheet.create({
  containerColumn: {
    flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },
  contentColumn: {
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
  },
  sectionContainer: {
    flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
  },
  toggleWrapper: {
    alignItems: 'center', justifyContent: 'center'
  },

  titleText: {
    fontFamily: "Arial", fontSize: 25, fontWeight: "bold", color: "black", textAlign: "center", textAlignVertical: "center"
  },
  sectionTitle: {
    fontFamily: "Arial", fontSize: 16, fontWeight: "bold", color: "#333", textAlign: "center", textAlignVertical: "bottom"
  },
  subText: {
    fontFamily: "Arial", fontSize: 10, color: "#666", textAlign: "center", textAlignVertical: "top"
  }
});

export default SettingsScene;