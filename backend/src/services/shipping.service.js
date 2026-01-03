export const calculateShippingRate = async (origin, destination, weight) => {
  // Logika skala besar: Integrasi API pihak ketiga dengan caching Redis
  // Agar tidak memanggil API ongkir terus-menerus untuk rute yang sama
  const cacheKey = `ship:${origin}:${destination}:${weight}`;
  // (Asumsikan ada logic redis.get di sini)
  
  return {
    service: 'Standard Expedition',
    cost: weight * 5000, // Contoh perhitungan sederhana
    estimatedDays: '2-3 Days'
  };
};