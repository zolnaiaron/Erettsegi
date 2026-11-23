(() => {
  const capitals = [
    ['Andorra la Vella', 1.52, 42.51], ['Tirana', 19.82, 41.33], ['Bécs', 16.37, 48.21, ['Wien']],
    ['Szarajevó', 18.41, 43.86, ['Sarajevo']], ['Brüsszel', 4.35, 50.85, ['Brusszel', 'Brussels']],
    ['Szófia', 23.32, 42.70, ['Sofia']], ['Minszk', 27.56, 53.90, ['Minsk']], ['Bern', 7.45, 46.95],
    ['Nicosia', 33.38, 35.19, ['Lefkosia']], ['Prága', 14.44, 50.08, ['Praga']], ['Berlin', 13.41, 52.52],
    ['Koppenhága', 12.57, 55.68, ['Koppenhaga', 'Copenhagen']], ['Tallinn', 24.75, 59.44],
    ['Athén', 23.73, 37.98, ['Athen', 'Athens']], ['Madrid', -3.70, 40.42], ['Helsinki', 24.94, 60.17],
    ['Párizs', 2.35, 48.86, ['Parizs', 'Paris']], ['Zágráb', 15.98, 45.82, ['Zagreb']], ['Budapest', 19.04, 47.50],
    ['Dublin', -6.26, 53.35], ['Reykjavík', -21.94, 64.15, ['Reykjavik']], ['Róma', 12.50, 41.90, ['Roma', 'Rome']],
    ['Vaduz', 9.52, 47.14], ['Vilnius', 25.28, 54.69], ['Luxemburg', 6.13, 49.61, ['Luxembourg']],
    ['Riga', 24.11, 56.95, ['Rīga']], ['Monaco', 7.42, 43.74], ['Chișinău', 28.84, 47.01, ['Chisinau', 'Kisinyov', 'Kisinyó']],
    ['Podgorica', 19.26, 42.43], ['Szkopje', 21.43, 41.99, ['Skopje']], ['Valletta', 14.51, 35.90],
    ['Amszterdam', 4.90, 52.37, ['Amsterdam']], ['Oslo', 10.75, 59.91], ['Varsó', 21.01, 52.23, ['Varso', 'Warsaw']],
    ['Lisszabon', -9.14, 38.72, ['Lisbon']], ['Bukarest', 26.10, 44.43, ['Bucharest']], ['Belgrád', 20.46, 44.81, ['Belgrad', 'Belgrade']],
    ['Moszkva', 37.62, 55.76, ['Moszkva', 'Moscow']], ['Stockholm', 18.07, 59.33], ['Ljubljana', 14.51, 46.06],
    ['Pozsony', 17.11, 48.15, ['Bratislava']], ['San Marino', 12.45, 43.94], ['Ankara', 32.86, 39.93],
    ['Kijev', 30.52, 50.45, ['Kijiv', 'Kyiv', 'Kiev']], ['London', -0.13, 51.51], ['Vatikánváros', 12.45, 41.90, ['Vatikán', 'Vatican City']]
  ].map(([name, longitude, latitude, alternatives = []], id) => ({ id, name, longitude, latitude, alternatives }));

  const bounds = { west: -25.5, south: 33.5, east: 52.5, north: 72.5, width: 1100, height: 1010 };
  const game = { order: [], index: 0, score: 0, mistakes: 0, skipped: 0, attempts: 0, startedAt: 0, timer: 0, ready: false, finishing: false };
  const el = id => document.getElementById(id);
  const shuffle = items => [...items].sort(() => Math.random() - .5);
  const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const normalize = text => text.toLocaleLowerCase('hu-HU').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const maximumDistance = length => length <= 5 ? 1 : length <= 9 ? 2 : 3;
  const mercatorY = latitude => Math.log(Math.tan(Math.PI / 4 + latitude * Math.PI / 360));
  const northY = mercatorY(bounds.north), southY = mercatorY(bounds.south);
  const project = capital => [
    (capital.longitude - bounds.west) / (bounds.east - bounds.west) * bounds.width,
    (northY - mercatorY(capital.latitude)) / (northY - southY) * bounds.height
  ];
  const levenshtein = (left, right) => {
    const row = Array.from({ length: right.length + 1 }, (_, i) => i);
    for (let i = 1; i <= left.length; i++) { let previous = row[0]; row[0] = i; for (let j = 1; j <= right.length; j++) { const current = row[j]; row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (left[i - 1] === right[j - 1] ? 0 : 1)); previous = current; } }
    return row[right.length];
  };
  const answersFor = capital => [capital.name, ...capital.alternatives].map(normalize);
  const current = () => capitals[game.order[game.index]];
  let mapReady = false, zoomed = false;

  function store() {
    state.capitalGame = state.capitalGame || { best: 0, fastest: null, history: [], mistakes: {}, xpDate: '' };
    state.capitalGame.history = state.capitalGame.history || [];
    state.capitalGame.mistakes = state.capitalGame.mistakes || {};
    return state.capitalGame;
  }
  function setFeedback(text = '', type = '') { const feedback = el('capitalFeedback'); feedback.textContent = text; feedback.className = `country-feedback ${type}`; }
  function resetMapView() { zoomed = false; el('capitalMap').setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`); updateZoomButton(); }
  function updateZoomButton() { const button = el('capitalMapZoomIn'); button.textContent = zoomed ? 'Normál nézet' : 'Közelítés'; button.setAttribute('aria-label', zoomed ? 'Normál nézet visszaállítása' : 'A jelölt főváros közelítése'); }
  function zoomToCurrent() {
    if (zoomed) return resetMapView();
    const [x, y] = project(current()), scale = 2.1, width = bounds.width / scale, height = bounds.height / scale;
    const left = Math.max(0, Math.min(bounds.width - width, x - width / 2));
    const top = Math.max(0, Math.min(bounds.height - height, y - height / 2));
    zoomed = true;
    el('capitalMap').setAttribute('viewBox', `${left} ${top} ${width} ${height}`);
    updateZoomButton();
  }
  function updateMarker(status = 'active') { const marker = el('capitalMarker'); const [x, y] = project(current()); marker.setAttribute('cx', x); marker.setAttribute('cy', y); marker.classList.remove('is-active', 'is-done'); marker.classList.add(status === 'done' ? 'is-done' : 'is-active'); }
  function updateStats() { const total = game.order.length, completed = game.index, progress = total ? completed / total * 100 : 0; el('capitalGameDone').textContent = `${completed} / ${total}`; el('capitalGameScore').textContent = String(game.score); el('capitalGameMistakes').textContent = String(game.mistakes); el('capitalGameRemaining').textContent = String(Math.max(0, total - completed)); el('capitalGameTime').textContent = formatTime(Math.floor((Date.now() - game.startedAt) / 1000)); el('capitalGameProgress').style.width = `${progress}%`; el('capitalGameProgress').parentElement.setAttribute('aria-valuenow', String(Math.round(progress))); }
  function renderTurn() { if (game.index >= game.order.length) return finishGame(); game.attempts = 0; game.finishing = false; el('capitalAnswer').value = ''; el('capitalAnswer').disabled = false; el('capitalCheck').disabled = false; el('capitalSkip').disabled = false; setFeedback(); resetMapView(); updateMarker(); updateStats(); el('capitalAnswer').focus(); }
  function acceptAnswer() { const capital = current(), earned = game.attempts === 0 ? 3 : game.attempts === 1 ? 2 : 1; game.score += earned; game.finishing = true; el('capitalAnswer').disabled = true; el('capitalCheck').disabled = true; el('capitalSkip').disabled = true; updateMarker('done'); updateStats(); setFeedback(`Helyes! +${earned} pont`, 'success'); window.setTimeout(() => { game.index++; renderTurn(); }, 750); }
  function checkAnswer() { if (!game.ready || game.finishing) return; const submitted = normalize(el('capitalAnswer').value); if (!submitted) return setFeedback('Írd be egy főváros nevét.', 'error'); const capital = current(); if (answersFor(capital).some(answer => levenshtein(submitted, answer) <= maximumDistance(answer.length))) return acceptAnswer(); game.attempts++; game.mistakes++; store().mistakes[capital.id] = (store().mistakes[capital.id] || 0) + 1; updateStats(); setFeedback('Még nem ez a főváros. Próbáld újra!', 'error'); el('capitalAnswer').select(); }
  function skipCapital() { if (!game.ready || game.finishing) return; const capital = current(); game.skipped++; game.finishing = true; el('capitalAnswer').disabled = true; el('capitalCheck').disabled = true; el('capitalSkip').disabled = true; setFeedback(`A helyes válasz: ${capital.name}.`, 'skipped'); window.setTimeout(() => { game.index++; renderTurn(); }, 1100); }
  function finishGame() { game.ready = false; window.clearInterval(game.timer); const elapsed = Math.floor((Date.now() - game.startedAt) / 1000), maximum = game.order.length * 3, percent = maximum ? Math.round(game.score / maximum * 100) : 0, saved = store(), today = new Date().toISOString().slice(0, 10); let bonus = 0; if (saved.xpDate !== today) { bonus = percent >= 95 ? 1000 : percent >= 85 ? 600 : percent >= 70 ? 300 : 0; if (bonus) { saved.xpDate = today; giveXp(bonus, '📍 Európa fővárosai'); } } saved.best = Math.max(saved.best || 0, game.score); saved.fastest = saved.fastest === null || elapsed < saved.fastest ? elapsed : saved.fastest; saved.history.unshift({ date: Date.now(), score: game.score, percent, elapsed, mistakes: game.mistakes, skipped: game.skipped }); saved.history = saved.history.slice(0, 10); save(); el('capitalResultScore').textContent = `${game.score} / ${maximum}${bonus ? ` · +${bonus / 100} XP` : ''}`; el('capitalResultPercent').textContent = `${percent}%`; el('capitalResultMistakes').textContent = String(game.mistakes); el('capitalResultSkipped').textContent = String(game.skipped); el('capitalResultTime').textContent = formatTime(elapsed); el('capitalResult').hidden = false; setFeedback('Minden főváros sorra került.', 'success'); updateStats(); }
  function startGame() { if (!mapReady) return; window.clearInterval(game.timer); game.order = shuffle(capitals.map(capital => capital.id)); game.index = game.score = game.mistakes = game.skipped = game.attempts = 0; game.startedAt = Date.now(); game.ready = true; game.finishing = false; el('capitalResult').hidden = true; game.timer = window.setInterval(updateStats, 1000); renderTurn(); }
  function loadMap() { if (mapReady) return; if (!window.EuropeSvgMap?.markup) return setFeedback('A térképadat nem érhető el.', 'error'); const layer = el('capitalMapLayer'); el('capitalMap').setAttribute('viewBox', window.EuropeSvgMap.viewBox); layer.innerHTML = `${window.EuropeSvgMap.markup}<circle id="capitalMarker" class="capital-marker" r="7"/>`; mapReady = true; startGame(); }

  el('capitalGameOpen').addEventListener('click', () => { screen('capitalGame'); if (!mapReady) window.requestAnimationFrame(loadMap); else startGame(); });
  el('capitalGameBack').addEventListener('click', () => screen('challenge'));
  el('capitalAnswerForm').addEventListener('submit', event => { event.preventDefault(); checkAnswer(); });
  el('capitalSkip').addEventListener('click', skipCapital);
  el('capitalNewGame').addEventListener('click', startGame);
  el('capitalMapZoomIn').addEventListener('click', zoomToCurrent);
  const timeCard = el('capitalGameTime').parentElement; timeCard.classList.add('country-map-time'); el('capitalMapViewport').append(timeCard);
})();
