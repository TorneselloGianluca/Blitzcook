import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { ViroARScene, ViroText, ViroFlexView, ViroMaterials, ViroNode, ViroImage } from "@reactvision/react-viro";
import GazeButton from "../components/GazeButton";
import GazeImageButton from "../components/GazeImageButton";
import BlitzCookScene from "./BlitzCookScene";
import { dbService } from "../../database.ts";

// Aggiungiamo i materiali per la checkbox
ViroMaterials.createMaterials({
  panelWhite: { diffuseColor: "rgba(255, 255, 255, 0.9)" },
  panelGreen: { diffuseColor: "rgba(46, 204, 113, 0.9)" },
  bgDark: { diffuseColor: "rgba(35, 47, 62, 0.95)" },
  itemUnselected: { diffuseColor: "rgba(236, 240, 241, 1.0)" },
  itemSelected: { diffuseColor: "rgba(241, 196, 15, 1.0)" },
  // Materiali per la Checkbox
  checkboxBase: { diffuseColor: "rgba(189, 195, 199, 1.0)" }, // Grigio spento
  checkboxChecked: { diffuseColor: "rgba(39, 174, 96, 1.0)" } // Verde acceso
});

const ShoppingListScene = (props: any) => {
  const setIsHovering = props.sceneNavigator?.viroAppProps?.setIsHovering;

  const [items, setItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("list");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const list = await dbService.getShoppingList();
      setItems(list || []);
      setIsLoading(false);
    } catch (e) {
      console.error("ERRORE LETTURA DB:", e);
      setIsLoading(false);
    }
  };

  const goBack = useCallback(() => {
    props.sceneNavigator.replace({ scene: BlitzCookScene, passProps: { setIsHovering } });
  }, [props.sceneNavigator]);

  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Funzione per eliminare gli elementi selezionati (Cestino)
  const deleteSelectedItems = useCallback(async () => {
    if (selectedIds.length > 0) {
      setIsLoading(true);
      await dbService.removeItemsFromShoppingList(selectedIds);
      setSelectedIds([]); // Resetta selezione
      await loadItems(); // Ricarica lista dal DB
    }
  }, [selectedIds]);

  // Funzione per comprare (Checkout)
  const simulateCheckout = useCallback(async () => {
    if (selectedIds.length > 0) {
      await dbService.removeItemsFromShoppingList(selectedIds);
      selectedIds.length = 0;
      setStatus("success");
    }
  }, [selectedIds]);

  const renderGrid = () => {
    if (isLoading) return <ViroText text="Loading..." style={styles.infoText} />;
    if (items.length === 0) return <ViroText width={3.5} height={2} text="The list is empty!" style={styles.infoText} />;

    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      const item1 = items[i];
      const item2 = items[i + 1] ? items[i + 1] : null;

      rows.push(
        <ViroFlexView key={`row-${i}`} style={styles.gridRow} width={2.5} height={0.25}>
          {renderItem(item1)}
          <ViroFlexView width={0.1} height={0.2} />
          {item2 ? renderItem(item2) : <ViroFlexView width={1.3} height={0.2} />}
        </ViroFlexView>
      );
    }
    return rows;
  };

  const renderItem = (item: any) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <ViroNode key={item.id} width={0.9} height={0.9}>
        {/* Bottone Principale dell'Item */}
        <GazeImageButton
          width={0.9} height={0.9}
          onClick={() => toggleSelection(item.id)}
          source={item.name == "Red Pepper" ? require("../../assets/ingredients/pepperImage.png") : require("../../assets/ingredients/cucumberImage.png")}
          position={[0, 0, 0]}
          onHoverChange={(hovering) => {
            if (setIsHovering) setIsHovering(hovering);
          }}
        />

        {isSelected && (
          <ViroImage
            source={require("../../assets/textures/buttons/selectedIcon.png")}
            position={[0.45, 0.3, 0.05]}
            width={0.2} height={0.2}
            renderingOrder={10}
          />
        )}
      </ViroNode>
    );
  };

  return (
    <ViroARScene>
      <ViroFlexView position={[0, 0, -4]} width={3.5} height={2.1} materials={["bg"]} style={styles.container}>

        {/* Header */}
        <ViroFlexView width={3.5} height={0.4} style={styles.header} >
          {/* Pulsante Indietro */}
          <GazeImageButton width={0.4} height={0.4}
            source={require("../../assets/textures/buttons/backButton.png")}
            onClick={goBack}
            onHoverChange={setIsHovering}
            position={[0, 0, 0]}
          />

          <ViroFlexView width={1.8} height={0.6} style={styles.headerText}>
            <ViroText text="Shopping List" width={1.8} height={0.6} style={styles.title} />
          </ViroFlexView>

          {/* Pulsante DELETE in alto a destra */}
          {selectedIds.length > 0 ? (
            <GazeImageButton
              width={0.4} height={0.4}
              source={require("../../assets/textures/buttons/deleteIcon.png")}
              onClick={deleteSelectedItems}
              onHoverChange={setIsHovering}
              position={[0, 0, 0]}
            />
          ) : (
            <ViroFlexView width={0.4} height={0.4} />
          )}
        </ViroFlexView>

        {status === "list" ? (
          <>
            <ViroFlexView width={3.5} height={1.1} style={styles.listContainer}>
              <ViroFlexView style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
                {renderGrid()}
              </ViroFlexView>
            </ViroFlexView>
          </>
        ) : (
          /* SCHERMATA SUCCESSO */
          <ViroFlexView width={2.8} height={1.2} materials={[]} style={styles.successContainer}>
            <ViroText text="Items successfully added!" style={styles.successTitle} width={2.5} height={0.4} />
            <ViroText text="Check your Amazon account." style={styles.successSub} width={2.5} height={0.3} />
          </ViroFlexView>
        )}

      </ViroFlexView>

      {/* Footer con pulsante BUY */}
      <ViroFlexView width={2.5} height={0.5} style={styles.footer} position={[0, -0.75, -3.9]} materials={["bgCrop"]}>
        {
          status !== "list" ? <GazeButton
            width={1.5} height={0.4}
            text="Back to list"
            onClick={() => {
              setStatus("list");
              setSelectedIds([]);
              loadItems();
            }}
            onHoverChange={setIsHovering}
            position={[0, -0.2, 0]}
          /> :
            selectedIds.length > 0 ? (
              <GazeButton
                width={1.4} height={0.45}
                text={`ADD SELECTED TO AMAZON CART (${selectedIds.length})`}
                styleText={{ color: "black", fontWeight: "bold", fontSize: 12 }}
                onClick={simulateCheckout}
                onHoverChange={setIsHovering}
                position={[0, -0.8, -3.9]}
              />
            ) : (
              <ViroText
                width={2.5} height={0.3}
                text="Select items to add them to your Amazon cart or remove them"
                position={[0, 0, 0]}
                style={{ fontSize: 11, textAlign: "center", color: "#10121b" }}
              />
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
  container: { flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  title: { fontSize: 25, fontFamily: 'Arial', color: "#10121b", fontWeight: "bold", textAlign: "center", textAlignVertical: "center" },

  headerText: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },

  listContainer: { flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: .05 },

  gridRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // Stile per la checkbox
  checkboxStyle: { alignItems: 'center', justifyContent: 'center' },

  itemText: { fontSize: 16, color: "#333", textAlign: "center", textAlignVertical: "center", fontWeight: "normal" },
  itemTextSelected: { fontSize: 16, color: "#10121b", textAlign: "center", textAlignVertical: "center", fontWeight: "bold" },
  infoText: { fontSize: 20, color: "#10121b", textAlign: "center" },

  footer: { alignItems: 'center', justifyContent: 'center' },

  successContainer: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 20, color: "#10121b", fontWeight: "bold", textAlign: "center" },
  successSub: { fontSize: 12, color: "#10121b", textAlign: "center" }
});

export default ShoppingListScene;