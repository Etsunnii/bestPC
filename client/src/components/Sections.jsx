import { useLayoutEffect, useRef } from "react";
import { motion } from "motion/react";
import { SiteFooter } from "./SiteFooter.jsx";

const buildGalleryImages = [
  "/assets/build-gallery-01.jpg",
  "/assets/build-gallery-02.jpg",
  "/assets/build-gallery-03.jpg",
  "/assets/build-gallery-04.jpg",
  "/assets/build-gallery-05.jpg",
  "/assets/build-gallery-06.jpg",
  "/assets/build-gallery-07.jpg",
];

const workStages = [
  {
    number: "01",
    title: "ПОДБОР И КОНЦЕПТ",
    description:
      "Изучаем ваши задачи, подбираем идеальную связку комплектующих. Создаём визуальный концепт будущей сборки, подчёркивающий стиль, агрессию и боевую готовность системы.",
    className: "work-stage--dark work-stage--first",
    x: "-9%",
  },
  {
    number: "02",
    title: "СБОРКА И УКЛАДКА",
    description:
      "Наши инженеры приступают к работе. Безупречный кабель-менеджмент, правильное распределение термопасты и установка кастомных систем охлаждения. Внимание к каждой детали.",
    className: "work-stage--blue",
    x: "17%",
  },
  {
    number: "03",
    title: "НАСТРОЙКА И ТЕСТЫ",
    description:
      "Система проходит суровые испытания. Мы настраиваем BIOS, тайминги памяти, кривые вентиляторов и прогоняем ПК через самые тяжёлые стресс-тесты для выявления узких мест.",
    className: "work-stage--light",
    x: "-9%",
  },
  {
    number: "04",
    title: "ФИНАЛЬНЫЙ РЕЗУЛЬТАТ",
    description:
      "Вы получаете протестированный, мощный и тихий компьютер, готовый к любым играм прямо из коробки. Эстетика и бескомпромиссная производительность в едином целом.",
    className: "work-stage--navy",
    x: "20%",
  },
];

const stageContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const stageVariants = {
  hidden: {
    opacity: 0,
    x: 0,
    y: -36,
    scale: 0.88,
  },
  visible: ({ x, order }) => ({
    opacity: 1,
    x,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 72,
      damping: 13,
      mass: 0.95,
      delay: order * 0.04,
    },
  }),
};

export function InfoSections({ navigate }) {
  const stagesRef = useRef(null);
  const stageCardRefs = useRef([]);

  useLayoutEffect(() => {
    const stagesElement = stagesRef.current;

    if (!stagesElement) return undefined;

    const alignStageNumbers = () => {
      stageCardRefs.current.forEach((card, index) => {
        if (!card) return;

        const center = card.offsetTop + card.offsetHeight / 2;
        stagesElement.style.setProperty(`--stage-${index + 1}-center`, `${center}px`);
      });
    };

    alignStageNumbers();

    const resizeObserver = new ResizeObserver(alignStageNumbers);
    resizeObserver.observe(stagesElement);
    stageCardRefs.current.forEach((card) => card && resizeObserver.observe(card));

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <section className="signal section" id="news">
        <h2>Этапы <span>работы</span></h2>
        <motion.div
          className="work-stages"
          ref={stagesRef}
          variants={stageContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          <motion.div
            className="work-stages__timeline"
            variants={stageContainerVariants}
            aria-hidden="true"
          >
            {workStages.map((stage, index) => (
              <motion.span
                custom={{ x: 0, order: index }}
                variants={stageVariants}
                key={stage.number}
              >
                {index + 1}
              </motion.span>
            ))}
          </motion.div>

          {workStages.map((stage, index) => (
            <motion.article
              ref={(element) => {
                stageCardRefs.current[index] = element;
              }}
              className={`work-stage ${stage.className}`}
              custom={{ x: stage.x, order: index }}
              variants={stageVariants}
              whileHover={{ y: -6, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              key={stage.number}
            >
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="build-photos section" id="build-photos">
        <h2>Фотографии <span>сборок</span></h2>
        <div className="build-gallery" aria-label="Фотографии собранных компьютеров">
          <div className="build-gallery__track">
            {[0, 1].map((copyIndex) => (
              <div
                className="build-gallery__set"
                aria-hidden={copyIndex === 1}
                key={copyIndex}
              >
                {buildGalleryImages.map((image, imageIndex) => (
                  <figure className="build-gallery__item" key={`${copyIndex}-${image}`}>
                    <img
                      src={image}
                      alt={copyIndex === 0 ? `Собранный игровой компьютер ${imageIndex + 1}` : ""}
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                    />
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter navigate={navigate} />
    </>
  );
}
