import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation, useUpdateProductMutation } from '../../../../services/adminApi.js';
import { toast } from 'react-hot-toast';

// frontend/src/features/admin/products/hooks/useProductForm.js
export const useProductForm = (initialData = null) => {
  const navigate = useNavigate();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleSubmit = async (formData) => {
    // --- DEBUG: Cek isi FormData sebelum dikirim ---
    // (Hanya bisa dilihat di Console Browser F12)
    if (!formData) {
      console.error("❌ [useProductForm] Error: formData is undefined");
      toast.error("System Error: No data to submit");
      return;
    }

    console.log("📦 [Submitting FormData]:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name} (${value.type})` : value);
    }

    // JANGAN membuat 'new FormData()' lagi di sini.
    // Gunakan langsung 'formData' yang datang dari komponen.

    try {
      if (initialData) {
        // Untuk update
        await updateProduct({ id: initialData._id, formData }).unwrap();
        toast.success('Product Updated', { icon: '🔄' });
      } else {
        // Untuk create baru
        await createProduct(formData).unwrap();
        toast.success('Product Launched Successfully!');
      }
      // FIX: Sesuaikan dengan rute di AdminSidebar (/admin/products)
      navigate('/admin/products'); 
    } catch (error) {
      // Jika Backend Anda mengirim status 400, pesan errornya akan muncul di sini
      // Log ini adalah KUNCI untuk debugging. Buka console browser (F12) untuk melihatnya.
      console.error("❌ [CREATE/UPDATE PRODUCT FAILED] Full error object:", error);
      
      let errorMessage = "Transaction Failed";

      // Coba ekstrak pesan error yang lebih spesifik dari berbagai kemungkinan struktur object error
      if (error && error.data) {
        // Struktur umum dari AppError backend: { status, message }
        if (typeof error.data.message === 'string') {
          errorMessage = error.data.message;
        } else if (typeof error.data === 'string') { // Jika backend hanya mengembalikan string
          errorMessage = error.data;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  return { handleSubmit, isLoading: isCreating || isUpdating };
};