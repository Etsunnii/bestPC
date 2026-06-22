export function scrollToId(id) {
  const element = document.getElementById(id);

  if (!element) return;

  if (id === "news") {
    const heading = element.querySelector("h2");
    const stages = element.querySelector(".work-stages");

    if (heading && stages) {
      const pageTop = window.scrollY;
      const headingRect = heading.getBoundingClientRect();
      const stagesRect = stages.getBoundingClientRect();
      const contentTop = pageTop + headingRect.top;
      const contentBottom = pageTop + stagesRect.bottom;
      const contentHeight = contentBottom - contentTop;
      const viewportGap = Math.max(16, (window.innerHeight - contentHeight) / 2);

      window.scrollTo({
        top: Math.max(0, contentTop - viewportGap),
        behavior: "smooth",
      });
      return;
    }
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function selectOnlyThisText(event) {
  event.preventDefault();
  const selection = window.getSelection();
  const range = document.createRange();

  range.selectNodeContents(event.currentTarget);
  selection.removeAllRanges();
  selection.addRange(range);
}
