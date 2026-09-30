const bookmarks = [...document.querySelectorAll('.bookmark')];
const chapters = [...document.querySelectorAll('.chapter')];
const pageContent = document.getElementById('page-content');
const readingPage = document.getElementById('reading-page');
const closedPrompt = document.getElementById('closed-prompt');
const chapterLabel = document.getElementById('chapter-label');
const pageNumber = document.getElementById('page-number');
const returnLink = document.querySelector('.return-link');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeChapter = null;
let turnTimer;

function turnTo(name, moveFocus = false) {
  clearTimeout(turnTimer);
  activeChapter = name;

  bookmarks.forEach((button) => {
    button.setAttribute('aria-expanded', String(button.dataset.section === name));
  });

  // Exchange chapters after the page has faded. A new selection cancels the previous turn.
  pageContent.classList.add('is-turning');
  turnTimer = setTimeout(() => {
    chapters.forEach((chapter) => { chapter.hidden = chapter.id !== name; });
    closedPrompt.hidden = name !== null;
    const number = chapters.findIndex((chapter) => chapter.id === name) + 1;
    chapterLabel.textContent = name ?? 'Contents';
    pageNumber.textContent = name ? String(number).padStart(2, '0') : '—';
    pageNumber.setAttribute('aria-label', name ? `Page ${number}` : 'No chapter open');
    returnLink.hidden = name === null;
    pageContent.classList.remove('is-turning');

    if (moveFocus && name) {
      document.getElementById(`${name}-title`).focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 650px)').matches) {
        readingPage.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
      }
    }
  }, reducedMotion.matches ? 0 : 180);
}

bookmarks.forEach((button) => {
  button.addEventListener('click', () => {
    const nextChapter = activeChapter === button.dataset.section ? null : button.dataset.section;
    turnTo(nextChapter, nextChapter !== null);
  });
});

document.querySelector('.site-name').addEventListener('click', (event) => {
  event.preventDefault();
  turnTo(null);
});

returnLink.addEventListener('click', () => {
  const openBookmark = bookmarks.find((button) => button.dataset.section === activeChapter);
  turnTo(null);
  openBookmark?.focus({ preventScroll: true });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || activeChapter === null) return;
  const openBookmark = bookmarks.find((button) => button.dataset.section === activeChapter);
  turnTo(null);
  openBookmark.focus({ preventScroll: true });
});
