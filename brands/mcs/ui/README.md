# MCS Produkt-Look (Mockups)
Jeder MCS-Post zeigt etwas vom Produkt, nicht nur Text. Vorhandene Bilder (1680×1120, `assets/ui-*.png`, Einbindung per `"bild":"../mcs/assets/ui-<id>.png"` in Bild, Karussell-Folie oder Reel-Szene):
| Datei | Inhalt | passt zu |
|---|---|---|
| ui-lager-scan | MCS Lager am Smartphone: Wareneingang scannen + „gebucht in büro+“ | Lager, Wareneingang |
| ui-lager-inventur | MCS Lager auf Tablet: Inventur mit Soll/Ist/Differenz | Inventur, Jahreswechsel |
| ui-flow-tickets | MCS Flow: Ticket-Board Neu / In Arbeit / Erledigt mit Zeiten | Flow, Support, Projekte |
| ui-eingang-ki | Eingangsrechnung + KI-Vorschlag mit Freigeben/Korrigieren | KI, Eingangsrechnungen, E-Rechnung |
| ui-archiv | MCS Archiv: Vorgangsliste „archiviert ✓“ + Beleg-Vorschau | GoBD, Archiv |
| ui-bi | Auswertung auf büro+-Daten: Kennzahlen, Monatsbalken, Top-Gruppen | Power BI, Auswertungen |
Alle sind als „BEISPIELDARSTELLUNG“ gekennzeichnet (nachgebaut, keine echten Kundendaten). Neue Mockups: in `ui.html` als `<div class="m" id="...">` (1680×1120) ergänzen, `python3 brands/mcs/ui/render_ui.py`. Echte Screenshots (anonymisiert) von Ralf haben Vorrang → `assets/screen-*.png`.
