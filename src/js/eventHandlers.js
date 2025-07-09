import { domEl } from "./dom.js";
import { isMobile, debounce } from "./utils.js";

export const setupEventListeners = (
  state,
  updateDisplay,
  closeSidebar,
  renderFilters,
  renderActiveFilters,
  renderTable,
  renderTableMobile
) => {
  let lastIsMobile = isMobile();

  window.addEventListener("resize", () => {
    const nowIsMobile = isMobile();
    if (nowIsMobile !== lastIsMobile) {
      state.renderMode = nowIsMobile ? renderTableMobile : renderTable;
      updateDisplay();
      lastIsMobile = nowIsMobile;
    }
  });

  domEl.filterTags.addEventListener("click", (e) => {
    const removeButton = e.target.closest("button[data-filter]");
    if (!removeButton) return;

    const filterToRemove = removeButton.getAttribute("data-filter");
    state.activeFilters = state.activeFilters.filter(
      (filter) => filter !== filterToRemove
    );
    renderActiveFilters(state.activeFilters, state.availableFilters);
    updateDisplay();
  });

  domEl.applyFiltersBtn.addEventListener("click", () => {
    const checkedFilters = Array.from(
      domEl.filterForm.querySelectorAll("input[type=checkbox]:checked")
    );
    state.activeFilters = checkedFilters.map((input) => input.value);

    renderActiveFilters(state.activeFilters, state.availableFilters);
    updateDisplay();
    closeSidebar();
  });

  domEl.filterBtn.addEventListener("click", () => {
    renderFilters(state.availableFilters, state.activeFilters);

    domEl.filterSidebar.classList.toggle("open");
    domEl.filterSidebar.removeAttribute("aria-hidden");
    domEl.filterBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  });

  domEl.filterOverlay.addEventListener("click", closeSidebar);

  domEl.cancelFiltersBtn.addEventListener("click", closeSidebar);

  domEl.searchField.addEventListener("input", debounce(updateDisplay, 250));

  domEl.tableHead.addEventListener("click", (e) => {
    const { settings } = state;
    const columnIconSort = e.target.closest(".result-sort__button");

    if (!columnIconSort) return;

    const columnHeader = e.target.closest("th[data-column]");
    const column = columnHeader.getAttribute("data-column");

    if (settings.defaultSort.column === column) {
      settings.defaultSort.direction =
        settings.defaultSort.direction === "asc" ? "desc" : "asc";
    } else {
      settings.defaultSort.column = column;
      settings.defaultSort.direction = "asc";
    }

    updateDisplay();
  });
};
