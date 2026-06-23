import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { CatalogDetailsModal } from "./CatalogDetailsModal.jsx";
import { CatalogPurchaseModal } from "./CatalogPurchaseModal.jsx";

const DIRECTUS_URL = (import.meta.env.VITE_DIRECTUS_URL || "http://127.0.0.1:8055").replace(/\/$/, "");

const fallbackCatalogBuilds = [
  {
    name: "Start",
    fullName: "Start",
    platform: "INTEL",
    price: "68 000 ₽",
    image: "/assets/catalog-pc.png",
    description: "Компактный игровой компьютер для уверенной игры в Full HD и повседневных задач.",
    gauges: [["FHD", "80", "80%"], ["2K", "56", "56%"], ["4K", "22", "22%"]],
    performance: [
      ["Full HD", "118 к/с", "средние"],
      ["Full HD", "80 к/с", "ультра"],
      ["2K", "56 к/с", "ультра"],
      ["4K", "22 к/с", "ультра"],
    ],
    specs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5050"],
      ["memory", "Процессор", "Intel Core i3-12100F"],
      ["dns", "ОЗУ", "16GB (2×8GB) DDR4 3200MHz"],
      ["mode_fan", "Охлаждение", "ID-Cooling 903 XT FRGB"],
      ["view_module", "Мат. плата", "H610M"],
    ],
    detailsSpecs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5050"],
      ["memory", "Процессор", "Intel Core i3-12100F"],
      ["view_module", "Материнская плата", "H610M"],
      ["dns", "Оперативная память", "16GB (2×8GB) DDR4 3200MHz"],
      ["hard_drive", "SSD накопитель", "1TB M.2 NVMe SSD"],
      ["mode_fan", "Охлаждение", "ID-Cooling 903 XT FRGB"],
      ["power", "Блок питания", "DeepCool PF650"],
      ["computer", "Корпус", "Beast Air Black"],
    ],
  },
  {
    name: "Gold",
    fullName: "Gold",
    platform: "INTEL",
    price: "105 000 ₽",
    image: "/assets/gold-pc.png",
    description: "Сбалансированный игровой компьютер для Full HD и уверенной работы с современными задачами.",
    gauges: [["FHD", "200", "80%"], ["2K", "144", "58%"], ["4K", "82", "33%"]],
    performance: [
      ["Full HD", "256 к/с", "средние"],
      ["Full HD", "200 к/с", "ультра"],
      ["2K", "105 к/с", "ультра"],
      ["4K", "60 к/с", "ультра"],
    ],
    specs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5060"],
      ["memory", "Процессор", "Intel Core i5-13400F"],
      ["dns", "ОЗУ", "32GB (2×16GB) DDR4"],
      ["mode_fan", "Охлаждение", "DeepCool AG400"],
      ["view_module", "Мат. плата", "B760M"],
    ],
    detailsSpecs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5060"],
      ["memory", "Процессор", "Intel Core i5-13400F"],
      ["view_module", "Материнская плата", "B760M"],
      ["dns", "Оперативная память", "32GB (2×16GB) DDR4"],
      ["hard_drive", "SSD накопитель", "1TB M.2 NVMe SSD"],
      ["mode_fan", "Охлаждение", "DeepCool AG400"],
      ["power", "Блок питания", "PCCooler YK750"],
      ["computer", "Корпус", "Zalman M4"],
    ],
  },
  {
    name: "Premium",
    fullName: "Premium",
    platform: "INTEL",
    price: "160 000 ₽",
    image: "/assets/premium-pc.png",
    description: "Мощная игровая сборка для высокого FPS в 2K, стриминга и тяжёлых рабочих приложений.",
    gauges: [["FHD", "276", "88%"], ["2K", "196", "68%"], ["4K", "112", "42%"]],
    performance: [
      ["Full HD", "329 к/с", "средние"],
      ["Full HD", "276 к/с", "ультра"],
      ["2K", "145 к/с", "ультра"],
      ["4K", "88 к/с", "ультра"],
    ],
    specs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5070"],
      ["memory", "Процессор", "Intel Core i5-13600KF"],
      ["dns", "ОЗУ", "32GB (2×16GB) DDR5"],
      ["mode_fan", "Охлаждение", "DeepCool AK620"],
      ["view_module", "Мат. плата", "B760"],
    ],
    detailsSpecs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5070"],
      ["memory", "Процессор", "Intel Core i5-13600KF"],
      ["view_module", "Материнская плата", "B760"],
      ["dns", "Оперативная память", "32GB (2×16GB) DDR5"],
      ["hard_drive", "SSD накопитель", "1TB M.2 NVMe SSD"],
      ["mode_fan", "Охлаждение", "DeepCool AK620"],
      ["power", "Блок питания", "DeepCool PN850M"],
      ["computer", "Корпус", "Beast Air White"],
    ],
  },
  {
    name: "Delux",
    fullName: "Delux",
    platform: "INTEL",
    price: "275 000 ₽",
    image: "/assets/delux-pc.png",
    description: "Флагманский компьютер для максимальных настроек в 4K, профессиональной работы и стриминга.",
    gauges: [["FHD", "364", "94%"], ["2K", "258", "78%"], ["4K", "156", "56%"]],
    performance: [
      ["Full HD", "405 к/с", "средние"],
      ["Full HD", "364 к/с", "ультра"],
      ["2K", "205 к/с", "ультра"],
      ["4K", "132 к/с", "ультра"],
    ],
    specs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5080"],
      ["memory", "Процессор", "Intel Core Ultra 7 265KF"],
      ["dns", "ОЗУ", "32GB (2×16GB) DDR5"],
      ["mode_fan", "Охлаждение", "Lian Li Galahad 360 (СЖО)"],
      ["view_module", "Мат. плата", "Z890"],
    ],
    detailsSpecs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5080"],
      ["memory", "Процессор", "Intel Core Ultra 7 265KF"],
      ["view_module", "Материнская плата", "Z890"],
      ["dns", "Оперативная память", "32GB (2×16GB) DDR5"],
      ["hard_drive", "SSD накопитель", "2TB M.2 NVMe SSD"],
      ["mode_fan", "Охлаждение", "Lian Li Galahad 360 (СЖО)"],
      ["power", "Блок питания", "DeepCool PX1000G"],
      ["computer", "Корпус", "Beast Vision Blue"],
    ],
  },
  {
    name: "Start",
    fullName: "Start AMD",
    platform: "AMD",
    price: "68 000 ₽",
    image: "/assets/catalog-pc.png",
    description: "Доступная AMD-сборка для уверенной игры в Full HD и повседневных задач.",
    gauges: [["FHD", "80", "80%"], ["2K", "56", "56%"], ["4K", "22", "22%"]],
    performance: [
      ["Full HD", "118 к/с", "средние"],
      ["Full HD", "80 к/с", "ультра"],
      ["2K", "56 к/с", "ультра"],
      ["4K", "22 к/с", "ультра"],
    ],
    specs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5050"],
      ["memory", "Процессор", "AMD Ryzen 5 5500"],
      ["dns", "ОЗУ", "16GB (2×8GB) DDR4 3200MHz"],
      ["mode_fan", "Охлаждение", "ID-Cooling 903 XT FRGB"],
      ["view_module", "Мат. плата", "A520M"],
    ],
    detailsSpecs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5050"],
      ["memory", "Процессор", "AMD Ryzen 5 5500"],
      ["view_module", "Материнская плата", "A520M"],
      ["dns", "Оперативная память", "16GB (2×8GB) DDR4 3200MHz"],
      ["hard_drive", "SSD накопитель", "1TB M.2 NVMe SSD"],
      ["mode_fan", "Охлаждение", "ID-Cooling 903 XT FRGB"],
      ["power", "Блок питания", "DeepCool PF650"],
      ["computer", "Корпус", "Beast Air Black"],
    ],
  },
  {
    name: "Gold",
    fullName: "Gold AMD",
    platform: "AMD",
    price: "105 000 ₽",
    image: "/assets/gold-pc.png",
    description: "Сбалансированная AMD-сборка для высокого FPS в Full HD и современных задач.",
    gauges: [["FHD", "200", "80%"], ["2K", "144", "58%"], ["4K", "82", "33%"]],
    performance: [
      ["Full HD", "256 к/с", "средние"],
      ["Full HD", "200 к/с", "ультра"],
      ["2K", "105 к/с", "ультра"],
      ["4K", "60 к/с", "ультра"],
    ],
    specs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5060"],
      ["memory", "Процессор", "AMD Ryzen 5 7500F"],
      ["dns", "ОЗУ", "32GB (2×16GB) DDR4"],
      ["mode_fan", "Охлаждение", "DeepCool AG400"],
      ["view_module", "Мат. плата", "B650"],
    ],
    detailsSpecs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5060"],
      ["memory", "Процессор", "AMD Ryzen 5 7500F"],
      ["view_module", "Материнская плата", "B650"],
      ["dns", "Оперативная память", "32GB (2×16GB) DDR4"],
      ["hard_drive", "SSD накопитель", "1TB M.2 NVMe SSD"],
      ["mode_fan", "Охлаждение", "DeepCool AG400"],
      ["power", "Блок питания", "PCCooler YK750"],
      ["computer", "Корпус", "Zalman M4"],
    ],
  },
  {
    name: "Premium",
    fullName: "Premium AMD",
    platform: "AMD",
    price: "160 000 ₽",
    image: "/assets/premium-pc.png",
    description: "Мощная AMD-сборка для 2K-гейминга, стриминга и тяжёлых рабочих приложений.",
    gauges: [["FHD", "276", "88%"], ["2K", "196", "68%"], ["4K", "112", "42%"]],
    performance: [
      ["Full HD", "329 к/с", "средние"],
      ["Full HD", "276 к/с", "ультра"],
      ["2K", "145 к/с", "ультра"],
      ["4K", "88 к/с", "ультра"],
    ],
    specs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5070"],
      ["memory", "Процессор", "AMD Ryzen 5 7500F"],
      ["dns", "ОЗУ", "32GB (2×16GB) DDR5"],
      ["mode_fan", "Охлаждение", "ID-Cooling FX240 (СЖО)"],
      ["view_module", "Мат. плата", "B650"],
    ],
    detailsSpecs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5070"],
      ["memory", "Процессор", "AMD Ryzen 5 7500F"],
      ["view_module", "Материнская плата", "B650"],
      ["dns", "Оперативная память", "32GB (2×16GB) DDR5"],
      ["hard_drive", "SSD накопитель", "1TB M.2 NVMe SSD"],
      ["mode_fan", "Охлаждение", "ID-Cooling FX240 (СЖО)"],
      ["power", "Блок питания", "DeepCool PN850M"],
      ["computer", "Корпус", "Beast Air Red"],
    ],
  },
  {
    name: "Delux",
    fullName: "Delux AMD",
    platform: "AMD",
    price: "275 000 ₽",
    image: "/assets/delux-pc.png",
    description: "Флагманская AMD-сборка для максимальных настроек в 4K и профессиональной работы.",
    gauges: [["FHD", "364", "94%"], ["2K", "258", "78%"], ["4K", "156", "56%"]],
    performance: [
      ["Full HD", "405 к/с", "средние"],
      ["Full HD", "364 к/с", "ультра"],
      ["2K", "205 к/с", "ультра"],
      ["4K", "132 к/с", "ультра"],
    ],
    specs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5080"],
      ["memory", "Процессор", "AMD Ryzen 7 9800X3D"],
      ["dns", "ОЗУ", "32GB (2×16GB) DDR5"],
      ["mode_fan", "Охлаждение", "Lian Li Galahad 360 (СЖО)"],
      ["view_module", "Мат. плата", "X870"],
    ],
    detailsSpecs: [
      ["developer_board", "Видеокарта", "NVIDIA RTX 5080"],
      ["memory", "Процессор", "AMD Ryzen 7 9800X3D"],
      ["view_module", "Материнская плата", "X870"],
      ["dns", "Оперативная память", "32GB (2×16GB) DDR5"],
      ["hard_drive", "SSD накопитель", "2TB M.2 NVMe SSD"],
      ["mode_fan", "Охлаждение", "Lian Li Galahad 360 (СЖО)"],
      ["power", "Блок питания", "DeepCool PX1000G"],
      ["computer", "Корпус", "Beast Vision Black"],
    ],
  },
];

const formatPrice = (price) => (
  Number.isFinite(Number(price))
    ? `${new Intl.NumberFormat("ru-RU").format(Number(price))} ₽`
    : String(price || "")
);

const sortCatalogBuilds = (builds) => [...builds].sort((a, b) => {
  const platformOrder = { INTEL: 0, AMD: 1 };
  const platformDifference = (platformOrder[a.platform] ?? 2) - (platformOrder[b.platform] ?? 2);

  if (platformDifference !== 0) return platformDifference;
  if (a.sort !== b.sort) return a.sort - b.sort;

  return String(a.name).localeCompare(String(b.name), "ru");
});

function mapDirectusProduct(item) {
  const platform = String(item.platform || "INTEL").toUpperCase();
  const preset = fallbackCatalogBuilds.find(
    (build) => build.name === item.name && build.platform === platform,
  );
  const value = (field, fallback = "Не указано") => {
    const result = item[field];
    return result === null || result === undefined || String(result).trim() === ""
      ? fallback
      : String(result).trim();
  };

  const detailsSpecs = [
    ["developer_board", "Видеокарта", value("GPU")],
    ["memory", "Процессор", value("processor")],
    ["view_module", "Материнская плата", value("matherboard")],
    ["dns", "Оперативная память", value("ram")],
    ["hard_drive", "SSD накопитель", value("storage")],
    ["mode_fan", "Охлаждение", value("cooling")],
    ["power", "Блок питания", value("power")],
    ["computer", "Корпус", value("case")],
  ];
  const fallbackGauges = preset?.gauges || [];
  const fallbackPerformance = preset?.performance || [];
  const fpsFhdMedium = Number(
    item.fps_fhd_medium ?? String(fallbackPerformance[0]?.[1] || "").replace(/\D/g, ""),
  );
  const fpsFhd = Number(item.fps_fhd ?? fallbackGauges[0]?.[1]);
  const fps2k = Number(item.fps_2k ?? fallbackGauges[1]?.[1]);
  const fps4k = Number(item.fps_4k ?? fallbackGauges[2]?.[1]);
  const gaugePercent = (fps, maximum) => (
    `${Math.min(100, Math.max(0, Math.round((Number.isFinite(fps) ? fps : 0) / maximum * 100)))}%`
  );

  return {
    ...preset,
    id: item.id,
    name: value("name", "Компьютер"),
    fullName: platform === "AMD" ? `${value("name", "Компьютер")} AMD` : value("name", "Компьютер"),
    platform,
    price: formatPrice(item.price),
    image: item.image ? `${DIRECTUS_URL}/public-catalog/assets/${item.image}` : preset?.image || "/assets/catalog-pc.png",
    description: value("description", preset?.description || ""),
    gauges: [
      ["FHD", Number.isFinite(fpsFhd) ? String(fpsFhd) : "—", gaugePercent(fpsFhd, 400)],
      ["2K", Number.isFinite(fps2k) ? String(fps2k) : "—", gaugePercent(fps2k, 300)],
      ["4K", Number.isFinite(fps4k) ? String(fps4k) : "—", gaugePercent(fps4k, 200)],
    ],
    performance: [
      ["Full HD", Number.isFinite(fpsFhdMedium) ? `${fpsFhdMedium} к/с` : "Нет данных", "средние"],
      ["Full HD", Number.isFinite(fpsFhd) ? `${fpsFhd} к/с` : "Нет данных", "ультра"],
      ["2K", Number.isFinite(fps2k) ? `${fps2k} к/с` : "Нет данных", "ультра"],
      ["4K", Number.isFinite(fps4k) ? `${fps4k} к/с` : "Нет данных", "ультра"],
    ],
    specs: detailsSpecs.slice(0, 5),
    detailsSpecs,
    sort: Number(item.sort) || 0,
  };
}

function ProductCard({ build, onBuy, onDetails, onPerformance }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 15, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 15, stiffness: 150 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ["10.5deg", "-10.5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10.5deg", "10.5deg"]);

  const handleMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <article className="product-card">
      <div className="product-card__top">
        <span
          className={`product-card__platform ${
            build.platform === "AMD" ? "product-card__platform--amd" : ""
          }`}
        >
          {build.platform === "INTEL" ? (
            "intel."
          ) : (
            <>
              AMD
              <img src="/assets/amd-mark.png" alt="" aria-hidden="true" />
            </>
          )}
        </span>
        <motion.div
          className="product-card__image"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          <img src={build.image} alt={`Игровой компьютер ${build.name}`} />
        </motion.div>
      </div>

      <div className="product-card__body">
        <div className="product-card__summary">
          <h3>{build.name}</h3>
          <p>{build.description}</p>
          <strong>{build.price}</strong>
        </div>

        <div className="product-card__fps-panel">
          {build.gauges.map(([resolution, fps, value], index) => (
            <div
              className={`fps-gauge fps-gauge--${index === 0 ? "fhd" : index === 1 ? "2k" : "4k"}`}
              style={{ "--gauge-value": value }}
              key={resolution}
            >
              <small>{resolution}</small><b>{fps}</b><span>FPS</span>
            </div>
          ))}
          <button
            type="button"
            title="Средние показатели в популярных играх"
            aria-label={`Открыть показатели производительности ${build.name}`}
            aria-haspopup="dialog"
            onClick={() => onPerformance(build)}
          >
            ?
          </button>
        </div>

        <button className="product-card__buy" type="button" onClick={() => onBuy(build)}>
          Купить ПК <span aria-hidden="true">→</span>
        </button>

        <button
          className="product-card__details"
          type="button"
          aria-haspopup="dialog"
          onClick={() => onDetails(build)}
        >
          Подробнее о сборке
          <i className="material-symbols-outlined" aria-hidden="true">chevron_right</i>
        </button>

        <div className="product-card__specs">
          {build.specs.map(([icon, label, value]) => (
            <div className="product-card__spec" key={label}>
              <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
              <div><small>{label}</small><strong>{value}</strong></div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Catalog() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [detailsBuild, setDetailsBuild] = useState(null);
  const [performanceBuild, setPerformanceBuild] = useState(null);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [catalogBuilds, setCatalogBuilds] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState(false);
  const filteredBuilds = useMemo(
    () => (
      activeFilter === "ALL"
        ? catalogBuilds
        : catalogBuilds.filter((build) => build.platform === activeFilter)
    ),
    [activeFilter, catalogBuilds],
  );

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({
      "filter[published][_eq]": "true",
      sort: "sort,name",
      limit: "-1",
    });

    setCatalogLoading(true);
    setCatalogError(false);

    fetch(`${DIRECTUS_URL}/public-catalog?${query}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Directus returned ${response.status}`);
        return response.json();
      })
      .then(({ data }) => {
        const products = Array.isArray(data)
          ? sortCatalogBuilds(data.map(mapDirectusProduct))
          : [];
        setCatalogBuilds(products);
        setCatalogLoading(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setCatalogBuilds([]);
          setCatalogError(true);
          setCatalogLoading(false);
          console.warn("Не удалось загрузить каталог из Directus, используется резервный каталог.", error);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const refreshCatalog = async () => {
      if (document.visibilityState !== "visible") return;

      const query = new URLSearchParams({
        "filter[published][_eq]": "true",
        sort: "sort,name",
        limit: "-1",
        _: Date.now().toString(),
      });

      try {
        const response = await fetch(`${DIRECTUS_URL}/public-catalog?${query}`, {
          cache: "no-store",
        });
        if (!response.ok) return;

        const { data } = await response.json();
        const products = Array.isArray(data)
          ? sortCatalogBuilds(data.map(mapDirectusProduct))
          : [];
        setCatalogBuilds(products);
      } catch {
        // Keep the current catalog during a brief connection interruption.
      }
    };

    const interval = window.setInterval(refreshCatalog, 5000);
    window.addEventListener("focus", refreshCatalog);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshCatalog);
    };
  }, []);

  useEffect(() => {
    if (!performanceBuild) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setPerformanceBuild(null);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [performanceBuild]);

  return (
    <section className="catalog section" id="catalog">
      <div className="catalog__heading">
        <h2>Каталог <span>компьютеров</span></h2>
      </div>

      <div className="catalog-filter" role="group" aria-label="Фильтр компьютеров">
        {[
          ["ALL", "Все товары"],
          ["INTEL", "INTEL"],
          ["AMD", "AMD"],
        ].map(([value, label]) => (
          <button
            className={activeFilter === value ? "is-active" : ""}
            type="button"
            aria-pressed={activeFilter === value}
            onClick={() => setActiveFilter(value)}
            key={value}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="catalog-grid">
        {filteredBuilds.map((build) => (
          <ProductCard
            build={build}
            key={`${build.platform}-${build.name}`}
            onBuy={setSelectedBuild}
            onDetails={setDetailsBuild}
            onPerformance={setPerformanceBuild}
          />
        ))}
      </div>

      {catalogLoading && (
        <div className="catalog-empty">
          <span className="material-symbols-outlined" aria-hidden="true">progress_activity</span>
          <strong>Загружаем каталог</strong>
        </div>
      )}

      {!catalogLoading && catalogError && (
        <div className="catalog-empty">
          <span className="material-symbols-outlined" aria-hidden="true">cloud_off</span>
          <strong>Каталог временно недоступен</strong>
        </div>
      )}

      {!catalogLoading && !catalogError && filteredBuilds.length === 0 && (
        <div className="catalog-empty">
          <span className="material-symbols-outlined" aria-hidden="true">desktop_windows</span>
          <strong>Сборки AMD скоро появятся</strong>
        </div>
      )}

      <AnimatePresence>
        {performanceBuild && (
          <motion.div
            className="performance-modal"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setPerformanceBuild(null);
            }}
          >
            <motion.div
              className="performance-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="performance-modal-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <button
                className="performance-modal__close material-symbols-outlined"
                type="button"
                aria-label="Закрыть"
                onClick={() => setPerformanceBuild(null)}
              >
                close
              </button>

              <h3 id="performance-modal-title">
                Средняя производительность {performanceBuild.name} в 14 играх
              </h3>
              <p>
                Показатели среднего FPS (кадров в секунду) в играх: Assassin’s Creed Mirage,
                Baldur’s Gate 3, Black Myth Wukong, Dragon Age: The Veilguard, Final Fantasy XVI,
                Flight Simulator 2020, Flight Simulator 2024, God of War Ragnarök, Horizon
                Forbidden West, The Last of Us Part 1, A Plague Tale: Requiem, Spider-Man 2,
                Stalker 2, Starfield и Warhammer 40,000: Space Marine 2.
              </p>

              <div className="performance-modal__stats">
                {performanceBuild.performance.map(([resolution, fps, quality]) => (
                  <div className="performance-modal__stat" key={`${resolution}-${fps}`}>
                    <span>{resolution}</span>
                    <strong>{fps}</strong>
                    <small>{quality}</small>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CatalogPurchaseModal build={selectedBuild} onClose={() => setSelectedBuild(null)} />
      <CatalogDetailsModal build={detailsBuild} onClose={() => setDetailsBuild(null)} />
    </section>
  );
}
