import { useEffect, useMemo, useState } from "react";
import { Header } from "./Header.jsx";
import { SiteFooter } from "./SiteFooter.jsx";

const reviews = [
  {
    name: "Коти",
    date: "20.04.2026",
    source: "Avito",
    text: "Закрыл гештальт и взял мощный ПК. Собрали очень аккуратно, всё объяснили и помогли подобрать комплектующие под мой бюджет.",
    image: "/assets/build-gallery-07.jpg",
  },
  {
    name: "Илья Билоус",
    date: "14.04.2026",
    source: "VK",
    text: "Топовый компьютер от ребят. Подсказали по нюансам, показали сборку перед отправкой и всё надёжно упаковали.",
    image: "/assets/build-gallery-01.jpg",
  },
  {
    name: "Костя Ефремов",
    date: "14.04.2026",
    source: "VK",
    text: "Огромное спасибо за работу! Собрали всё быстро и без лишних вопросов. Комплектующие подобрали под мои задачи, кабель-менеджмент идеальный.",
    image: "/assets/build-gallery-03.jpg",
  },
  {
    name: "Александр",
    date: "06.04.2026",
    source: "Avito",
    text: "Заказывал белую сборку. Вживую выглядит ещё лучше, чем на фотографиях. Температуры отличные, компьютер работает тихо.",
    image: "/assets/build-gallery-05.jpg",
  },
  {
    name: "Максим С.",
    date: "29.03.2026",
    source: "Avito",
    text: "Помогли не переплатить за ненужные компоненты и вложить бюджет в видеокарту. В играх получил именно ту производительность, на которую рассчитывал.",
    image: "/assets/build-gallery-06.jpg",
  },
  {
    name: "Дмитрий Орлов",
    date: "18.03.2026",
    source: "VK",
    text: "Всегда были на связи, присылали фотографии процесса и результаты тестов. Получил полностью готовый компьютер — включил и сразу играю.",
    image: "/assets/build-gallery-04.jpg",
  },
];

const filters = ["Все", "Avito", "VK"];

function Stars() {
  return (
    <div className="review-stars" aria-label="Оценка 5 из 5">
      {Array.from({ length: 5 }, (_, index) => (
        <span className="material-symbols-outlined" aria-hidden="true" key={index}>star</span>
      ))}
    </div>
  );
}

export function ReviewsPage({ menuOpen, setMenuOpen, navigate }) {
  const [filter, setFilter] = useState("Все");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const visibleReviews = useMemo(
    () => filter === "Все" ? reviews : reviews.filter((review) => review.source === filter),
    [filter],
  );

  useEffect(() => {
    if (!selectedPhoto) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedPhoto(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedPhoto]);

  return (
    <main className="reviews-page">
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((value) => !value)}
        navigate={navigate}
      />

      <section className="reviews-hero">
        <button className="reviews-back" type="button" onClick={() => navigate("home")}>
          <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
          На главную
        </button>

        <div className="reviews-heading">
          <div>
            <h1>Отзывы <span>клиентов</span></h1>
          </div>
          <p>
            Реальные впечатления о подборе комплектующих, качестве сборки,
            тестировании и доставке компьютеров Beast PC.
          </p>
        </div>

        <div className="reviews-summary">
          <div className="reviews-score">
            <strong>5,0</strong>
            <div>
              <Stars />
              <span>На основе отзывов Avito и VK</span>
            </div>
          </div>

          <div className="rating-bars" aria-label="Распределение оценок">
            {[5, 4, 3, 2, 1].map((value) => (
              <div className="rating-bar" key={value}>
                <span>{value}</span>
                <i><b style={{ width: value === 5 ? "100%" : "0%" }} /></i>
              </div>
            ))}
          </div>

          <div className="reviews-actions">
            <p><strong>100%</strong> покупателей рекомендуют наши сборки</p>
            <div>
              <a href="https://www.avito.ru/" target="_blank" rel="noreferrer">Оставить на Avito</a>
              <a href="https://vk.com/" target="_blank" rel="noreferrer">Написать в VK</a>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews-content">
        <div className="reviews-toolbar">
          <div>
            <div className="reviews-filters" role="group" aria-label="Фильтр отзывов">
              {filters.map((item) => (
                <button
                  className={filter === item ? "is-active" : ""}
                  type="button"
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="reviews-grid">
          {visibleReviews.map((review, index) => (
            <article className={`review-card review-card--${(index % 3) + 1}`} key={`${review.source}-${review.name}`}>
              <header>
                <div className="review-avatar">{review.name.slice(0, 1)}</div>
                <div className="review-author">
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
                </div>
                <span className={`review-source review-source--${review.source.toLowerCase()}`}>
                  Отзыв с {review.source}
                </span>
              </header>

              <Stars />
              <p>{review.text}</p>

              <button
                className="review-photo"
                type="button"
                onClick={() => setSelectedPhoto({
                  src: review.image,
                  alt: `Компьютер клиента ${review.name}`,
                })}
                aria-label={`Открыть фотографию компьютера клиента ${review.name}`}
              >
                <img src={review.image} alt={`Компьютер клиента ${review.name}`} loading="lazy" />
              </button>

              <a
                className="review-verify"
                href={review.source === "Avito" ? "https://www.avito.ru/" : "https://vk.com/"}
                target="_blank"
                rel="noreferrer"
              >
                Проверить отзыв
                <span className="material-symbols-outlined" aria-hidden="true">open_in_new</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter navigate={navigate} />

      {selectedPhoto && (
        <div
          className="review-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Полноразмерная фотография сборки"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedPhoto(null);
          }}
        >
          <button
            className="review-lightbox__close"
            type="button"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Закрыть фотографию"
            autoFocus
          >
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
          <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
        </div>
      )}
    </main>
  );
}
