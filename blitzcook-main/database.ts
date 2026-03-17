import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'BlitzCook.db';

export const dbService = {
  getDB: async () => {
    return await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
  },

  createTables: async () => {
    const db = await dbService.getDB();
    await db.executeSql(`CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, description TEXT);`);
    await db.executeSql(`CREATE TABLE IF NOT EXISTS ingredients (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, asin TEXT NOT NULL);`);
    await db.executeSql(`CREATE TABLE IF NOT EXISTS recipe_ingredients (recipe_id INTEGER, ingredient_id INTEGER, quantity TEXT, FOREIGN KEY (recipe_id) REFERENCES recipes(id), FOREIGN KEY (ingredient_id) REFERENCES ingredients(id));`);
    await db.executeSql(`CREATE TABLE IF NOT EXISTS shopping_list (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, asin TEXT, quantity TEXT);`);
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS completed_recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        recipe_id INTEGER, 
        date_completed TEXT, 
        FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
      );
    `);
  },

  seedData: async () => {
    const db = await dbService.getDB();
    await db.executeSql("DELETE FROM recipe_ingredients");
    await db.executeSql("DELETE FROM ingredients");
    await db.executeSql("DELETE FROM recipes");

    console.log("--> [DB] Inizializzazione Dati...");

    const r1 = await db.executeSql(`INSERT INTO recipes (name, description) VALUES (?, ?)`, ['Roasted Peppers', 'Delicious roasted peppers']);
    const r2 = await db.executeSql(`INSERT INTO recipes (name, description) VALUES (?, ?)`, ['Ciambotta', 'A traditional Neaoplitan dish']);
    const r1Id = r1[0].insertId;
    const r2Id = r2[0].insertId;

    const i1 = await db.executeSql(`INSERT INTO ingredients (name, asin) VALUES (?, ?)`, ['Red Pepper', 'B01M35W9L5']);
    const i2 = await db.executeSql(`INSERT INTO ingredients (name, asin) VALUES (?, ?)`, ['Cucumber', 'B01M35W9L6']);


    await db.executeSql(`INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)`, [r1Id, i1[0].insertId, '1 Piece']);

    await db.executeSql(`INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)`, [r2Id, i1[0].insertId, '1 Piece']);
    await db.executeSql(`INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)`, [r2Id, i2[0].insertId, '1 Piece']);

    console.log("--> [DB] Dati Inseriti.");
  },

  addToShoppingList: async (recipeName: string) => {
    try {
      const db = await dbService.getDB();

      // 1. Prendiamo gli ingredienti della ricetta che vogliamo aggiungere
      const query = `
          SELECT i.name, i.asin, ri.quantity
          FROM recipe_ingredients ri
          JOIN recipes r ON ri.recipe_id = r.id
          JOIN ingredients i ON ri.ingredient_id = i.id
          WHERE r.name = ?
        `;
      const results = await db.executeSql(query, [recipeName]);

      for (let i = 0; i < results[0].rows.length; i++) {
        const item = results[0].rows.item(i);

        const checkQuery = `SELECT id, quantity FROM shopping_list WHERE name = ?`;
        const checkResult = await db.executeSql(checkQuery, [item.name]);

        if (checkResult[0].rows.length > 0) {
          const existingRow = checkResult[0].rows.item(0);

          const newQuantity = `${existingRow.quantity} + ${item.quantity}`;

          await db.executeSql(
            `UPDATE shopping_list SET quantity = ? WHERE id = ?`,
            [newQuantity, existingRow.id]
          );

        } else {
          await db.executeSql(
            `INSERT INTO shopping_list (name, asin, quantity) VALUES (?, ?, ?)`,
            [item.name, item.asin, item.quantity]
          );
        }
      }
      console.log(`[DB] Gestiti ${results[0].rows.length} ingredienti per ${recipeName}.`);
    } catch (e) {
      console.error("[DB ERROR] Add To Cart:", e);
    }
  },

  getShoppingList: async () => {
    try {
      const db = await dbService.getDB();
      const results = await db.executeSql(`SELECT * FROM shopping_list`);
      const items = [];
      for (let i = 0; i < results[0].rows.length; i++) {
        let row = results[0].rows.item(i);
        items.push({
          id: row.id,
          name: row.name,
          asin: row.asin,
          quantity: row.quantity
        });
      }
      return items;
    } catch (e) {
      console.error("[DB ERROR] Get List:", e);
      return [];
    }
  },

  clearShoppingList: async () => {
    const db = await dbService.getDB();
    await db.executeSql("DELETE FROM shopping_list");
    console.log("[DB] Carrello svuotato completamente.");
  },

  removeItemsFromShoppingList: async (ids: number[]) => {
    if (ids.length === 0) return;
    try {
      const db = await dbService.getDB();
      const placeholders = ids.map(() => '?').join(',');
      await db.executeSql(
        `DELETE FROM shopping_list WHERE id IN (${placeholders})`,
        ids
      );
      console.log(`[DB] Rimossi ${ids.length} elementi dal carrello.`);
    } catch (e) {
      console.error("[DB ERROR] Remove Items:", e);
    }
  },

  removeRecipeFromShoppingList: async (recipeName: string) => {
    try {
      const db = await dbService.getDB();
      const query = `
        DELETE FROM shopping_list 
        WHERE name IN (
          SELECT i.name 
          FROM ingredients i
          JOIN recipe_ingredients ri ON i.id = ri.ingredient_id
          JOIN recipes r ON r.id = ri.recipe_id
          WHERE r.name = ?
        )
      `;
      await db.executeSql(query, [recipeName]);
      console.log(`[DB] Rimossi ingredienti della ricetta ${recipeName}.`);
    } catch (e) {
      console.error("[DB ERROR] Remove Recipe From Cart:", e);
    }
  },

  checkRecipeInCart: async (recipeName: string) => {
    try {
      const db = await dbService.getDB();

      const requiredQuery = `
        SELECT COUNT(*) as total_required 
        FROM recipe_ingredients ri
        JOIN recipes r ON r.id = ri.recipe_id
        WHERE r.name = ?
      `;
      const requiredResult = await db.executeSql(requiredQuery, [recipeName]);
      const totalRequired = requiredResult[0].rows.item(0).total_required;

      if (totalRequired === 0) return false;

      const foundQuery = `
        SELECT COUNT(*) as found_count 
        FROM shopping_list 
        WHERE name IN (
          SELECT i.name 
          FROM ingredients i
          JOIN recipe_ingredients ri ON i.id = ri.ingredient_id
          JOIN recipes r ON r.id = ri.recipe_id
          WHERE r.name = ?
        )
      `;
      const foundResult = await db.executeSql(foundQuery, [recipeName]);
      const foundCount = foundResult[0].rows.item(0).found_count;

      return foundCount >= totalRequired;

    } catch (e) {
      console.error("[DB ERROR] Check Recipe In Cart:", e);
      return false;
    }
  },

  markRecipeAsCompleted: async (recipeName: string) => {
    try {
      const db = await dbService.getDB();
      
      const result = await db.executeSql('SELECT id FROM recipes WHERE name = ?', [recipeName]);
      
      if (result[0].rows.length > 0) {
        const recipeId = result[0].rows.item(0).id;
        const date = new Date().toISOString();

        await db.executeSql(
          `INSERT INTO completed_recipes (recipe_id, date_completed) VALUES (?, ?)`,
          [recipeId, date]
        );
        console.log(`[DB] Ricetta "${recipeName}" segnata come completata.`);
        return true;
      } else {
        console.warn(`[DB] Impossibile completare: Ricetta "${recipeName}" non trovata.`);
        return false;
      }
    } catch (e) {
      console.error("[DB ERROR] Mark Completed:", e);
      return false;
    }
  },

  getCompletedRecipes: async () => {
    try {
      const db = await dbService.getDB();
      
      const query = `
        SELECT cr.id as completed_id, cr.date_completed, r.name, r.description, r.id as original_recipe_id
        FROM completed_recipes cr
        JOIN recipes r ON cr.recipe_id = r.id
        ORDER BY cr.date_completed DESC
      `;
      
      const results = await db.executeSql(query);
      const items = [];
      
      for (let i = 0; i < results[0].rows.length; i++) {
        items.push(results[0].rows.item(i));
      }
      
      return items;
    } catch (e) {
      console.error("[DB ERROR] Get Completed:", e);
      return [];
    }
  },
  
  removeCompletedRecipe: async (completedId: number) => {
    try {
      const db = await dbService.getDB();
      await db.executeSql(`DELETE FROM completed_recipes WHERE id = ?`, [completedId]);
      console.log(`[DB] Voce cronologia #${completedId} rimossa.`);
    } catch (e) {
      console.error("[DB ERROR] Remove Completed:", e);
    }
  },
  
  clearHistoryForRecipe: async (recipeName: string) => {
      try {
        const db = await dbService.getDB();
        const query = `
            DELETE FROM completed_recipes 
            WHERE recipe_id IN (SELECT id FROM recipes WHERE name = ?)
        `;
        await db.executeSql(query, [recipeName]);
        console.log(`[DB] Cronologia pulita per "${recipeName}".`);
      } catch (e) {
        console.error("[DB ERROR] Clear History For Recipe:", e);
      }
  }
};