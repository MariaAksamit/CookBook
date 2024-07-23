import React, { createContext, useContext, useState } from 'react';

const SelectedCategoryContext = createContext();

const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const setCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <SelectedCategoryContext.Provider value={{ selectedCategory, setCategory }}>
      {children}
    </SelectedCategoryContext.Provider>
  );
};

const useCategory = () => {
  const context = useContext(SelectedCategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};

export { CategoryProvider, useCategory };