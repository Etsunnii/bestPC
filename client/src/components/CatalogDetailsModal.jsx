import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

export function CatalogDetailsModal({ build, onClose }) {
  useEffect(() => {
    if (!build) return undefined;

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

  return (
    <AnimatePresence>
      {build && (
        <motion.div
          className="catalog-details-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            className="catalog-details"
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-details-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16, ease: "linear" }}
          >
            <header className="catalog-details__header">
              <h2 id="catalog-details-title">
                Спецификация <span>{build.name}</span>
              </h2>
              <button
                className="catalog-details__close material-symbols-outlined"
                type="button"
                aria-label="Закрыть окно"
                onClick={onClose}
              >
                close
              </button>
            </header>

            <div className="catalog-details__content">
              <h3>КОМПЛЕКТУЮЩИЕ</h3>
              <div className="catalog-details__grid">
                {build.detailsSpecs.map(([, label, value]) => (
                  <div className="catalog-details__item" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
