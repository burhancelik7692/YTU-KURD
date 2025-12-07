import { supabase } from '../supabase';

/**
 * Sanat Servisi (Art Service)
 * Standartlara uygun hata yönetimi ve veri formatlama içerir.
 */

export const artService = {
  
  // Sanat içeriklerini getir (Kartlar ve Galeri için)
  async getArtContent() {
    try {
      // 1. Veritabanı İsteği
      const { data, error, status } = await supabase
        .from('resources')
        .select('*')
        .eq('type', 'art') // Sadece 'art' tipindekileri getir
        .order('created_at', { ascending: true });

      // 2. Error Handling
      if (error) {
        throw new Error(`Veritabanı Hatası: ${error.message} (Kod: ${status})`);
      }

      // 3. Response Schema & Formatter (Formatlayıcı)
      // Frontend'in beklediği temiz objeyi oluşturuyoruz
      const formattedData = data.map(item => ({
        id: item.id,
        title: item.title || 'Bênav',
        description: item.description || '', // Yeni eklediğimiz açıklama sütunu
        category: item.category || 'Giştî', // Kategori (örn: sinema, wene)
        // Resim yoksa placeholder koyuyoruz (Null Check)
        image: item.image_url || 'https://placehold.co/600x400?text=Wêne+Tune', 
      }));

      // 4. Başarılı Dönüş
      return {
        success: true,
        data: formattedData
      };

    } catch (err) {
      // 5. Uncaught Error Handling
      console.error('ArtService Error:', err);
      
      return {
        success: false,
        data: [],
        error: err.message || 'Beklenmeyen bir hata oluştu.'
      };
    }
  }
};