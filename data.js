// ============================================================
// DATA.JS - Alle Daten des Sonnensystems
// ============================================================

// Texturen liegen lokal im Projektordner (offline-fähig). Pluto, Ceres und Monde kommen noch von Wikimedia,
// fehlen sie, wird eine prozedurale Ersatz-Textur genutzt.
export const TEXTURES = {
  earth: [
    { name:'earth_atmos_2048.jpg', desc:'Erdoberfläche', icon:'⊕', url:'earth_atmos_2048.jpg', category:'Erde & Mond', required:true },
    { name:'earth_normal_2048.jpg', desc:'Normalen-Map', icon:'⌗', url:'earth_normal_2048.jpg', category:'Erde & Mond', required:false },
    { name:'earth_specular_2048.jpg', desc:'Specular-Map', icon:'◇', url:'earth_specular_2048.jpg', category:'Erde & Mond', required:false },
    { name:'earth_clouds_1024.png', desc:'Wolkenschicht', icon:'≡', url:'earth_clouds_1024.png', category:'Erde & Mond', required:false },
    { name:'moon_1024.jpg', desc:'Erdmond', icon:'☾', url:'moon_1024.jpg', category:'Erde & Mond', required:false }
  ],
  planets: [
    { name:'sunmap.jpg', desc:'Sonne', icon:'☉', url:'2k_sun.jpg', category:'Planeten', required:true },
    { name:'mercurymap.jpg', desc:'Merkur', icon:'☿', url:'2k_mercury.jpg', category:'Planeten', required:true },
    { name:'venusmap.jpg', desc:'Venus', icon:'♀', url:'2k_venus_surface.jpg', category:'Planeten', required:true },
    { name:'marsmap1k.jpg', desc:'Mars', icon:'♂', url:'2k_mars.jpg', category:'Planeten', required:true },
    { name:'jupitermap.jpg', desc:'Jupiter', icon:'♃', url:'2k_jupiter.jpg', category:'Planeten', required:true },
    { name:'saturnmap.jpg', desc:'Saturn', icon:'♄', url:'2k_saturn.jpg', category:'Planeten', required:true },
    { name:'uranusmap.jpg', desc:'Uranus', icon:'♅', url:'2k_uranus.jpg', category:'Planeten', required:true },
    { name:'neptunemap.jpg', desc:'Neptun', icon:'♆', url:'2k_neptune.jpg', category:'Planeten', required:true },
    { name:'plutomap.jpg', desc:'Pluto', icon:'♇', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/1024px-Pluto_in_True_Color_-_High-Res.jpg', category:'Planeten', required:false },
    { name:'ceresmap.jpg', desc:'Ceres', icon:'⚳', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29.jpg/1024px-Ceres_-_RC3_-_Haulani_Crater_%2822381131691%29.jpg', category:'Planeten', required:false }
  ],
  moons: [
    { name:'io.jpg', desc:'Io', icon:'◉', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Io_highest_resolution_true_color.jpg/1024px-Io_highest_resolution_true_color.jpg', category:'Monde', required:false },
    { name:'europa.jpg', desc:'Europa', icon:'◉', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Europa-moon-with-margins.jpg/1024px-Europa-moon-with-margins.jpg', category:'Monde', required:false },
    { name:'ganymede.jpg', desc:'Ganymed', icon:'◉', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Ganymede_g1_true.jpg/1024px-Ganymede_g1_true.jpg', category:'Monde', required:false },
    { name:'callisto.jpg', desc:'Kallisto', icon:'◉', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Callisto.jpg/1024px-Callisto.jpg', category:'Monde', required:false },
    { name:'titan.jpg', desc:'Titan', icon:'◉', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Titan_in_true_color.jpg/1024px-Titan_in_true_color.jpg', category:'Monde', required:false },
    { name:'enceladus.jpg', desc:'Enceladus', icon:'○', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Enceladus_from_Voyager.jpg/1024px-Enceladus_from_Voyager.jpg', category:'Monde', required:false },
    { name:'mimas.jpg', desc:'Mimas', icon:'○', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Mimas_Cassini.jpg/1024px-Mimas_Cassini.jpg', category:'Monde', required:false },
    { name:'triton.jpg', desc:'Triton', icon:'◉', url:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Triton_moon_mosaic_Voyager_2_%28large%29.jpg/1024px-Triton_moon_mosaic_Voyager_2_%28large%29.jpg', category:'Monde', required:false }
  ]
};

export const ALL_TEXTURES = [...TEXTURES.earth, ...TEXTURES.planets, ...TEXTURES.moons];

// ===== KOMETEN =====
export const COMETS = [
  { name:'1P/Halley', shortName:'Halley', a:17.8, e:0.967, incl:2.85, node:1.05, peri:1.85, period:75.3, radius:0.06,
    desc:'Der berühmteste Komet der Geschichte. Sein Erscheinen wurde seit 240 v. Chr. dokumentiert. Zuletzt 1986 im inneren Sonnensystem - nächste Wiederkehr 2061.',
    stats:{'Typ':'Kurzperiodischer Komet','Kern-Durchmesser':'ca. 15 × 8 km','Umlaufzeit':'75–76 Jahre','Perihel':'0,586 AE','Aphel':'35,1 AE','Bahnneigung':'162,3°','Letztes Perihel':'9. Februar 1986','Nächstes Perihel':'28. Juli 2061','Entdecker':'Edmond Halley (1705)'},
    fact:'Halley bewies 1705, dass die Kometen von 1531, 1607 und 1682 identisch sind - der erste periodische Komet.' },
  { name:'99942 Apophis', shortName:'Apophis', a:0.92, e:0.191, incl:0.058, node:3.56, peri:2.16, period:0.886, radius:0.03,
    desc:'Ein erdnaher Asteroid, der 2004 kurzzeitig als potenzielle Gefahr galt. Am 13. April 2029 wird er in nur 31.000 km Entfernung an der Erde vorbeifliegen - näher als manche Satelliten.',
    stats:{'Typ':'Erdnaher Asteroid (NEO)','Durchmesser':'ca. 370 m','Masse':'ca. 6,1 × 10¹⁰ kg','Umlaufzeit':'323,6 Tage','Perihel':'0,746 AE','Aphel':'1,099 AE','Bahnexzentrizität':'0,191','Nächste Annäherung':'13. April 2029','Entfernung 2029':'ca. 31.000 km'},
    fact:'Am 13. April 2029 wird Apophis als heller Punkt am Himmel sichtbar sein - mit bloßem Auge in Europa, Afrika und Asien.' },
  { name:'C/1995 O1 (Hale-Bopp)', shortName:'Hale-Bopp', a:186, e:0.995, incl:1.56, node:4.03, peri:2.71, period:2534, radius:0.35,
    desc:'Einer der hellsten Kometen des 20. Jahrhunderts. 1997 war er 18 Monate lang mit bloßem Auge sichtbar - länger als jeder andere Komet in der Geschichte.',
    stats:{'Typ':'Langperiodischer Komet','Kern-Durchmesser':'ca. 60 km','Umlaufzeit':'ca. 2.534 Jahre','Perihel':'0,914 AE','Aphel':'371 AE','Bahnneigung':'89,4°','Letztes Perihel':'1. April 1997','Entdeckung':'23. Juli 1995','Entdecker':'Alan Hale & Thomas Bopp'},
    fact:'Hale-Bopp war so hell, dass er 1997 sogar von der Internationalen Raumstation aus gefilmt werden konnte.' },
  { name:'2P/Encke', shortName:'Encke', a:2.22, e:0.848, incl:0.2, node:5.88, peri:3.31, period:3.3, radius:0.04,
    desc:'Komet mit der kürzesten bekannten Umlaufzeit. Verantwortlich für den jährlichen Tauriden-Meteorstrom im Oktober/November.',
    stats:{'Typ':'Kurzperiodischer Komet','Kern-Durchmesser':'ca. 4,8 km','Umlaufzeit':'3,30 Jahre','Perihel':'0,336 AE','Aphel':'4,10 AE','Bahnneigung':'11,8°','Letztes Perihel':'22. Oktober 2023','Nächstes Perihel':'2027','Entdecker':'Pierre Méchain (1786)'},
    fact:'Encke wurde nach Johann Franz Encke benannt, der 1819 seine Bahn berechnete.' },
  { name:'109P/Swift-Tuttle', shortName:'Swift-Tuttle', a:26.1, e:0.963, incl:1.99, node:2.06, peri:2.21, period:133, radius:0.09,
    desc:'Der Ursprungskörper der Perseiden - eines der bekanntesten Meteorströme, der jedes Jahr im August zu sehen ist.',
    stats:{'Typ':'Kurzperiodischer Komet','Kern-Durchmesser':'ca. 26 km','Umlaufzeit':'133 Jahre','Perihel':'0,96 AE','Aphel':'51,2 AE','Bahnneigung':'113,5°','Letztes Perihel':'Dezember 1992','Nächstes Perihel':'Juli 2126','Entdecker':'Lewis Swift & Horace Tuttle (1862)'},
    fact:'Die Perseiden-Meteore sind Staubpartikel, die Swift-Tuttle auf seiner Bahn hinterlassen hat.' },
  { name:'C/2020 F3 (NEOWISE)', shortName:'NEOWISE', a:358, e:0.9992, incl:2.42, node:1.05, peri:3.43, period:6766, radius:0.14,
    desc:'Der hellste Komet seit Hale-Bopp. 2020 war er mit bloßem Auge sichtbar und wurde zum meistfotografierten Kometen des Jahres.',
    stats:{'Typ':'Langperiodischer Komet','Kern-Durchmesser':'ca. 5 km','Umlaufzeit':'ca. 6.766 Jahre','Perihel':'0,295 AE','Aphel':'715 AE','Bahnneigung':'128,9°','Letztes Perihel':'3. Juli 2020','Entdeckung':'27. März 2020','Entdecker':'NEOWISE-Teleskop (NASA)'},
    fact:'NEOWISE wird erst im Jahr 8786 wiederkehren.' }
];

// ===== POI-DATENBANK =====
export const POI_DATA = {
  'Erde': [
    { name:'Mount Everest', lat:27.99, lon:86.93, icon:'▲', cat:'Berg' },
    { name:'Grand Canyon', lat:36.10, lon:-112.11, icon:'⌇', cat:'Canyon' },
    { name:'Niagarafälle', lat:43.08, lon:-79.07, icon:'≋', cat:'Wasserfall' },
    { name:'Victoriafälle', lat:-17.92, lon:25.86, icon:'≋', cat:'Wasserfall' },
    { name:'Iguazú-Wasserfälle', lat:-25.69, lon:-54.44, icon:'≋', cat:'Wasserfall' },
    { name:'Great Barrier Reef', lat:-18.29, lon:147.70, icon:'≈', cat:'Riff' },
    { name:'Uluru', lat:-25.34, lon:131.04, icon:'▲', cat:'Fels' },
    { name:'Sahara', lat:23.42, lon:25.00, icon:'☀', cat:'Wüste' },
    { name:'Amazonas', lat:-3.47, lon:-62.22, icon:'≈', cat:'Fluss' },
    { name:'Kilimandscharo', lat:-3.07, lon:37.36, icon:'▲', cat:'Berg' },
    { name:'Matterhorn', lat:45.98, lon:7.66, icon:'▲', cat:'Berg' },
    { name:'Zugspitze', lat:47.42, lon:10.99, icon:'▲', cat:'Berg' },
    { name:'Nordkap', lat:71.17, lon:25.78, icon:'❄', cat:'Kap' },
    { name:'Vesuv', lat:40.82, lon:14.43, icon:'▲', cat:'Vulkan' },
    { name:'Ätna', lat:37.75, lon:14.99, icon:'▲', cat:'Vulkan' },
    { name:'Kilauea', lat:19.42, lon:-155.29, icon:'▲', cat:'Vulkan' },
    { name:'Totes Meer', lat:31.50, lon:35.47, icon:'≈', cat:'See' },
    { name:'Baikalsee', lat:53.56, lon:108.16, icon:'≈', cat:'See' },
    { name:'Bodensee', lat:47.60, lon:9.40, icon:'≈', cat:'See' },
    { name:'Nordpol', lat:90, lon:0, icon:'❄', cat:'Pol' },
    { name:'Südpol', lat:-90, lon:0, icon:'❄', cat:'Pol' },
    { name:'Eiffelturm', lat:48.86, lon:2.29, icon:'⌂', cat:'Bauwerk' },
    { name:'Brandenburger Tor', lat:52.52, lon:13.38, icon:'⌂', cat:'Bauwerk' },
    { name:'Kölner Dom', lat:50.94, lon:6.96, icon:'⌂', cat:'Bauwerk' },
    { name:'Neuschwanstein', lat:47.56, lon:10.75, icon:'⌂', cat:'Schloss' },
    { name:'Schiefer Turm Pisa', lat:43.72, lon:10.40, icon:'⌂', cat:'Bauwerk' },
    { name:'Kolosseum', lat:41.89, lon:12.49, icon:'⌂', cat:'Antike' },
    { name:'Akropolis', lat:37.97, lon:23.73, icon:'⌂', cat:'Antike' },
    { name:'Stonehenge', lat:51.18, lon:-1.83, icon:'◯', cat:'Antike' },
    { name:'Pyramiden Gizeh', lat:29.98, lon:31.13, icon:'△', cat:'Antike' },
    { name:'Taj Mahal', lat:27.17, lon:78.04, icon:'⌂', cat:'Bauwerk' },
    { name:'Chinesische Mauer', lat:40.43, lon:116.57, icon:'⌐', cat:'Antike' },
    { name:'Angkor Wat', lat:13.41, lon:103.87, icon:'⌂', cat:'Antike' },
    { name:'Machu Picchu', lat:-13.16, lon:-72.55, icon:'△', cat:'Antike' },
    { name:'Christusstatue Rio', lat:-22.95, lon:-43.21, icon:'⌂', cat:'Denkmal' },
    { name:'Freiheitsstatue', lat:40.69, lon:-74.04, icon:'⌂', cat:'Denkmal' },
    { name:'Sagrada Família', lat:41.40, lon:2.17, icon:'⌂', cat:'Kirche' },
    { name:'Petersdom', lat:41.90, lon:12.45, icon:'⌂', cat:'Kirche' },
    { name:'Big Ben', lat:51.50, lon:-0.12, icon:'⌂', cat:'Bauwerk' },
    { name:'Tower Bridge', lat:51.51, lon:-0.08, icon:'⌂', cat:'Brücke' },
    { name:'Sydney Opera House', lat:-33.86, lon:151.22, icon:'⌂', cat:'Bauwerk' },
    { name:'Burj Khalifa', lat:25.20, lon:55.27, icon:'⌂', cat:'Bauwerk' },
    { name:'Golden Gate Bridge', lat:37.82, lon:-122.48, icon:'⌂', cat:'Brücke' },
    { name:'Atomium Brüssel', lat:50.89, lon:4.34, icon:'⌂', cat:'Bauwerk' },
    { name:'Berlin', lat:52.52, lon:13.41, icon:'◉', cat:'Stadt' },
    { name:'Paris', lat:48.86, lon:2.35, icon:'◉', cat:'Stadt' },
    { name:'London', lat:51.51, lon:-0.13, icon:'◉', cat:'Stadt' },
    { name:'Rom', lat:41.90, lon:12.50, icon:'◉', cat:'Stadt' },
    { name:'Madrid', lat:40.42, lon:-3.70, icon:'◉', cat:'Stadt' },
    { name:'Moskau', lat:55.76, lon:37.62, icon:'◉', cat:'Stadt' },
    { name:'Istanbul', lat:41.01, lon:28.98, icon:'◉', cat:'Stadt' },
    { name:'New York', lat:40.71, lon:-74.01, icon:'◉', cat:'Stadt' },
    { name:'Los Angeles', lat:34.05, lon:-118.24, icon:'◉', cat:'Stadt' },
    { name:'Mexiko-Stadt', lat:19.43, lon:-99.13, icon:'◉', cat:'Stadt' },
    { name:'Rio de Janeiro', lat:-22.91, lon:-43.17, icon:'◉', cat:'Stadt' },
    { name:'São Paulo', lat:-23.55, lon:-46.63, icon:'◉', cat:'Stadt' },
    { name:'Buenos Aires', lat:-34.60, lon:-58.38, icon:'◉', cat:'Stadt' },
    { name:'Kairo', lat:30.04, lon:31.24, icon:'◉', cat:'Stadt' },
    { name:'Kapstadt', lat:-33.92, lon:18.42, icon:'◉', cat:'Stadt' },
    { name:'Nairobi', lat:-1.29, lon:36.82, icon:'◉', cat:'Stadt' },
    { name:'Dubai', lat:25.20, lon:55.27, icon:'◉', cat:'Stadt' },
    { name:'Mumbai', lat:19.08, lon:72.88, icon:'◉', cat:'Stadt' },
    { name:'Delhi', lat:28.61, lon:77.21, icon:'◉', cat:'Stadt' },
    { name:'Peking', lat:39.90, lon:116.41, icon:'◉', cat:'Stadt' },
    { name:'Shanghai', lat:31.23, lon:121.47, icon:'◉', cat:'Stadt' },
    { name:'Hongkong', lat:22.32, lon:114.17, icon:'◉', cat:'Stadt' },
    { name:'Tokio', lat:35.68, lon:139.65, icon:'◉', cat:'Stadt' },
    { name:'Seoul', lat:37.57, lon:126.98, icon:'◉', cat:'Stadt' },
    { name:'Singapur', lat:1.35, lon:103.82, icon:'◉', cat:'Stadt' },
    { name:'Bangkok', lat:13.76, lon:100.50, icon:'◉', cat:'Stadt' },
    { name:'Sydney', lat:-33.87, lon:151.21, icon:'◉', cat:'Stadt' },
    { name:'Auckland', lat:-36.85, lon:174.76, icon:'◉', cat:'Stadt' },
    { name:'Honolulu', lat:21.31, lon:-157.86, icon:'◉', cat:'Stadt' },
    { name:'Reykjavik', lat:64.15, lon:-21.94, icon:'◉', cat:'Stadt' }
  ],
  'Merkur': [
    { name:'Caloris-Becken', lat:30.5, lon:162.0, icon:'◯', cat:'Krater' },
    { name:'Rachmaninoff-Krater', lat:27.7, lon:57.6, icon:'◯', cat:'Krater' },
    { name:'Discovery Rupes', lat:-56.0, lon:-38.0, icon:'⌐', cat:'Klippe' },
    { name:'Borealis-Quadrant', lat:78.0, lon:0.0, icon:'▲', cat:'Region' }
  ],
  'Venus': [
    { name:'Maxwell Montes', lat:65.2, lon:3.3, icon:'▲', cat:'Berg' },
    { name:'Aphrodite Terra', lat:-10.0, lon:100.0, icon:'▲', cat:'Hochebene' },
    { name:'Ishtar Terra', lat:70.0, lon:30.0, icon:'▲', cat:'Hochebene' },
    { name:'Maat Mons', lat:0.5, lon:194.6, icon:'▲', cat:'Vulkan' },
    { name:'Alpha Regio', lat:-25.0, lon:5.0, icon:'◆', cat:'Region' }
  ],
  'Mars': [
    { name:'Olympus Mons', lat:18.65, lon:-133.8, icon:'▲', cat:'Vulkan' },
    { name:'Valles Marineris', lat:-14.0, lon:-59.0, icon:'⌇', cat:'Canyon' },
    { name:'Hellas Planitia', lat:-42.4, lon:70.5, icon:'◯', cat:'Becken' },
    { name:'Gale-Krater', lat:-5.4, lon:137.8, icon:'◯', cat:'Krater' },
    { name:'Jezero-Krater', lat:18.4, lon:77.7, icon:'◯', cat:'Krater' },
    { name:'Elysium Planitia', lat:3.0, lon:154.7, icon:'◆', cat:'Ebene' },
    { name:'Nordpolarkappe', lat:87.0, lon:0.0, icon:'❄', cat:'Eiskappe' },
    { name:'Südpolarkappe', lat:-87.0, lon:0.0, icon:'❄', cat:'Eiskappe' },
    { name:'Arsia Mons', lat:-8.35, lon:-120.1, icon:'▲', cat:'Vulkan' },
    { name:'Syrtis Major', lat:8.4, lon:69.5, icon:'◆', cat:'Region' },
    { name:'Utopia Planitia', lat:46.7, lon:117.5, icon:'◆', cat:'Ebene' }
  ],
  'Jupiter': [
    { name:'Großer Roter Fleck', lat:-22.0, lon:0.0, icon:'◉', cat:'Sturm' },
    { name:'Nordäquatorialband', lat:15.0, lon:0.0, icon:'≡', cat:'Wolkenband' },
    { name:'Südäquatorialband', lat:-15.0, lon:0.0, icon:'≡', cat:'Wolkenband' },
    { name:'Nordpolregion', lat:80.0, lon:0.0, icon:'❄', cat:'Pol' },
    { name:'Südpolregion', lat:-80.0, lon:0.0, icon:'❄', cat:'Pol' }
  ],
  'Saturn': [
    { name:'Nordpol-Hexagon', lat:78.0, lon:0.0, icon:'⬡', cat:'Phänomen' },
    { name:'A-Ring', lat:0.0, lon:0.0, icon:'◯', cat:'Ring' },
    { name:'B-Ring', lat:0.0, lon:0.0, icon:'◯', cat:'Ring' },
    { name:'Cassini-Teilung', lat:0.0, lon:0.0, icon:'◯', cat:'Ring' },
    { name:'Äquatorband', lat:0.0, lon:0.0, icon:'≡', cat:'Wolkenband' }
  ],
  'Uranus': [
    { name:'Nordpol', lat:90, lon:0, icon:'❄', cat:'Pol' },
    { name:'Südpol', lat:-90, lon:0, icon:'❄', cat:'Pol' }
  ],
  'Neptun': [
    { name:'Großer Dunkler Fleck', lat:-22.0, lon:0.0, icon:'◉', cat:'Sturm' },
    { name:'Scooter-Wolken', lat:42.0, lon:0.0, icon:'≡', cat:'Wolken' },
    { name:'Nordpol', lat:90, lon:0, icon:'❄', cat:'Pol' },
    { name:'Südpol', lat:-90, lon:0, icon:'❄', cat:'Pol' }
  ],
  'Pluto': [
    { name:'Sputnik Planitia', lat:20.0, lon:180.0, icon:'◯', cat:'Eisfeld' },
    { name:'Tombaugh Regio', lat:10.0, lon:180.0, icon:'◆', cat:'Region' },
    { name:'Cthulhu Macula', lat:-10.0, lon:60.0, icon:'◆', cat:'Region' }
  ],
  'Mond': [
    { name:'Mare Tranquillitatis', lat:8.5, lon:31.4, icon:'●', cat:'Mare' },
    { name:'Apollo 11 Landestelle', lat:0.67, lon:23.47, icon:'◆', cat:'Landestelle' },
    { name:'Mare Imbrium', lat:32.8, lon:-15.6, icon:'●', cat:'Mare' },
    { name:'Tycho-Krater', lat:-43.3, lon:-11.4, icon:'◯', cat:'Krater' },
    { name:'Copernicus-Krater', lat:9.6, lon:-20.1, icon:'◯', cat:'Krater' }
  ],
  'Titan': [
    { name:'Kraken Mare', lat:68.0, lon:310.0, icon:'≈', cat:'Methansee' },
    { name:'Ligeia Mare', lat:79.0, lon:248.0, icon:'≈', cat:'Methansee' },
    { name:'Punga Mare', lat:85.0, lon:340.0, icon:'≈', cat:'Methansee' },
    { name:'Ontario Lacus', lat:-72.0, lon:183.0, icon:'≈', cat:'Methansee' }
  ],
  'Io': [
    { name:'Loki Patera', lat:19.0, lon:303.0, icon:'▲', cat:'Vulkan' },
    { name:'Pele', lat:-18.7, lon:255.3, icon:'▲', cat:'Vulkan' },
    { name:'Tvashtar Paterae', lat:63.0, lon:123.0, icon:'▲', cat:'Vulkan' }
  ],
  'Europa': [
    { name:'Conamara Chaos', lat:9.7, lon:274.3, icon:'◆', cat:'Chaos' },
    { name:'Pwyll-Krater', lat:-25.2, lon:271.4, icon:'◯', cat:'Krater' }
  ],
  'Enceladus': [
    { name:'Südpol-Geysire', lat:-85.0, lon:0.0, icon:'≡', cat:'Geysire' },
    { name:'Tigerstreifen', lat:-75.0, lon:0.0, icon:'⌇', cat:'Furchen' }
  ],
  'Triton': [
    { name:'Cantaloupe-Terrain', lat:-30.0, lon:30.0, icon:'◆', cat:'Region' },
    { name:'Stickstoff-Geysire', lat:-58.0, lon:0.0, icon:'≡', cat:'Geysire' }
  ]
};

// ===== INFO-DATENBANK =====
export const INFO_DATA = {
  'Sonne':{icon:'☉',name:'Sonne',subtitle:'Stern · Spektralklasse G2V',desc:'Die Sonne ist der Stern im Zentrum unseres Sonnensystems. In ihrem Kern verschmelzen pro Sekunde etwa 600 Millionen Tonnen Wasserstoff zu Helium – die freigesetzte Energie strahlt als Licht und Wärme in den Weltraum.',stats:{'Typ':'Gelber Zwergstern','Durchmesser':'1.392.700 km','Masse':'1,989 × 10³⁰ kg','Gravitation':'274 m/s² (27,9 g)','Fluchtgeschw.':'617,7 km/s','Mittlere Dichte':'1,41 g/cm³','Oberflächentemp.':'5.505 °C','Kerntemperatur':'15,7 Mio. °C','Rotationsdauer':'25,4 Tage','Alter':'4,603 Mrd. Jahre','Zusammensetzung':'73 % H, 25 % He','Leuchtkraft':'3,828 × 10²⁶ W'},fact:'In der Sonne könnten 1,3 Millionen Erden Platz finden.'},
  'Merkur':{icon:'☿',name:'Merkur',subtitle:'Planet · Gesteinsplanet',desc:'Merkur ist der kleinste Planet und der Sonne am nächsten. Ohne nennenswerte Atmosphäre schwanken die Temperaturen zwischen Tag und Nacht um über 600 °C.',stats:{'Typ':'Gesteinsplanet','Durchmesser':'4.879 km','Masse':'3,301 × 10²³ kg','Gravitation':'3,70 m/s²','Fluchtgeschw.':'4,25 km/s','Mittlere Dichte':'5,43 g/cm³','Sonnenumlauf':'88 Tage','Rotationsdauer':'58,6 Tage','Entfernung zur Sonne':'57,9 Mio. km','Umlaufgeschw.':'47,4 km/s','Bahnexzentrizität':'0,206','Achsneigung':'0,034°','Temperatur':'−173 °C bis +427 °C','Monde':'0'},fact:'Ein Merkur-Tag dauert 176 Erdentage.'},
  'Venus':{icon:'♀',name:'Venus',subtitle:'Planet · Gesteinsplanet',desc:'Venus ist der heißeste Planet im Sonnensystem. Eine dichte CO₂-Atmosphäre mit Schwefelsäurewolken erzeugt einen extremen Treibhauseffekt.',stats:{'Typ':'Gesteinsplanet','Durchmesser':'12.104 km','Masse':'4,867 × 10²⁴ kg','Gravitation':'8,87 m/s²','Fluchtgeschw.':'10,36 km/s','Mittlere Dichte':'5,24 g/cm³','Sonnenumlauf':'224,7 Tage','Rotationsdauer':'243 Tage (rückläufig)','Entfernung zur Sonne':'108,2 Mio. km','Umlaufgeschw.':'35,0 km/s','Achsneigung':'177,4°','Temperatur':'ca. +465 °C','Monde':'0'},fact:'Venus rotiert rückwärts - Sonne geht im Westen auf.'},
  'Erde':{icon:'⊕',name:'Erde',subtitle:'Planet · Unser Zuhause',desc:'Die Erde ist der einzige bekannte Planet mit Leben. Sie besitzt flüssiges Wasser, eine schützende Atmosphäre und ein Magnetfeld.',stats:{'Typ':'Gesteinsplanet','Durchmesser':'12.742 km','Masse':'5,972 × 10²⁴ kg','Gravitation':'9,807 m/s² (1 g)','Fluchtgeschw.':'11,19 km/s','Mittlere Dichte':'5,51 g/cm³','Sonnenumlauf':'365,25 Tage','Rotationsdauer':'23 h 56 min','Entfernung zur Sonne':'149,6 Mio. km','Umlaufgeschw.':'29,8 km/s','Bahnexzentrizität':'0,017','Achsneigung':'23,44°','Temperatur':'−89 °C bis +57 °C','Monde':'1 (Mond)'},fact:'Rund 71 % der Oberfläche sind mit Wasser bedeckt.'},
  'Mars':{icon:'♂',name:'Mars',subtitle:'Planet · Der rote Planet',desc:'Mars wird wegen seines eisenoxidhaltigen Bodens auch „roter Planet" genannt.',stats:{'Typ':'Gesteinsplanet','Durchmesser':'6.779 km','Masse':'6,417 × 10²³ kg','Gravitation':'3,71 m/s²','Fluchtgeschw.':'5,03 km/s','Mittlere Dichte':'3,93 g/cm³','Sonnenumlauf':'687 Tage','Rotationsdauer':'24 h 37 min','Entfernung zur Sonne':'227,9 Mio. km','Umlaufgeschw.':'24,1 km/s','Bahnexzentrizität':'0,093','Achsneigung':'25,19°','Temperatur':'−153 °C bis +20 °C','Monde':'2 (Phobos, Deimos)'},fact:'Olympus Mons ist 22 km hoch.'},
  'Ceres':{icon:'⚳',name:'Ceres',subtitle:'Zwergplanet · Asteroidengürtel',desc:'Ceres ist der größte Körper im Asteroidengürtel.',stats:{'Typ':'Zwergplanet','Durchmesser':'939 km','Masse':'9,39 × 10²⁰ kg','Gravitation':'0,27 m/s²','Fluchtgeschw.':'0,51 km/s','Mittlere Dichte':'2,16 g/cm³','Sonnenumlauf':'4,60 Jahre','Rotationsdauer':'9 h 4 min','Entfernung zur Sonne':'413 Mio. km','Temperatur':'−105 °C'},fact:'Enthält mehr Süßwasser als die Erde.'},
  'Jupiter':{icon:'♃',name:'Jupiter',subtitle:'Planet · Gasriese',desc:'Jupiter ist der größte Planet im Sonnensystem.',stats:{'Typ':'Gasriese','Durchmesser':'139.820 km','Masse':'1,898 × 10²⁷ kg','Gravitation':'24,79 m/s²','Fluchtgeschw.':'59,5 km/s','Mittlere Dichte':'1,33 g/cm³','Sonnenumlauf':'11,86 Jahre','Rotationsdauer':'9 h 56 min','Entfernung zur Sonne':'778,5 Mio. km','Umlaufgeschw.':'13,1 km/s','Achsneigung':'3,13°','Temperatur':'ca. −110 °C','Monde':'über 95'},fact:'Der Große Rote Fleck tobt seit 350 Jahren.'},
  'Saturn':{icon:'♄',name:'Saturn',subtitle:'Planet · Gasriese mit Ringen',desc:'Saturn ist berühmt für sein ausgedehntes Ringsystem.',stats:{'Typ':'Gasriese','Durchmesser':'116.460 km','Masse':'5,683 × 10²⁶ kg','Gravitation':'10,44 m/s²','Fluchtgeschw.':'35,5 km/s','Mittlere Dichte':'0,687 g/cm³','Sonnenumlauf':'29,46 Jahre','Rotationsdauer':'10 h 33 min','Entfernung zur Sonne':'1,43 Mrd. km','Umlaufgeschw.':'9,7 km/s','Achsneigung':'26,73°','Temperatur':'ca. −140 °C','Monde':'293 bekannt'},fact:'Würde auf Wasser schwimmen.'},
  'Uranus':{icon:'♅',name:'Uranus',subtitle:'Planet · Eisriese',desc:'Uranus rollt auf der Seite durch seine Umlaufbahn.',stats:{'Typ':'Eisriese','Durchmesser':'50.724 km','Masse':'8,681 × 10²⁵ kg','Gravitation':'8,87 m/s²','Fluchtgeschw.':'21,3 km/s','Mittlere Dichte':'1,27 g/cm³','Sonnenumlauf':'84,01 Jahre','Rotationsdauer':'17 h 14 min','Entfernung zur Sonne':'2,87 Mrd. km','Umlaufgeschw.':'6,8 km/s','Achsneigung':'97,77°','Temperatur':'ca. −195 °C','Monde':'28'},fact:'Erst 1781 entdeckt.'},
  'Neptun':{icon:'♆',name:'Neptun',subtitle:'Planet · Eisriese',desc:'Neptun hat die stärksten Stürme im Sonnensystem.',stats:{'Typ':'Eisriese','Durchmesser':'49.244 km','Masse':'1,024 × 10²⁶ kg','Gravitation':'11,15 m/s²','Fluchtgeschw.':'23,5 km/s','Mittlere Dichte':'1,64 g/cm³','Sonnenumlauf':'164,8 Jahre','Rotationsdauer':'16 h 6 min','Entfernung zur Sonne':'4,50 Mrd. km','Umlaufgeschw.':'5,4 km/s','Achsneigung':'28,32°','Temperatur':'ca. −200 °C','Monde':'16'},fact:'1846 durch Mathematik vorhergesagt.'},
  'Pluto':{icon:'♇',name:'Pluto',subtitle:'Zwergplanet · Kuipergürtel',desc:'Pluto gilt seit 2006 als Zwergplanet. New Horizons lieferte 2015 detailierte Aufnahmen.',stats:{'Typ':'Zwergplanet','Durchmesser':'2.376 km','Masse':'1,303 × 10²² kg','Gravitation':'0,62 m/s²','Fluchtgeschw.':'1,21 km/s','Mittlere Dichte':'1,88 g/cm³','Sonnenumlauf':'247,9 Jahre','Rotationsdauer':'6,39 Tage','Entfernung zur Sonne':'5,91 Mrd. km','Achsneigung':'122,53°','Temperatur':'−233 °C','Monde':'5'},fact:'Kleiner als der Erdmond.'},
  'Eris':{icon:'◌',name:'Eris',subtitle:'Zwergplanet · Scattered Disk',desc:'Massereicher als Pluto, Entdeckung 2005 führte zur Neudefinition von „Planet“.',stats:{'Typ':'Zwergplanet','Durchmesser':'~2.326 km','Sonnenumlauf':'558 Jahre','Entfernung zur Sonne':'~96 AE','Monde':'1 (Dysnomia)'},fact:'Ursprünglich „Xena“ genannt.'},
  'Haumea':{icon:'🜨',name:'Haumea',subtitle:'Zwergplanet · Kuipergürtel',desc:'Stark elliptisch geformt durch schnelle Rotation.',stats:{'Typ':'Zwergplanet','Durchmesser':'~1.600 km','Rotationsdauer':'3,9 Stunden','Sonnenumlauf':'284 Jahre','Monde':'2'},fact:'Einer der schnellsten Rotatoren im Sonnensystem.'},
  'Makemake':{icon:'🝱',name:'Makemake',subtitle:'Zwergplanet · Kuipergürtel',desc:'Zweithellster Kuipergürtel-Objekt nach Pluto.',stats:{'Typ':'Zwergplanet','Durchmesser':'~1.430 km','Sonnenumlauf':'306 Jahre','Temperatur':'−243 °C','Monde':'1'},fact:'Benannt nach dem Schöpfergott der Rapa Nui.'},
  'Mond':{icon:'☾',name:'Mond',subtitle:'Mond der Erde',desc:'Der einzige natürliche Satellit der Erde.',stats:{'Typ':'Natürlicher Satellit','Durchmesser':'3.474 km','Masse':'7,342 × 10²² kg','Gravitation':'1,62 m/s²','Fluchtgeschw.':'2,38 km/s','Mittlere Dichte':'3,34 g/cm³','Umlaufzeit':'27,32 Tage','Entfernung zur Erde':'384.400 km','Temperatur':'−173 °C bis +127 °C'},fact:'Entfernt sich 3,8 cm pro Jahr.'},
  'Io':{icon:'◉',name:'Io',subtitle:'Mond des Jupiter',desc:'Vulkanisch aktivster Körper im Sonnensystem.',stats:{'Durchmesser':'3.643 km','Gravitation':'1,80 m/s²','Umlaufzeit':'1,77 Tage','Temperatur':'−163 °C'},fact:'Über 400 aktive Vulkane.'},
  'Europa':{icon:'◉',name:'Europa',subtitle:'Mond des Jupiter',desc:'Unter Eiskruste ein riesiger Ozean.',stats:{'Durchmesser':'3.122 km','Gravitation':'1,31 m/s²','Umlaufzeit':'3,55 Tage'},fact:'Kandidat für außerirdisches Leben.'},
  'Ganymed':{icon:'◉',name:'Ganymed',subtitle:'Mond des Jupiter',desc:'Größter Mond im Sonnensystem.',stats:{'Durchmesser':'5.268 km','Umlaufzeit':'7,15 Tage'},fact:'Größer als Merkur.'},
  'Kallisto':{icon:'◉',name:'Kallisto',subtitle:'Mond des Jupiter',desc:'Älteste Oberfläche.',stats:{'Durchmesser':'4.821 km','Umlaufzeit':'16,7 Tage'},fact:'Über 4 Mrd. Jahre alt.'},
  'Titan':{icon:'◉',name:'Titan',subtitle:'Mond des Saturn',desc:'Dichte Stickstoff-Atmosphäre, Methanseen.',stats:{'Durchmesser':'5.150 km','Umlaufzeit':'15,95 Tage','Atmosphäre':'95 % N₂'},fact:'Einziger Mond mit dichter Atmosphäre.'},
  'Enceladus':{icon:'○',name:'Enceladus',subtitle:'Mond des Saturn',desc:'Eisfontänen aus dem Südpol.',stats:{'Durchmesser':'504 km','Umlaufzeit':'1,37 Tage'},fact:'Speist den E-Ring.'},
  'Triton':{icon:'◉',name:'Triton',subtitle:'Mond des Neptun',desc:'Umkreist Neptun rückwärts.',stats:{'Durchmesser':'2.707 km','Umlaufzeit':'5,88 Tage'},fact:'Einer der kältesten Orte.'},
  'Phobos':{icon:'◐',name:'Phobos',subtitle:'Mond des Mars',desc:'Größerer Marsmond.',stats:{'Durchmesser':'22,5 km','Umlaufzeit':'7 h 39 min'},fact:'Stürzt auf den Mars.'},
  'Deimos':{icon:'◑',name:'Deimos',subtitle:'Mond des Mars',desc:'Kleinerer Marsmond.',stats:{'Durchmesser':'12,4 km','Umlaufzeit':'1,26 Tage'},fact:'Wirkt wie ein heller Stern.'},
  'Amalthea':{icon:'◍',name:'Amalthea',subtitle:'Mond des Jupiter',desc:'Kleiner innerer Jupitermond.',stats:{'Durchmesser':'167 km','Umlaufzeit':'11 h 57 min'},fact:'Rötlich gefärbt.'},
  'Mimas':{icon:'○',name:'Mimas',subtitle:'Mond des Saturn',desc:'Sieht wie Todesstern aus.',stats:{'Durchmesser':'396 km','Umlaufzeit':'22 h 37 min'},fact:'Krater Herschel riesig.'},
  'Tethys':{icon:'◌',name:'Tethys',subtitle:'Mond des Saturn',desc:'Eisiger Mond mit riesigem Canyon.',stats:{'Durchmesser':'1.062 km','Umlaufzeit':'1,89 Tage'},fact:'Ithaca Chasma 2.000 km lang.'},
  'Dione':{icon:'◌',name:'Dione',subtitle:'Mond des Saturn',desc:'Helle Eisklippen.',stats:{'Durchmesser':'1.123 km','Umlaufzeit':'2,74 Tage'},fact:'Könnte internen Ozean haben.'},
  'Rhea':{icon:'◌',name:'Rhea',subtitle:'Mond des Saturn',desc:'Zweitgrößter Saturnmond.',stats:{'Durchmesser':'1.527 km','Umlaufzeit':'4,52 Tage'},fact:'Sauerstoff-Atmosphäre.'},
  'Hyperion':{icon:'◍',name:'Hyperion',subtitle:'Mond des Saturn',desc:'Schwammartige Struktur.',stats:{'Durchmesser':'270 km','Umlaufzeit':'21,3 Tage'},fact:'Rotiert chaotisch.'},
  'Iapetus':{icon:'◐',name:'Iapetus',subtitle:'Mond des Saturn',desc:'Zweifarbige Oberfläche.',stats:{'Durchmesser':'1.469 km','Umlaufzeit':'79,3 Tage'},fact:'Yin-Yang-Look.'},
  'Phoebe':{icon:'◍',name:'Phoebe',subtitle:'Mond des Saturn',desc:'Umkreist Saturn rückwärts.',stats:{'Durchmesser':'213 km','Umlaufzeit':'550 Tage'},fact:'Aus dem Kuipergürtel.'},
  'Miranda':{icon:'◐',name:'Miranda',subtitle:'Mond des Uranus',desc:'Zerklüftete Oberfläche.',stats:{'Durchmesser':'472 km','Umlaufzeit':'1,41 Tage'},fact:'Verona Rupes 20 km hoch.'},
  'Ariel':{icon:'○',name:'Ariel',subtitle:'Mond des Uranus',desc:'Hellster Uranusmond.',stats:{'Durchmesser':'1.158 km','Umlaufzeit':'2,52 Tage'},fact:'Jüngste Oberfläche.'},
  'Umbriel':{icon:'●',name:'Umbriel',subtitle:'Mond des Uranus',desc:'Dunkelster großer Uranusmond.',stats:{'Durchmesser':'1.169 km','Umlaufzeit':'4,14 Tage'},fact:'Heller Ring Wunda.'},
  'Titania':{icon:'○',name:'Titania',subtitle:'Mond des Uranus',desc:'Größter Uranusmond.',stats:{'Durchmesser':'1.578 km','Umlaufzeit':'8,71 Tage'},fact:'1.500 km langer Canyon.'},
  'Oberon':{icon:'○',name:'Oberon',subtitle:'Mond des Uranus',desc:'Äußerster großer Uranusmond.',stats:{'Durchmesser':'1.523 km','Umlaufzeit':'13,5 Tage'},fact:'6 km hoher Berg.'},
  'Nereid':{icon:'◍',name:'Nereid',subtitle:'Mond des Neptun',desc:'Exzentrischste Umlaufbahn.',stats:{'Durchmesser':'340 km','Umlaufzeit':'360 Tage'},fact:'Entfernung schwankt stark.'},
  'Proteus':{icon:'◍',name:'Proteus',subtitle:'Mond des Neptun',desc:'Zweitgrößter Neptunmond.',stats:{'Durchmesser':'420 km','Umlaufzeit':'1,12 Tage'},fact:'1989 entdeckt.'},
  'Charon':{icon:'☾',name:'Charon',subtitle:'Mond des Pluto',desc:'Halb so groß wie Pluto.',stats:{'Durchmesser':'1.212 km','Umlaufzeit':'6,4 Tage'},fact:'Umkreisen sich gegenseitig.'},
  'Styx':{icon:'·',name:'Styx',subtitle:'Mond des Pluto',desc:'Sehr kleiner innerer Mond.',stats:{'Durchmesser':'~16 km','Umlaufzeit':'20 Tage'},fact:'Entdeckt 2012.'},
  'Nix':{icon:'·',name:'Nix',subtitle:'Mond des Pluto',desc:'Unregelmäßig geformter Mond.',stats:{'Durchmesser':'~50 km','Umlaufzeit':'25 Tage'},fact:'Name von der griechischen Nachtgöttin.'},
  'Kerberos':{icon:'·',name:'Kerberos',subtitle:'Mond des Pluto',desc:'Winziger Mond zwischen Nix und Hydra.',stats:{'Durchmesser':'~19 km','Umlaufzeit':'32 Tage'},fact:'Zuerst „P4“ genannt.'},
  'Hydra':{icon:'·',name:'Hydra',subtitle:'Mond des Pluto',desc:'Äußerer kleiner Mond.',stats:{'Durchmesser':'~50 km','Umlaufzeit':'38 Tage'},fact:'Entdeckt 2005 zusammen mit Nix.'},
  'ISS':{icon:'▣',name:'ISS',subtitle:'Internationale Raumstation',desc:'Umkreist die Erde in ca. 400 km Höhe.',stats:{'Größe':'109 × 73 m','Masse':'ca. 420 t','Höhe':'ca. 400 km','Umlaufzeit':'ca. 92 min','Besatzung':'6–7'},fact:'Umrundet die Erde 16 Mal am Tag.'},
  'Hubble':{icon:'▤',name:'Hubble',subtitle:'Weltraumteleskop',desc:'Beobachtet seit 1990 das Universum.',stats:{'Spiegel':'2,4 m','Länge':'13,2 m','Masse':'11,1 t','Start':'24. April 1990'},fact:'Über 1,5 Mio. Beobachtungen.'},
  'Asteroidengürtel':{icon:'⁘',name:'Asteroidengürtel',subtitle:'Region · zwischen Mars & Jupiter',desc:'Millionen Gesteinsbrocken.',stats:{'Entfernung zur Sonne':'2,1 – 3,3 AE','Breite':'ca. 180 Mio. km','Größter Körper':'Ceres (939 km)','Anzahl':'über 1 Mio.'},fact:'Größtenteils leerer Raum.'},
  'Kuipergürtel':{icon:'❄',name:'Kuipergürtel',subtitle:'Region · jenseits von Neptun',desc:'Ring aus eisigen Kleinkörpern.',stats:{'Entfernung zur Sonne':'30 – 50 AE','Bekannte Objekte':'über 3.000','Temperatur':'unter −220 °C'},fact:'Quelle vieler Kometen.'}
};

COMETS.forEach(c => {
  INFO_DATA[c.shortName] = {
    icon:'☄', name:c.shortName, subtitle:'Komet',
    desc:c.desc, stats:c.stats, fact:c.fact
  };
});



// EDU + MEDIA ausgelagert
import { EDU_DATA } from './data-edu.js';
import { MEDIA_DATA } from './data-media.js';
export { EDU_DATA, MEDIA_DATA };

// Edu in INFO_DATA mergen
Object.keys(EDU_DATA).forEach(k=>{
  if(INFO_DATA[k]) INFO_DATA[k].edu = EDU_DATA[k];
  else INFO_DATA[k] = Object.assign({icon:'○',name:k,subtitle:'',desc:'',stats:{},fact:''}, {edu:EDU_DATA[k]});
});
COMETS.forEach(c=>{
  if(EDU_DATA[c.shortName] && INFO_DATA[c.shortName])
    INFO_DATA[c.shortName].edu = EDU_DATA[c.shortName];
});

export const MOON_DATA = {
  'Erde':[{name:'Mond',radius:.27,distance:2.6,speed:1.0,tex:'moon_1024.jpg'}],
  'Mars':[{name:'Phobos',radius:.012,distance:2.2,speed:3.5},{name:'Deimos',radius:.008,distance:3.5,speed:2.0}],
  'Jupiter':[
    {name:'Io',radius:.025,distance:1.8,speed:2.2,tex:'io.jpg'},
    {name:'Europa',radius:.022,distance:2.4,speed:1.8,tex:'europa.jpg'},
    {name:'Ganymed',radius:.037,distance:3.2,speed:1.3,tex:'ganymede.jpg'},
    {name:'Kallisto',radius:.034,distance:4.2,speed:1.0,tex:'callisto.jpg'},
    {name:'Amalthea',radius:.008,distance:1.4,speed:3.0}
  ],
  'Saturn':[
    {name:'Mimas',radius:.005,distance:1.6,speed:2.8,tex:'mimas.jpg'},
    {name:'Enceladus',radius:.007,distance:2.0,speed:2.3,tex:'enceladus.jpg'},
    {name:'Tethys',radius:.009,distance:2.5,speed:1.9},
    {name:'Dione',radius:.010,distance:3.0,speed:1.6},
    {name:'Rhea',radius:.012,distance:3.6,speed:1.3},
    {name:'Titan',radius:.020,distance:4.5,speed:1.0,tex:'titan.jpg'},
    {name:'Hyperion',radius:.006,distance:5.2,speed:.8},
    {name:'Iapetus',radius:.011,distance:6.2,speed:.7},
    {name:'Phoebe',radius:.004,distance:7.5,speed:.5}
  ],
  'Uranus':[
    {name:'Miranda',radius:.010,distance:1.9,speed:2.5},
    {name:'Ariel',radius:.015,distance:2.4,speed:2.0},
    {name:'Umbriel',radius:.015,distance:3.0,speed:1.6},
    {name:'Titania',radius:.020,distance:3.8,speed:1.2},
    {name:'Oberon',radius:.019,distance:4.6,speed:1.0}
  ],
  'Neptun':[
    {name:'Triton',radius:.015,distance:2.8,speed:-1.2,tex:'triton.jpg'},
    {name:'Nereid',radius:.006,distance:5.0,speed:.5},
    {name:'Proteus',radius:.008,distance:2.0,speed:2.0}
  ],
  'Pluto':[
    {name:'Charon',radius:.5,distance:3.0,speed:1.0},
    {name:'Styx',radius:.12,distance:4.2,speed:0.7},
    {name:'Nix',radius:.15,distance:5.0,speed:0.55},
    {name:'Kerberos',radius:.1,distance:5.8,speed:0.45},
    {name:'Hydra',radius:.14,distance:6.5,speed:0.4}
  ]
};

// ===== PLANETEN =====
import { EVENTS, EVENT_TYPES, getEventsSorted } from './data-events.js';
export { EVENTS, EVENT_TYPES, getEventsSorted };


// ===== KEPLER-ELEMENTE (Näherung J2000, für "Jetzt"-Position) =====
// a in AE, Perioden in Tagen, Winkel in Grad, M0 bei J2000
// Genauigkeit: ausreichend für Schule/Übersicht, keine Navigations-Ephemeride
export const ORBITAL_ELEMENTS = {
  'Merkur':  { a:0.387, e:0.206, i:7.0,  L:252.25, ϖ:77.46,  Ω:48.33,  period:87.969 },
  'Venus':   { a:0.723, e:0.007, i:3.39, L:181.98, ϖ:131.60, Ω:76.68,  period:224.701 },
  'Erde':    { a:1.000, e:0.017, i:0.0,  L:100.46, ϖ:102.94, Ω:0.0,    period:365.256 },
  'Mars':    { a:1.524, e:0.093, i:1.85, L:355.45, ϖ:336.04, Ω:49.56,  period:686.980 },
  'Ceres':   { a:2.767, e:0.076, i:10.6, L:95.99,  ϖ:73.6,   Ω:80.5,   period:1681.6 },
  'Jupiter': { a:5.203, e:0.048, i:1.30, L:34.35,  ϖ:14.33,  Ω:100.46, period:4332.59 },
  'Saturn':  { a:9.537, e:0.054, i:2.49, L:50.08,  ϖ:93.06,  Ω:113.66, period:10759.2 },
  'Uranus':  { a:19.19, e:0.047, i:0.77, L:314.20, ϖ:173.01, Ω:74.23,  period:30688.5 },
  'Neptun':  { a:30.07, e:0.009, i:1.77, L:304.22, ϖ:48.12,  Ω:131.78, period:60182.0 },
  'Pluto':   { a:39.48, e:0.249, i:17.2, L:238.93, ϖ:224.07, Ω:110.30, period:90560.0 },
  'Eris':    { a:67.86, e:0.44,  i:44.0, L:204.16, ϖ:151.0,  Ω:35.95,  period:203830 },
  'Haumea':  { a:43.13, e:0.19,  i:28.2, L:240.0,  ϖ:240.0,  Ω:122.0,  period:103468 },
  'Makemake':{ a:45.79, e:0.16,  i:29.0, L:178.0,  ϖ:298.0,  Ω:79.6,   period:113183 }
};
// Sidereal rotation period in hours (negative = retrograde)
export const SPIN_HOURS = {
  'Merkur':1407.6,'Venus':-5832.5,'Erde':23.934,'Mars':24.623,
  'Jupiter':9.925,'Saturn':10.656,'Uranus':-17.24,'Neptun':16.11,'Pluto':153.3,
  'Ceres':9.07,'Eris':25.9,'Haumea':3.92,'Makemake':22.8,'Sonne':609.12
};

export const PLANETS = [
  {name:'Merkur',radius:.12,distance:3.2,orbitSpeed:1.60,spinSpeed:.02,tilt:.03,texture:'mercurymap.jpg'},
  {name:'Venus',radius:.18,distance:4.6,orbitSpeed:1.17,spinSpeed:-.008,tilt:.05,texture:'venusmap.jpg'},
  {name:'Erde',radius:.19,distance:6.4,orbitSpeed:1.00,spinSpeed:.02,tilt:.41,isEarth:true},
  {name:'Mars',radius:.14,distance:8.4,orbitSpeed:.80,spinSpeed:.018,tilt:.44,texture:'marsmap1k.jpg'},
  {name:'Ceres',radius:.06,distance:11.0,orbitSpeed:.62,spinSpeed:.03,tilt:.05,isDwarf:true,texture:'ceresmap.jpg'},
  {name:'Jupiter',radius:.60,distance:13.5,orbitSpeed:.44,spinSpeed:.05,tilt:.05,texture:'jupitermap.jpg'},
  {name:'Saturn',radius:.52,distance:18.5,orbitSpeed:.32,spinSpeed:.045,tilt:.47,hasRings:true,texture:'saturnmap.jpg'},
  {name:'Uranus',radius:.36,distance:23.5,orbitSpeed:.23,spinSpeed:-.03,tilt:1.71,texture:'uranusmap.jpg'},
  {name:'Neptun',radius:.34,distance:28.5,orbitSpeed:.18,spinSpeed:.035,tilt:.49,texture:'neptunemap.jpg'},
  {name:'Pluto',radius:.07,distance:33.0,orbitSpeed:.12,spinSpeed:.02,tilt:2.05,isDwarf:true,texture:'plutomap.jpg'},
  {name:'Eris',radius:.06,distance:38.0,orbitSpeed:.09,spinSpeed:.015,tilt:0.5,isDwarf:true},
  {name:'Haumea',radius:.055,distance:35.5,orbitSpeed:.10,spinSpeed:.08,tilt:0.4,isDwarf:true},
  {name:'Makemake',radius:.055,distance:36.5,orbitSpeed:.095,spinSpeed:.02,tilt:0.3,isDwarf:true}
];