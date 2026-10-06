# Ellenőrzés – 2026. október 6. – 0.2

10 sikeres Node.js teszt: MD5, párosítás, mentés/import, motorparancs, STOP sor; régi mentések migrálása kikapcsolt véletlen móddal; véletlen beállítások körútja; hibás tartományok elutasítása; a három labdatípus motorparancsai; irányhatárok és fél lépések; 100 labda szétosztása ötös csomagokba; körönként új sorsolás, változatlan forrásadatok.

Chromium 134, 390×844 és 1280×950: véletlen kapcsolók és határok mentése, újratöltése, JSON export/import; felülírt kézi mezők letiltása; szimulált Bluetooth párosítás; két hétlabdás kör helyesen 5+2+5+2 labdás véges parancsokkal; pihenő csak a teljes kör után; véletlen egylabdás próba; leállítás visszaszámlálás közben, csomagok között és futás közben; késői befejezési jelzés elvetése; hiányzó befejezési visszajelzésnél leállítás; motorhatár túllépésének elutasítása. A STOP futás közben látható mobilon. Nincs JavaScript kivétel vagy vízszintes túlcsordulás.

A tesztek szimulált kapcsolattal futottak. A véletlen mód tényleges labdapályája, az ötlabdás csomagok közötti fizikai átmenet és leállás Beni robotján még kipróbálásra vár.
