const fs = require("fs");
//načtení modulu express
const express = require("express");
const cors = require("cors");

const categoryRouter = require("./controller/category-controller");
const recipeRouter = require("./controller/recipe-controller");
const ingredientRouter = require("./controller/ingredient-controller");

//inicializace nového Express.js serveru
const app = express();
//definování portu, na kterém má aplikace běžet na localhostu
const port = process.env.PORT || 8000;

// Parsování body
app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.use(cors())

app.use("/recipe", recipeRouter);
app.use("/ingredient", ingredientRouter);
app.use("/category", categoryRouter);


app.get("/*", (req, res) => {
  res.send("Unknown path!");
});


//nastavení portu, na kterém má běžet HTTP server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
