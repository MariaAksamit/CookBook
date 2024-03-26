import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import HomeR from './routes/HomeR';
import RecipeListR from './routes/RecipeListR';
import IngredientListR from './routes/IngredientListR';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<HomeR />} />
          <Route path="recipeList" element={<RecipeListR />} />
          <Route path="ingredientList" element={<IngredientListR />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();