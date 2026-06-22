import { useState } from "react";
import { build } from "../data/build.js";
import { BuildComputerModal } from "./BuildComputerModal.jsx";

export function Configurator() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
    <section className="products section" id="products">
      <div className="section-heading">
        <h2>Собери свой <span>PC</span></h2>
      </div>

      <div className="config-layout">
        <div className="config-card">
          <div className="config-visual">
            <div className="config-visual-glow" aria-hidden="true" />
            <img src="/assets/white-gaming-pc-v4.png" alt="Белый игровой компьютер Beast PC" />
          </div>

          <div className="config-main">
            <div className="config-copy">
              <p className="config-tag">✓ {build.tag}</p>
              <h3>{build.price}</h3>
              <p>{build.description}</p>
            </div>
            <button
              className="config-cta"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              Собрать компьютер <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="config-specs">
            <div className="config-specs-title"><span>ПРИМЕР СБОРКИ</span></div>
            <div className="spec-list">
              {build.specs.map(([icon, label, value]) => (
                <div className="spec-row" key={label}>
                  <span className="spec-icon material-symbols-outlined" aria-hidden="true">{icon}</span>
                  <div><small>{label}</small><strong>{value}</strong></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="help-card">
          <div>
            <h3><span>НЕ РАЗБИРАЕШЬСЯ</span><span>В КОМПЛЕКТУЮЩИХ?</span></h3>
            <p>Мы подберём лучшее решение для ваших целей и задач.</p>
          </div>
          <div className="help-actions">
            <a href="https://www.avito.ru/" target="_blank" rel="noreferrer">НАПИСАТЬ НА <strong>Avito</strong></a>
            <a href="https://vk.com/" target="_blank" rel="noreferrer">НАПИСАТЬ В <strong>VK</strong></a>
          </div>
        </aside>
      </div>
    </section>
    <BuildComputerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
