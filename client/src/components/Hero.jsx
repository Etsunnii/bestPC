import { useEffect, useMemo, useState } from "react";
import { Header } from "./Header.jsx";
import { selectOnlyThisText } from "../utils/dom.js";

const DIRECTUS_URL = (import.meta.env.VITE_DIRECTUS_URL || "http://127.0.0.1:8055").replace(/\/$/, "");

const defaultHero = {
  Name_shop: "BEAST PC",
  eyebrow: "Сборка компьютеров",
  subtitle: "Аккуратный кабель-менеджмент и качественная сборка",
  opisanie: "Покори цифровой мир с компьютером своей мечты — собранным специально для твоих целей",
  primary_button_text: "СОБРАТЬ ПК",
  secondary_button_text: "ГОТОВЫЕ СБОРКИ",
  image_alt: "Игровой компьютер Beast PC с синей подсветкой",
  image_desktop: null,
  image_tablet: null,
  image_mobile: null,
};

const assetUrl = (file, fallback) => {
  const fileId = typeof file === "object" ? file?.id : file;
  return fileId ? `${DIRECTUS_URL}/assets/${fileId}` : fallback;
};

export function Hero({ menuOpen, setMenuOpen, navigate }) {
  const [content, setContent] = useState(defaultHero);
  const titleParts = useMemo(() => {
    const words = String(content.Name_shop || defaultHero.Name_shop).trim().split(/\s+/);
    const accent = words.length > 1 ? words.pop() : "";
    return { main: words.join(" ") || defaultHero.Name_shop, accent };
  }, [content.Name_shop]);

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch(`${DIRECTUS_URL}/items/Hero_section?_=${Date.now()}`, {
          cache: "no-store",
        });
        if (!response.ok) return;

        const { data } = await response.json();
        if (data) setContent((current) => ({ ...current, ...data }));
      } catch {
        // Keep current content during a brief Directus interruption.
      }
    };

    loadHero();
    const interval = window.setInterval(loadHero, 5000);
    window.addEventListener("focus", loadHero);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", loadHero);
    };
  }, []);

  return (
    <section className="hero" id="home">
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((value) => !value)}
        navigate={navigate}
      />

      <div className="hero-copy">
        <p className="eyebrow" onPointerDown={selectOnlyThisText}>{content.eyebrow}</p>
        <div className="animated-title">
          <h1 aria-label={content.Name_shop} onPointerDown={selectOnlyThisText}>
            <span>{titleParts.main}</span>
            {titleParts.accent && <>&nbsp;<b>{titleParts.accent}</b></>}
          </h1>
          <svg className="title-underline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 0,10 Q 75,0 150,10 Q 225,20 300,10" />
          </svg>
        </div>
        <p className="hero-subtitle">{content.subtitle}</p>
      </div>

      <div className="hero-offer">
        <div className="pc-wrap">
          <div className="pc-glow" />
          <div className="pc-float-layer">
            <picture>
              <source media="(max-width: 470px)" srcSet={assetUrl(content.image_mobile, "/assets/hero-pc-mobile.png")} />
              <source media="(max-width: 800px)" srcSet={assetUrl(content.image_tablet, "/assets/hero-pc-tablet.png")} />
              <img
                src={assetUrl(content.image_desktop, "/assets/hero-pc-desktop.png")}
                alt={content.image_alt}
              />
            </picture>
          </div>
        </div>

        <div className="offer-panel">
          <p>{content.opisanie}</p>
          <div className="offer-actions">
            <button className="primary-button build-button" onClick={() => navigate("products")}>
              {content.primary_button_text}
            </button>
            <button className="primary-button build-button ready-button" onClick={() => navigate("catalog")}>
              {content.secondary_button_text}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
