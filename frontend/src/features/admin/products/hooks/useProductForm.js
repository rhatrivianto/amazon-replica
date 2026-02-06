import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation, useUpdateProductMutation } from '../../../../services/adminApi.js';
import { toast } from 'react-hot-toast';

// frontend/src/features/admin/products/hooks/useProductForm.js
export const useProductForm = (initialData = null) => {
  const navigate = useNavigate();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleSubmit = async (formData) => {
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
      navigate('/admin/dashboard/products'); 
    } catch (error) {
      // Jika Backend Anda mengirim status 400, pesan errornya akan muncul di sini
      const errorMessage = error.data?.message || error.data || "Transaction Failed";
      toast.error(typeof errorMessage === 'string' ? errorMessage : "Check all fields");
      console.error("[Amazon-System] Transaction Failed:", error);
    }
  };

  return { handleSubmit, isLoading: isCreating || isUpdating };
};