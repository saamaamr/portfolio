(function () {
  try {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme === 'light' || savedTheme === 'dark'
      ? savedTheme
      : prefersDark
        ? 'dark'
        : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const favicon = document.getElementById('site-favicon');
    if (favicon) {
      favicon.setAttribute(
        'href',
        theme === 'dark' ? '/assets/logo-dark.svg' : '/assets/logo-light.svg'
      );
    }
  } catch (_) {
    document.documentElement.dataset.theme = 'light';
    const favicon = document.getElementById('site-favicon');
    if (favicon) favicon.setAttribute('href', '/assets/logo-light.svg');
  }
})();
