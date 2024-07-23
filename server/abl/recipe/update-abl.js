const path = require("path");
const Ajv = require("ajv");
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(
  path.join(__dirname, "..", "..", "storage", "recipes.json")
);

const IngredientDao = require("../../dao/ingredient-dao");
let ingredientDao = new IngredientDao(
  path.join(__dirname, "..", "..", "storage", "ingredients.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", minLength: 3, maxLength: 100 },
    description: { type: "string", minLength: 3, maxLength: 1600 },
    category: { type: "string" },
    image: { type: "string" },
    ingredients: {
      type: "array",
      minItems: 0,
      items: [
        {
          type: "object",
          properties: {
            id: { type: "string" },
            amount: { type: "number", minimum: 1, maximum: 5000 },
            unit: { type: "string", minLength: 1, maxLength: 25 },
          },
          required: ["id", "amount", "unit"],
        }
      ]
    }
  },
  required: ["id", "name", "category", "description"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let recipe = req.body;
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      if (recipe.ingredients) {
        for (let ingredient of recipe.ingredients) {
          const exists = await ingredientDao.getIngredient(ingredient.id);

          if (!exists) {
            res.status(400).send({
              errorMessage:
                "Ingredience s ID " + ingredient.id + " neexistuje",
              params: req.body,
            });
            return;
          }
        }
      }
      // pokud cesta k obrázku (název souboru) není definovaná, použije se defaultní obrázek
      if (recipe.image === "") {
        recipe.image = "meat_heads.jpg";
      }
      recipe = await dao.updateRecipe(recipe);
      res.json(recipe);
    } else {
      res.status(400).send({
        errorMessage: "Vstupní data neprošla validací",
        params: recipe,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    if (e.message.startsWith("recipe with given id")) {
      res.status(400).json({ error: e.message });
    }
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;