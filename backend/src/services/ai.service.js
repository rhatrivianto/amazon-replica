export const getProductRecommendations = async (productId) => {
  // Amazon-scale: Biasanya mengambil data dari Vector Database (Pinecone/Milvus)
  // atau dari pre-computed table di Redis
  return { 
    suggestedIds: [], 
    reason: "Frequently bought together" 
  };
};