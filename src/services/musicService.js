import { supabase } from '../supabase';

/**
 * Müzik Servisi
 * Veritabanı işlemleri burada yapılır.
 * UI (Arayüz) tarafı burayı kullanır, Supabase'i tanımaz.
 */

export const musicService = {
  
  // Tüm müzikleri getir
  async getAllMusic() {
    try {
      // 1. Veritabanı İsteği
      const { data, error, status } = await supabase
        .from('resources')
        .select('*')
        .eq('type', 'music') // Sadece müzik tipindekiler
        .order('created_at', { ascending: false });

      // 2. Error Handling (Hata Yönetimi)
      if (error) {
        // Supabase hatasını kendi formatımıza çeviriyoruz
        throw new Error(`Veritabanı Hatası: ${error.message} (Kod: ${status})`);
      }

      // 3. Response Schema & Formatter (Yanıt Şeması ve Formatlama)
      // Dönen veriyi kontrol edip, eksik alanları (resim vb.) dolduruyoruz.
      const formattedData = data.map(item => ({
        id: item.id,
        title: item.title || 'Bênav', // Başlık yoksa 'İsimsiz'
        category: item.category || 'Giştî', // Kategori yoksa 'Genel'
        url: item.url,
        // Resim yoksa varsayılan bir placeholder dönüyoruz (Presenter Mantığı)
        imageUrl: item.image_url || null, 
        createdAt: item.created_at
      }));

      // 4. Başarılı Dönüş (Response)
      return {
        success: true,
        data: formattedData,
        count: formattedData.length
      };

    } catch (err) {
      // 5. Uncaught Error Handling (Beklenmeyen Hata Yakalama)
      console.error('MusicService Error:', err);
      
      return {
        success: false,
        data: [],
        error: err.message || 'Bilinmeyen bir hata oluştu.'
      };
    }
  }
};