export function Logo({ className = "", onClick }) {
  return (
    <button className={`brand ${className}`} onClick={onClick} aria-label="BP home">
      <span>B</span><i /><span>P</span>
    </button>
  );
}

export function Header({ menuOpen, onMenuToggle, navigate }) {
  return (
    <header className="site-header">
      <button
        className="menu-button"
        type="button"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={onMenuToggle}
      >
        <span />
        <span />
      </button>

      <nav className={menuOpen ? "nav nav--open" : "nav"} aria-label="Main navigation">
        <button className="nav-link nav-link--catalog" onClick={() => navigate("catalog")}>КАТАЛОГ ПК</button>
        <button className="nav-link nav-link--steps" onClick={() => navigate("news")}>ЭТАПЫ РАБОТЫ</button>
        <Logo className="brand--nav" onClick={() => navigate("home")} />
        <button className="nav-link nav-link--contacts" onClick={() => navigate("products")}>КОНТАКТЫ</button>
        <button className="nav-link nav-link--reviews" onClick={() => navigate("reviews-page")}>ОТЗЫВЫ</button>
      </nav>

      <Logo className="brand--mobile" onClick={() => navigate("home")} />
    </header>
  );
}
