const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(
  path.join(__dirname, "..", "..", "storage", "ingredients.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", minLength: 3, maxLength: 100 },
  },
  required: ["id", "name"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let ingredient = req.body;
    const valid = ajv.validate(schema, ingredient);
    if (valid) {
      ingredient = await dao.updateIngredient(ingredient);
      res.json(ingredient);
    } else {
      res.status(400).send({
        errorMessage: "Vstupní data neprošla validací",
        params: ingredient,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
