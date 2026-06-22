import { useEffect, useState } from "react";
import { Catalog } from "./components/Catalog.jsx";
import { Configurator } from "./components/Configurator.jsx";
import { Hero } from "./components/Hero.jsx";
import { ReviewsPage } from "./components/ReviewsPage.jsx";
import { InfoSections } from "./components/Sections.jsx";
import { scrollToId } from "./utils/dom.js";

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setMenuOpen(false);
      setPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "instant" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (id) => {
    setMenuOpen(false);

    if (id === "reviews-page") {
      if (window.location.pathname !== "/reviews") {
        window.history.pushState({}, "", "/reviews");
      }
      setPath("/reviews");
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (window.location.pathname !== "/") {
      window.history.pushState({}, "", "/");
      setPath("/");
      window.setTimeout(() => scrollToId(id), 0);
      return;
    }

    scrollToId(id);
  };

  if (path === "/reviews") {
    return (
      <ReviewsPage
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        navigate={navigate}
      />
    );
  }

  return (
    <main>
      <Hero menuOpen={menuOpen} setMenuOpen={setMenuOpen} navigate={navigate} />
      <Configurator />
      <Catalog />
      <InfoSections navigate={navigate} />
    </main>
  );
}
