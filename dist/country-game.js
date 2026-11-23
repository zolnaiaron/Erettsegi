(() => {
  const countries = [
    ['AD', 'Andorra'], ['AL', 'Albánia'], ['AT', 'Ausztria'],
    ['BA', 'Bosznia-Hercegovina', ['Bosznia és Hercegovina']], ['BE', 'Belgium'], ['BG', 'Bulgária'],
    ['BY', 'Fehéroroszország', ['Belarusz']], ['CH', 'Svájc'], ['CY', 'Ciprus'], ['CZ', 'Csehország', ['Cseh Köztársaság']],
    ['DE', 'Németország'], ['DK', 'Dánia'], ['EE', 'Észtország'], ['EL', 'Görögország'], ['ES', 'Spanyolország'],
    ['FI', 'Finnország'], ['FR', 'Franciaország'], ['HR', 'Horvátország'], ['HU', 'Magyarország'],
    ['IE', 'Írország'], ['IS', 'Izland'], ['IT', 'Olaszország'], ['LI', 'Liechtenstein'],
    ['LT', 'Litvánia'], ['LU', 'Luxemburg'], ['LV', 'Lettország'], ['MC', 'Monaco'], ['MD', 'Moldova', ['Moldovai Köztársaság']],
    ['ME', 'Montenegró'], ['MK', 'Észak-Macedónia', ['Macedónia']], ['MT', 'Málta'], ['NL', 'Hollandia', ['Németalföld']],
    ['NO', 'Norvégia'], ['PL', 'Lengyelország'], ['PT', 'Portugália'], ['RO', 'Románia'], ['RS', 'Szerbia'],
    ['RU', 'Oroszország', ['Orosz Föderáció']], ['SE', 'Svédország'], ['SI', 'Szlovénia'], ['SK', 'Szlovákia'],
    ['SM', 'San Marino'], ['TR', 'Törökország', ['Török Köztársaság']], ['UA', 'Ukrajna'],
    ['UK', 'Egyesült Királyság', ['Nagy-Britannia', 'Britannia']], ['VA', 'Vatikán', ['Vatikánváros', 'Szentszék']]
  ].map(([code, name, alternatives = []]) => ({ code, name, alternatives }));

  const byCode = new Map(countries.map(country => [country.code, country]));
  const tinyCodes = new Set(['AD', 'LI', 'LU', 'MC', 'MT', 'SM', 'VA']);
  const view = { width: 1100, height: 1010 };
  const game = { order: [], index: 0, score: 0, mistakes: 0, skipped: 0, attempts: 0, completed: new Set(), startedAt: 0, timer: 0, ready: false, finishing: false };
  let featureByCode = new Map();
  let mapReady = false;
  let mapLoading = false;
  let transform = { scale: 1, x: 0, y: 0 };

  const el = id => document.getElementById(id);
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const shuffle = list => [...list].sort(() => Math.random() - .5);
  const normalize = text => text.toLocaleLowerCase('hu-HU').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const maximumDistance = length => length <= 5 ? 1 : length <= 9 ? 2 : 3;
  const levenshtein = (left, right) => {
    const row = Array.from({ length: right.length + 1 }, (_, index) => index);
    for (let i = 1; i <= left.length; i++) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= right.length; j++) {
        const current = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (left[i - 1] === right[j - 1] ? 0 : 1));
        previous = current;
      }
    }
    return row[right.length];
  };
  const alternatives = country => [country.name, ...country.alternatives].map(normalize);
  const allNames = new Map(countries.flatMap(country => alternatives(country).map(name => [name, country.code])));
  const currentCountry = () => byCode.get(game.order[game.index]);

  function countryStore() {
    state.countryGame = state.countryGame || { best: 0, fastest: null, history: [], mistakes: {}, xpDate: '' };
    state.countryGame.history = state.countryGame.history || [];
    state.countryGame.mistakes = state.countryGame.mistakes || {};
    return state.countryGame;
  }

  function centreOf(feature) {
    return feature.centre || [500, 325];
  }

  function renderMap() {
    const layer = el('countryMapLayer');
    const svg = el('countryMap');
    svg.setAttribute('viewBox', window.EuropeSvgMap.viewBox);
    layer.innerHTML = window.EuropeSvgMap.markup;
    featureByCode = new Map([...layer.querySelectorAll('[data-country]')].map(path => {
      const box = path.getBBox();
      return [path.dataset.country, { code: path.dataset.country, centre: [box.x + box.width / 2, box.y + box.height / 2] }];
    }));
    const italy = layer.querySelector('[data-country="IT"]')?.getBBox();
    if (italy && !featureByCode.has('MC')) featureByCode.set('MC', { code: 'MC', centre: [italy.x - 2, italy.y + italy.height * .2] });
    tinyCodes.forEach(code => {
      const feature = featureByCode.get(code);
      if (!feature) return;
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      marker.setAttribute('class', 'country-marker');
      marker.setAttribute('data-country-marker', code);
      marker.setAttribute('cx', feature.centre[0]);
      marker.setAttribute('cy', feature.centre[1]);
      marker.setAttribute('r', '4.5');
      layer.append(marker);
    });
    svg.style.touchAction = 'manipulation';
    updateMapState();
  }

  function updateMapState() {
    const active = currentCountry()?.code;
    document.querySelectorAll('#countryMapLayer [data-country], #countryMapLayer [data-country-marker]').forEach(item => {
      const code = item.dataset.country || item.dataset.countryMarker;
      const isActive = code === active;
      const isDone = game.completed.has(code);
      item.classList.toggle('is-active', isActive && !isDone);
      if (isDone) {
        item.style.setProperty('fill', '#6fb184', 'important');
        item.style.setProperty('stroke', '#285d3a', 'important');
        item.style.setProperty('stroke-width', '2', 'important');
      } else if (isActive) {
        item.style.setProperty('fill', '#f2c95c', 'important');
        item.style.setProperty('stroke', '#6f4d00', 'important');
        item.style.setProperty('stroke-width', '2.4', 'important');
      } else {
        item.style.removeProperty('fill');
        item.style.removeProperty('stroke');
        item.style.removeProperty('stroke-width');
      }
    });
    document.querySelectorAll('.country-path.is-done,.country-marker.is-done').forEach(item => item.classList.remove('is-done'));
    game.completed.forEach(code => {
      document.querySelectorAll(`[data-country="${code}"], [data-country-marker="${code}"]`).forEach(item => item.classList.add('is-done'));
    });
  }

  function updateTransform() {
    el('countryMapLayer').setAttribute('transform', `translate(${transform.x} ${transform.y}) scale(${transform.scale})`);
  }

  function updateZoomButton() {
    const button = el('countryMapZoomIn');
    const isZoomed = transform.scale > 1;
    button.textContent = isZoomed ? 'Normál' : 'Közelítés';
    button.setAttribute('aria-label', isZoomed ? 'Normál nézet visszaállítása' : 'Kiemelt ország közelítése');
  }

  function resetMapView() {
    transform = { scale: 1, x: 0, y: 0 };
    updateTransform();
    updateZoomButton();
  }

  function zoomToCurrentCountry() {
    if (transform.scale > 1) return resetMapView();
    const feature = featureByCode.get(currentCountry()?.code);
    if (!feature) return;
    const [x, y] = centreOf(feature);
    transform.scale = 1.955;
    transform.x = view.width / 2 - x * transform.scale;
    transform.y = view.height / 2 - y * transform.scale;
    updateTransform();
    updateZoomButton();
  }

  function updateStats() {
    const total = game.order.length;
    const completed = game.index;
    el('countryGameDone').textContent = `${completed} / ${total}`;
    el('countryGameScore').textContent = String(game.score);
    el('countryGameMistakes').textContent = String(game.mistakes);
    el('countryGameRemaining').textContent = String(Math.max(0, total - completed));
    el('countryGameTime').textContent = formatTime(Math.floor((Date.now() - game.startedAt) / 1000));
    const progress = total ? completed / total * 100 : 0;
    el('countryGameProgress').style.width = `${progress}%`;
    el('countryGameProgress').parentElement.setAttribute('aria-valuenow', String(Math.round(progress)));
  }

  function setFeedback(text = '', type = '') {
    const feedback = el('countryFeedback');
    feedback.textContent = text;
    feedback.className = `country-feedback ${type}`;
  }

  function renderTurn() {
    if (game.index >= game.order.length) return finishGame();
    game.attempts = 0;
    game.finishing = false;
    el('countryAnswer').value = '';
    el('countryAnswer').disabled = false;
    el('countryCheck').disabled = false;
    el('countrySkip').disabled = false;
    setFeedback();
    resetMapView();
    updateMapState();
    updateStats();
    el('countryAnswer').focus();
  }

  function rememberMiss(country) {
    const store = countryStore();
    store.mistakes[country.code] = (store.mistakes[country.code] || 0) + 1;
  }

  function acceptAnswer() {
    const country = currentCountry();
    const earned = game.attempts === 0 ? 3 : game.attempts === 1 ? 2 : 1;
    game.score += earned;
    game.completed.add(country.code);
    game.finishing = true;
    el('countryAnswer').disabled = true;
    el('countryCheck').disabled = true;
    el('countrySkip').disabled = true;
    updateMapState();
    updateStats();
    setFeedback(`Helyes! +${earned} pont`, 'success');
    window.setTimeout(() => { game.index++; renderTurn(); }, 750);
  }

  function checkAnswer() {
    if (!game.ready || game.finishing) return;
    const submitted = normalize(el('countryAnswer').value);
    if (!submitted) return setFeedback('Írd be egy ország nevét.', 'error');
    const country = currentCountry();
    const belongsToAnotherCountry = allNames.has(submitted) && allNames.get(submitted) !== country.code;
    const accepted = !belongsToAnotherCountry && alternatives(country).some(answer => levenshtein(submitted, answer) <= maximumDistance(answer.length));
    if (accepted) return acceptAnswer();
    game.attempts++;
    game.mistakes++;
    rememberMiss(country);
    updateStats();
    setFeedback('Még nem ez az ország. Próbáld újra!', 'error');
    el('countryAnswer').select();
  }

  function skipCountry() {
    if (!game.ready || game.finishing) return;
    const country = currentCountry();
    game.skipped++;
    game.finishing = true;
    el('countryAnswer').disabled = true;
    el('countryCheck').disabled = true;
    el('countrySkip').disabled = true;
    setFeedback(`A helyes válasz: ${country.name}.`, 'skipped');
    window.setTimeout(() => { game.index++; renderTurn(); }, 1100);
  }

  function finishGame() {
    game.ready = false;
    window.clearInterval(game.timer);
    const elapsed = Math.floor((Date.now() - game.startedAt) / 1000);
    const maximum = game.order.length * 3;
    const percent = maximum ? Math.round(game.score / maximum * 100) : 0;
    const store = countryStore();
    const today = new Date().toISOString().slice(0, 10);
    let bonus = 0;
    if (store.xpDate !== today) {
      bonus = percent >= 95 ? 1000 : percent >= 85 ? 600 : percent >= 70 ? 300 : 0;
      if (bonus) { store.xpDate = today; giveXp(bonus, '🌍 Melyik ország ez?'); }
    }
    store.best = Math.max(store.best || 0, game.score);
    store.fastest = store.fastest === null || elapsed < store.fastest ? elapsed : store.fastest;
    store.history.unshift({ date: Date.now(), score: game.score, percent, elapsed, mistakes: game.mistakes, skipped: game.skipped });
    store.history = store.history.slice(0, 10);
    save();
    el('countryResultScore').textContent = `${game.score} / ${maximum}${bonus ? ` · +${bonus / 100} XP` : ''}`;
    el('countryResultPercent').textContent = `${percent}%`;
    el('countryResultMistakes').textContent = String(game.mistakes);
    el('countryResultSkipped').textContent = String(game.skipped);
    el('countryResultTime').textContent = formatTime(elapsed);
    el('countryResult').hidden = false;
    el('countryAnswer').disabled = true;
    el('countryCheck').disabled = true;
    el('countrySkip').disabled = true;
    setFeedback('Minden ország sorra került.', 'success');
    updateStats();
  }

  function startGame() {
    if (!mapReady) return;
    window.clearInterval(game.timer);
    game.order = shuffle(countries.map(country => country.code).filter(code => featureByCode.has(code)));
    game.index = 0;
    game.score = 0;
    game.mistakes = 0;
    game.skipped = 0;
    game.attempts = 0;
    game.completed = new Set();
    game.startedAt = Date.now();
    game.ready = true;
    game.finishing = false;
    resetMapView();
    el('countryResult').hidden = true;
    game.timer = window.setInterval(updateStats, 1000);
    renderTurn();
  }

  function loadMap() {
    if (mapReady || mapLoading) return;
    mapLoading = true;
    try {
      if (!window.EuropeSvgMap?.markup) throw new Error('A térképadat nem érhető el.');
      renderMap();
      if (featureByCode.size < 40) throw new Error('A térképadat hiányos.');
      mapReady = true;
      mapLoading = false;
      startGame();
    } catch (error) {
      mapLoading = false;
      setFeedback(error.message, 'error');
    }
  }

  el('countryGameOpen').addEventListener('click', () => {
    screen('countryGame');
    if (!mapReady) window.requestAnimationFrame(loadMap);
    else startGame();
  });
  el('countryGameBack').addEventListener('click', () => screen('challenge'));
  el('countryAnswerForm').addEventListener('submit', event => { event.preventDefault(); checkAnswer(); });
  el('countrySkip').addEventListener('click', skipCountry);
  el('countryNewGame').addEventListener('click', startGame);
  const timeCard = el('countryGameTime').parentElement;
  timeCard.classList.add('country-map-time');
  el('countryMapViewport').append(timeCard);
  updateZoomButton();
  el('countryMapZoomIn').addEventListener('click', zoomToCurrentCountry);
  document.querySelector('.country-attribution')?.remove();
  el('countryMapLoading')?.remove();
})();
