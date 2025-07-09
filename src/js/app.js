import { domEl } from "./dom.js";
import { debounce, isMobile } from "./utils.js";
import { calcSummary, applyFilters, sortClients } from "./calculations.js";
import {
  renderSummary,
  renderTableHeader,
  renderActiveFilters,
  renderFilters,
  renderTable,
  renderTableMobile,
  updateSortIcons,
  closeSidebar,
} from "./rendering.js";
import { setupEventListeners } from "./eventHandlers.js";
import { fetchData } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    settings: {},
    clients: [],
    availableFilters: [],
    activeFilters: [],
    renderMode: null,
  };

  const updateDisplay = () => {
    const filtered = applyFilters(
      state.clients,
      domEl.searchField.value,
      state.activeFilters
    );
    const sorted = sortClients(filtered, state.settings);
    state.renderMode(sorted, state.settings);
    updateSortIcons(state.settings);
  };

  const init = async () => {
    try {
      [state.settings, state.clients, state.availableFilters] =
        await Promise.all([
          fetchData(`/mock/settings.json`),
          fetchData(`/mock/clients.json`),
          fetchData(`/mock/filters.json`),
        ]);

      state.renderMode = isMobile() ? renderTableMobile : renderTable;

      renderSummary(calcSummary(state.clients, state.settings));
      renderTableHeader(state.settings.columns);
      renderActiveFilters(state.activeFilters, state.availableFilters);
      updateDisplay();

      setupEventListeners(
        state,
        updateDisplay,
        closeSidebar,
        renderFilters,
        renderActiveFilters,
        renderTable,
        renderTableMobile
      );
    } catch (err) {
      console.error("init", err);
    }
  };

  init();
});
