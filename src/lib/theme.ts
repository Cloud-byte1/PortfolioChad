/** Flip the site between light and dark and remember the choice. */
export function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem("theme", next);
  } catch {}
}
