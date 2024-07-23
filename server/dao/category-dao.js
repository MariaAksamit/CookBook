"use strict";
const fs = require("fs");
const path = require("path");

const crypto = require("crypto");

const rf = fs.promises.readFile;
const wf = fs.promises.writeFile;

const DEFAULT_STORAGE_PATH = path.join(__dirname, "storage", "recipeCategories.json");

class CategoryDao {
  constructor(storagePath) {
    this.categoryStoragePath = storagePath ? storagePath : DEFAULT_STORAGE_PATH;
  }

  async createCategory(category) {
    let categoryList = await this._loadAllCategories();
    category.id = crypto.randomBytes(8).toString("hex");
    categoryList.push(category);
    await wf(this._getStorageLocation(), JSON.stringify(categoryList, null, 2));
    return category;
  }

  async getCategory(id) {
    let categoryList = await this._loadAllCategories();
    const result = categoryList.find((b) => b.id === id);
    return result;
  }

  async updateCategory(category) {
    let categoryList = await this._loadAllCategories();
    const categoryIndex = categoryList.findIndex((b) => b.id === category.id);
    if (categoryIndex < 0) {
      throw new Error(`category with given id ${category.id} does not exists.`);
    } else {
      categoryList[categoryIndex] = {
        ...categoryList[categoryIndex],
        ...category,
      };
    }
    await wf(this._getStorageLocation(), JSON.stringify(categoryList, null, 2));
    return categoryList[categoryIndex];
  }

  async deleteCategory(id) {
    let categoryList = await this._loadAllCategories();
    const categoryIndex = categoryList.findIndex((b) => b.id === id);
    if (categoryIndex >= 0) {
      categoryList.splice(categoryIndex, 1);
    }
    await wf(this._getStorageLocation(), JSON.stringify(categoryList, null, 2));
    return {};
  }

  async listCategories() {
    let categoryList = await this._loadAllCategories();
    return categoryList;
  }

  async _loadAllCategories() {
    let categoryList;
    try {
      categoryList = JSON.parse(await rf(this._getStorageLocation()));
    } catch (e) {
      if (e.code === "ENOENT") {
        console.info("No storage found, initializing new one...");
        categoryList = [];
      } else {
        throw new Error(
          "Unable to read from storage. Wrong data format. " +
            this._getStorageLocation()
        );
      }
    }
    return categoryList;
  }

  _getStorageLocation() {
    return this.categoryStoragePath;
  }
}

module.exports = CategoryDao;
