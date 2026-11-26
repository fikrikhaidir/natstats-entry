// Entry point: theme, navigation, command palette, then the router draws the page.
import { startRouter } from './router.js';
import { buildNavigation } from './ui/navigation.js';
import { setupPalette } from './ui/command-palette.js';
import { initTheme, toggleTheme, currentTheme } from './ui/theme.js';
import { icon } from './ui/icons.js';

initTheme();

const markActive = buildNavigation(document.querySelector('#nav'));
setupPalette(document.querySelector('#open-search'));

const themeButton = document.querySelector('#toggle-theme');
function paintThemeButton() {
  themeButton.replaceChildren(icon(currentTheme() === 'dark' ? 'sun' : 'moon'));
  themeButton.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}
themeButton.addEventListener('click', () => {
  toggleTheme();
  paintThemeButton();
});
paintThemeButton();
document.querySelector('#open-search').prepend(icon('search', 16));

startRouter(document.querySelector('#page'), (route) => markActive(route.path));
