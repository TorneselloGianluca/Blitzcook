import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroFlexView,
  ViroMaterials,
  ViroARSceneNavigator,
  ViroImage,
  ViroAnimatedImage,
} from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import RecipeDetailScene from "./RecipeDetailsScene";
import BlitzCookScene from "./BlitzCookScene";
import RoundGazeButton from "../components/RoundGazeButton";
import GazeImageButton from "../components/GazeImageButton";

ViroMaterials.createMaterials({
  cardBackground: { diffuseColor: "#FFFFFF" },
});

interface SearchSceneProps {
  sceneNavigator?: any;
  searchText?: string;
  searching?: boolean;
}

const DailyExercisesScene = (props: SearchSceneProps) => {
  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;

  const categoryTitle = props.searchText || "UNKNOWN";
  const [showLoading, setShowLoading] = useState(props.searching);
  const [animTimer, setAnimTimer] = useState(0);

  useEffect(() => {
    if (props.searching) {
      setShowLoading(true);
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [props.searching]);

  const goBack = useCallback(() => {
    props.sceneNavigator.replace({ scene: BlitzCookScene, passProps: { setIsHovering: setIsHovering } });
  }, [props.sceneNavigator]);

  const selectRecipe = useCallback((recipeName: string) => {
    props.sceneNavigator.replace({
      scene: RecipeDetailScene,
      passProps: { recipeName: recipeName, setIsHovering: setIsHovering }
    });
  }, [props.sceneNavigator]);

  if (showLoading) {
    return (
      <ViroARScene>
        <ViroFlexView
          position={[0, 0, -4]}
          width={3.5} height={2.1}
          materials={["bg"]}
          style={styles.loading}
        >
          <ViroText
            text="Generating the right exercises, just for you..."
            style={styles.loadingText}
            width={13} height={1.9}
            scale={[0.25, 0.25, 0.25]}
          />
        </ViroFlexView>
        <ViroAnimatedImage
          source={require("../../assets/textures/loading.gif")}
          position={[0, -0.5, -3.9]}
          width={0.4}
          height={0.4}
        />
      </ViroARScene>
    );
  }

  return (
    <ViroARScene>

      <ViroFlexView
        position={[0, 0, -4]}
        width={3.5} height={2.1}
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

          {/* Category Title */}

          <ViroFlexView
            width={3}
            height={0.28}>
            <ViroText
              text={`${categoryTitle}`}
              style={styles.titleText}
              width={2.5} height={0.28}
            />
          </ViroFlexView>

        </ViroFlexView>

        <ViroText
          text="These exercises are unverified and might be inaccurate"
          style={styles.subHeader}
          width={3} height={0.25}
        />

        {/* GRID CONTAINER */}
        <ViroFlexView
          width={3.2} height={1.6}
          style={styles.gridContainer}
        >
          {/* ROW 1 */}
          <ViroFlexView style={styles.row} width={2.6} height={0.7}>
            <GazeImageButton
              position={[0, 0, 0]} width={0.9} height={0.7}
              onClick={
                () =>
                  props.sceneNavigator.replace({
                    scene: RecipeDetailScene,
                    passProps: {
                      recipeName: "Chocolate Cake",
                      recipeDescription: "Make sure to whisk everything without leaving crumbs",
                      recipeIngredients: ["200g chocolate", "100ml milk", "50g flour", "2 tbsp sugar"],
                      recipeDifficulty: 1,
                      recipeTime: 1,
                      setIsHovering: setIsHovering
                    }
                  })
              }
              onHoverChange={(hovering) => {
                if (setIsHovering) setIsHovering(hovering);
              }}
              source={require("../../assets/recipes/cakeImage.png")}
            />
            <GazeImageButton
              position={[0, 0, 0]} width={0.9} height={0.7}
              onClick={
                () =>
                  props.sceneNavigator.replace({
                    scene: RecipeDetailScene,
                    passProps: {
                      recipeName: "Tuna Pasta",
                      recipeDescription: "Be careful while cooking the tuna, you don't want it to be dry!",
                      recipeIngredients: ["200g pasta", "70g tuna"],
                      recipeDifficulty: 1,
                      recipeTime: 3,
                      setIsHovering: setIsHovering
                    }
                  })
              }
              onHoverChange={(hovering) => {
                if (setIsHovering) setIsHovering(hovering);
              }}
              source={require("../../assets/recipes/pastaTonno.png")}
            />
          </ViroFlexView>

          {/* ROW 2 */}
          <ViroFlexView style={styles.row} width={2.6} height={0.7}>
            <GazeImageButton
              position={[0, 0, 0]} width={0.9} height={0.7}
              onClick={
                () =>
                  props.sceneNavigator.replace({
                    scene: RecipeDetailScene,
                    passProps: {
                      recipeName: "Zucchine Scapece",
                      recipeDescription: "Roast a red bell pepper, making sure not to burn it!",
                      recipeIngredients: ["1 Red Bell Pepper"],
                      recipeDifficulty: 1,
                      recipeTime: 1,
                      setIsHovering: setIsHovering
                    }
                  })
              }
              onHoverChange={(hovering) => {
                if (setIsHovering) setIsHovering(hovering);
              }}
              source={require("../../assets/recipes/scapeceImage.png")}
            />
            <GazeImageButton
              position={[0, 0, 0]} width={0.9} height={0.7}
              onClick={
                () =>
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
                  })
              }
              onHoverChange={(hovering) => {
                if (setIsHovering) setIsHovering(hovering);
              }}
              source={require("../../assets/recipes/roastedPepperImage.png")}
            />
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
  headerTitle: {
    fontFamily: "Arial", fontSize: 50, color: "#10121b", fontWeight: "bold", textAlign: "center", textAlignVertical: "center",
  },
  subHeader: {
    fontFamily: "Arial", fontSize: 10, color: "#10121b", textAlign: "center", textAlignVertical: "center",
  },
  gridContainer: {
    flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
  },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  pageText: {
    color: "black", fontSize: 20, textAlign: "center",
  },
  recipeBtnText: {
    fontSize: 10, fontWeight: "bold", color: "white"
  },
  containerColumn: { flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' },
  loading: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  infoCol: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  descBox: { flexDirection: 'column', alignItems: 'center', padding: .1 },
  contentBox: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  footerCenter: { alignItems: 'center', justifyContent: 'center' },

  titleText: { fontFamily: "Arial", fontSize: 20, fontWeight: "bold", color: "#10121b", textAlign: "center" },
  sectionTitle: { fontFamily: "Arial", fontSize: 12, fontWeight: "bold", color: "#2b2d42", textAlign: "center", textAlignVertical: "center" },
  ingredientsTitle: { fontFamily: "Arial", fontSize: 18, fontWeight: "bold", color: "#2b2d42", textAlign: "center", textAlignVertical: "center" },
  label: { fontFamily: "Arial", fontSize: 13, fontWeight: "bold", color: "#10121b" },
  value: { fontFamily: "Arial", fontSize: 20, color: "#333" },
  bodyText: { fontFamily: "Arial", fontSize: 10, color: "#333", textAlign: "justify" },
  bodyTextList: { fontFamily: "Arial", fontSize: 22, color: "#000", textAlign: "left", textAlignVertical: "center", fontWeight: "bold" },
  loadingText: { fontFamily: "Arial", fontSize: 80, fontWeight: "bold", color: "white", textAlign: "center", textAlignVertical: "center" },
});

export default DailyExercisesScene;