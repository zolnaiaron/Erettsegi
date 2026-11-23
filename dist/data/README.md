# Térképadat

`gisco-countries-2024-10m.geojson`: Eurostat/GISCO Countries 2024, 1:10M, EPSG:4326.

`europe-game-countries-10m.geojson`: a fenti Eurostat/GISCO-állományból korábban gépileg képzett, csak az 50 európai játékországot tartalmazó részhalmaz. Ismét ez a térkép közvetlen geometriai forrása, a részletesség további egyszerűsítése nélkül.

`europe-iso-map.svg`: Marcin Floryan ISO-kódos Európa-térképe a Wikimedia Commonsról, CC BY-SA 3.0 licenc alatt.

`../country-wikimedia-map.js`: a fenti SVG-ből a `scripts/build-wikimedia-map.js` által készített korábbi, kisebb részletességű térkép. Az alkalmazás már nem ezt tölti be.

A térkép ismét az eredeti `europe-game-countries-10m.geojson` részhalmazból készül, amely az Eurostat/GISCO Countries 2024 hivatalos `CNTR_RG_10M_2024_4326.geojson` állományából származik (EPSG:4326).

`../country-highres-map.js`: a fenti 1:10 milliós forrásból a `scripts/build-highres-europe-map.js` által előre levágott, Web Mercator-vetületbe helyezett és SVG-útvonalakká alakított európai térkép. A játék ezt tölti be közvetlenül, ezért futás közben nincs GeoJSON-feldolgozás vagy hálózati térképkérés.

Forrás: https://commons.wikimedia.org/wiki/File:Europe-countries-outline-iso-coded-plain.svg

Forrás: https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_10M_2024_4326.geojson

Az alkalmazás a fájlból kizárólag az európai játék országainak geometriáját rajzolja ki. A felhasználásra a GISCO-adatforrás saját letöltési és felhasználási feltételei vonatkoznak.
