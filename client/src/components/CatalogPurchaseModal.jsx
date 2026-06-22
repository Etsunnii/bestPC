import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function CatalogPurchaseModal({ build, onClose }) {
  const [copied, setCopied] = useState(false);

  const requestText = useMemo(() => {
    if (!build) return "";

    const configuration = (build.detailsSpecs || build.specs)
      .map(([, label, value]) => `${label}: ${value}`)
      .join("\n");

    return [
      "Комментарий: Здравствуйте! Хочу обсудить заказ данного ПК.",
      "",
      "— Заявка с сайта —",
      `Сборка: ${build.fullName}`,
      `Цена: ${build.price}`,
      "",
      "— Конфигурация —",
      configuration,
    ].join("\n");
  }, [build]);

  useEffect(() => {
    if (!build) return undefined;

    setCopied(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [build, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestText);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = requestText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AnimatePresence>
      {build && (
        <motion.div
          className="catalog-order-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            className="catalog-order"
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-order-title"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              className="catalog-order__close material-symbols-outlined"
              type="button"
              aria-label="Закрыть окно"
              onClick={onClose}
            >
              close
            </button>

            <header className="catalog-order__header">
              <h2 id="catalog-order-title">Оформление</h2>
              <p>Отправьте нам конфигурацию. Мы свяжемся с вами для обсуждения деталей сборки.</p>
            </header>

            <div className="catalog-order__notice">
              <span className="material-symbols-outlined" aria-hidden="true">info</span>
              <div>
                <strong>1. Скопируйте текст ниже</strong>
                <strong>2. Выберите мессенджер для отправки</strong>
              </div>
            </div>

            <pre className="catalog-order__request">{requestText}</pre>

            <div className="catalog-order__actions">
              <button className="catalog-order__copy" type="button" onClick={handleCopy}>
                <span>{copied ? "СКОПИРОВАНО" : "СКОПИРОВАТЬ"}</span>
                <b className="material-symbols-outlined" aria-hidden="true">
                  {copied ? "check" : "content_copy"}
                </b>
              </button>

              <a href="https://www.avito.ru/" target="_blank" rel="noreferrer">
                <span>AVITO</span>
                <b className="material-symbols-outlined" aria-hidden="true">arrow_forward</b>
              </a>

              <a href="https://vk.com/" target="_blank" rel="noreferrer">
                <span>VK</span>
                <b className="material-symbols-outlined" aria-hidden="true">arrow_forward</b>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
