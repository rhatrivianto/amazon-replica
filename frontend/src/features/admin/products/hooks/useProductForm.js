import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation, useUpdateProductMutation } from '../../../../services/adminServiceApi.js';
import { toast } from 'react-hot-toast';

export const useProductForm = (initialData = null) => {
  const navigate = useNavigate();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const handleSubmit = async (formDataRaw) => {
    const data = new FormData();
    
    // 1. Basic Fields Mapping
    const simpleFields = ['name', 'description', 'price', 'stock', 'category', 'brand', 'asin'];
    simpleFields.forEach(field => {
      if (formDataRaw[field] !== undefined) data.append(field, formDataRaw[field]);
    });

    // 2. Complex Fields Mapping (Stringify for Backend Parser)
    // Field ini datang dari state di ProductForm.jsx
    if (formDataRaw.specifications) {
      data.append('specifications', JSON.stringify(formDataRaw.specifications));
    }
    if (formDataRaw.bulletPoints) {
      data.append('bulletPoints', JSON.stringify(formDataRaw.bulletPoints));
    }
    if (formDataRaw.shippingInfo) {
      data.append('shippingInfo', JSON.stringify(formDataRaw.shippingInfo));
    }

    // 3. Images Handling
    if (formDataRaw.images && formDataRaw.images.length > 0) {
      formDataRaw.images.forEach((file) => {
        data.append('images', file);
      });
    }

    try {
      if (initialData) {
        await updateProduct({ id: initialData._id, formData: data }).unwrap();
        toast.success('Product Updated in Catalog', { icon: '🔄' });
      } else {
        await createProduct(data).unwrap();
        toast.success('Product Launched Successfully!', {
          style: { background: '#131921', color: '#febd69' }
        });
      }
      navigate('/admin/dashboard/products'); 
    } catch (error) {
      const errorMessage = error.data?.message || "Internal System Error";
      toast.error(errorMessage);
      console.error("[Amazon-System] Transaction Failed:", error);
    }
  };

  return { handleSubmit, isLoading: isCreating || isUpdating };
};