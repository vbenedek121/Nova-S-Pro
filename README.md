# Pongbot HU 0.5 – Beni edzőtársa

Magyar Nova S Pro webes vezérlő, a gyári edzéscsoportokhoz igazított felépítéssel. Nem hivatalos alkalmazás. Ez a változat még nem volt kipróbálva valódi roboton.

## Mi változott?

- Alap / Basic, Kombinált / Combined, Összetett / Complex és Saját edzések.
- 34 kereshető minta, eredeti névvel és magyar jelentéssel; három szint, jobb-/balkezes iránytükrözés.
- Külön látszik, milyen labdát küld a robot. A Loop edzés nyesett labdát ad a pörgetés gyakorlásához.
- Időalapú edzés (alapérték 5 perc), köralapú edzés, véletlen sorrend, alapból 0 másodperc körszünet.
- Szüneteltetés az aktuális sorozat végén, majd folytatás. Azonnali leállításhoz STOP.
- Választható, melyik labdabeállításból kérsz egyetlen próbalabdát.
- Az üres labda nem használ korábbi nyesett motorértékeket; 0-s pörgetés is üresként normalizálódik.
- Üreslabda-kalibrálás: sebességhez menthető kerékegyensúly, interpoláció a köztes sebességeken. Csak üres labdánál érvényes.
- A gyári APK izolált számolófüggvényéből ellenőrzött fordulatszámképlet, a korábbi 400-as alsó szoftveres korlát megszüntetésével. A megengedett tartomány 0–7500 fordulat/perc.
- Korábbi 0.1–0.4-es saját mentések importálhatók. A távirányító és az összes korábbi véletlen kapcsoló megmaradt. A helyi tároló kulcsa változatlan.

## Az edzésnevek jelentése

| Név | Magyar jelentés | A robot labdája |
|---|---|---|
| Push(B) | Fonák nyesett tolás | Nyesett |
| Push(F) | Tenyeres nyesett tolás | Nyesett |
| Drive(B) | Fonák kontra | Pörgetett |
| Drive(F) | Tenyeres kontra | Pörgetett |
| Loop(B) | Fonák pörgetés nyesettre | Nyesett |
| Loop(F) | Tenyeres pörgetés nyesettre | Nyesett |

B = Backhand = fonák. F = Forehand = tenyeres. A név a játékos gyakorolt ütését jelöli.

## A minták eredete és korlátja

A nevek és az ütés/labda kapcsolat a gyári Nova S Pro kézikönyv alapján szerepelnek. A számszerű minták az olanga/nova közösségi vezérlő 2026. október 19-én elért forrásából származnak. A Drive(F)–Drive(F), Loop(F)–Loop(F) és háromlabdás Drive(F) sorozatok középső célirányát a kézikönyv középre helyezett labdáihoz igazítottuk.

**Ez nem a gyártó hitelesített teljes edzésadatbázisa.** A kézikönyv 36 normál és 8 hálóközeli kombinációt ír le. A rendelkezésre álló közösségi készletben 34 normál minta található; hálóközeli mintákat nem találtunk ki. Több kombinált mintánál a három szint forrásértékei azonosak. A 2/3 Court Random Drive a közösségi változat mintája, nem hitelesített gyári pályaszórás.

A gyári APK-ban a rendszeredzések API-jának hivatkozása megtalálható. A rendszeredzés-lista nyilvános kérésére a szerver bejelentkezési tokent kér; teljes gyári adatokat nem kaptunk. A gyári app fiókját és hitelesítését nem módosítottuk.

Források:
- https://store.pongbotsports.com/pages/support
- https://github.com/olanga/nova
- A gyártói oldalról linkelt appintl-pr-1.0.11_1208_1443.apk; az 1.0.12 binárisa nem volt vizsgálva.

## Üres labda beállítása

1. Állítsd a fejet a normál, felső/alsó kerékállásba.
2. Válaszd ki a sebességet és ívmagasságot az Üres labda beállítása panelen.
3. Kérj egyetlen próbalabdát. Ha nyesett, finoman a pozitív irányba állítsd a kerékegyensúlyt; ha pörgetett, negatívba.
4. Kérj újabb egyetlen labdát, és mentsd a bevált értéket. Több sebességen is készíthetsz mentett pontot.

A pozitív korrekció növeli a felső kerék fordulatát és ugyanannyival csökkenti az alsóét. Ez nem bizonyított javítása Beni robotja tapasztalt hibájának; a fizikai eredményt a roboton kell ellenőrizni. A korrekció az adott böngészőben marad, a gyakorlatok JSON-mentése nem tartalmazza.

## Megnyitás és használat

Androidon Chrome és HTTPS cím szükséges a Bluetoothhoz. A gyári alkalmazást és más robotvezérlő lapokat zárd be, majd Kapcsolódás. Elsőként az 1 labda próba gombbal tesztelj. Az ívmagasság a teljes kombinációra közös, az oldalpörgetéshez a fej kézi elfordítása szükséges. Az oldalirány előjelét az első próbakor ellenőrizd.

Ha a kapcsolat megszakad, a STOP nem továbbítható. Ha a robot tovább adogat, a saját kapcsolójával állítsd le. A lap háttérbe kerülésekor a szoftver leállítási parancsot próbál küldeni; automatikusan nem indul újra.

A projekt fájljait egy GitHub Pages tárhely gyökerébe vagy almappájába töltsd. Újratöltés után ellenőrizd a 0.5 verziófeliratot. Az élő GitHub Pages cím: https://vbenedek121.github.io/Nova-S-Pro/ . Az edzésminták a távirányító Edzésterv kiválasztása listájában és az Edzéstár és szerkesztés nézetben is elérhetők.

Helyi ellenőrzés: `python3 -m http.server 8080`, majd ugyanazon a gépen `http://127.0.0.1:8080`. Közvetlen `file://` megnyitás nem támogatott. Telefonról egy PC sima HTTP LAN-címe Bluetoothhoz nem megfelelő.

## Fejlesztői ellenőrzés

`npm test`: paraméterek, korábbi mentések, pörgetésirány, semleges labda, kalibrálás, minden edzésminta és parancscsomag ellenőrzése.

`node tests/ui-check.cjs`: Playwright és Chromium szükséges; a helyi webszerver fusson a 8080-as porton. Más cím `PONG_URL`, más Chromium bináris `PONG_CHROMIUM_PATH` változóval adható meg. A teszt szimulált Bluetooth eszközt használ.

## Webes 0.5 frissítés

A korábbi, élő 0.4-es változat távirányítója, véletlen labdatípusa, oldaliránya és fel-le kapcsolója megmaradt. A mentési formátum 4-es; a korábbi 1–3 formátumok beolvasása támogatott. Az új edzéstár és az üreslabda-kalibráció ezekkel együtt működik. Az összes JavaScript modul azonos 0.5 gyorsítótár-verziót kapott.
