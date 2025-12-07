export const siteContent = {
  // =================================================================
  // KÜRTÇE (KU)
  // =================================================================
  KU: {
    // --- MENÜ (NAVBAR) ---
    nav: {
      sereke: 'Sereke',
      ziman: 'Ziman',
      cand: 'Çand',
      dirok: 'Dîrok',
      muzik: 'Muzîk',
      huner: 'Huner',
      listik: 'Lîstik',
      follow: 'Me Bişopînin',
      join: 'Tevlî Me Bibe'
    },
    // --- ANA SAYFA (HOME) ---
    home: {
      heroTitle1: 'Li YTÜ',
      heroTitle2: 'Dengê Me',
      heroTitle3: 'Rengê Me.',
      heroSubtitle: 'Zanîngeha Yıldız Teknîk - Komeleya Kurdî',
      heroButton: 'Tevlî Me Bibe',
      aboutTitle: 'Derbarê Me',
      aboutText1: 'Komeleya Kurdî ya Zanîngeha Yıldız Teknîk (YTU) di sala 2025an de hatiye damezrandin. Armanca me parastina zimanê kurdî, belavkirina çanda kurdî, û hînkirina dîroka me ye.',
      aboutText2: 'Em bi xwendekarên kurd û hemû kesên ku ji zimanê kurdî hez dikin re dixebitin. Em çalakiyên cuda yên çandî, hunerî û perwerdehî organîze dikin.',
      featuresTitle: 'Beşên Me',
      ctaTitle: 'Beşdarî Komeleya Me Bibe',
      ctaText: 'Heke tu dixwazî zimanê kurdî hîn bibî, çanda xwe nas bikî, û bi me re bixebitî, bi me re têkilî dayne!',
      ctaButton: 'Dest Pê Bike',
      // Yeni Eklenenler (Sayaç ve Günün Sözü için)
      eventTitle: 'Çalakiya Pêşerojê',
      eventEmptyTitle: 'Tê Ragihandin',
      eventEmptyDesc: 'Ji bo çalakiyên nû li bendê bin.',
      dailyTitle: 'Naveroka Rojê',
      dailyWord: 'Peyv',
      dailyQuote: 'Gotin',
      time: { day: 'Roj', hour: 'Saet', min: 'Deqe', sec: 'Çirk' }
    },
    // --- KARTLAR (HOME SAYFASINDAKİ ÖZETLER) ---
    cards: {
      zimanTitle: 'Ziman', zimanDesc: 'Hînbûna zimanê kurdî û rêzimana wê',
      candTitle: 'Çand', candDesc: 'Çanda dewlemend a gelê kurd',
      dirokTitle: 'Dîrok', dirokDesc: 'Dîroka kevn a kurdan',
      muzikTitle: 'Muzîk', muzikDesc: 'Muzîka kurdî û stranan',
      hunerTitle: 'Huner', hunerDesc: 'Huner û hunermendên kurd'
    },
    // --- ALT SAYFALAR (DETAYLAR) ---
    pages: {
      dirok: {
        title: "Dîroka Kurdan",
        desc: "Ji Medan heta îro, serpêhatiya gelê kevnar ê Mezopotamyayê.",
        sections: [
          { title: "Koka Kurdan", text: "Kurd yek ji gelên herî kevnar ên Mezopotamyayê ne. Di dîrokê de bi navên Gûtî, Hûrî û Med hatine naskirin. Împaratoriya Medan (B.Z. 612) yekem dewleta mezin a pêşiyên Kurdan tê hesibandin." },
          { title: "Mîrektiyên Kurd", text: "Di serdema navîn de Kurdan gelek mîrektî ava kirine. Wekî Merwanî, Şedadî, Botan, Soran û Baban. Van mîrektiyan çand û hunera Kurdî pêş xistine." },
          { title: "Serdema Nûjen", text: "Di sedsala 20an de têkoşîna Kurdan a ji bo nasname û mafên neteweyî berdewam kir. Îro Kurd li çar parçeyên Kurdistanê û li diyasporayê çanda xwe didin jiyîn." }
        ]
      },
      ziman: {
        title: "Zimanê Kurdî",
        desc: "Zimanê me nasnameya me ye. Kurdî zimanekî Hînd-Ewropî ye.",
        alphabetTitle: "Alfabeya Kurdî (Kurmancî)",
        phrasesTitle: "Hevokên Girîng",
        topics: [
          { id: 'reziman', title: 'Rêzimana Kurdî', desc: 'Rêziman û qawaidên ziman', text: 'Zimanê kurdî zimanek Hind-Ewropî ye. Alfabeya latînî (Kurmancî) û erebî (Soranî) heye.' },
          { id: 'axaftin', title: 'Axaftina Rojane', desc: 'Hevokên rojane', text: 'Silav, Çawa yî, Baş im, Spas, Bi xêr hatî...' },
          { id: 'peyv', title: 'Peyv û Bêje', desc: 'Peyvên girîng', text: 'Mal, Dê, Bav, Dibistan, Nan, Av, Jiyan...' },
          { id: 'guhdari', title: 'Guhdarî û Axaftin', desc: 'Pratîka ziman', text: 'Ji bo hînbûnê divê hûn her roj guhdarî bikin û biaxivin.' }
        ],
        phrases: [
          { org: 'Roj baş', mean: 'Günaydın' },
          { org: 'Şev baş', mean: 'İyi geceler' },
          { org: 'Spas', mean: 'Teşekkürler' },
          { org: 'Tu çawa yî?', mean: 'Nasılsın?' },
          { org: 'Ez baş im', mean: 'İyiyim' },
          { org: 'Navê te çi ye?', mean: 'Adın ne?' }
        ]
      },
      cand: {
        title: "Çanda Kurdî",
        desc: "Reng, deng û jiyana gelê Kurd.",
        sections: [
          { title: "Newroz", text: "Newroz (21ê Adarê) cejna neteweyî ya Kurdan e. Sersala nû û sembola berxwedanê ye. Agirê Newrozê nîşana azadiyê ye." },
          { title: "Cil û Berg", text: "Cilên Kurdî bi rengên xwe yên zindî têne naskirin. Şal û şapik (ji bo mêran) û kiras û fîstan (ji bo jinan) parçeyên sereke ne." },
          { title: "Mêvanperwerî", text: "Di çanda Kurdî de mêvan pîroz e. Deriyê Kurdan her tim ji mêvanan re vekirî ye û xwarinên herî xweş ji bo wan têne amadekirin." }
        ]
      },
      muzik: {
        title: "Muzîka Kurdî",
        desc: "Dengê çiya û evînê.",
        sections: [
          { title: "Dengbêjî", text: "Dengbêjî stûna muzîka Kurdî ye. Dengbêj, dîrok û êşên gel bi tenê bi dengê xwe vedibêjin. Şakiro, Evdalê Zeynikê mînakên mezin in." },
          { title: "Amûrên Muzîkê", text: "Tembûr, def, zirne û bilûr amûrên sereke ne. Bi taybetî tembûr di muzîka Kurdî de xwedî cihekî pîroz e." },
          { title: "Muzîka Nûjen", text: "Îro hunermendên wekî Şivan Perwer, Ciwan Haco, Aynur Doğan muzîka Kurdî bi şêwazên nûjen (Rock, Jazz) digihîjînin cîhanê." }
        ]
      },
      huner: {
        title: "Huner û Sînema",
        desc: "Dîtina cîhanê bi çavên Kurdan.",
        sections: [
          { title: "Sînemaya Kurdî", text: "Yilmaz Güney bavê sînemaya Kurdî tê hesibandin. Fîlmên wekî 'Yol' û 'Sûrî' di cîhanê de deng vedane." },
          { title: "Wênesazî", text: "Hunermendên Kurd êş û hêviyên gelê xwe li ser tûwalê nîşan didin. Ehmedê Xanî di heman demê de xetatekî mezin bû." },
          { title: "Govend", text: "Reqsên Kurdî (Govend) beşeke girîng a jiyana civakî ye. Her herêmek (Serhed, Botan, Amed) xwedî şêwazek taybet e." }
        ]
      }
    }
  },

  // =================================================================
  // TÜRKÇE (TR)
  // =================================================================
  TR: {
    nav: {
      sereke: 'Anasayfa',
      ziman: 'Dil',
      cand: 'Kültür',
      dirok: 'Tarih',
      muzik: 'Müzik',
      huner: 'Sanat',
      listik: 'Oyun',
      follow: 'Bizi Takip Edin',
      join: 'Bize Katılın'
    },
    home: {
      heroTitle1: "YTÜ'de",
      heroTitle2: 'Sesimiz',
      heroTitle3: 'Rengimiz.',
      heroSubtitle: 'Yıldız Teknik Üniversitesi - Kürtçe Topluluğu',
      heroButton: 'Bize Katıl',
      aboutTitle: 'Hakkımızda',
      aboutText1: 'YTÜ Kürtçe Topluluğu, 2025 yılında kurulmuştur. Amacımız Kürt dilini korumak, kültürümüzü tanıtmak ve tarihimizi öğretmektir.',
      aboutText2: 'Kürt öğrenciler ve dile ilgi duyan herkesle birlikte çalışıyoruz. Çeşitli kültürel, sanatsal ve eğitim faaliyetleri düzenliyoruz.',
      featuresTitle: 'Bölümlerimiz',
      ctaTitle: 'Topluluğumuza Katılın',
      ctaText: 'Kürtçe öğrenmek, kültürü tanımak ve bizimle birlikte çalışmak istiyorsan, iletişime geç!',
      ctaButton: 'Başla',
      eventTitle: 'Sıradaki Etkinlik',
      eventEmptyTitle: 'Duyurulacak',
      eventEmptyDesc: 'Yeni etkinlikler için beklemede kalın.',
      dailyTitle: 'Günün İçeriği',
      dailyWord: 'Kelime',
      dailyQuote: 'Söz',
      time: { day: 'Gün', hour: 'Saat', min: 'Dak', sec: 'San' }
    },
    cards: {
      zimanTitle: 'Dil', zimanDesc: 'Kürtçe dil eğitimi ve gramer',
      candTitle: 'Kültür', candDesc: 'Zengin Kürt kültürü',
      dirokTitle: 'Tarih', dirokDesc: 'Köklü tarih',
      muzikTitle: 'Müzik', muzikDesc: 'Kürt müziği ve şarkıları',
      hunerTitle: 'Sanat', hunerDesc: 'Kürt sanatı ve sanatçıları'
    },
    pages: {
      dirok: {
        title: "Kürt Tarihi",
        desc: "Medlerden günümüze, Mezopotamya'nın kadim halkının serüveni.",
        sections: [
          { title: "Kökenler", text: "Kürtler, Mezopotamya'nın en eski halklarından biridir. Tarihte Guti, Huri ve Med isimleriyle anılmışlardır. Med İmparatorluğu (M.Ö. 612), Kürtlerin atalarının kurduğu ilk büyük devlet kabul edilir." },
          { title: "Kürt Mirlikleri", text: "Ortaçağ'da Kürtler birçok mirlik kurmuştur. Mervaniler, Şeddadiler, Botan, Soran ve Baban gibi mirlikler, Kürt kültürünü ve sanatını geliştirmiştir." },
          { title: "Modern Dönem", text: "20. yüzyılda Kürtlerin kimlik ve ulusal haklar mücadelesi devam etmiştir. Bugün Kürtler, Kürdistan'ın dört parçasında ve diasporada kültürlerini yaşatmaktadır." }
        ]
      },
      ziman: {
        title: "Kürt Dili",
        desc: "Dilimiz kimliğimizdir. Kürtçe, Hint-Avrupa dil ailesindendir.",
        alphabetTitle: "Kürtçe Alfabesi (Kurmanci)",
        phrasesTitle: "Önemli Kalıplar",
        topics: [
          { id: 'reziman', title: 'Kürtçe Gramer', desc: 'Dil bilgisi ve kurallar', text: 'Kürtçe Hint-Avrupa dil ailesindendir. Latin (Kurmanci) ve Arap (Sorani) alfabeleri kullanılır.' },
          { id: 'axaftin', title: 'Günlük Konuşma', desc: 'Günlük diyaloglar', text: 'Selam, Nasılsın, İyiyim, Teşekkürler, Hoş geldin...' },
          { id: 'peyv', title: 'Kelime Bilgisi', desc: 'Önemli kelimeler', text: 'Ev, Anne, Baba, Okul, Ekmek, Su, Hayat...' },
          { id: 'guhdari', title: 'Dinleme ve Konuşma', desc: 'Dil pratiği', text: 'Öğrenmek için her gün dinlemeli ve konuşmalısınız.' }
        ],
        phrases: [
          { org: 'Roj baş', mean: 'Günaydın' },
          { org: 'Şev baş', mean: 'İyi geceler' },
          { org: 'Spas', mean: 'Teşekkürler' },
          { org: 'Tu çawa yî?', mean: 'Nasılsın?' },
          { org: 'Ez baş im', mean: 'İyiyim' },
          { org: 'Navê te çi ye?', mean: 'Adın ne?' }
        ]
      },
      cand: {
        title: "Kürt Kültürü",
        desc: "Kürt halkının renkleri, sesleri ve yaşamı.",
        sections: [
          { title: "Newroz", text: "Newroz (21 Mart), Kürtlerin ulusal bayramıdır. Yeni yılı ve direnişi simgeler. Newroz ateşi özgürlüğün sembolüdür." },
          { title: "Giyim Kuşam", text: "Kürt kıyafetleri canlı renkleriyle tanınır. Şal û şapik (erkekler için) ve kiras û fîstan (kadınlar için) temel parçalardır." },
          { title: "Misafirperverlik", text: "Kürt kültüründe misafir kutsaldır. Kürtlerin kapısı misafire her zaman açıktır ve en güzel yemekler onlar için hazırlanır." }
        ]
      },
      muzik: {
        title: "Kürt Müziği",
        desc: "Dağların ve aşkın sesi.",
        sections: [
          { title: "Dengbêjlik", text: "Dengbêjlik Kürt müziğinin temel direğidir. Dengbêjler, halkın tarihini ve acılarını sadece sesleriyle anlatır. Şakiro ve Evdalê Zeynikê büyük örneklerdir." },
          { title: "Enstrümanlar", text: "Tembur (Saz), erbane (def), zurna ve kaval temel çalgılardır. Özellikle tembur, Kürt müziğinde kutsal bir yere sahiptir." },
          { title: "Modern Müzik", text: "Günümüzde Şivan Perwer, Ciwan Haco, Aynur Doğan gibi sanatçılar Kürt müziğini modern tarzlarla (Rock, Caz) dünyaya ulaştırmaktadır." }
        ]
      },
      huner: {
        title: "Sanat ve Sinema",
        desc: "Dünyayı Kürtlerin gözünden görmek.",
        sections: [
          { title: "Kürt Sineması", text: "Yılmaz Güney, Kürt sinemasının babası kabul edilir. 'Yol' ve 'Sürü' gibi filmler dünyada ses getirmiştir." },
          { title: "Resim", text: "Kürt ressamlar halklarının acılarını ve umutlarını tuvale yansıtır. Ehmedê Xanî aynı zamanda büyük bir hattattı." },
          { title: "Halk Oyunları (Govend)", text: "Kürt dansları (Govend), sosyal yaşamın önemli bir parçasıdır. Her bölgenin (Serhat, Botan, Amed) kendine has bir tarzı vardır." }
        ]
      }
    }
  },

  // =================================================================
  // İNGİLİZCE (EN)
  // =================================================================
  EN: {
    nav: {
      sereke: 'Home',
      ziman: 'Language',
      cand: 'Culture',
      dirok: 'History',
      muzik: 'Music',
      huner: 'Art',
      listik: 'Game',
      follow: 'Follow Us',
      join: 'Join Us'
    },
    home: {
      heroTitle1: 'At YTU',
      heroTitle2: 'Our Voice',
      heroTitle3: 'Our Color.',
      heroSubtitle: 'Yildiz Technical University - Kurdish Society',
      heroButton: 'Join Us',
      aboutTitle: 'About Us',
      aboutText1: 'YTU Kurdish Society was established in 2025. Our aim is to protect the Kurdish language, promote our culture, and teach our history.',
      aboutText2: 'We work with Kurdish students and anyone interested in the language. We organize various cultural, artistic, and educational activities.',
      featuresTitle: 'Our Departments',
      ctaTitle: 'Join Our Community',
      ctaText: 'If you want to learn Kurdish, discover the culture, and work with us, contact us!',
      ctaButton: 'Start Now',
      eventTitle: 'Upcoming Event',
      eventEmptyTitle: 'To Be Announced',
      eventEmptyDesc: 'Stay tuned for new events.',
      dailyTitle: 'Daily Content',
      dailyWord: 'Word',
      dailyQuote: 'Quote',
      time: { day: 'Day', hour: 'Hr', min: 'Min', sec: 'Sec' }
    },
    cards: {
      zimanTitle: 'Language', zimanDesc: 'Kurdish language learning and grammar',
      candTitle: 'Culture', candDesc: 'The rich culture of the Kurdish people',
      dirokTitle: 'History', dirokDesc: 'Ancient history of the Kurds',
      muzikTitle: 'Music', muzikDesc: 'Kurdish music and songs',
      hunerTitle: 'Art', hunerDesc: 'Kurdish art and artists'
    },
    pages: {
      dirok: {
        title: "Kurdish History",
        desc: "From Medes to today, the journey of the ancient people of Mesopotamia.",
        sections: [
          { title: "Origins", text: "Kurds are one of the most ancient peoples of Mesopotamia. Known in history as Guti, Hurrian, and Medes." },
          { title: "Kurdish Principalities", text: "In the middle ages, Kurds established many principalities like Marwanids, Shaddadids, Botan, Soran, and Baban." },
          { title: "Modern Era", text: "Today Kurds continue their struggle for identity and rights in four parts of Kurdistan and diaspora." }
        ]
      },
      ziman: {
        title: "Kurdish Language",
        desc: "Our language is our identity. Kurdish is an Indo-European language.",
        alphabetTitle: "Kurdish Alphabet (Kurmanci)",
        phrasesTitle: "Important Phrases",
        topics: [
          { id: 'reziman', title: 'Grammar', desc: 'Grammar rules', text: 'Kurdish belongs to the Indo-European language family. Written in Latin and Arabic scripts.' },
          { id: 'axaftin', title: 'Daily Speech', desc: 'Daily phrases', text: 'Hello, How are you, I am fine, Thanks, Welcome...' },
          { id: 'peyv', title: 'Vocabulary', desc: 'Important words', text: 'Home, Mother, Father, School, Bread, Water, Life...' },
          { id: 'guhdari', title: 'Listening & Speaking', desc: 'Language practice', text: 'To learn well, you must listen and speak Kurdish every day.' }
        ],
        phrases: [
          { org: 'Roj baş', mean: 'Good morning' },
          { org: 'Şev baş', mean: 'Good night' },
          { org: 'Spas', mean: 'Thanks' },
          { org: 'Tu çawa yî?', mean: 'How are you?' },
          { org: 'Ez baş im', mean: 'I am fine' },
          { org: 'Navê te çi ye?', mean: 'What is your name?' }
        ]
      },
      cand: {
        title: "Kurdish Culture",
        desc: "Colors, sounds, and life of the Kurdish people.",
        sections: [
          { title: "Newroz", text: "Newroz (March 21) is the national new year of Kurds. It symbolizes new beginnings and resistance." },
          { title: "Clothing", text: "Kurdish clothes are known for their vibrant colors. Shal u shapik (men) and kiras u fistan (women) are staples." },
          { title: "Hospitality", text: "Guests are sacred in Kurdish culture. Doors are always open, and the best food is served to guests." }
        ]
      },
      muzik: {
        title: "Kurdish Music",
        desc: "Voice of the mountains and love.",
        sections: [
          { title: "Dengbej", text: "Dengbej is the pillar of Kurdish music. Bards tell history and pain through voice alone. Shakiro is a great example." },
          { title: "Instruments", text: "Tembur, erbane (def), zurna, and flute are main instruments. Tembur holds a sacred place." },
          { title: "Modern Music", text: "Artists like Sivan Perwer, Ciwan Haco, and Aynur Dogan bring Kurdish music to the world with modern styles." }
        ]
      },
      huner: {
        title: "Art & Cinema",
        desc: "Seeing the world through Kurdish eyes.",
        sections: [
          { title: "Kurdish Cinema", text: "Yilmaz Guney is considered the father of Kurdish cinema. Movies like 'Yol' have made a global impact." },
          { title: "Painting", text: "Kurdish painters reflect their people's pain and hope on canvas." },
          { title: "Folk Dance (Govend)", text: "Kurdish dances are a vital part of social life. Each region (Serhat, Botan, Amed) has its own style." }
        ]
      }
    }
  }
};