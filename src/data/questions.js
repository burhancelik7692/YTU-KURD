// ==========================================
// 1. KELİME OYUNU HAVUZU (WORDLE)
// ==========================================
export const WORDLE_DB = [
  { word: "AZADÎ", meaning: "Özgürlük" }, { word: "HEVAL", meaning: "Arkadaş" },
  { word: "JÎYAN", meaning: "Yaşam" }, { word: "ZIMAN", meaning: "Dil" },
  { word: "XEBAT", meaning: "Çalışma" }, { word: "BAWER", meaning: "İnanç" },
  { word: "AGIRÎ", meaning: "Ağrı" }, { word: "DÎROK", meaning: "Tarih" },
  { word: "HUNER", meaning: "Sanat" }, { word: "WELAT", meaning: "Vatan" },
  { word: "PÊNÛS", meaning: "Kalem" }, { word: "ŞAHÎD", meaning: "Şahit" },
  { word: "KEVIR", meaning: "Taş" }, { word: "ÇIYAY", meaning: "Dağ" },
  { word: "GULAN", meaning: "Mayıs / Güller" }, { word: "BAHAR", meaning: "Bahar" },
  { word: "CÎRAN", meaning: "Komşu" }, { word: "EVÎNÎ", meaning: "Aşk" },
  { word: "HÊVÎY", meaning: "Umut" }, { word: "MÊVAN", meaning: "Misafir" },
  { word: "RÊZAN", meaning: "Yol Gösteren" }, { word: "SÊVÊN", meaning: "Elmalar" },
  { word: "ŞEVÊN", meaning: "Geceler" }, { word: "TÎRÊJ", meaning: "Işın" },
  { word: "XORTA", meaning: "Gençler" }, { word: "ZOZAN", meaning: "Yayla" },
  { word: "BIRÎN", meaning: "Yara" }, { word: "HAVÎN", meaning: "Yaz" },
  { word: "KURDÎ", meaning: "Kürtçe" }, { word: "QÊRÎN", meaning: "Haykırış" },
  { word: "RÛKEN", meaning: "Güler Yüzlü" }, { word: "SEROK", meaning: "Başkan" },
  { word: "ŞERMÎ", meaning: "Utangaç" }, { word: "XEWNÊ", meaning: "Rüya" },
  { word: "BELGÊ", meaning: "Belge" }, { word: "CEJNÊ", meaning: "Bayram" },
  { word: "HEVRA", meaning: "Birlikte" }, { word: "KELEH", meaning: "Kale" },
  { word: "LEŞKER", meaning: "Asker" }, { word: "MALBAT", meaning: "Aile" },
  { word: "ŞIVAN", meaning: "Çoban" }, { word: "VEGER", meaning: "Dönüş" },
  { word: "XANÎY", meaning: "Ev / Hane" }, { word: "ZANAY", meaning: "Bilge" },
  { word: "AŞTÎY", meaning: "Barış" }, { word: "ZAVAY", meaning: "Damat" },
  { word: "KOFÎY", meaning: "Kofi (Başlık)" }, { word: "DEŞTÊ", meaning: "Ova" }
];

// ==========================================
// 2. KÜLTÜR TESTİ HAVUZU (QUIZ)
// ==========================================
export const QUIZ_DB = [
  
  // --- KATEGORİ: DÎROK (TARİH) ---
  
  // SEVİYE 1: HÊSAN (KOLAY)
  { category: "Dîrok", difficulty: 1, question: "Cejna neteweyî ya Kurdan a 21ê Adarê çi ye?", options: [{ text: "Newroz", points: 10 }, { text: "Sersal", points: 0 }, { text: "Cejna Remezanê", points: 0 }], explanation: "Newroz cejna neteweyî û destpêka biharê ye." },
  { category: "Dîrok", difficulty: 1, question: "Kawayê Hesinkar li dijî kê serî hilda?", options: [{ text: "Dehak", points: 10 }, { text: "Romayî", points: 0 }, { text: "Mongol", points: 0 }], explanation: "Kawa li dijî zilma Dehak serî hilda." },
  { category: "Dîrok", difficulty: 1, question: "Bajarê 'Amed' îro bi kîjan navî tê zanîn?", options: [{ text: "Diyarbakır", points: 10 }, { text: "Mardin", points: 0 }, { text: "Batman", points: 0 }], explanation: "Amed navê kevn ê Diyarbakırê ye." },
  { category: "Dîrok", difficulty: 1, question: "Selahedînê Eyûbî kîjan bajar ji Xaçperestan rizgar kir?", options: [{ text: "Quds", points: 10 }, { text: "Şam", points: 0 }, { text: "Bexda", points: 0 }], explanation: "Di sala 1187an de." },
  { category: "Dîrok", difficulty: 1, question: "Paytexta Başûrê Kurdistanê kîjan bajar e?", options: [{ text: "Hewlêr", points: 10 }, { text: "Silêmanî", points: 0 }, { text: "Dihok", points: 0 }], explanation: "Hewlêr (Erbil) paytext e." },
  { category: "Dîrok", difficulty: 1, question: "Kîjan bajar wekî 'Bajarê Pêxemberan' tê nasîn?", options: [{ text: "Riha (Urfa)", points: 10 }, { text: "Dîlok", points: 0 }, { text: "Mûş", points: 0 }], explanation: "Riha bajarê Îbrahîm Pêxember e." },
  { category: "Dîrok", difficulty: 1, question: "Keleha Hewlêrê çend salî ye?", options: [{ text: "Zêdeyî 6000 sal", points: 10 }, { text: "100 sal", points: 0 }, { text: "1000 sal", points: 0 }], explanation: "Yek ji kevntirîn bajarên cîhanê ye." },
  { category: "Dîrok", difficulty: 1, question: "Çiyayê Agirî li kîjan bajarî ye?", options: [{ text: "Agirî", points: 10 }, { text: "Wan", points: 0 }, { text: "Qers", points: 0 }], explanation: "Çiyayê herî bilind ê Kurdistanê ye." },
  { category: "Dîrok", difficulty: 1, question: "Gola Wanê li ku ye?", options: [{ text: "Bakurê Kurdistanê", points: 10 }, { text: "Başûrê Kurdistanê", points: 0 }, { text: "Rojhilatê Kurdistanê", points: 0 }], explanation: "Gola herî mezin a Kurdistanê ye." },
  { category: "Dîrok", difficulty: 1, question: "Kîjan bajar bi Sûran navdar e?", options: [{ text: "Amed", points: 10 }, { text: "Mêrdîn", points: 0 }, { text: "Sêrt", points: 0 }], explanation: "Sûrên Amedê di cîhanê de navdar in." },

  // SEVİYE 2: NAVÎN (ORTA)
  { category: "Dîrok", difficulty: 2, question: "Kîjan împaratorî wekî bavikên Kurdan tê nasîn?", options: [{ text: "Med", points: 10 }, { text: "Asûr", points: 0 }, { text: "Sûmer", points: 0 }], explanation: "Împaratoriya Medan B.Z. 612 ava bû." },
  { category: "Dîrok", difficulty: 2, question: "Nivîskarê 'Şerefname' kî ye?", options: [{ text: "Şerefxanê Bedlîsî", points: 10 }, { text: "Ehmedê Xanî", points: 0 }, { text: "Melayê Cizîrî", points: 0 }], explanation: "Şerefname (1597) dîroka mîrektiyên Kurd e." },
  { category: "Dîrok", difficulty: 2, question: "Komara Kurdistanê ya Mehabadê kîjan salê ava bû?", options: [{ text: "1946", points: 10 }, { text: "1923", points: 0 }, { text: "1958", points: 0 }], explanation: "Temenê wê 11 meh bûn." },
  { category: "Dîrok", difficulty: 2, question: "Peymana ku Kurdistan kir çar parçe kîjan e?", options: [{ text: "Lozan (1923)", points: 10 }, { text: "Sevr", points: 0 }, { text: "Zuhab", points: 0 }], explanation: "Peymana Lozanê sînorên îro xêz kirin." },
  { category: "Dîrok", difficulty: 2, question: "Mîrektiya Botan li kîjan bajarî hikûm kir?", options: [{ text: "Cizîr", points: 10 }, { text: "Wan", points: 0 }, { text: "Hekarî", points: 0 }], explanation: "Bedirxaniyan li Cizîrê bûn." },
  { category: "Dîrok", difficulty: 2, question: "Qesra Îshaq Paşa li kîjan navçeyê ye?", options: [{ text: "Bazîd", points: 10 }, { text: "Gever", points: 0 }, { text: "Tetwan", points: 0 }], explanation: "Li Bazîda Agiriyê ye." },
  { category: "Dîrok", difficulty: 2, question: "Şerê 'Keleha Dimdimê' li dijî kê bû?", options: [{ text: "Sefewiyan", points: 10 }, { text: "Osmaniyan", points: 0 }, { text: "Ereban", points: 0 }], explanation: "Xanê Lepzêrîn serokatiya berxwedanê kir." },
  { category: "Dîrok", difficulty: 2, question: "Kîjan şikeft li Kurdistanê cihê jiyana pêşîn a mirovan e?", options: [{ text: "Şaneder", points: 10 }, { text: "Damlatas", points: 0 }, { text: "Karain", points: 0 }], explanation: "Şikefta Şaneder li Başûr e." },
  { category: "Dîrok", difficulty: 2, question: "Serhildana Agiriyê di bin serokatiya kê de bû?", options: [{ text: "Îhsan Nûrî Paşa", points: 10 }, { text: "Simko", points: 0 }, { text: "Şêx Seîd", points: 0 }], explanation: "Komara Agiriyê (1927-1930)." },
  { category: "Dîrok", difficulty: 2, question: "Mîrektiya Baban li kîjan bajarî hikûm kir?", options: [{ text: "Silêmanî", points: 10 }, { text: "Hewlêr", points: 0 }, { text: "Kerkûk", points: 0 }], explanation: "Bajarê Silêmanî ji aliyê wan ve hat avakirin." },

  // SEVİYE 3: ZEHMET (ZOR)
  { category: "Dîrok", difficulty: 3, question: "Kîjan şaristaniya kevnar li cihê 'Xirabreşk' (Göbeklitepe) jiyaye?", options: [{ text: "Nenas (Pêşdîrok)", points: 10 }, { text: "Hîtît", points: 0 }, { text: "Babîl", points: 0 }], explanation: "Perestgeha herî kevn a cîhanê ye (12.000 sal)." },
  { category: "Dîrok", difficulty: 3, question: "Dewleta 'Dostadî' (Merwanî) kîjan salan hikûm kir?", options: [{ text: "983-1085", points: 10 }, { text: "1100-1200", points: 0 }, { text: "800-900", points: 0 }], explanation: "Paytexta wan Amed û Meyafarqîn bû." },
  { category: "Dîrok", difficulty: 3, question: "Navê jina Mîrê Soran kî bû ku demekê hikûm kir?", options: [{ text: "Xanzad", points: 10 }, { text: "Adela Xanim", points: 0 }, { text: "Mestûre", points: 0 }], explanation: "Mîr Xanzad li Qelaya Xanzadê (Hewlêr) tê zanîn." },
  { category: "Dîrok", difficulty: 3, question: "Mîrektiya 'Hesnewiyan' li ku derê hate damezrandin?", options: [{ text: "Rojhilat (Kirmaşan)", points: 10 }, { text: "Bakur (Wan)", points: 0 }, { text: "Başûr (Dihok)", points: 0 }], explanation: "Di sedsala 10an de." },
  { category: "Dîrok", difficulty: 3, question: "Pirtûka 'Mînaalan' (Dîroka Kurdan) ya Mînorskî behsa çi dike?", options: [{ text: "Eslê Kurdan", points: 10 }, { text: "Muzîka Kurdî", points: 0 }, { text: "Ziman", points: 0 }], explanation: "Vladimir Minorsky kurdnasekî navdar bû." },
  { category: "Dîrok", difficulty: 3, question: "Kîjan padîşahê Sasaniyan eslê xwe Kurd didît?", options: [{ text: "Erdeşîrê Babekan", points: 10 }, { text: "Xusrew", points: 0 }, { text: "Yezdgerd", points: 0 }], explanation: "Di 'Karnameya Erdeşîr' de behs tê kirin." },
  { category: "Dîrok", difficulty: 3, question: "Peymana Qesrî Şîrîn (Zuhab) kîjan salê hat îmzekirin?", options: [{ text: "1639", points: 10 }, { text: "1514", points: 0 }, { text: "1923", points: 0 }], explanation: "Kurdistan cara yekem di navbera Osmanî û Îranê de parçe bû." },
  { category: "Dîrok", difficulty: 3, question: "Mîrektiya 'Şedadî' li kîjan herêmê hikûm kir?", options: [{ text: "Erîvan û Gence", points: 10 }, { text: "Mûsil", points: 0 }, { text: "Tewrêz", points: 0 }], explanation: "Di navbera salên 951-1174an de." },
  { category: "Dîrok", difficulty: 3, question: "Kîjan peyman di sala 1975an de bû sedema têkçûna şoreşa Kurd li Iraqê?", options: [{ text: "Peymana Cezayîrê", points: 10 }, { text: "Peymana Enqereyê", points: 0 }, { text: "Peymana Bexdayê", points: 0 }], explanation: "Di navbera Iraq û Îranê de." },
  { category: "Dîrok", difficulty: 3, question: "Yekemîn rojnameya Kurdî 'Kurdistan' li ku derket?", options: [{ text: "Qahîre", points: 10 }, { text: "Parîs", points: 0 }, { text: "Stenbol", points: 0 }], explanation: "1898, ji aliyê Mîqdad Mîdhad Bedirxan ve." },

  // --- KATEGORİ: WÊJE (EDEBİYAT) ---

  // SEVİYE 1: HÊSAN
  { category: "Wêje", difficulty: 1, question: "Nivîskarê 'Mem û Zîn' kî ye?", options: [{ text: "Ehmedê Xanî", points: 10 }, { text: "Melayê Cizîrî", points: 0 }, { text: "Feqiyê Teyran", points: 0 }], explanation: "Şahesera edebiyata Kurdî ye." },
  { category: "Wêje", difficulty: 1, question: "Kîjan helbestvanê Kurd bi 'Dîwana' xwe navdar e?", options: [{ text: "Melayê Cizîrî", points: 10 }, { text: "Cegerxwîn", points: 0 }, { text: "Pîremêrd", points: 0 }], explanation: "Dîwana wî bi evîna îlahî tije ye." },
  { category: "Wêje", difficulty: 1, question: "Romana 'Şivanê Kurmanca' ya kê ye?", options: [{ text: "Erebê Şemo", points: 10 }, { text: "Mehmed Uzun", points: 0 }, { text: "Jan Dost", points: 0 }], explanation: "Yekemîn romana Kurdî tê hesibandin." },
  { category: "Wêje", difficulty: 1, question: "Helbesta 'Kî me Ez?' ya kê ye?", options: [{ text: "Cegerxwîn", points: 10 }, { text: "Hejar", points: 0 }, { text: "Bêkes", points: 0 }], explanation: "Cegerxwîn şaîrê azadiyê ye." },
  { category: "Wêje", difficulty: 1, question: "Nivîskarê romana 'Tu' kî ye?", options: [{ text: "Mehmed Uzun", points: 10 }, { text: "Firat Cewerî", points: 0 }, { text: "Helîm Yûsiv", points: 0 }], explanation: "Mehmed Uzun romannivîsekî nûjen e." },
  { category: "Wêje", difficulty: 1, question: "Destana 'Zembîlfiroş' li ser çi ye?", options: [{ text: "Evîn û Îman", points: 10 }, { text: "Şer", points: 0 }, { text: "Dîrok", points: 0 }], explanation: "Çîroka Mîr û Zembîlfiroş." },
  { category: "Wêje", difficulty: 1, question: "Feqiyê Teyran bi kê re ketiye diyalogê?", options: [{ text: "Melayê Cizîrî", points: 10 }, { text: "Ehmedê Xanî", points: 0 }, { text: "Mewlana", points: 0 }], explanation: "Pirs û bersivên wan navdar in." },
  { category: "Wêje", difficulty: 1, question: "Sirûda 'Ey Reqîb' kê nivîsand?", options: [{ text: "Dildar", points: 10 }, { text: "Pîremêrd", points: 0 }, { text: "Goran", points: 0 }], explanation: "Sirûda neteweyî ye." },
  { category: "Wêje", difficulty: 1, question: "Kovar û rojnameya yekem 'Kurdistan' kê derxist?", options: [{ text: "Mîqdad Mîdhad Bedirxan", points: 10 }, { text: "Celadet Bedirxan", points: 0 }, { text: "Osman Sebrî", points: 0 }], explanation: "1898, Qahîre." },
  { category: "Wêje", difficulty: 1, question: "Pirtûka pîroz a Êzidiyan çi ye?", options: [{ text: "Mishefa Reş", points: 10 }, { text: "Avesta", points: 0 }, { text: "Zebûr", points: 0 }], explanation: "Cilwe û Mishefa Reş." },

  // SEVİYE 2: NAVÎN
  { category: "Wêje", difficulty: 2, question: "Melayê Cizîrî bi kîjan navî tê nasîn?", options: [{ text: "Nîşana Evînê", points: 10 }, { text: "Bavê Kurdan", points: 0 }, { text: "Mîrê Helbestê", points: 0 }], explanation: "Mela şaîrê evîna heqîqî ye." },
  { category: "Wêje", difficulty: 2, question: "Romana 'Siya Evînê' ya kê ye?", options: [{ text: "Mehmed Uzun", points: 10 }, { text: "Firat Cewerî", points: 0 }, { text: "Hesenê Metê", points: 0 }], explanation: "Yek ji romanên girîng ên Uzun e." },
  { category: "Wêje", difficulty: 2, question: "Kîjan helbestvanê Kurd 'Soranî' standard kir?", options: [{ text: "Goran", points: 10 }, { text: "Nalî", points: 0 }, { text: "Salem", points: 0 }], explanation: "Ebdulla Goran şêwaza nû anî." },
  { category: "Wêje", difficulty: 2, question: "Mewlewiyê Kurd bi kîjan zaravayî nivîsandiye?", options: [{ text: "Hewramî", points: 10 }, { text: "Kurmancî", points: 0 }, { text: "Soranî", points: 0 }], explanation: "Klasîkên Hewramî." },
  { category: "Wêje", difficulty: 2, question: "Nivîskarê 'Dîroka Edebiyata Kurdî' kî ye?", options: [{ text: "Marûf Xeznedar", points: 10 }, { text: "Qanatê Kurdo", points: 0 }, { text: "Mehmed Uzun", points: 0 }], explanation: "Berhema herî berfireh e." },
  { category: "Wêje", difficulty: 2, question: "Kîjan pirtûk ji aliyê Mîr Celadet ve hatiye nivîsandin?", options: [{ text: "Rêzimana Kurdî", points: 10 }, { text: "Dîwan", points: 0 }, { text: "Çîrokên Gelêrî", points: 0 }], explanation: "Bingehên gramera Kurmancî." },
  { category: "Wêje", difficulty: 2, question: "Helbesta 'Helebçe' ya kê ye?", options: [{ text: "Şêrko Bêkes", points: 10 }, { text: "Cegerxwîn", points: 0 }, { text: "Hejar", points: 0 }], explanation: "Şêrko Bêkes êşa Helebçeyê aniye ziman." },
  { category: "Wêje", difficulty: 2, question: "Wergêrê 'Şerefname'yê (ji Farisî bo Kurmancî) kî ye?", options: [{ text: "M. Emîn Bozarslan", points: 10 }, { text: "Ziya Avci", points: 0 }, { text: "Celadet Bedirxan", points: 0 }], explanation: "M. Emîn Bozarslan wergera herî naskirî kir." },
  { category: "Wêje", difficulty: 2, question: "Kîjan kovara nûjen li Bakur derket?", options: [{ text: "Nûbihar", points: 10 }, { text: "Hawar", points: 0 }, { text: "Ronahî", points: 0 }], explanation: "Kovara Nûbiharê demeke dirêj e weşanê dike." },
  { category: "Wêje", difficulty: 2, question: "Kîjan nivîskarê Kurd 'Xelata Nobelê' wernegirtiye lê namzet bû?", options: [{ text: "Yaşar Kemal", points: 10 }, { text: "Orhan Pamuk", points: 0 }, { text: "Elîf Şafak", points: 0 }], explanation: "Yaşar Kemal bi eslê xwe Kurd bû." },

  // SEVİYE 3: ZEHMET
  { category: "Wêje", difficulty: 3, question: "Pirtûka 'Nûbihara Biçûkan' (Ferheng) ya kê ye?", options: [{ text: "Ehmedê Xanî", points: 10 }, { text: "Melayê Cizîrî", points: 0 }, { text: "Feqiyê Teyran", points: 0 }], explanation: "Yekemîn ferhenga Kurdî-Erebî ye ji bo zarokan." },
  { category: "Wêje", difficulty: 3, question: "Yekemîn romana Kurdî li Başûr 'Meseley Wijdan' kê nivîsand?", options: [{ text: "Ehmed Muxtar Caf", points: 10 }, { text: "Erebê Şemo", points: 0 }, { text: "Îbrahîm Ehmed", points: 0 }], explanation: "An jî 'Janî Gel' a Îbrahîm Ehmed." },
  { category: "Wêje", difficulty: 3, question: "Kîjan helbestvanê Kurd bi 'Xezel'ên xwe yên erotîk/sûfî tê zanîn?", options: [{ text: "Nalî", points: 10 }, { text: "Mewlewî", points: 0 }, { text: "Hejar", points: 0 }], explanation: "Nalî damezrînerê ekola Baban e." },
  { category: "Wêje", difficulty: 3, question: "Feqiyê Teyran kîjan berhema xwe li ser 'Zimanê Teyran' nivîsandiye?", options: [{ text: "Mantiqut Teyr", points: 10 }, { text: "Dîwan", points: 0 }, { text: "Bersîs", points: 0 }], explanation: "Bandora Ferîdûdîn Attar heye." },
  { category: "Wêje", difficulty: 3, question: "Kîjan nivîskarê Kurd 'Ansîklopediya Îslamê' wergerand?", options: [{ text: "Hejar Mukriyanî", points: 10 }, { text: "Hêmin", points: 0 }, { text: "Qanatê Kurdo", points: 0 }], explanation: "Wergera 'Qanûn' a Îbnî Sîna jî wî kir." },
  { category: "Wêje", difficulty: 3, question: "Romana 'Labîrenta Cinan' ya kê ye?", options: [{ text: "Hesenê Metê", points: 10 }, { text: "Firat Cewerî", points: 0 }, { text: "Helîm Yûsiv", points: 0 }], explanation: "Romaneke modern a Kurdî." },
  { category: "Wêje", difficulty: 3, question: "Kîjan pirtûk behsa 'Zargotina Kurdên Êrîvanê' dike?", options: [{ text: "Heciyê Cindî", points: 10 }, { text: "Erebê Şemo", points: 0 }, { text: "Qanatê Kurdo", points: 0 }], explanation: "Xebatên folklorê." },
  { category: "Wêje", difficulty: 3, question: "Pirtûka 'Adetên Kurdan' kê nivîsand?", options: [{ text: "Mela Mehmûdê Bazîdî", points: 10 }, { text: "Ehmedê Xanî", points: 0 }, { text: "Bedirxan", points: 0 }], explanation: "Bi alîkariya Alexander Jaba (1860)." },
  { category: "Wêje", difficulty: 3, question: "Navê helbesta Cegerxwîn a ji bo 'Lenîn' çi ye?", options: [{ text: "Lenîn", points: 10 }, { text: "Stalîn", points: 0 }, { text: "Marx", points: 0 }], explanation: "Cegerxwîn komûnîst bû." },
  { category: "Wêje", difficulty: 3, question: "Kîjan helbestvanê Kurd bi 'Çarîn'ên (Rubaî) xwe navdar e?", options: [{ text: "Baba Tahîrê Uryan", points: 10 }, { text: "Xeyam", points: 0 }, { text: "Nalî", points: 0 }], explanation: "Beriya Omer Xeyam jiyaye." },

  // --- KATEGORİ: ZIMAN (DİL) ---

  // SEVİYE 1: HÊSAN
  { category: "Ziman", difficulty: 1, question: "'Rojbaş' tê çi wateyê?", options: [{ text: "Günaydın", points: 10 }, { text: "İyi geceler", points: 0 }, { text: "Hoşçakal", points: 0 }], explanation: "Silava sibehê." },
  { category: "Ziman", difficulty: 1, question: "'Spas' çi ye?", options: [{ text: "Teşekkür", points: 10 }, { text: "Rica", points: 0 }, { text: "Lütfen", points: 0 }], explanation: "Peyva minetdariyê." },
  { category: "Ziman", difficulty: 1, question: "'Ez ji te hez dikim' bi Tirkî çi ye?", options: [{ text: "Seni seviyorum", points: 10 }, { text: "Seni özledim", points: 0 }, { text: "Nasılsın", points: 0 }], explanation: "Peyva evînê." },
  { category: "Ziman", difficulty: 1, question: "Zimanê Kurdî ji kîjan malbatê ye?", options: [{ text: "Hînd-Ewropî", points: 10 }, { text: "Samî", points: 0 }, { text: "Ural-Altay", points: 0 }], explanation: "Koma zimanên Îranî." },
  { category: "Ziman", difficulty: 1, question: "'Nan' tê çi wateyê?", options: [{ text: "Ekmek", points: 10 }, { text: "Su", points: 0 }, { text: "Yemek", points: 0 }], explanation: "Xwarina bingehîn." },
  { category: "Ziman", difficulty: 1, question: "'Av' tê çi wateyê?", options: [{ text: "Su", points: 10 }, { text: "Ateş", points: 0 }, { text: "Toprak", points: 0 }], explanation: "Jiyan e." },
  { category: "Ziman", difficulty: 1, question: "'Şevbaş' kîngê tê gotin?", options: [{ text: "Bi şev (İyi geceler)", points: 10 }, { text: "Sibehê", points: 0 }, { text: "Nîvro", points: 0 }], explanation: "Xatirxwestina şevê." },
  { category: "Ziman", difficulty: 1, question: "Kîjan zarava li Amedê tê axaftin?", options: [{ text: "Kurmancî", points: 10 }, { text: "Soranî", points: 0 }, { text: "Kelhûrî", points: 0 }], explanation: "Kurmancî zaravayê herî mezin e." },
  { category: "Ziman", difficulty: 1, question: "Alfabeya Kurdî ya latînî çend tîp in?", options: [{ text: "31", points: 10 }, { text: "29", points: 0 }, { text: "28", points: 0 }], explanation: "Alfabeya Hawarê." },
  { category: "Ziman", difficulty: 1, question: "'Dest' bi Tirkî çi ye?", options: [{ text: "El", points: 10 }, { text: "Ayak", points: 0 }, { text: "Baş", points: 0 }], explanation: "Endamê laş." },

  // SEVİYE 2: NAVÎN
  { category: "Ziman", difficulty: 2, question: "Zaravayê Zazakî bi kîjan navî din tê zanîn?", options: [{ text: "Kirdkî / Dimilkî", points: 10 }, { text: "Soranî", points: 0 }, { text: "Lorî", points: 0 }], explanation: "Li Dêrsim û Çewligê tê axaftin." },
  { category: "Ziman", difficulty: 2, question: "Kîjan zarava li Başûrê Kurdistanê (Hewlêr, Silêmanî) fermî ye?", options: [{ text: "Soranî", points: 10 }, { text: "Kurmancî", points: 0 }, { text: "Hewramî", points: 0 }], explanation: "Bi tîpên Erebî tê nivîsandin." },
  { category: "Ziman", difficulty: 2, question: "Cînavka 'Ez' bi Soranî çi ye?", options: [{ text: "Min", points: 10 }, { text: "Ew", points: 0 }, { text: "To", points: 0 }], explanation: "Di Soranî de 'Min' tê bikaranîn." },
  { category: "Ziman", difficulty: 2, question: "'Pirtûkxane' tê çi wateyê?", options: [{ text: "Kütüphane", points: 10 }, { text: "Okul", points: 0 }, { text: "Kitapçı", points: 0 }], explanation: "Cihê pirtûkan." },
  { category: "Ziman", difficulty: 2, question: "'Mamoste' kî ye?", options: [{ text: "Öğretmen", points: 10 }, { text: "Öğrenci", points: 0 }, { text: "Müdür", points: 0 }], explanation: "Kesê fêr dike." },
  { category: "Ziman", difficulty: 2, question: "'Xwendekar' kî ye?", options: [{ text: "Öğrenci", points: 10 }, { text: "Öğretmen", points: 0 }, { text: "Yazar", points: 0 }], explanation: "Kesê dixwîne." },
  { category: "Ziman", difficulty: 2, question: "Di Kurdî de tîpa 'Ê' dengê çi dide?", options: [{ text: "E ya girtî/dirêj", points: 10 }, { text: "I ya kurt", points: 0 }, { text: "A ya vekirî", points: 0 }], explanation: "Wekî 'Elma'ya Tirkî lê dirêjtir." },
  { category: "Ziman", difficulty: 2, question: "'Aştî' peyveke çawa ye?", options: [{ text: "Barış", points: 10 }, { text: "Savaş", points: 0 }, { text: "Özgürlük", points: 0 }], explanation: "Dijberê şer e." },
  { category: "Ziman", difficulty: 2, question: "'Azadî' tê çi wateyê?", options: [{ text: "Özgürlük", points: 10 }, { text: "Barış", points: 0 }, { text: "Adalet", points: 0 }], explanation: "Armanca sereke." },
  { category: "Ziman", difficulty: 2, question: "'Jin, Jiyan, Azadî' tê çi wateyê?", options: [{ text: "Kadın, Yaşam, Özgürlük", points: 10 }, { text: "Kadın, Hayat, Barış", points: 0 }, { text: "Ekmek, Su, Özgürlük", points: 0 }], explanation: "Dirûşmeya navdar." },

  // SEVİYE 3: ZEHMET
  { category: "Ziman", difficulty: 3, question: "Celadet Bedirxan alfabeya latînî li ser kîjan kovarê ava kir?", options: [{ text: "Hawar", points: 10 }, { text: "Ronahî", points: 0 }, { text: "Jîn", points: 0 }], explanation: "Sala 1932." },
  { category: "Ziman", difficulty: 3, question: "Di Kurmancî de 'Ergative' (Cewherê Guherbar) kîngê çêdibe?", options: [{ text: "Di Dema Borî de", points: 10 }, { text: "Di Dema Niha de", points: 0 }, { text: "Her tim", points: 0 }], explanation: "Ez çûm (Ne-têper), Min nan xwar (Têper)." },
  { category: "Ziman", difficulty: 3, question: "'Rêzimana Kurdî' (Gramera Kurmancî) yekem car kê bi latînî nivîsand?", options: [{ text: "Celadet Bedirxan", points: 10 }, { text: "Cegerxwîn", points: 0 }, { text: "Osman Sebrî", points: 0 }], explanation: "Bingehê gramerê ye." },
  { category: "Ziman", difficulty: 3, question: "Zaravayê 'Kelhûrî' li ku tê axaftin?", options: [{ text: "Kirmaşan û Îlam", points: 10 }, { text: "Mehabad", points: 0 }, { text: "Hewlêr", points: 0 }], explanation: "Zaravayê herî mezin ê Rojhilat." },
  { category: "Ziman", difficulty: 3, question: "Cûdahiya 'Lêkerên Têper' û 'Ne-têper' çi ye?", options: [{ text: "Objeyê digirin an nagirin", points: 10 }, { text: "Demê nîşan didin", points: 0 }, { text: "Mê û Nêr in", points: 0 }], explanation: "Têper (Geçişli), Ne-têper (Geçişsiz)." },
  { category: "Ziman", difficulty: 3, question: "Di Kurmancî de 'Zayend' (Cinsiyet) heye?", options: [{ text: "Erê (Mê û Nêr)", points: 10 }, { text: "Na", points: 0 }, { text: "Tenê di Soranî de", points: 0 }], explanation: "Mînak: Ap (Nêr), Met (Mê)." },
  { category: "Ziman", difficulty: 3, question: "Alfabeya Kurdî ya 'Erebî' (Soranî) çend tîp in?", options: [{ text: "34", points: 10 }, { text: "28", points: 0 }, { text: "31", points: 0 }], explanation: "Tîpên wekî V, Ç, P, G, J, Rr, Ll lê zêde bûne." },
  { category: "Ziman", difficulty: 3, question: "Peyva 'Zimannas' tê çi wateyê?", options: [{ text: "Dilbilimci", points: 10 }, { text: "Yazar", points: 0 }, { text: "Çevirmen", points: 0 }], explanation: "Kesê pisporê ziman." },
  { category: "Ziman", difficulty: 3, question: "'Veqetandek' (Tewang) çi ye?", options: [{ text: "Paşgira -ê, -a (Îzafe)", points: 10 }, { text: "Lêker", points: 0 }, { text: "Cînavk", points: 0 }], explanation: "Mînak: Kurê min, Keça te." },
  { category: "Ziman", difficulty: 3, question: "'Lorî' zaravayekî Kurdî ye?", options: [{ text: "Erê", points: 10 }, { text: "Na, zimanekî din e", points: 0 }, { text: "Erebî ye", points: 0 }], explanation: "Zaravayê herî başûr ê Kurdistanê ye." },

  // --- KATEGORİ: FOLKLOR ---

  // SEVİYE 1: HÊSAN
  { category: "Folklor", difficulty: 1, question: "Xwarina 'Dolme' ji çi tê çêkirin?", options: [{ text: "Pelên tirî û birinc", points: 10 }, { text: "Goşt û nan", points: 0 }, { text: "Şîr û şekir", points: 0 }], explanation: "Xwarineke neteweyî ye." },
  { category: "Folklor", difficulty: 1, question: "Şal û Şapik kî li xwe dike?", options: [{ text: "Mêr", points: 10 }, { text: "Jin", points: 0 }, { text: "Zarok tenê", points: 0 }], explanation: "Cilê mêran ê kevneşopî." },
  { category: "Folklor", difficulty: 1, question: "Kofî çi ye?", options: [{ text: "Serpoşê Jinan", points: 10 }, { text: "Xwarin", points: 0 }, { text: "Amûra muzîkê", points: 0 }], explanation: "Jinan didan serê xwe." },
  { category: "Folklor", difficulty: 1, question: "Govend çi ye?", options: [{ text: "Reqsa Kurdî", points: 10 }, { text: "Xwarin", points: 0 }, { text: "Lîstika zarokan", points: 0 }], explanation: "Dîlan / Halay." },
  { category: "Folklor", difficulty: 1, question: "Sergovend kî ye?", options: [{ text: "Kesê destpêkê", points: 10 }, { text: "Tembûrvan", points: 0 }, { text: "Bûk", points: 0 }], explanation: "Serkêşê dîlanê." },
  { category: "Folklor", difficulty: 1, question: "Kîjan amûr di muzîka Kurdî de sereke ye?", options: [{ text: "Tembûr / Saz", points: 10 }, { text: "Piyano", points: 0 }, { text: "Gîtar", points: 0 }], explanation: "Dengbêj û hunermend bikar tînin." },
  { category: "Folklor", difficulty: 1, question: "Newroz kîjan demsalê dest pê dike?", options: [{ text: "Bihar", points: 10 }, { text: "Havîn", points: 0 }, { text: "Zivistan", points: 0 }], explanation: "21ê Adarê." },
  { category: "Folklor", difficulty: 1, question: "Rengên 'Keskesor'ê çend in?", options: [{ text: "7", points: 10 }, { text: "3", points: 0 }, { text: "4", points: 0 }], explanation: "Keskûsor (Gökkuşağı)." },
  { category: "Folklor", difficulty: 1, question: "Sembola 'Rojê' li ser Ala Kurdistanê çend tîrêj e?", options: [{ text: "21", points: 10 }, { text: "18", points: 0 }, { text: "12", points: 0 }], explanation: "Nîşana 21ê Adarê." },
  { category: "Folklor", difficulty: 1, question: "Kîjan ajal di çanda Kurdî de pîroz e?", options: [{ text: "Tawus", points: 10 }, { text: "Gur", points: 0 }, { text: "Hirç", points: 0 }], explanation: "Tawusê Melek (Êzidîtî)." },

  // SEVİYE 2: NAVÎN
  { category: "Folklor", difficulty: 2, question: "Mîrê tembûrê kî ye?", options: [{ text: "Seîd Yûsiv", points: 10 }, { text: "Şivan Perwer", points: 0 }, { text: "Aram Tîgran", points: 0 }], explanation: "Seîd Yûsiv hostayê tembûrê (Bizinq) bû." },
  { category: "Folklor", difficulty: 2, question: "Destana 'Memê Alan' çavkaniya kîjan berhemê ye?", options: [{ text: "Mem û Zîn", points: 10 }, { text: "Siyabend û Xecê", points: 0 }, { text: "Zembîlfiroş", points: 0 }], explanation: "Ehmedê Xanî ji Memê Alan îlhama xwe girt." },
  { category: "Folklor", difficulty: 2, question: "Kîjan xwarin li Sêrtê navdar e?", options: [{ text: "Biryan", points: 10 }, { text: "Kebab", points: 0 }, { text: "Tirşik", points: 0 }], explanation: "Biryana Sêrtê." },
  { category: "Folklor", difficulty: 2, question: "Navê hespê Ristemê Zal çi bû?", options: [{ text: "Rexş", points: 10 }, { text: "Boz", points: 0 }, { text: "Qers", points: 0 }], explanation: "Hespê efsanewî." },
  { category: "Folklor", difficulty: 2, question: "Di çîroka 'Xecê û Siyabend' de Siyabend çawa dimire?", options: [{ text: "Ji çiya dikeve", points: 10 }, { text: "Tê kuştin", points: 0 }, { text: "Bi jehrê", points: 0 }], explanation: "Li Çiyayê Sîpanê." },
  { category: "Folklor", difficulty: 2, question: "Kîjan hunermend wekî 'Bilbilê Kurdistanê' tê nasîn?", options: [{ text: "Hesen Cizîrî", points: 10 }, { text: "Tehsîn Taha", points: 0 }, { text: "Mihemed Şêxo", points: 0 }], explanation: "Dengê wî yê zîz." },
  { category: "Folklor", difficulty: 2, question: "Keledoş xwarina kîjan herêmê ye?", options: [{ text: "Wan / Serhed", points: 10 }, { text: "Mêrdîn", points: 0 }, { text: "Efrîn", points: 0 }], explanation: "Bi giyayên çiyê (akûb, sîr) tê çêkirin." },
  { category: "Folklor", difficulty: 2, question: "Reqsa 'Şêxanî' a kîjan herêmê ye?", options: [{ text: "Badînan / Botan", points: 10 }, { text: "Dersim", points: 0 }, { text: "Serhed", points: 0 }], explanation: "Govendeke bi rîtm e." },
  { category: "Folklor", difficulty: 2, question: "Eyşe Şan bi çi tê nasîn?", options: [{ text: "Dengbêja Jin", points: 10 }, { text: "Nivîskar", points: 0 }, { text: "Siyasetmedar", points: 0 }], explanation: "Stranên wekî 'Qederê' navdar in." },
  { category: "Folklor", difficulty: 2, question: "Navê jina ku di destana 'Kela Dimdim' de tê gotin?", options: [{ text: "Gulbihar", points: 10 }, { text: "Zîn", points: 0 }, { text: "Xecê", points: 0 }], explanation: "Jina Xanê Lepzêrîn." },

  // SEVİYE 3: ZEHMET
  { category: "Folklor", difficulty: 3, question: "Mihemed Şêxo bi eslê xwe ji kîjan perçeyî ye?", options: [{ text: "Rojava (Qamişlo)", points: 10 }, { text: "Bakur", points: 0 }, { text: "Başûr", points: 0 }], explanation: "Bavê Felekan." },
  { category: "Folklor", difficulty: 3, question: "Kîjan hunermendê Kurd 'Senfoniya Şengalê' çêkir?", options: [{ text: "Dilşad Seîd", points: 10 }, { text: "Şivan Perwer", points: 0 }, { text: "Ciwan Haco", points: 0 }], explanation: "Kemanjenê navdar ê cîhanî." },
  { category: "Folklor", difficulty: 3, question: "Xwarina 'Sêrûpê' bi kîjan navî tê zanîn?", options: [{ text: "Paça / Serûpê", points: 10 }, { text: "Tirşik", points: 0 }, { text: "Qelî", points: 0 }], explanation: "Xwarina zivistanê." },
  { category: "Folklor", difficulty: 3, question: "Di 'Kiras û Fîstan' de perçeyê li ser piştê çi ye?", options: [{ text: "Kember / Hember", points: 10 }, { text: "Poşû", points: 0 }, { text: "Şal", points: 0 }], explanation: "Ji zîv an qumaş." },
  { category: "Folklor", difficulty: 3, question: "Navê 'Beko' di Mem û Zînê de sembola çi ye?", options: [{ text: "Fitne û fesadî", points: 10 }, { text: "Qehremanî", points: 0 }, { text: "Evîn", points: 0 }], explanation: "Bekoyê Ewan." },
  { category: "Folklor", difficulty: 3, question: "Kîjan dengbêj 'Kilama Bavê Fexriya' gotiye?", options: [{ text: "Reso", points: 10 }, { text: "Şakiro", points: 0 }, { text: "Evdalê Zeynikê", points: 0 }], explanation: "Reso şagirtê Evdal bû." },
  { category: "Folklor", difficulty: 3, question: "Tahîrê Tofîq bi kîjan stranê tê nasîn?", options: [{ text: "Şîrîn Buhare", points: 10 }, { text: "Eman Eman", points: 0 }, { text: "Zembîlfiroş", points: 0 }], explanation: "Hunermendê Başûr." },
  { category: "Folklor", difficulty: 3, question: "'Xalîçeyên Pazîrîk' têkiliya wan bi kê re heye?", options: [{ text: "Împaratoriya Med / Skît", points: 10 }, { text: "Ereb", points: 0 }, { text: "Çîn", points: 0 }], explanation: "Kevntirîn xalîçeya cîhanê." },
  { category: "Folklor", difficulty: 3, question: "Navê jina Dengbêj a bi navdar ji Êrîvanê kî ye?", options: [{ text: "Sûsika Simo", points: 10 }, { text: "Eyşe Şan", points: 0 }, { text: "Meryem Xan", points: 0 }], explanation: "Dengbêja Sovyetê." },
  { category: "Folklor", difficulty: 3, question: "Lîstika 'Cîrîd' (Hesp) li kîjan herêmê zêde ye?", options: [{ text: "Serhed", points: 10 }, { text: "Botan", points: 0 }, { text: "Soran", points: 0 }], explanation: "Lîstika siwariyê." }
];