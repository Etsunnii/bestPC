"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

function AnimatedInput({ label, value, className = "", floatOutside = false, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const showLabel = isFocused || value.length > 0;

  return (
    <div className={`order-input ${className}`}>
      <label className="order-input__label" htmlFor={inputId} aria-hidden="true">
        {label.split("").map((character, index) => (
          <motion.span
            // The text is stable and index is the correct identity for individual letters.
            key={`${character}-${index}`}
            initial={{ y: 0, color: "#a4acba" }}
            animate={{
              y: showLabel ? (floatOutside ? -43 : -20) : 0,
              color: showLabel ? (floatOutside ? "#101116" : "#6e7685") : "#a4acba",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: index * 0.018,
            }}
          >
            {character === " " ? "\u00A0" : character}
          </motion.span>
        ))}
      </label>
      <input
        {...props}
        id={inputId}
        value={value}
        onFocus={(event) => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          props.onBlur?.(event);
        }}
        aria-label={label}
      />
    </div>
  );
}

function Choice({ active, children, onClick }) {
  return (
    <button
      className={active ? "order-choice order-choice--active" : "order-choice"}
      type="button"
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function AnimatedTextarea({ label, value, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaId = useId();
  const showLabel = isFocused || value.length > 0;

  return (
    <div className="order-textarea-floating">
      <label className="order-textarea-floating__label" htmlFor={textareaId} aria-hidden="true">
        {label.split("").map((character, index) => (
          <motion.span
            key={`${character}-${index}`}
            initial={{ y: 0, color: "#a4acba" }}
            animate={{
              y: showLabel ? -43 : 0,
              color: showLabel ? "#101116" : "#a4acba",
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: index * 0.012,
            }}
          >
            {character === " " ? "\u00A0" : character}
          </motion.span>
        ))}
      </label>
      <textarea
        {...props}
        id={textareaId}
        value={value}
        aria-label={label}
        onFocus={(event) => {
          setIsFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          props.onBlur?.(event);
        }}
      />
    </div>
  );
}

export function BuildComputerModal({ isOpen, onClose }) {
  const [budget, setBudget] = useState("");
  const [appearance, setAppearance] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("СДЭК");
  const [wireless, setWireless] = useState("Нет");
  const [hardwareWishes, setHardwareWishes] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [copyState, setCopyState] = useState("idle");
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const formData = {
    budget,
    appearance,
    deliveryMethod,
    wireless,
    hardwareWishes,
    deliveryAddress,
  };

  const requestText = [
    "Заявка на индивидуальную сборку Beast PC",
    `Бюджет: ${budget || "не указан"}`,
    `Внешний вид: ${appearance || "не указан"}`,
    `Пожелания по железу: ${hardwareWishes || "не указаны"}`,
    `Доставка: ${deliveryMethod}`,
    `Адрес пункта: ${deliveryAddress || "не указан"}`,
    `Wi-Fi и Bluetooth: ${wireless}`,
  ].join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestText);
      setCopyState("copied");
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = requestText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setCopyState("copied");
    }

    window.setTimeout(() => setCopyState("idle"), 1800);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Заявка на сборку:", formData);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="order-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              className="order-modal__close"
              type="button"
              aria-label="Закрыть окно"
              onClick={onClose}
            >
              ×
            </button>

            <header className="order-modal__header">
              <h2 id="order-modal-title">Сборка на заказ</h2>
              <p>Заполните пожелания, и мы подберём идеальное решение.</p>
            </header>

            <form className="order-form" onSubmit={handleSubmit}>
              <div className="order-form__top">
                <div className="order-form__left">
                  <fieldset className="order-field order-field--floating-label">
                    <AnimatedInput
                      label="Бюджет сборки"
                      value={budget}
                      floatOutside
                      inputMode="numeric"
                      onChange={(event) => setBudget(event.target.value)}
                    />
                  </fieldset>

                  <fieldset className="order-field order-field--floating-label">
                    <AnimatedInput
                      label="Внешний вид"
                      value={appearance}
                      floatOutside
                      onChange={(event) => setAppearance(event.target.value)}
                    />
                  </fieldset>
                </div>

                <div className="order-form__right">
                  <fieldset className="order-field">
                    <legend>Способ доставки</legend>
                    <div className="order-segment order-segment--delivery" aria-label="Способ доставки">
                      <Choice
                        active={deliveryMethod === "СДЭК"}
                        onClick={() => setDeliveryMethod("СДЭК")}
                      >
                        СДЭК
                      </Choice>
                      <Choice
                        active={deliveryMethod === "ЯНДЕКС"}
                        onClick={() => setDeliveryMethod("ЯНДЕКС")}
                      >
                        ЯНДЕКС
                      </Choice>
                    </div>
                  </fieldset>

                  <fieldset className="order-field order-field--floating-label order-field--delivery-address">
                    <AnimatedInput
                      label="Адрес пункта выдачи"
                      value={deliveryAddress}
                      floatOutside
                      onChange={(event) => setDeliveryAddress(event.target.value)}
                    />
                  </fieldset>
                </div>
              </div>

              <fieldset className="order-field order-field--wireless">
                <div className="order-wireless-label">Нужен Wi-Fi и Bluetooth?</div>
                <div className="order-wireless-switch">
                  <motion.div
                    className="order-wireless-switch__thumb"
                    animate={{ x: wireless === "Да" ? "0%" : "100%" }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    className={wireless === "Да" ? "is-active" : ""}
                    onClick={() => setWireless("Да")}
                  >
                    Да
                  </button>
                  <button
                    type="button"
                    className={wireless === "Нет" ? "is-active" : ""}
                    onClick={() => setWireless("Нет")}
                  >
                    Нет
                  </button>
                </div>
              </fieldset>

              <fieldset className="order-field order-field--hardware">
                <AnimatedTextarea
                  label="Пожелания по железу"
                  rows="3"
                  value={hardwareWishes}
                  onChange={(event) => setHardwareWishes(event.target.value)}
                />
              </fieldset>

              <div className="order-form__hint">
                Сначала скопируйте заявку, затем отправьте её нам в любой мессенджер.
              </div>

              <div className="order-modal__actions">
                <button className="order-copy-button" type="button" onClick={handleCopy}>
                  <span>{copyState === "copied" ? "СКОПИРОВАНО" : "СКОПИРОВАТЬ"}</span>
                  <i className="material-symbols-outlined" aria-hidden="true">
                    {copyState === "copied" ? "check" : "content_copy"}
                  </i>
                </button>
                <a
                  className="order-messenger-button"
                  href="https://www.avito.ru/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => console.log("Заявка для Avito:", formData)}
                >
                  <span>AVITO</span>
                  <b><i className="material-symbols-outlined" aria-hidden="true">arrow_forward</i></b>
                </a>
                <a
                  className="order-messenger-button"
                  href="https://vk.com/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => console.log("Заявка для VK:", formData)}
                >
                  <span>VK</span>
                  <b><i className="material-symbols-outlined" aria-hidden="true">arrow_forward</i></b>
                </a>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
