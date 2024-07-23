const path = require("path");
const Ajv = require("ajv").default;
const CategoryDao = require("../../dao/category-dao");
let dao = new CategoryDao(
  path.join(__dirname, "..", "..", "storage", "recipeCategories.json")
);

let schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", minLength: 3, maxLength: 50 },
  },
  required: ["id", "name"],
};

async function UpdateAbl(req, res) {
  try {
    const ajv = new Ajv();
    let category = req.body;
    const valid = ajv.validate(schema, category);
    if (valid) {
      category = await dao.updateCategory(category);
      res.json(category);
    } else {
      res.status(400).send({
        errorMessage: "Vstupní data neprošla validací",
        params: category,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = UpdateAbl;
