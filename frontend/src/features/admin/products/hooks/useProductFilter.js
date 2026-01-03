// useProductFilter.js
import { useState } from 'react';

export const useProductFilter = (products = []) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Pastikan kita selalu beroperasi pada Array
  const productList = Array.isArray(products) ? products : [];

  const filteredProducts = productList.filter((product) => {
    if (!searchTerm) return true;

    const s = searchTerm.toLowerCase();

    // 1. Cek Nama Produk
    const nameMatch = product.name?.toLowerCase().includes(s);
    
    // 2. Cek Nama Kategori (Amazon Style: Bisa search kategori langsung di sini)
    // Cek apakah category berupa string atau object dengan property name
    const categoryName = typeof product.category === 'object' 
      ? product.category?.name 
      : product.category;
    const categoryMatch = categoryName?.toLowerCase().includes(s);

    // 3. Cek Brand
    const brandName = typeof product.brand === 'object'
      ? product.brand?.name
      : product.brand;
    const brandMatch = brandName?.toLowerCase().includes(s);

    return nameMatch || categoryMatch || brandMatch;
  });

  return {
    searchTerm,
    setSearchTerm,
    filteredProducts
  };
};