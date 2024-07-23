import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { CategoryProvider } from './routes/SelectedCategoryContext';
import HomeR from './routes/HomeR';
import RecipeListR from './routes/RecipeListR';
import IngredientListR from './routes/IngredientListR';
import CategoryListR from "./routes/CategoryListR";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <CategoryProvider> {/* Zabalte kořenový komponent do poskytovatele kontextu */}
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<HomeR />} />
          <Route path="recipeList" element={<RecipeListR />} />
          <Route path="ingredientList" element={<IngredientListR />} />
          <Route path="categoryList" element={<CategoryListR />} />
        </Route>
      </Routes>
    </CategoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();