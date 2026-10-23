// ============================================================
// ASTRONOMISCHE EREIGNISSE – Kalender, Finsternisse, Konstellationen
// Hinweis: Bahnen in der 3D-Ansicht sind vereinfacht; der Zeitsprung
// setzt den Simulationskalender und zeigt Kontext/Medien.
// ============================================================

export const EVENTS = [
  {
    id: 'se-2026-08-12',
    title: 'Partielle Sonnenfinsternis (Europa)',
    type: 'eclipse_solar',
    date: '2026-08-12T18:00:00Z',
    end: '2026-08-12T20:30:00Z',
    visibility: 'Europa (in DE partiell, Totalität Spanien/Island-Pfad)',
    desc: 'Der Mond schiebt sich vor die Sonne. In Deutschland Bedeckung bis etwa 85–90 %​. Totalität u. a. in Nordspanien.',
    school: 'Physik/Optik: Schatten, Kern- und Halbschatten. Nie ohne Sonnenschutzfilter beobachten.',
    bodies: ['Sonne', 'Mond', 'Erde'],
    demo: 'solar_eclipse',
    images: [
      { title: 'Sonnenfinsternis – Korona', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Solar_Eclipse_corona_2017.jpg/1024px-Solar_Eclipse_corona_2017.jpg', credit: 'NASA' }
    ],
    videos: [
      { title: 'planet schule | Sonnenfinsternis 12.8.2026', youtube: '_VSDjceJesg', lang: 'de' },
      { title: 'logo! einfach erklärt – Sonnenfinsternis', youtube: 'kzYglCDaEqk', lang: 'de' },
      { title: 'Lehrerschmidt – Sonnenfinsternis', youtube: 'I5Ui2mxUvC8', lang: 'de' }
    ]
  },
  {
    id: 'se-2017-08-21',
    title: 'Totale Sonnenfinsternis USA 2017',
    type: 'eclipse_solar',
    date: '2017-08-21T18:00:00Z',
    visibility: 'USA (Totalitätszone)',
    desc: 'Historisch gut dokumentierte totale Sonnenfinsternis über den USA („Great American Eclipse“).',
    school: 'Vergleich total / partiell / ringförmig.',
    bodies: ['Sonne', 'Mond', 'Erde'],
    demo: 'solar_eclipse',
    images: [
      { title: 'Totalität 2017', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Solar_Eclipse_corona_2017.jpg/1024px-Solar_Eclipse_corona_2017.jpg', credit: 'NASA' }
    ],
    videos: [
      { title: 'Finsternisse – Schattenspiele (Grundschule)', youtube: '5lGgR__ZKdo', lang: 'de' }
    ]
  },
  {
    id: 'le-2022-05-16',
    title: 'Totale Mondfinsternis (Blutmond)',
    type: 'eclipse_lunar',
    date: '2022-05-16T04:00:00Z',
    visibility: 'teilweise Europa, Amerika, Afrika',
    desc: 'Der Mond tritt in den Kernschatten der Erde und erscheint oft rötlich („Blutmond“).',
    school: 'Reihenfolge Sonne–Erde–Mond. Rayleigh-Streuung erklärt die rote Farbe.',
    bodies: ['Sonne', 'Erde', 'Mond'],
    demo: 'lunar_eclipse',
    images: [
      { title: 'Mondfinsternis', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1024px-FullMoon2010.jpg', credit: 'Wikimedia' }
    ],
    videos: [
      { title: 'Planetarium Berlin – Finsternisse', youtube: 's9bgwYPvfa0', lang: 'de' }
    ]
  },
  {
    id: 'le-2025-03-14',
    title: 'Totale Mondfinsternis März 2025',
    type: 'eclipse_lunar',
    date: '2025-03-14T06:00:00Z',
    visibility: 'Amerika, Pazifik (Europa: Monduntergang)',
    desc: 'Totale Mondfinsternis; in Mitteleuropa je nach Standort nur teilweise sichtbar.',
    school: 'Warum nicht jede Finsternis überall sichtbar ist.',
    bodies: ['Sonne', 'Erde', 'Mond'],
    demo: 'lunar_eclipse',
    images: [],
    videos: []
  },
  {
    id: 'met-perseids',
    title: 'Perseiden (Sternschnuppen)',
    type: 'meteor',
    date: '2026-08-12T22:00:00Z',
    recurring: { month: 8, day: 12 },
    visibility: 'Nordhalbkugel, nach Mitternacht',
    desc: 'Jährlicher Meteorstrom aus dem Staub des Kometen Swift-Tuttle. Maximum um den 12. August.',
    school: 'Zusammenhang Kometenbahn – Meteoroidenstrom – Radiant (Sternbild Perseus).',
    bodies: ['Swift-Tuttle', 'Erde'],
    demo: null,
    images: [],
    videos: [
      { title: 'Perseiden erklärt', youtube: 'kzYglCDaEqk', lang: 'de' }
    ]
  },
  {
    id: 'met-geminids',
    title: 'Geminiden',
    type: 'meteor',
    date: '2025-12-14T22:00:00Z',
    recurring: { month: 12, day: 14 },
    visibility: 'weltweit, klares Wetter',
    desc: 'Starker Meteorstrom im Dezember, Ursprung Asteroid (3200) Phaethon.',
    school: 'Nicht alle Ströme stammen von Kometen.',
    bodies: ['Erde'],
    demo: null,
    images: [],
    videos: []
  },
  {
    id: 'met-taurids',
    title: 'Tauriden',
    type: 'meteor',
    date: '2025-11-05T22:00:00Z',
    recurring: { month: 11, day: 5 },
    visibility: 'Oktober/November',
    desc: 'Mit Komet Encke verbunden; gelegentlich helle Feuerkugeln.',
    school: 'Elternkörper Encke – Strom Tauriden.',
    bodies: ['Encke', 'Erde'],
    demo: null,
    images: [],
    videos: []
  },
  {
    id: 'opp-mars-2025',
    title: 'Mars in Opposition',
    type: 'opposition',
    date: '2025-01-16T00:00:00Z',
    visibility: 'ganze Nacht, besonders hell',
    desc: 'Mars steht der Sonne am Himmel gegenüber und ist der Erde relativ nahe – gute Beobachtungszeit.',
    school: 'Opposition vs. Konjunktion; Entfernung und scheinbare Helligkeit.',
    bodies: ['Mars', 'Erde', 'Sonne'],
    demo: 'opposition',
    images: [
      { title: 'Mars', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1024px-OSIRIS_Mars_true_color.jpg', credit: 'ESA' }
    ],
    videos: []
  },
  {
    id: 'conj-jupiter-venus',
    title: 'Konjunktion Jupiter–Venus (Beispiel)',
    type: 'conjunction',
    date: '2023-03-01T18:00:00Z',
    visibility: 'Abendhimmel',
    desc: 'Zwei helle Planeten stehen am Himmel nahe beieinander (winkelige Nähe, nicht physische Nähe).',
    school: 'Scheinbare Nähe ≠ räumliche Nähe. Projektion an der Himmelskugel.',
    bodies: ['Jupiter', 'Venus'],
    demo: null,
    images: [],
    videos: []
  },
  {
    id: 'hist-apollo11',
    title: 'Apollo 11 – Mondlandung',
    type: 'mission',
    date: '1969-07-20T20:17:00Z',
    visibility: 'historisch',
    desc: 'Erste bemannte Mondlandung. Neil Armstrong und Buzz Aldrin betreten die Mondoberfläche.',
    school: 'Geschichte der Raumfahrt, Physik des Raketenflugs, gebundene Rotation des Mondes.',
    bodies: ['Mond', 'Erde'],
    demo: null,
    images: [
      { title: 'Aldrin auf dem Mond', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/1024px-Aldrin_Apollo_11_original.jpg', credit: 'NASA' }
    ],
    videos: [
      { title: 'Apollo 11 Landing', youtube: 'RMINSD7MmT4', lang: 'en' }
    ]
  },
  {
    id: 'hist-newhorizons',
    title: 'New Horizons an Pluto',
    type: 'mission',
    date: '2015-07-14T11:49:00Z',
    visibility: 'historisch',
    desc: 'Vorbeiflug an Pluto und Charon – erste detailreiche Aufnahmen.',
    school: 'Zwergplaneten, Kuipergürtel, lange Flugzeiten.',
    bodies: ['Pluto', 'Charon'],
    demo: null,
    images: [
      { title: 'Pluto True Color', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Pluto_in_True_Color_-_High-Res.jpg/1024px-Pluto_in_True_Color_-_High-Res.jpg', credit: 'NASA' }
    ],
    videos: [
      { title: 'New Horizons at Pluto', youtube: '2AY8s7u5V0Y', lang: 'en' }
    ]
  },
  {
    id: 'hist-halley-1986',
    title: 'Komet Halley 1986',
    type: 'comet',
    date: '1986-02-09T00:00:00Z',
    visibility: 'weltweit (historisch)',
    desc: 'Letzte Perihelpassage des Halleyschen Kometen. Nächste Rückkehr 2061.',
    school: 'Periodische Kometen, historische Vorhersage durch Edmond Halley.',
    bodies: ['Halley'],
    demo: null,
    images: [
      { title: 'Halley 1986', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Comet_Halley.jpg/1024px-Comet_Halley.jpg', credit: 'NASA' }
    ],
    videos: []
  },
  {
    id: 'hist-neowise-2020',
    title: 'Komet NEOWISE 2020',
    type: 'comet',
    date: '2020-07-03T00:00:00Z',
    visibility: 'Nordhalbkugel, Juli 2020',
    desc: 'Heller Komet, mit bloßem Auge sichtbar und stark fotografiert.',
    school: 'Koma und Schweif, Beobachtung am Abend-/Morgenhimmel.',
    bodies: ['NEOWISE'],
    demo: null,
    images: [
      { title: 'NEOWISE von der ISS', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Comet_NEOWISE_from_the_ISS.jpg/1024px-Comet_NEOWISE_from_the_ISS.jpg', credit: 'NASA' }
    ],
    videos: []
  },
  {
    id: 'equinox-2026-03',
    title: 'Frühlings-Tagundnachtgleiche',
    type: 'equinox',
    date: '2026-03-20T15:46:00Z',
    recurring: { month: 3, day: 20 },
    visibility: 'global (astronomisch)',
    desc: 'Sonne steht über dem Äquator – Tag und Nacht etwa gleich lang. Beginn des astronomischen Frühlings (Nordhalbkugel).',
    school: 'Achsneigung 23,4°, Jahreszeiten, Ekliptik.',
    bodies: ['Erde', 'Sonne'],
    demo: null,
    images: [],
    videos: [
      { title: 'Sonne, Erde, Mond – Jahreszeiten', youtube: 'C2EvU_PMl1M', lang: 'de' }
    ]
  },
  {
    id: 'solstice-2026-06',
    title: 'Sommersonnenwende',
    type: 'solstice',
    date: '2026-06-21T08:24:00Z',
    recurring: { month: 6, day: 21 },
    visibility: 'global',
    desc: 'Längster Tag auf der Nordhalbkugel.',
    school: 'Sonnenwenden und Tagundnachtgleichen im Jahreslauf.',
    bodies: ['Erde', 'Sonne'],
    demo: null,
    images: [],
    videos: []
  }
];

export const EVENT_TYPES = {
  eclipse_solar: { label: 'Sonnenfinsternis', icon: '☀', color: '#ffcc44' },
  eclipse_lunar: { label: 'Mondfinsternis', icon: '🌕', color: '#ff8866' },
  meteor: { label: 'Meteorstrom', icon: '☄', color: '#88ddff' },
  opposition: { label: 'Opposition', icon: '◎', color: '#ffaa66' },
  conjunction: { label: 'Konjunktion', icon: '☌', color: '#aaddff' },
  mission: { label: 'Mission', icon: '🚀', color: '#88ffaa' },
  comet: { label: 'Komet', icon: '☄', color: '#ccddff' },
  equinox: { label: 'Tagundnachtgleiche', icon: '⚖', color: '#ffe688' },
  solstice: { label: 'Sonnenwende', icon: '🌅', color: '#ffcc88' }
};

export function getEventsSorted() {
  return [...EVENTS].sort((a, b) => new Date(a.date) - new Date(b.date));
}