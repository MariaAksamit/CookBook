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
  },
  required: ["id"],
};

async function DeleteAbl(req, res) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, req.body);
  try {
    if (valid) {
      const categoryId = req.body.id;
      await dao.deleteCategory(categoryId);
      res.json({});
    } else {
      res.status(400).send({
        errorMessage: "Vstupní data neprošla validací",
        params: req.body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
}

module.exports = DeleteAbl;
