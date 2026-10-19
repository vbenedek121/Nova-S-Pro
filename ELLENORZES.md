# Ellenőrzés – Pongbot HU 0.5, 2026. október 19.

18 sikeres Node.js teszt. Vizsgálva: MD5 és párosítási válasz; magyar mentések; régi 0.1 mentések normalizálása; érvénytelen import; 24 bájtos labdarekord; STOP sorbaállítása; üres labda és korábbi nyesett motoradatok kizárása; kerékegyensúly kizárólag üres labdára; a gyári natív modulból ellenőrzött referenciavektorok; 400 alatti fordulat; mind a 34 minta mindhárom szinten és két kézbeállítással; kalibrálás, interpoláció és hibás értékek elutasítása.

Chromium 153, szimulált Bluetooth eszköz, 390×844 és 1280×950 nézet. Sikeres felületi próba: 6/12/16 kategória, magyar és eredeti nevek, beérkező pörgetés, szintváltás, kézváltás, keresés, mentés és újratöltés, szint/kéz megőrzése, JSON export/import, párosítás, kalibrált egyetlen üres labda, nyesett mintáról üresre váltás motoradatainak törlése, elmentett korrekció visszaolvasása, szünet/folytatás, időzített STOP, STOP visszaszámlálás közben és késői visszajelzés figyelmen kívül hagyása nyugalmi állapotban. JavaScript kivétel és vízszintes túlcsordulás nem jelentkezett.

A mobil és asztali képernyőképeket vizuálisan ellenőriztük. A képernyőképek belső ellenőrzéshez készültek, nem részei a csomagnak.

A valódi robot viselkedését, a labda fizikai forgását, pályáját, a firmware-kompatibilitást és a fizikai leállást ezek a tesztek nem igazolják. A felhasználó által tapasztalt üreslabda-nyesés megszűnése még nincs ellenőrizve. Az üreslabda-korrekció alapértéke 0; a ténylegesen szükséges korrekciót Beni robotján kell megmérni/beállítani.

A program gyári elnevezésű közösségi mintákat tartalmaz; nem állítjuk, hogy a teljes gyári adatbázis vagy a gyári alkalmazás minden funkciója elkészült.

A webes 0.5 változat külön ellenőrzése: a korábbi 0.4-es távirányító, a v3 formátumú mentett edzés, a három véletlen kapcsoló, a v4 visszamentés és hét véletlen labda 5+2 rekordos kötegelése sikeres. STOP után nem indul további köteg. A 34 mintát a távirányító választólistája is tartalmazza.
