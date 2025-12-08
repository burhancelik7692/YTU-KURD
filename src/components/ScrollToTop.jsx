import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Standart Pencere Kaydırma (En garantisi)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // 'smooth' yerine 'instant' kullanıyoruz ki hemen gitsin
    });
    
    // 2. HTML ve Body etiketlerini de zorla yukarı it
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    // 3. Eğer scroll bir 'div' içindeyse (Örn: .app-container) onu bul ve kaydır
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }

    // 4. Eğer 'root' divi kayıyorsa onu da dene
    const rootDiv = document.getElementById('root');
    if (rootDiv) {
      rootDiv.scrollTo(0, 0);
    }

  }, [pathname]); // Her sayfa değiştiğinde (pathname) çalışır

  return null;
};

export default ScrollToTop;