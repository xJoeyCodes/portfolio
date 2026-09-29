const navButtons = [...document.querySelectorAll('.nav-link')];
const sheet = document.getElementById('bookmark-sheet');
const sections = [...sheet.querySelectorAll('.sheet-section')];
let activeSection = null;

function showSection(name) {
  activeSection = name;
  sheet.hidden = name === null;

  navButtons.forEach((button) => {
    button.setAttribute('aria-expanded', String(button.dataset.section === name));
  });

  sections.forEach((section) => {
    section.hidden = section.id !== name;
  });
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showSection(activeSection === button.dataset.section ? null : button.dataset.section);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || activeSection === null) return;
  const wasInsideSheet = sheet.contains(document.activeElement);
  const openButton = navButtons.find((button) => button.dataset.section === activeSection);
  showSection(null);
  if (wasInsideSheet) openButton.focus();
});
