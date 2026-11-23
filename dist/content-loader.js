(() => {
  const subjectRoot = subject => `tananyag/${subject.id}`;

  const read = async path => {
    const response = await fetch(path);
    return response.ok ? response.text() : '';
  };

  const fields = block => block.split(/\r?\n/).reduce((result, line) => {
    const match = line.match(/^([A-ZÁÉÍÓÖŐÚÜŰ_0-9]+):\s*(.*)$/i);
    if (match) result[match[1].toUpperCase()] = match[2].trim();
    return result;
  }, {});

  const blocks = text => text.split(/^---+\s*$/m).map(part => part.trim()).filter(Boolean);

  const parseIndex = text => blocks(text).map(block => {
    const value = fields(block);
    return value.ID && value.CÍM ? { id: value.ID, title: value.CÍM } : null;
  }).filter(Boolean);

  const parseLessons = text => blocks(text).map((block, index) => {
    const match = block.match(/^ID:\s*(.+)\r?\nCÍM:\s*(.+)\r?\nSZÖVEG:\s*\r?\n([\s\S]*)$/im);
    return match ? { id: match[1].trim(), title: match[2].trim(), body: match[3].trim(), index } : null;
  }).filter(Boolean);

  const parseQuizzes = text => blocks(text).map(block => {
    const value = fields(block);
    const type = (value.TÍPUS || '').toLocaleLowerCase('hu-HU');
    if (!value.ID || !value.KÉRDÉS || !value.HELYES) return null;
    if (type === 'igaz-hamis') return { id: value.ID, lessonId: value.LECKE_ID || '', type, question: value.KÉRDÉS, correct: value.HELYES.toLocaleLowerCase('hu-HU') === 'igaz' ? 'Igaz' : 'Hamis', explanation: value.MAGYARÁZAT || '' };
    const answers = [value.HELYES, value.ROSSZ1, value.ROSSZ2, value.ROSSZ3].filter(Boolean);
    return type === 'választásos' && answers.length === 4 ? { id: value.ID, lessonId: value.LECKE_ID || '', type, question: value.KÉRDÉS, correct: value.HELYES, answers, explanation: value.MAGYARÁZAT || '' } : null;
  }).filter(Boolean);

  const parseCards = text => blocks(text).map(block => {
    const value = fields(block);
    return value.ID && value.ELŐLAP && value.HÁTLAP ? { id: value.ID, lessonId: value.LECKE_ID || '', front: value.ELŐLAP, back: value.HÁTLAP } : null;
  }).filter(Boolean);

  const escape = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const inline = value => escape(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  const renderLesson = text => text.split(/\r?\n/).map(line => {
    if (/^##\s+/.test(line)) return `<h3>${inline(line.replace(/^##\s+/, ''))}</h3>`;
    if (/^#\s+/.test(line)) return `<h2>${inline(line.replace(/^#\s+/, ''))}</h2>`;
    if (/^-\s+/.test(line)) return `<li>${inline(line.replace(/^-\s+/, ''))}</li>`;
    return line.trim() ? `<p>${inline(line)}</p>` : '';
  }).join('').replace(/(<li>.*?<\/li>)+/g, match => `<ul>${match}</ul>`);

  window.ContentLoader = {
    async load(subject) {
      if (subject.contentLoaded) return subject;
      const root = subjectRoot(subject);
      const index = parseIndex(await read(`${root}/index.txt`));
      const bundles = await Promise.all(index.map(async entry => {
        const folder = `${root}/${entry.id}`;
        const [lessonText, quizText, cardText] = await Promise.all([
          read(`${folder}/lecke.txt`),
          read(`${folder}/kviz.txt`),
          read(`${folder}/tanulokartya.txt`)
        ]);
        const lesson = parseLessons(lessonText)[0] || { ...entry, body: '' };
        return { lesson, quizzes: parseQuizzes(quizText), cards: parseCards(cardText) };
      }));
      subject.lessons = bundles.map(bundle => bundle.lesson);
      subject.quizzes = bundles.flatMap(bundle => bundle.quizzes);
      subject.cards = bundles.flatMap(bundle => bundle.cards);
      subject.contentLoaded = true;
      return subject;
    },
    renderLesson
  };
})();
