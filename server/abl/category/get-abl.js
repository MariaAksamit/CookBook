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

async function GetAbl(req, res) {
  try {
    const ajv = new Ajv();
    const body = req.query.id ? req.query : req.body;
    const valid = ajv.validate(schema, body);
    if (valid) {
      const categoryId = body.id;
      const category = await dao.getCategory(categoryId);
      if (!category) {
        res
          .status(400)
          .send({ error: `category with id '${categoryId}' doesn't exist.` });
      }
      res.json(category);
    } else {
      res.status(400).send({
        errorMessage: "validation of input failed",
        params: body,
        reason: ajv.errors,
      });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

module.exports = GetAbl;
