# Sonnensystem 3D

Interaktives 3D-Sonnensystem (Three.js 0.160), optimiert für Handy und Desktop.

## Starten

Die App nutzt ES-Module und muss deshalb über einen lokalen Webserver laufen. Ein Doppelklick auf `index.html` reicht nicht.

```
cd C:\claude-stuff\sonnensystem
python -m http.server 8080
```

Dann im Browser `http://localhost:8080` öffnen. Vom Handy im selben WLAN: `http://<PC-IP>:8080`.

Three.js und die Haupttexturen liegen im Ordner (`vendor/`, `*.jpg`). Die App läuft also auch offline. Nur Pluto, Ceres und einige Monde laden ihre Texturen von Wikimedia, sonst gibt es eine Ersatztextur.

## Änderungen (Okt. 2026)

- **Mobil:** Das Fokus-Panel war immer eingeblendet und ist jetzt behoben. Die Fokus-Steuerung sitzt oben, es ist immer nur ein Fokus-Fenster offen, und die Lightbox lässt sich schließen. Wird die Szene angetippt, schließt das Menü. Schalter und Slider sind größer.
- **Tippen:** Zwei-Finger-Zoom löst keine Klicks mehr aus. Kleine Objekte (ISS, Monde, Kometen) haben einen Toleranzradius, die Sonne ist anklickbar, und im Info-Panel gibt es einen Button „Details & Schule öffnen“.
- **Performance:** Auf Handys gilt eine niedrigere Pixelratio, Bloom läuft in halber Auflösung und die Milchstraße wird günstiger gerendert. Die Gürtel werden nur neu berechnet, wenn sich etwas bewegt. Bei dauerhaft wenig FPS sinkt die Auflösung automatisch. Auf Mobil ist der Weichzeichner aus.
- **Korrektheit:** Die Bahnlinien sind echte Ellipsen. Asteroiden- und Kuipergürtel, Kometen und Sterne haben jetzt denselben Maßstab wie die Planeten. Die Kamera schaut im Fokus auf die Tagseite.
