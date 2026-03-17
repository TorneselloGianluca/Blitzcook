import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import { ViroARScene, ViroText, ViroFlexView, ViroMaterials, ViroImage } from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import PepperScene from "./PepperScene";
import CategoryScene from "./CategoryScene";
import GazeImageButton from "../components/GazeImageButton";
import { dbService } from "../../database.ts";
import DescriptionButton from "../components/DescriptionButton.tsx";
import SearchScene from "./SearchScene.tsx";
import BlitzCookScene from "./BlitzCookScene.tsx";

ViroMaterials.createMaterials({
  panelWhite: { diffuseColor: "rgba(255, 255, 255, 0.4)" },
  descBg: { diffuseTexture: require("../../assets/textures/descBG.png"), diffuseColor: "rgba(255, 255, 255, 1)" },
  descBgHover: { diffuseTexture: require("../../assets/textures/descBG.png"), diffuseColor: "rgba(202, 207, 210, 1)" },
});

const RecipeDetailScene = (props: any) => {

  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering ?? (() => { });
  const setTopText = props.sceneNavigator?.viroAppProps?.setTopText;

  const recipeName = props.recipeName || "UNKNOWN";

  const [showIngredients, setShowIngredients] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const checkCartStatus = async () => {
      const inCart = await dbService.checkRecipeInCart(recipeName);
      setIsInCart(inCart);
    };
    checkCartStatus();
  }, [recipeName]);

  const goBack = useCallback(() => {
    if (showIngredients) setShowIngredients(false);
    else if (showDescription) setShowDescription(false);
    else props.sceneNavigator.replace({ scene: SearchScene, passProps: { setIsHovering, searchText: "Pepper" } });
  }, [props.sceneNavigator, showIngredients, showDescription, setIsHovering]);

  const startCooking = useCallback(() => {
    props.sceneNavigator.replace({ scene: PepperScene, passProps: { setIsHovering } });
  }, [props.sceneNavigator, setIsHovering]);

  const toggleIngredients = useCallback(() => setShowIngredients((p) => !p), []);

  const toggleCart = useCallback(async () => {
    if (isInCart) {
      console.log("Rimozione ingredienti dal database...");
      await dbService.removeRecipeFromShoppingList(recipeName);
      setIsInCart(false);

      if (setTopText) {
        setTopText("Ingredients removed from Shopping List.");
        setTimeout(() => setTopText(""), 3000);
      }
    } else {
      console.log("Salvataggio ingredienti nel database...");
      await dbService.addToShoppingList(recipeName);
      setIsInCart(true);

      if (setTopText) {
        setTopText("Ingredients added to your Shopping List!");
        setTimeout(() => setTopText(""), 3000);
      }
    }
  }, [recipeName, setTopText, isInCart]);

  return (
    <ViroARScene>
      <ViroFlexView position={[0, 0, -4]} width={3.5} height={2.1} materials={["bg"]} style={styles.containerColumn}>
        <ViroFlexView style={styles.headerRow} width={3.48} height={0.4}>
          <GazeImageButton
            width={0.4} height={0.4} position={[0, 0, 0]}
            source={require("../../assets/textures/buttons/backButton.png")}
            onClick={goBack}
            onHoverChange={(h) => setIsHovering(h)}
          />

          <ViroFlexView width={2.3} height={0.33}>
            <ViroText text={recipeName.toUpperCase()} width={2.3} height={0.33} style={styles.titleText} />
          </ViroFlexView>

          {/* PULSANTE CARRELLO DINAMICO */}
          {showIngredients ? (
            <GazeImageButton
              key={`cart-btn-${isInCart}`}
              width={0.4} height={0.4}
              source={
                isInCart
                  ? require("../../assets/textures/buttons/removeFromCartIcon.png")
                  : require("../../assets/textures/buttons/addToCartIcon.png")
              }
              onClick={() => toggleCart()}
              position={[0, 0, 0]}
              onHoverChange={(h) => setIsHovering(h)}
            />
          ) : (
            <ViroFlexView width={0.4} height={0.4} />
          )}
        </ViroFlexView>

        {(showIngredients || showDescription) ? (
          <ViroFlexView width={3} height={1.52} style={styles.contentBox}>
            <ViroText text={showIngredients ? "INGREDIENTS" : "DESCRIPTION"} width={2} height={0.3} style={styles.ingredientsTitle} />
            <ViroFlexView width={3} height={1.2} style={styles.contentBox} materials={["descBg"]}>
              <ViroText
                text={showDescription ? (props.recipeDescription || "Loading...") : (props.recipeIngredients?.map((i: any) => `• ${i}`).join("\n") || "Loading...")}
                width={2.8} height={1.2} style={styles.bodyTextList}
              />
            </ViroFlexView>
          </ViroFlexView>
        ) : (
          <>
            <ViroFlexView width={3.3} height={0.2} style={styles.contentRow}>
              <ViroFlexView width={1.65} height={2.2} style={styles.infoCol}>
                <ViroFlexView width={1.9} height={0.4} style={styles.infoRow}>
                  <ViroText text="DIFFICULTY" width={0.8} height={0.2} style={styles.label} />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ViroImage key={i} source={require("../../assets/textures/difficultyFull.png")} width={0.16} height={0.16} opacity={i < (props.recipeDifficulty || 0) ? 1 : 0.3} />
                  ))}
                </ViroFlexView>
                <ViroFlexView width={2.2} height={0.2} style={styles.infoRow}>
                  <ViroText text="TIME" width={0.8} height={0.2} style={styles.label} />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ViroImage key={i} source={require("../../assets/textures/timer.png")} width={0.16} height={0.145} opacity={i < (props.recipeDifficulty || 0) ? 1 : 0.3} />
                  ))}
                </ViroFlexView>
                <GazeButton
                  width={1} height={0.4} text={"CHECK INGREDIENTS"} styleText={{ fontSize: 12 }}
                  onClick={toggleIngredients} position={[0, 0, 0]} onHoverChange={(h) => setIsHovering(h)}
                />
              </ViroFlexView>
              <ViroFlexView width={1.4} height={1.15} style={styles.descBox}>
                <ViroText text="DESCRIPTION" width={1} height={0.2} style={styles.sectionTitle} />
                <DescriptionButton width={1.4} height={0.75} text={props.recipeDescription || "Desc"} styleText={{ fontSize: 12 }} onClick={() => setShowDescription(true)} onHoverChange={(h) => setIsHovering(h)} />
              </ViroFlexView>
            </ViroFlexView>
            <ViroFlexView width={2.8} height={0.4} style={styles.footerCenter}>
              <GazeButton
                position={[0, 0, 0]} width={0.9} height={0.4} text="START"
                styleText={{ fontSize: 20, fontWeight: "bold" }} onClick={startCooking} onHoverChange={(h) => setIsHovering(h)}
              />
            </ViroFlexView>
          </>
        )}
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
  containerColumn: { flexDirection: "column", alignItems: "center", justifyContent: "space-between" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  contentRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  infoCol: { flexDirection: "column", justifyContent: "center", alignItems: "center" },
  descBox: { flexDirection: "column", alignItems: "center", padding: 0.1 },
  contentBox: { flexDirection: "column", alignItems: "center", justifyContent: "center" },
  footerCenter: { alignItems: "center", justifyContent: "center" },
  titleText: { fontFamily: "Arial", fontSize: 20, fontWeight: "bold", color: "#10121b", textAlign: "center" },
  sectionTitle: { fontFamily: "Arial", fontSize: 12, fontWeight: "bold", color: "#2b2d42", textAlign: "center", textAlignVertical: "center" },
  ingredientsTitle: { fontFamily: "Arial", fontSize: 18, fontWeight: "bold", color: "#000", textAlign: "center", textAlignVertical: "center" },
  label: { fontFamily: "Arial", fontSize: 13, fontWeight: "bold", color: "#10121b" },
  bodyText: { fontFamily: "Arial", fontSize: 10, color: "#333", textAlign: "justify" },
  bodyTextList: { fontFamily: "Arial", fontSize: 22, color: "#000", textAlign: "left", textAlignVertical: "center", fontWeight: "bold" },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});

export default RecipeDetailScene;