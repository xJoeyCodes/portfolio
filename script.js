const bookmarks = [...document.querySelectorAll('.bookmark')];
const chapters = [...document.querySelectorAll('.chapter')];
const pageContent = document.getElementById('page-content');
const readingPage = document.getElementById('reading-page');
const chapterLabel = document.getElementById('chapter-label');
const pageNumber = document.getElementById('page-number');
const returnLink = document.querySelector('.return-link');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeChapter = 'preface';
let turnTimer;

function turnTo(name, moveFocus = false) {
  clearTimeout(turnTimer);
  activeChapter = name;

  bookmarks.forEach((button) => {
    button.setAttribute('aria-expanded', String(button.dataset.section === name));
  });

  // Fade the printed content out before exchanging pages. Cancelled turns use the latest selection.
  pageContent.classList.add('is-turning');
  turnTimer = setTimeout(() => {
    chapters.forEach((chapter) => { chapter.hidden = chapter.id !== name; });
    const number = chapters.findIndex((chapter) => chapter.id === name) + 1;
    chapterLabel.textContent = name;
    pageNumber.textContent = String(number).padStart(2, '0');
    pageNumber.setAttribute('aria-label', `Page ${number}`);
    returnLink.hidden = name === 'preface';
    pageContent.classList.remove('is-turning');

    if (moveFocus) {
      document.getElementById(`${name}-title`).focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 650px)').matches) {
        readingPage.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
      }
    }
  }, reducedMotion.matches ? 0 : 180);
}

bookmarks.forEach((button) => {
  button.addEventListener('click', () => {
    turnTo(activeChapter === button.dataset.section ? 'preface' : button.dataset.section, true);
  });
});

document.querySelectorAll('[data-home]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    turnTo('preface', true);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || activeChapter === 'preface') return;
  const openBookmark = bookmarks.find((button) => button.dataset.section === activeChapter);
  turnTo('preface');
  openBookmark.focus({ preventScroll: true });
});
