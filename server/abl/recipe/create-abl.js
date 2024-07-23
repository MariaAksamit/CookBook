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
          required: ["id", "amount", "unit"], // ingredient items nejsou povinné, pokud však existují, musí mít všechny atributy
        }
      ]
    }
  },
  required: ["name", "category", "description", {/*"ingredients"*/}],
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = true;
    if (valid) {
      let recipe = req.body;
      if (recipe.ingredients) {

        for(let ingredient of recipe.ingredients) {
          const exists = await ingredientDao.getIngredient(ingredient.id);

          if (!exists) {
            res.status(400).send({
              errorMessage: "Ingredience s ID " + ingredient.id + " neexistuje",
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
      recipe = await dao.createRecipe(recipe);
      res.json(recipe);
    } else {
      res.status(400).send({
        errorMessage: "Vstupní data neprošla validací",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

module.exports = CreateAbl;
