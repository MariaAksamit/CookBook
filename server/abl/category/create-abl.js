const path = require("path");
const Ajv = require("ajv").default;
const CategoryDao = require("../../dao/category-dao");
let dao = new CategoryDao(
  path.join(__dirname, "..", "..", "storage", "recipeCategories.json")
);

let schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3, maxLength: 50 }
  },
  required: ["name"]
};

async function CreateAbl(req, res) {
  try {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, req.body);
    if (valid) {
      let category = req.body;
      category = await dao.createCategory(category);
      res.json(category);
    } else {
      res.status(400).send({
        errorMessage: "Vstupní data neprošla validací",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
      res.status(500).send(e);
  }
}

module.exports = CreateAbl;
