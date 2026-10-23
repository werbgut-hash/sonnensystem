// Schul-Infos Haupt / Real / Gymnasium
// ===== SCHUL-INFOS (Haupt- / Real- / Gymnasium) =====
// Fächerbezug: Physik, Chemie, Biologie, Geografie, Mathematik, Geschichte
export const EDU_DATA = {
  'Sonne':{
    subjects:['Physik','Chemie','Geografie'],
    haupt:'Die Sonne ist ein Stern und liefert fast alle Energie für Leben und Wetter auf der Erde. Ohne Sonne wäre es dunkel und kalt.',
    real:'In der Sonne wandelt Kernfusion Wasserstoff in Helium um. Die Strahlung braucht etwa 8 Minuten bis zur Erde. Sonnenflecken und Flares hängen mit dem Magnetfeld zusammen.',
    gym:'Spektralklasse G2V: Gleichgewicht aus Gravitation und Strahlungsdruck. Proton-Proton-Kette im Kern (T≈1,5·10⁷ K). Neutrinos und Heliosphäre; Sonnenwind formt die Magnetosphären der Planeten.',
    tip:'Physik: Energieerhaltung & Fusion. Chemie: H/He. Geografie: Klima und Jahreszeiten hängen von Sonneneinstrahlung ab.'
  },
  'Merkur':{
    subjects:['Physik','Geografie'],
    haupt:'Merkur ist der kleinste Planet und der Sonne am nächsten. Tagsüber wird es extrem heiß, nachts extrem kalt – weil kaum Atmosphäre da ist.',
    real:'Keine nennenswerte Atmosphäre → große Temperaturunterschiede. Oberfläche voller Krater wie der Mond. Umlauf in 88 Tagen, Rotation in 59 Tagen (3:2-Resonanz).',
    gym:'3:2-Spin-Orbit-Resonanz; hohe Dichte deutet auf großen Eisenkern. Exzentrische Bahn (e≈0,21). Kein globales Magnetfeld wie die Erde, aber schwaches induziertes Feld.',
    tip:'Physik: Gravitation, Strahlung ohne Atmosphäre. Vergleich Erde–Mond–Merkur (Krater).'
  },
  'Venus':{
    subjects:['Physik','Chemie','Geografie','Biologie'],
    haupt:'Venus ist fast so groß wie die Erde, aber viel heißer. Eine dicke Wolkendecke hält die Wärme fest – wie in einem Treibhaus.',
    real:'CO₂-Atmosphäre mit extremem Treibhauseffekt (~465 °C). Luftdruck ~90 bar. Rotation rückläufig (Sonne geht „im Westen“ auf). Beispiel für Klima-Extreme.',
    gym:'Runaway-Greenhouse-Effekt; Schwefelsäurewolken; fehlendes Magnetfeld und Wasserverlust. Vergleich Erde–Venus als Klimamodell in der Klimaforschung.',
    tip:'Chemie/Geografie: Treibhauseffekt. Biologie: Grenzen der Bewohnbarkeit.'
  },
  'Erde':{
    subjects:['Biologie','Geografie','Physik','Chemie'],
    haupt:'Die Erde ist unser Zuhause. Es gibt Wasser, Luft zum Atmen und ein Magnetfeld, das uns vor gefährlicher Sonnenstrahlung schützt.',
    real:'Einziger bekannter Planet mit stabilem flüssigem Wasser und Leben. Plattentektonik, Atmosphäre (N₂/O₂), Ozonschicht, Magnetosphäre. Mond stabilisiert die Achsneigung.',
    gym:'Goldilocks-Zone; biogeochemische Kreisläufe; Anthropozän. Vergleich mit Exoplaneten-Kriterien (Atmosphäre, Magnetfeld, flüssiges H₂O).',
    tip:'Quer durch Fächer: Wasser, Klima, Leben, Magnetfeld, Jahreszeiten (Achsneigung 23,4°).'
  },
  'Mond':{
    subjects:['Physik','Geografie','Geschichte'],
    haupt:'Der Mond umkreist die Erde und sorgt für Ebbe und Flut. Er leuchtet nicht selbst, sondern spiegelt Sonnenlicht.',
    real:'Gezeitenkraft (Gravitation). Gebundene Rotation: immer dieselbe Seite zur Erde. Apollo-Landungen (1969–1972). Krater erzählen die Geschichte des Sonnensystems.',
    gym:'Gezeitenreibung → gebundene Rotation; Mondentfernung nimmt zu (~3,8 cm/Jahr). Entstehung: Impakthypothese. Lichtgeschwindigkeit und Entfernung (Laser-Reflektoren).',
    tip:'Physik: Gravitation & Gezeiten. Geschichte: Raumfahrt. Mathematik: Umlaufzeit und Bahnradius.'
  },
  'Mars':{
    subjects:['Physik','Geografie','Biologie','Chemie'],
    haupt:'Mars wird der Rote Planet genannt. Früher gab es dort vermutlich flüssiges Wasser. Heute ist er kalt und trocken.',
    real:'Dünne CO₂-Atmosphäre, Polkappen aus CO₂- und Wassereis. Valles Marineris, Olympus Mons. Rover (Curiosity, Perseverance) suchen Spuren von Leben.',
    gym:'Verlust von Atmosphäre/Magnetfeld; Beweis für einstiges Wasser (Sedimente, Minerale). Astrobiologie und Terraforming-Diskussionen (kritisch betrachten).',
    tip:'Biologie: Bedingungen für Leben. Geografie: Vergleich Erd- und Marsrelief.'
  },
  'Ceres':{
    subjects:['Physik','Geografie'],
    haupt:'Ceres ist der größte Brocken im Asteroidengürtel zwischen Mars und Jupiter und gilt als Zwergplanet.',
    real:'Rund 940 km Durchmesser. Dawn-Mission zeigte hellen Salzablagerungen (Occator). Möglicherweise unterirdisches Wasser/Eis.',
    gym:'Grenzfall Planet/Asteroid; Differenzierung (Schichtenbau). Kryovulkanismus-Hinweise.',
    tip:'Physik: Definition Planet vs. Zwergplanet (IAU 2006).'
  },
  'Jupiter':{
    subjects:['Physik','Mathematik'],
    haupt:'Jupiter ist der größte Planet – ein riesiger Gasball. Der Große Rote Fleck ist ein Sturm, der schon sehr lange existiert.',
    real:'Gasriese (H/He), starkes Magnetfeld, viele Monde (u. a. Io, Europa, Ganymed, Kallisto). Schützt innere Planeten teilweise vor Einschlägen.',
    gym:'Differenzieller Rotation; innere Wärmequelle; Roche-Grenze und Ringsystem. Galileische Monde als Mini-Sonnensystem (Bahnresonanzen).',
    tip:'Physik: Gravitation, Zentripetalkraft. Geschichte: Galilei und die Jupitermonde (Beobachtung).'
  },
  'Saturn':{
    subjects:['Physik','Mathematik'],
    haupt:'Saturn ist für seine Ringe berühmt. Die Ringe bestehen aus Eis- und Gesteinsstückchen.',
    real:'Geringste mittlere Dichte aller Planeten (würde auf Wasser „schwimmen“). Titan hat eine dichte Atmosphäre; Enceladus stößt Wasserfontänen aus.',
    gym:'Keeler-/Encke-Teilung; Resonanzen mit Monden. Cassini-Huygens: Titan-Seen aus Methan/Ethan.',
    tip:'Physik: Dichte = m/V. Chemie: Kohlenwasserstoffe auf Titan.'
  },
  'Uranus':{
    subjects:['Physik','Geografie'],
    haupt:'Uranus ist ein eisiger Gasplanet und liegt „auf der Seite“ – seine Achse ist stark gekippt.',
    real:'Achsneigung ~98°. Methan in der Atmosphäre färbt ihn blaugrün. Schwache Ringe, viele Monde.',
    gym:'Extreme Jahreszeiten (Jahr ≈ 84 Erdjahre). Eisriese (H₂O, NH₃, CH₄) statt klassischer Gasriese.',
    tip:'Geografie/Physik: Achsneigung und Jahreszeiten vergleichen (Erde 23,5° vs. Uranus 98°).'
  },
  'Neptun':{
    subjects:['Physik'],
    haupt:'Neptun ist der äußerste große Planet und sehr windig. Er ist kräftig blau.',
    real:'Stärkste Winde im Sonnensystem. Triton umkreist rückläufig. Entdeckung 1846 durch Bahnabweichung von Uranus (Mathematik!).',
    gym:'Vorhersage aus Himmelsmechanik (Le Verrier/Adams). Innere Wärme trotz großer Sonne-Entfernung.',
    tip:'Geschichte/Mathematik: Wissenschaftliche Vorhersage eines Planeten.'
  },
  'Pluto':{
    subjects:['Physik','Geschichte'],
    haupt:'Pluto ist ein Zwergplanet weit draußen. Seit 2006 zählt er nicht mehr zu den „klassischen“ Planeten.',
    real:'Kuipergürtel-Objekt. New Horizons (2015): Eisberge, Stickstoff-Gletscher, Charon. IAU-Definition: Bahn nicht freigeräumt.',
    gym:'Diskussion Planetenstatus; Doppelplanet-System mit Charon (Baryzentrum außerhalb Plutos).',
    tip:'Wissenschaftstheorie: Wie sich Definitionen ändern (IAU 2006).'
  },
  'Eris':{
    subjects:['Physik','Geschichte'],
    haupt:'Eris ist ein Zwergplanet noch weiter draußen als Pluto und etwa so groß wie er.',
    real:'Entdeckung 2005 löste die Debatte um den Planetenbegriff aus. Mond Dysnomia.',
    gym:'Scattered Disk; hohe Bahnneigung und Exzentrizität.',
    tip:'Geschichte der Astronomie: Warum Pluto „degradiert“ wurde.'
  },
  'Haumea':{
    subjects:['Physik'],
    haupt:'Haumea ist ein länglicher Zwergplanet, der sich sehr schnell dreht.',
    real:'Rotation in ~4 Stunden → ellipsoide Form. Zwei Monde, Ring nachgewiesen.',
    gym:'Hydrostatisches Gleichgewicht bei schneller Rotation (Jakobi-Ellipsoid).',
    tip:'Physik: Fliehkräfte und Form von Himmelskörpern.'
  },
  'Makemake':{
    subjects:['Physik','Geografie'],
    haupt:'Makemake ist ein kalter Zwergplanet im Kuipergürtel ohne dichte Atmosphäre.',
    real:'Rötliche Oberfläche (Tholine). Ein bekannter Mond. Sehr geringe Temperaturen.',
    gym:'Vergleich Kuipergürtel-Objekte: Albedo, Farbe, flüchtige Stoffe.',
    tip:'Geografie/Astronomie: Aufbau des äußeren Sonnensystems.'
  },
  'ISS':{
    subjects:['Physik','Technik','Biologie'],
    haupt:'Die ISS ist eine Raumstation, in der Menschen in der Schwerelosigkeit forschen und leben.',
    real:'Orbit ~400 km, ~28 000 km/h, 16× pro Tag um die Erde. Internationale Zusammenarbeit.',
    gym:'Mikrogravitation und Physiologie; Bahnmechanik (Low Earth Orbit); Sichtbarkeit von der Erde.',
    tip:'Physik: freier Fall = „Schwerelosigkeit“. Biologie: Muskeln/Knochen ohne Last.'
  },
  'Hubble':{
    subjects:['Physik','Geschichte'],
    haupt:'Hubble ist ein Weltraumteleskop, das schärfere Bilder macht als viele Teleskope auf der Erde.',
    real:'Oberhalb der Atmosphäre → kein Seeing. Wichtige Entdeckungen zu Galaxien und Expansion des Universums.',
    gym:'Winkelauflösung; Rotverschiebung; Beitrag zur Hubble-Konstante (mit Unsicherheiten und Debatte).',
    tip:'Physik: Licht, Teleskope, Atmosphäre als Störfaktor.'
  },
  'Io':{
    subjects:['Physik','Chemie'],
    haupt:'Io ist ein Mond des Jupiter mit vielen Vulkanen – der aktivste im Sonnensystem.',
    real:'Gezeitenheizung durch Jupiter und Bahnresonanz mit Europa/Ganymed treibt Vulkanismus an.',
    gym:'Tideale Dissipation; Schwefelchemie; Plasma-Torus entlang der Bahn.',
    tip:'Physik: Gezeitenkräfte nicht nur auf der Erde.'
  },
  'Europa':{
    subjects:['Biologie','Physik'],
    haupt:'Unter der Eisoberfläche von Europa könnte ein Ozean aus flüssigem Wasser liegen – interessant für die Suche nach Leben.',
    real:'Eisrinde, möglicher salziger Ozean, geringe Gezeitenheizung. Ziel künftiger Missionen (z. B. Europa Clipper).',
    gym:'Astrobiologie: Energie, Wasser, Chemie. Vergleich Enceladus.',
    tip:'Biologie: Bedingungen für Leben jenseits der Erde.'
  },
  'Ganymed':{
    subjects:['Physik'],
    haupt:'Ganymed ist der größte Mond im Sonnensystem – größer als der Planet Merkur.',
    real:'Eigenes Magnetfeld (einzigartig unter Monden). Differenzierter Aufbau.',
    gym:'Eigener Magnetodynamo; mögliche innere Ozeane.',
    tip:'Physik: Magnetfelder entstehen nicht nur in Planeten.'
  },
  'Kallisto':{
    subjects:['Physik','Geografie'],
    haupt:'Kallisto ist ein stark verkraterter Mond des Jupiter und wirkt geologisch „alt“.',
    real:'Wenig innere Wärme, kaum tektonische Erneuerung. Viele Einschlagskrater.',
    gym:'Vergleich der galileischen Monde: Aktivität nimmt mit Entfernung zu Jupiter ab (näher = mehr Gezeitenheizung).',
    tip:'Geografie/Physik: Oberflächenalter und Kraterdichte.'
  },
  'Titan':{
    subjects:['Chemie','Geografie','Physik'],
    haupt:'Titan ist ein großer Mond des Saturn mit dichter Atmosphäre und Seen – aber aus flüssigem Methan, nicht Wasser.',
    real:'N₂-Atmosphäre, Methan-Kreislauf (ähnlich dem Wasserkreislauf der Erde). Huygens-Landung 2005.',
    gym:'Organische Chemie, Präbiotik; Vergleich hydrologischer vs. methanologischer Kreislauf.',
    tip:'Chemie: Kohlenwasserstoffe. Geografie: Kreisläufe in Atmosphären.'
  },
  'Enceladus':{
    subjects:['Biologie','Physik'],
    haupt:'Enceladus stößt Fontänen aus Wassereis aus – unter der Oberfläche gibt es vermutlich flüssiges Wasser.',
    real:'Südpol-Geysire speisen einen Teil des Saturn-E-Rings. Cassini flog durch die Fontänen.',
    gym:'Hydrothermale Aktivität möglich → Astrobiologie. Gezeitenheizung trotz geringer Größe.',
    tip:'Biologie/Physik: Energiequellen unter Eis.'
  },
  'Triton':{
    subjects:['Physik'],
    haupt:'Triton ist der größte Mond des Neptun und umkreist ihn „rückwärts“.',
    real:'Retrograde Bahn → vermutlich eingefangenes Kuipergürtel-Objekt. Stickstoff-Geysire.',
    gym:'Einfang-Szenarien; Gezeitenentwicklung; Vergleich Pluto.',
    tip:'Physik: Drehimpuls und Bahnrichtung.'
  },
  'Charon':{
    subjects:['Physik'],
    haupt:'Charon ist der größte Mond des Pluto. Beide drehen sich um einen gemeinsamen Schwerpunkt.',
    real:'Doppelplanet-ähnlich: Baryzentrum liegt außerhalb von Pluto. Gebundene Rotation beider Körper.',
    gym:'Zweikörperproblem; Massenschätzung aus Bahnparametern.',
    tip:'Physik/Mathematik: Schwerpunkt (Baryzentrum).'
  },
  'Phobos':{
    subjects:['Physik'],
    haupt:'Phobos ist ein kleiner, unregelmäßiger Mond des Mars und kommt der Marsoberfläche sehr nahe.',
    real:'Sinkt langsam ab (Gezeiten), wird vermutlich zerbrechen. Form wie ein Kartoffel.',
    gym:'Roche-Grenze; Gezeitenabbau der Bahn.',
    tip:'Physik: Gezeitenreibung und Bahnzerfall.'
  },
  'Deimos':{
    subjects:['Physik'],
    haupt:'Deimos ist der kleinere und weiter entfernte Mond des Mars.',
    real:'Unregelmäßig, dunkle Oberfläche. Vermutlich eingefangener Asteroid.',
    gym:'Vergleich gebundene vs. ungebundene Monde; Asteroiden-Einfang.',
    tip:'Physik: Mondentstehung und Einfang.'
  },
  'Halley':{
    subjects:['Physik','Geschichte'],
    haupt:'Der Halleysche Komet kommt etwa alle 76 Jahre in die Nähe der Sonne und bekommt dann einen Schweif.',
    real:'Kurzperiodisch. Historisch wichtige Bahnvorhersage durch Edmond Halley. Nächste Wiederkehr 2061.',
    gym:'Keplerbahnen; Perihel/Aphel; Koma und Schweif (Staub + Ion) zeigen von der Sonne weg.',
    tip:'Geschichte: Wissenschaftliche Vorhersage. Physik: Impuls durch Sonnenwind.'
  },
  'Apophis':{
    subjects:['Physik','Mathematik'],
    haupt:'Apophis ist ein Asteroid, der der Erde manchmal nahe kommt. Wissenschaftler berechnen die Bahn genau.',
    real:'Nahbegegnung 2029 (sicher vorbei). Beispiel für Bahnbestimmung und Risikoabschätzung.',
    gym:'Bahnunsicherheit, Monte-Carlo-Vorhersagen, Δv-Ablenkung als Schutzkonzept.',
    tip:'Mathematik/Physik: Fehlerrechnung und Prognose.'
  },
  'Hale-Bopp':{
    subjects:['Physik','Geschichte'],
    haupt:'Hale-Bopp war 1997 ein sehr heller Komet, den man lange mit bloßem Auge sehen konnte.',
    real:'Langperiodisch, großer Kern. Beobachtungskampagnen in der Öffentlichkeit.',
    gym:'Staub- und Ionenproduktion; absolute Helligkeit und Entfernungsmodul.',
    tip:'Physik: Helligkeit und Entfernung.'
  },
  'Encke':{
    subjects:['Physik'],
    haupt:'Encke hat die kürzeste bekannte Umlaufzeit eines Kometen und hängt mit Sternschnuppen zusammen.',
    real:'Ursprung der Tauriden. Starke Bahnstörungen durch Jupiter möglich.',
    gym:'Meteoroidenströme und Elternkörper; säkulare Bahnentwicklung.',
    tip:'Physik: Zusammenhang Komet–Meteorstrom.'
  },
  'Swift-Tuttle':{
    subjects:['Physik','Geografie'],
    haupt:'Von Swift-Tuttle kommen die Perseiden – die Sternschnuppen im August.',
    real:'Jeden Sommer kreuzt die Erde die Staubspur. Radiant im Sternbild Perseus.',
    gym:'Meteor-Radiant; relative Geschwindigkeit; Beobachtungsplanung.',
    tip:'Geografie/Astronomie: Orientierung am Sternhimmel.'
  },
  'NEOWISE':{
    subjects:['Physik'],
    haupt:'NEOWISE war 2020 ein heller Komet, den viele Menschen fotografiert haben.',
    real:'Entdeckung durch IR-Teleskop. Beispiel moderner Himmelsüberwachung.',
    gym:'Infrarot-Astronomie; Kometenaktivität nahe Perihel.',
    tip:'Physik: Wellenlängen und Beobachtung.'
  },
  'Asteroidengürtel':{
    subjects:['Physik','Geografie'],
    haupt:'Zwischen Mars und Jupiter kreisen viele Gesteinsbrocken – der Asteroidengürtel.',
    real:'Kein dichter „Ring“, sondern großer Abstand zwischen Objekten. Ceres ist der größte Körper.',
    gym:'Kirkwood-Lücken (Resonanzen mit Jupiter); Entstehung und Planetesimale.',
    tip:'Physik: Resonanzen und stabile Bahnen.'
  },
  'Kuipergürtel':{
    subjects:['Physik'],
    haupt:'Hinter Neptun liegt der Kuipergürtel mit vielen eisigen Kleinkörpern – auch Pluto gehört dazu.',
    real:'Quelle kurzperiodischer Kometen. Sehr niedrige Temperaturen.',
    gym:'Transneptune; Scattered Disk; Verbindung zur Oortschen Wolke (Modell).',
    tip:'Physik: Aufbau des Sonnensystems nach außen.'
  }
};