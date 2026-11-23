(() => {
  const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
  const card = (title, body) => `<details class="requirement-card"><summary>${title}<span>+</span></summary><div class="requirement-body">${body}</div></details>`;

  const romanThemes = [
    'Stil de viață sănătos — egészséges életmód, táplálkozás, sport, testi-lelki egyensúly.',
    'Tehnologiile în viața noastră — digitális technológiák, internet, mesterséges intelligencia, ember és gép viszonya.',
    'Adolescenți printre cărți — kamaszkori olvasás, olvasmányélmények és a könyvek személyiségformáló szerepe.',
    'Imaginea de sine în adolescență — énkép, emberi természet, érzelemvilág és személyiség.',
    'Orientarea în carieră — pályaválasztás, jövőkép, szakmai identitás és hivatástudat.',
    'Mediul înconjurător — környezetvédelem, energiaforrások és természeti katasztrófák.',
    'Experiențele fundamentale — születés, halál, szerelem, barátság és küzdelem.',
    'Subiect și alteritate — az én és a másik viszonya, empátia, tolerancia és elfogadás.',
    'Tradiție și modernitate — hagyomány, korszerűség és kulturális örökség.'
  ];
  const romanAuthors = [
    'Mihai Eminescu — <em>Luceafărul</em>, <em>Floare albastră</em>, <em>Scrisoarea I</em>',
    'Ion Luca Caragiale — <em>O scrisoare pierdută</em>',
    'Ioan Slavici — <em>Moara cu noroc</em>',
    'Ion Creangă — <em>Povestea lui Harap-Alb</em>, <em>Amintiri din copilărie</em>',
    'George Bacovia — <em>Plumb</em>, <em>Lacustră</em>',
    'Lucian Blaga — <em>Eu nu strivesc corola de minuni a lumii</em>',
    'Tudor Arghezi — <em>Testament</em>, <em>Flori de mucigai</em>',
    'Liviu Rebreanu — <em>Ion</em>, <em>Pădurea spânzuraților</em>',
    'Camil Petrescu — <em>Ultima noapte de dragoste, întâia noapte de război</em>, <em>Jocul ielelor</em>',
    'George Călinescu — <em>Enigma Otiliei</em>',
    'Mihail Sadoveanu — <em>Baltagul</em>, <em>Hanu Ancuței</em>',
    'Marin Preda — <em>Moromeții</em> (I. kötet)',
    'Marin Sorescu — <em>Iona</em>',
    'Nichita Stănescu — <em>În dulcele stil clasic</em>, <em>Către Galateea</em>, <em>Leoaică tânără, iubirea</em>'
  ];
  const magAuthors = [
    '<b>Klasszikus és régi:</b> Janus Pannonius, Balassi Bálint, Zrínyi Miklós, Mikes Kelemen.',
    '<b>Felvilágosodás, reformkor, romantika:</b> Berzsenyi Dániel, Csokonai Vitéz Mihály, Kazinczy Ferenc, Kármán József, Kölcsey Ferenc, Vörösmarty Mihály, Katona József, Petőfi Sándor, Arany János, Madách Imre, Jókai Mór, Vajda János.',
    '<b>Realizmus és századforduló:</b> Mikszáth Kálmán, Krúdy Gyula, Móricz Zsigmond.',
    '<b>Nyugat:</b> Ady Endre, Babits Mihály, Kosztolányi Dezső, Tóth Árpád, Juhász Gyula.',
    '<b>Erdélyi és két világháború közötti:</b> Áprily Lajos, Dsida Jenő, Kós Károly, Kuncz Aladár, Tamási Áron.',
    '<b>Késő modernség és 20. század:</b> József Attila, Radnóti Miklós, Szabó Lőrinc, Illyés Gyula, Németh László, Ottlik Géza, Örkény István, Pilinszky János, Weöres Sándor.',
    '<b>Kortárs és erdélyi:</b> Kányádi Sándor, Székely János, Szilágyi Domokos, Szilágyi István, Esterházy Péter, Kovács András Ferenc.'
  ];

  const html = `
    <section id="requirements" class="screen requirements" aria-labelledby="requirementsTitle">
      <div class="requirements-heading"><p class="eyebrow">ÉRETTSÉGI KÖVETELMÉNY</p><h2 id="requirementsTitle">Hivatalos tananyag, egy helyen</h2><p>A román Oktatási Minisztérium vizsgaprogramjai alapján. Nyisd ki a tantárgyakat a részletes követelményekhez.</p></div>
      <div class="requirement-overview">${card('Vizsgaszerkezet', `<div class="requirement-grid"><p><b>Román</b><br>Szóbeli (10–15 perc) és írásbeli (3 óra). 9 általános téma, 3 diskurzustípus, 14 kanonikus szerző. DOOM3 és DEX norma.</p><p><b>Magyar</b><br>Szóbeli kompetencia és írásbeli (3 óra). Kommunikáció, nyelvtan, poétika és 41 ajánlott szerző.</p><p><b>Történelem</b><br>Írásbeli, 3 óra (E.c). Forráselemzés, ok-okozat és esszé a 9 kötelező témakörből.</p><p><b>Földrajz</b><br>Írásbeli, 3 óra (E.d). Európa, Románia és EU; vaktérkép, klimogram, statisztika.</p></div>`)}</div>
      <div class="requirements-subjects">
        ${card('Román nyelv és irodalom', `<p>A helyesírási, szótani és központozási hibák pontlevonással járnak. Szóbelin ismeretlen leíró, tájékoztató, elbeszélő vagy érvelő szöveget kell feldolgozni, önálló gondolatkifejtéssel.</p><h3>9 általános témakör</h3>${list(romanThemes)}<h3>Diskurzustípusok és fogalmak</h3>${list(['<b>Epikai:</b> cselekményszál, elbeszélői sík és nézőpont, szereplő, jellemzés, konfliktus, tér-idő, narrátor.', '<b>Drámai:</b> szerzői utasítás, dialógus, monológ, felvonás, jelenet, replika, drámai konfliktus.', '<b>Lírai:</b> líraiság típusa, lírai én, verselés, költői képek és alakzatok.', '<b>Közös:</b> cím, incipit, központi szimbólum, téma és motívum, világkép, műfajok, irodalmi irányzatok; egyenes, függő és szabad függő beszéd.'])}<h3>14 kanonikus szerző és reprezentatív művek</h3>${list(romanAuthors)}`)}
        ${card('Magyar nyelv és irodalom', `<h3>Kommunikáció és nyelvtan</h3>${list(['Közlési tényezők és funkciók; nyelvváltozatok, stílusrétegek, denotatív és konnotatív jelentés.', 'Szövegtan: kohézió, koherencia, téma, kulcsszó, anafora és katafora; elbeszélő, leíró és érvelő szöveg.', 'Hivatalos levél és szakmai önéletrajz (CV) formai-tartalmi szabályai.', 'Érvelés: érvek és ellenérvek, deduktív és induktív gondolatmenet, bizonyítás, cáfolat, érvelési hibák.', 'A helyesírás 4 alapelve: kiejtés, szóelemzés, hagyomány, egyszerűsítés; egybe- és különírás, tulajdonnevek, idegen szavak, központozás.', 'Véleményalkotás és forráshasználat: idézés, hivatkozás, plágium elkerülése.'])}<h3>Poétika és irodalom</h3>${list(['Esztétikai minőségek és hangnemek: fenséges, tragikus, elégikus, komikus, ironikus, groteszk, abszurd, szatirikus stb.', 'Szóképek, alakzatok és verstan: metafora, szimbólum, metonímia, hasonlat, ritmus, időmérték, rímtípusok, Balassi-strófa, szonett.', 'Epika: eposz, ballada, legenda, novella, regény, napló, irodalmi levél; elbeszélés, időkezelés, emberkép.', 'Líra: dal, epigramma, óda, himnusz, elégia; lírai én, beszédmód, allegorikusság, szimbolikusság, intertextualitás.', 'Dráma: tragédia, komédia, tragikomédia, drámai költemény; szerkezet, konfliktus és hős.'])}<h3>A hivatalos program 41 ajánlott szerzője</h3>${list(magAuthors)}`)}
        ${card('Történelem', `<p>A vizsga forráselemzést, kronológiát, szakszókincset, ok-okozati összefüggéseket és logikus esszéépítést mér. A III. tétel esszéje az alábbi 9 témakörből érkezik.</p><h3>I. Népek és történelmi terek</h3>${list(['<b>A románok romanitása a történészek szemszögéből:</b> etnogenezis, romanizáció, dák–római kontinuitás; középkori és humanista források; Erdélyi Iskola; bevándorlás- és kontinuitáselmélet, Xenopol és Iorga.'])}<h3>II. Társadalom és az eszmék világa</h3>${list(['<b>20. század: demokrácia és totalitarizmus:</b> többpártrendszer, fasizmus, nácizmus, kommunizmus; romániai rendszerek 1938–1944 között.', '<b>Románia alkotmányai:</b> 1866, 1923, 1938, 1948/1952/1965 és 1991 (2003-as módosítás).'])}<h3>III. Állam és politika</h3>${list(['<b>Helyi autonómiák és központi intézmények (9–18. század):</b> kenézségek, vajdaságok; Gelu, Glad, Menumorut; 1247-es diploma; Havasalföld és Moldva; fejedelem, tanács, egyház, hadsereg.', '<b>A modern román állam:</b> reformprojektek, 1821, 1848, 1859-es egyesülés és Cuza, 1877–1878-as függetlenség, 1918-as Nagy-Románia.', '<b>Háború utáni Románia:</b> kommunista hatalomátvétel, Gheorghiu-Dej, Ceaușescu, ellenállás és disszidencia, 1989-es forradalom.'])}<h3>IV. Nemzetközi kapcsolatok</h3>${list(['<b>Román térség diplomácia és konfliktus között:</b> Oszmán Birodalom, Magyar Királyság, Lengyelország; Mircea cel Bătrân, Hunyadi János, Ștefan cel Mare, Mihai Viteazul; hűbériség és autonómia.', '<b>Románia az európai koncertben:</b> keleti kérdés, 1856, 1878, Hármas Szövetség, Antant, Népszövetség, Kisantant, II. világháború és 1944. augusztus 23.', '<b>Románia a hidegháborúban:</b> KGST, Varsói Szerződés, 1958, 1964, nyugati kapcsolatok, 1980-as elszigetelődés.'])}`)}
        ${card('Földrajz', `<p>Elvárt a térképolvasás, klimogram- és statisztikaelemzés, összehasonlító elemzés. Gyakorold a népsűrűség, a hőingás és az évi középhőmérséklet számítását.</p><h3>A. Alapvető földrajzi elemek (1–6)</h3>${list(['A román és európai tér: fekvés, határok, kiterjedés.', 'Természetföldrajz: domborzat, éghajlat, vízrajz, élővilág, talajok, erőforrások; kiemelten Duna és Fekete-tenger.', 'Társadalom- és gazdaságföldrajz: politikai térkép, népesség, városhálózat, ipar, mezőgazdaság, szolgáltatások és közlekedés.', 'Környezet és tájtípusok: problémák, védett területek.', 'Földrajzi régiók: kiemelt esettanulmány a Kárpátok hegységrendszere.', 'Románia szomszédai: Ukrajna, Moldova, Magyarország, Szerbia, Bulgária.'])}<h3>B. Románia és az Európai Unió (7–11)</h3>${list(['EU-kialakulás: ESZAK (1951), EGK (1957), Maastricht (1992), bővítések (2004, 2007, 2013).', 'EU-arculat: egységes piac, eurózóna, schengeni övezet és regionális különbségek.', '8 kiemelt ország: Franciaország, Németország, Olaszország, Egyesült Királyság, Spanyolország, Portugália, Görögország, Ausztria — fekvés, domborzat, éghajlat, vizek, városok, gazdaság, turizmus.', 'Románia az EU-ban: geopolitikai helyzet, integráció.', 'Energia az EU-ban és Romániában: fosszilis függés, megújulók, atomenergia, energiabiztonság.'])}<h3>C. Európa és EU a kortárs világban (12–16)</h3>${list(['Népességrobbanás, élelmezési válság, éghajlatváltozás, elsivatagosodás, ivóvízhiány, egyenlőtlen fejlődés.', 'Európa történelmi, technológiai, tudományos és kulturális szerepe.', 'EU-kapcsolatok az USA-val, Kínával, Japánnal és BRICS-országokkal.', 'Globalizáció, multinacionális vállalatok, kulturális hatások.', 'Demográfiai fenntarthatóság, zöld átállás, digitalizáció, EU-jövőkép.'])}`)}
      </div>
    </section>`;
  document.querySelector('main')?.insertAdjacentHTML('beforeend', html);
})();
