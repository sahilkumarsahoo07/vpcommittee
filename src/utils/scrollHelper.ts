/**
 * Smoothly scrolls to a page section without modifying the browser URL with '#' hash tags.
 */
export const scrollToSection = (targetId: string, e?: React.MouseEvent) => {
  if (e) {
    e.preventDefault();
  }

  const cleanId = targetId.replace(/^#/, '').trim();

  if (!cleanId || cleanId === 'hero' || cleanId === 'top' || cleanId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Remove any hash tag from the address bar if present
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname);
  }
};
