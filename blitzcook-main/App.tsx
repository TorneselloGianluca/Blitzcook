import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Animated, Easing } from "react-native";
import { ViroARSceneNavigator, ViroMaterials } from "@reactvision/react-viro";
import BlitzCookScene from "./src/scenes/BlitzCookScene";
import { Text } from "react-native-elements";
import { dbService } from "./database.ts";
import CategoryScene from "./src/scenes/CategoryScene";
import SearchScene from "./src/scenes/SearchScene";
import PepperScene from "./src/scenes/PepperScene";
import ReportErrorScene from "./src/scenes/ReportErrorScene";
import ReviewScene from "./src/scenes/ReviewScene";
import RecipeDetailScene from "./src/scenes/RecipeDetailsScene.tsx";
import SuccessScene from "./src/scenes/SuccessScene.tsx";
import GameOverScene from "./src/scenes/GameOverScene.tsx";

const CursorLoader = ({ loading }: { loading: boolean }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 2900,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else {
      animatedValue.setValue(0);
    }
  }, [loading, animatedValue]);

  const scale = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  if (!loading) return null;

  return (
    <View style={styles.loaderContainer}>
      <Animated.View style={[styles.loaderRing, { transform: [{ scale }] }]} />
    </View>
  );
};

export default function App() {
  const [topText, setTopText] = useState<string>("");
  const [isHovering, setIsHovering] = useState<boolean>(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        await dbService.createTables();
        await dbService.seedData();
      } catch (e) {
        console.error(e);
      }
    };
    initDB();
  }, []);

  return (
    <View style={styles.f1}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{ scene: BlitzCookScene }}
        viroAppProps={{
          setTopText,
          setIsHovering,
        }}
        style={styles.f1}
      />

      {topText !== "" && (
        <View style={styles.screenOverlay}>
          <View style={styles.timerBadge}>
            <Text style={styles.time}>{topText}</Text>
          </View>
        </View>
      )}

      <View style={styles.crosshairContainer}>
        <CursorLoader loading={isHovering} />
        <View style={styles.crosshairDot} />
      </View>
    </View>
  );
}

ViroMaterials.createMaterials({
  cardBackground: { diffuseColor: "#FFFFFF" },
  bg: {
    diffuseTexture: require('./assets/textures/screenBG.png'),
    diffuseColor: "rgba(141, 153, 174, 0.81)",
  },
  bgCrop: {
    diffuseTexture: require('./assets/textures/screenBGCrop.png'),
    diffuseColor: "rgba(141, 153, 174, 0.81)",
  },
  btnNormal: {
    diffuseTexture: require('./assets/textures/buttonBG.png'),
    diffuseColor: "rgba(255, 255, 255, 1)"
  },
  btnHover: {
    diffuseTexture: require('./assets/textures/buttonBG.png'),
    diffuseColor: "rgba(202, 207, 210, 1)",
  },
  imgBtnHover: {
    diffuseColor: "rgba(202, 207, 210, 1)",
  },
  reviewBox: {
    diffuseTexture: require('./assets/textures/screenBG.png')
  },
  btnNormalRound: {
    diffuseTexture: require('./assets/textures/roundButtonBG.png'),
    diffuseColor: "rgba(255, 255, 255, 1)"
  },
  btnHoverRound: {
    diffuseTexture: require('./assets/textures/roundButtonBG.png'),
    diffuseColor: "rgba(202, 207, 210, 1)",
  },
  searchBar: {
    diffuseTexture: require('./assets/textures/searchBar1.png')
  },
  hudBackground: {
    diffuseColor: "rgba(255, 255, 255, 0.8)",
  },
});

const styles = StyleSheet.create({
  f1: { flex: 1 },
  crosshairContainer: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", alignItems: "center", pointerEvents: "none", zIndex: 1,
  },
  crosshairDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: "#d80032",
    borderWidth: 1, borderColor: "white", zIndex: 2,
  },
  loaderContainer: {
    position: "absolute", justifyContent: "center", alignItems: "center", width: 60, height: 60,
  },
  loaderRing: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: "rgba(255, 215, 0, 0.6)",
    borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.8)", position: "absolute", zIndex: 1,
  },
  screenOverlay: { position: "absolute", top: 0, width: "100%", alignItems: "center", zIndex: 0 },
  timerBadge: { backgroundColor: "rgba(0,0,0,0.7)", padding: 15, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  time: { color: "white", fontSize: 24, fontWeight: "bold" },
});