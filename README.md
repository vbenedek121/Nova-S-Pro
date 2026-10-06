# Pongbot HU – Beni edzőtársa

Saját magyar, mobilra is használható Nova S Pro vezérlő. **0.3 próbaváltozat; a véletlen mód valódi roboton még nincs ellenőrizve.** Beni a közösségi Nova Drill Controlt sikeresen tesztelte, ez azonban új, külön implementáció.

## Funkciók

- Saját nevű gyakorlatok mentése a böngésző helyi tárhelyére; másolat, törlés.
- Teljes gyűjtemény mentése JSON fájlba, additív visszatöltés a meglévők törlése nélkül.
- 1–5 labdabeállítás; sebesség, felső/alsó pörgetés, irány, gyakoriság, ismétlésszám.
- Közös ívmagasság, körök száma, körök közötti szünet.
- 5 másodperces indulási visszaszámlálás, egyetlen labdás próba, leállítás.
- Minden kör véges robotparancs. Visszajelzés nélkül nem indít újabb kört.
- Háttérbe tett lapnál leállítási kísérlet. Kapcsolatvesztéskor nincs automatikus újraindítás.

## Használat

Androidon Chrome, Bluetooth és HTTPS webcím kell. A gyári appot és más vezérlőlapokat zárd be, majd Kapcsolódás → robot kiválasztása. Először néhány labdával, az **1 labda próba** gombbal tesztelj. A LEÁLLÍTÁS gombot is próbáld ki. Ha a Bluetooth megszakad, a stop parancs nem továbbítható, ilyenkor szükség esetén a robot kapcsolóját használd.

A minták nincsenek kalibrálva a te asztalodhoz. A sebesség/pörgetés skálái relatívak. Az oldalirány előjelét az első próbakor ellenőrizd a robot elhelyezéséhez képest. Az alap-ívmagasság teljes kombinációra közös, véletlen fel-le módban labdánként új értéket kap; az oldalpörgetéshez a fejet kézzel kell elfordítani. Elsőként normál, függőleges kerékállással tesztelj.

A **Mentés** a jelenlegi böngészőben tárol; a **Mentés fájlba** minden mentett gyakorlatot és az aktuális szerkesztést exportálja. A fájlból betöltés új példányokat ad hozzá. A gyári és a közösségi vezérlő fájlformátuma nem kompatibilis ezzel a változattal. Nincs felhős fiók, automatikus szinkron vagy garantált offline indulás.

## Véletlen edzés (0.3)

A **Véletlen labdatípus** kapcsoló minden egyes labdánál egyenlő eséllyel választ nyesett, üres és pörgetett között. A pörgetés erőssége itt külön állítható; üres labdánál nulla. A sorok eredeti típusát és pörgetését nem írja át, kikapcsolva azok lépnek ismét életbe.

A **Véletlen oldalirány** minden labdának külön célirányt választ a két határ között, 0,5 lépésenként. A **Teljes tartomány** gomb −10…+10-re állítja. Ez a vezérlés tartománya, nem kalibrált asztalszélesség. Először −4…+4 között próbáld. A kapcsolók egymástól függetlenek; ismétlődhet ugyanaz a típus vagy irány. Sebességet és ütemet nem sorsolunk.

A **Véletlen fel-le állítás** kapcsoló minden labdánál új ívmagasságot választ a megadott alsó és felső határ között, egész lépésekben (−50…100 skálán, nem centiméterben). A három kapcsoló egymástól független és együtt is működik. Az **Alapmagasság körül ±5** gomb a felül beállított fix magasság köré állítja a két határt, a megengedett tartományon belül. Kikapcsolva újra az eredeti fix magasságot használja. A véletlen magasság az adogatási parancs része, szerkesztéskor nem mozgatja a fejet. A tényleges labdapályát az asztalon kell kipróbálni, kezdetben szűk magasságtartományban.

A soronkénti labdaszám megmarad, de minden ismétlés saját sorsolást kap. Legfeljebb öt külön labdát küldünk egy véges parancsban. A következő csomag csak befejezési visszajelzés után indul; ötlabdánként rövid átmenet lehet. A beállított pihenő csak a teljes kör után következik. Minden kör új sorsolás; az egylabdás próba is használja a kapcsolókat, de összesen egy labdát küld.

A kapcsolók és határok mentéskor, másolatnál és export/import során megmaradnak. A régi (1. verziós) mentések kikapcsolt véletlen móddal tölthetők be. A korábbi 2. verziós mentések beállításai megmaradnak, a fel-le sorsolás kikapcsolva indul. A 3. verziós mentéseket a 0.3 vagy újabb alkalmazással kell megnyitni.

## GitHub Pages

A `vbenedek121/Nova-S-Pro` repository gyökerében található az alkalmazás. Settings → Pages → Deploy from a branch → main → / (root) → Save. Várható cím: `https://vbenedek121.github.io/Nova-S-Pro/` (csak sikeres publikálás után létezik).

Alternatívaként egy már publikált GitHub Pages repository külön almappájából is működik. Minden hivatkozás relatív. A projekt saját címe alatt használj mindig azonos böngészőt a helyi mentésekhez.

Helyi ellenőrzés: `python3 -m http.server 8080`, majd `http://localhost:8080`. Közvetlen `file://` megnyitás nem támogatott. Telefonról egy PC sima HTTP LAN-címe Bluetoothhoz nem megfelelő.

## Fejlesztés és eredet

Függőségmentes HTML/CSS/JavaScript. `npm test` ellenőrzi a mentéseket, a csomagformátumot, az MD5 párosítási kivonatot és a sorban álló parancsok leállítását.

A Bluetooth üzenetek és motorparaméterek megértéséhez az [olanga/nova](https://github.com/olanga/nova) és az abban hivatkozott smee/plunder munkája szolgált referenciaként. Az alkalmazás kezelőfelülete, adatmodellje, tárolása és kommunikációs megvalósítása önálló kód; nem tartalmazza a referenciaprojekt alkalmazásfájljait vagy előre programozott gyakorlatait. Az MD5 az RFC 1321 szerint készült, a robot kézfogásához szükséges.

### Ellenőrzés határa

Az automatizált tesztek böngészős működést és szimulált Bluetooth-válaszokat vizsgálnak. Nem igazolják a tényleges labdapályát, az új firmware kompatibilitását vagy a fizikai leállást. Az első hardveres teszt Beni robotján szükséges.
