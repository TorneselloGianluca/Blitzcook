import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import {
  ViroARScene,
  ViroText,
  ViroFlexView,
  ViroMaterials,
  ViroARSceneNavigator,
  ViroImage,
} from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import RecipeDetailScene from "./RecipeDetailsScene";
import BlitzCookScene from "./BlitzCookScene";
import RoundGazeButton from "../components/RoundGazeButton";
import GazeImageButton from "../components/GazeImageButton";

interface CategorySceneProps {
  sceneNavigator?: any;
  categoryTitle?: string;
}

const CategoryScene = (props: CategorySceneProps) => {
  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;

  const categoryTitle = props.categoryTitle || "UNKNOWN";

  const goBack = useCallback(() => {
    props.sceneNavigator.replace({
      scene: BlitzCookScene, passProps: { setIsHovering: setIsHovering }
    });
  }, [props.sceneNavigator]);

  const selectRecipe = useCallback((recipeName: string) => {
    props.sceneNavigator.replace({
      scene: RecipeDetailScene,
      passProps: { recipeName: recipeName, setIsHovering: setIsHovering }
    });
  }, [props.sceneNavigator]);

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
              width={2.5} height={0}
              scale={[0.25, 0.25, 0.25]}
            />
          </ViroFlexView>

        </ViroFlexView>

        <ViroText
          text="Available exercises:"
          style={styles.subHeader}
          width={3} height={0.3}
          scale={[0.5, 0.5, 0.5]}
        />

        {/* GRID CONTAINER */}
        <ViroFlexView
          width={3.2} height={2.1}
          style={styles.gridContainer}
        >
          {/* ROW 1 */}
          <ViroFlexView style={styles.row} width={2.9} height={0.5}>
            <GazeButton
              position={[0, 0, 0]} width={1.1} height={0.5}
              text="Roasted Peppers"
              styleText={styles.recipeBtnText}
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
            />
            <GazeButton
              position={[0, 0, 0]} width={1.1} height={0.5}
              text="Stiff Peaks"
              styleText={styles.recipeBtnText}
              onClick={() => selectRecipe("Stiff Peaks")}
              onHoverChange={(hovering) => {
                if (setIsHovering) setIsHovering(hovering);
              }}
            />
          </ViroFlexView>

          {/* ROW 2 */}
          <ViroFlexView style={styles.row} width={2.9} height={0.5}>
            <GazeButton
              position={[0, 0, 0]} width={1.1} height={0.5}
              text="Flat Meringue"
              styleText={styles.recipeBtnText}
              onClick={() => selectRecipe("Flat Meringue")}
              onHoverChange={(hovering) => {
                if (setIsHovering) setIsHovering(hovering);
              }}
            />
            <GazeButton
              position={[0, 0, 0]} width={1.1} height={0.5}
              text="Chocolate Tempering"
              styleText={styles.recipeBtnText}
              onClick={() => selectRecipe("Chocolate Tempering")}
              onHoverChange={(hovering) => {
                if (setIsHovering) setIsHovering(hovering);
              }}
            />
          </ViroFlexView>
        </ViroFlexView>
      </ViroFlexView>
      {/*
      <GazeImageButton
        position={[1.38, -0.2, -3.9]} width={0.25} height={0.25}
        source={require("../../assets/textures/buttons/backButton.png")}
        onClick={() => console.log("Next page...")}
        onHoverChange={(hovering) => {
          if (setIsHovering) setIsHovering(hovering);
        }}
      />
*/}
    </ViroARScene>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: "Arial", fontSize: 50, color: "#10121b", fontWeight: "bold", textAlign: "center", textAlignVertical: "center",
  },
  subHeader: {
    fontFamily: "Arial", fontSize: 20, color: "#10121b", textAlign: "center", textAlignVertical: "center",
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
    fontSize: 18, fontWeight: "bold", color: "#10121b"
  },
  containerColumn: { flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  infoCol: { flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
  descBox: { flexDirection: 'column', alignItems: 'center', padding: .1 },
  contentBox: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  footerCenter: { alignItems: 'center', justifyContent: 'center' },

  titleText: { fontFamily: "Arial", fontSize: 90, fontWeight: "bold", color: "#10121b", textAlign: "center" },
  sectionTitle: { fontFamily: "Arial", fontSize: 12, fontWeight: "bold", color: "#2b2d42", textAlign: "center", textAlignVertical: "center" },
  ingredientsTitle: { fontFamily: "Arial", fontSize: 18, fontWeight: "bold", color: "#2b2d42", textAlign: "center", textAlignVertical: "center" },
  label: { fontFamily: "Arial", fontSize: 13, fontWeight: "bold", color: "#10121b" },
  value: { fontFamily: "Arial", fontSize: 20, color: "#333" },
  bodyText: { fontFamily: "Arial", fontSize: 10, color: "#333", textAlign: "justify" },
  bodyTextList: { fontFamily: "Arial", fontSize: 22, color: "#000", textAlign: "left", textAlignVertical: "center", fontWeight: "bold" },

});

export default CategoryScene;