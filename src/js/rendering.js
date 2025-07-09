import { domEl } from "./dom.js";
import { parseDate, formatDate } from "./utils.js";

export const renderSummary = (summaryData) => {
  domEl.summary.innerHTML = summaryData
    .map(
      (block) => `
        <div class="summary__block summary__block--${block.type} u-flex-center">
          <div class="summary-wrapper u-flex-center">
            <p class="summary__title">${
              block.type === "light" ? "מתוכם" : "לא הגיעו"
            }</p>
            <h2 class="summary__value">${block.value}</h2>
            <p class="summary__subtitle">${block.subtitle}</p>
          </div>
          ${block.type === "light" ? "<div class='step'></div>" : ""}
        </div>
      `
    )
    .join("");
};

export const createTableHeaderTh = (column) => {
  if (!column.isActive) {
    return "";
  }

  if (column.label === "") {
    return `<th scope="col" class="results-table__cell ${column.key}"></th>`;
  }

  return `
    <th scope="col"
        class="results-table__cell ${column.key}"
        data-column="${column.key}">
        <button
          type="button"
          class="result-sort__button"
          aria-label="כפתור מיון לפי ${column.label}">
          <span>${column.label}</span>
          <img
            src="./assets/icon-arrow-up.svg"
            alt="אייקון מיון"
            class="icon--sort"
          />
        </button>
    </th>
  `;
};

export const renderTableHeader = (columns) => {
  const tableThs = columns
    .map((column) => createTableHeaderTh(column))
    .join("");
  domEl.tableHead.innerHTML = `<tr>${tableThs}</tr>`;
};

export const renderFilters = (availableFilters, activeFilters) => {
  domEl.filterForm.innerHTML = availableFilters
    .filter((filter) => filter.isActive)
    .map(
      (filter) => `
        <label class="filter-checkbox">
          <input 
            class="filter-checkbox__input" 
            type="checkbox" 
            value="${filter.value}" 
            ${activeFilters.includes(filter.value) ? "checked" : ""}
          />
          <span class="filter-sidebar_custom-checkbox"></span>
          <div class="filter-checkbox__texts">
            <span class="filter-checkbox__main">${filter.label}</span>
            <span class="filter-checkbox__subtitle">הוספת תגית לדו"ח</span>
          </div>
        </label>
        <div class="filter-sidebar__divider"></div>
      `
    )
    .join("");
};

export const renderActiveFilters = (activeFilters, availableFilters) => {
  domEl.filterTags.innerHTML = activeFilters
    .map((filterValue) => {
      const filter = availableFilters.find((f) => f.value === filterValue);
      return `
        <span class="filter-tag">
          <span class="filter-tag__label">${filter?.label || filterValue}</span>
          <button class="filter-tag__remove" data-filter="${filterValue}" title="הסר סינון">
            <img src="./assets/icon-close.svg" alt="כפתור מחיקת פילטר">
          </button>
        </span>
      `;
    })
    .join("");
};

export const createDesktopClientBlock = (client, settings) => {
  const { clientName, lastClass, nextClass, isSubscribed } = client;
  const visibleColumns = Object.fromEntries(
    settings.columns.map((col) => [col.key, col.isActive])
  );

  const nameCell = `
      <td>
        <span class="client-name-box">${clientName || ""}</span>
      </td>
    `;

  let lastClassCell;
  if (!lastClass) {
    lastClassCell = `
        <td>
          <span class="last-seen-details">
            <span class="last-seen-details__label">לא נמצא שיבוץ אחרון</span>
          </span>
        </td>
    `;
  } else {
    const dateDisplay = lastClass.date
      ? `<span class="last-seen-details__date">${formatDate(
          parseDate(lastClass.date)
        )}</span>`
      : "";

    const timeDisplay = lastClass.hour
      ? `<span class="last-seen-details__time u-flex-center">${lastClass.hour}</span>`
      : "";

    lastClassCell = `
        <td>
          <span class="last-seen-details">
            <span class="last-seen-details__label last-seen-details__label--active">
              ${lastClass.name}
            </span>
            ${dateDisplay}
            ${timeDisplay}
          </span>
        </td>
    `;
  }

  const nextClassCell = nextClass
    ? `
        <td>
          <span class="status-cell status-cell--class">
            <img src="./assets/icon-check-rounded.svg" alt="אייקון של נוכח" class="status-cell__icon">
            <span class="status-cell__pill">${formatDate(
              parseDate(nextClass.date)
            )}</span>
          </span>
        </td>
      `
    : `
        <td>
          <span class="status-cell">
            <img src="./assets/icon-close-rounded.svg" alt="אייקון של איקס" class="status-cell__icon">
            <span>ללא</span>
          </span>
        </td>
    `;

  const subscriptionCell = `
      <td>
        <span class="subscription-pill ${
          isSubscribed ? "subscription-pill--active" : ""
        }">${isSubscribed ? "מנוי פעיל" : "ללא מנוי"}</span>
      </td>
    `;

  return `
    ${visibleColumns["checkBox"] ? "<td></td>" : ""}
    ${visibleColumns["clientName"] ? nameCell : ""}
    ${visibleColumns["lastClass"] ? lastClassCell : ""} 
    ${visibleColumns["nextClass"] ? nextClassCell : ""}
    ${visibleColumns["isSubscribed"] ? subscriptionCell : ""}
    ${visibleColumns["actions"] ? "<td></td>" : ""}
  `;
};

export const renderTable = (clientList, settings) => {
  if (!clientList.length) {
    domEl.tableBody.innerHTML =
      "<tr><td colspan='6'>לא נמצאו תוצאות.</td></tr>";
    return;
  }

  domEl.tableBody.innerHTML = clientList
    .map(
      (client) => `
        <tr>
          ${createDesktopClientBlock(client, settings)}
        </tr>
      `
    )
    .join("");
};

export const createMobileClientBlock = (client, settings) => {
  const { clientName, lastClass, nextClass, isSubscribed } = client;
  const visibleColumns = Object.fromEntries(
    settings.columns.map((col) => [col.key, col.isActive])
  );

  const lastClassLabelClass = lastClass?.date
    ? "last-seen-details__label last-seen-details__label--active"
    : "last-seen-details__label";
  const lastDate = lastClass ? lastClass?.date : "ללא";

  const futureClassBlock = nextClass
    ? `<img src="./assets/icon-check-rounded.svg" alt="אייקון של נוכח" class="status-cell__icon">
       <span>עתידי</span>
       <span class="status-cell__pill">
         ${formatDate(parseDate(nextClass.date))}
       </span>`
    : `<img src="./assets/icon-close-rounded.svg" alt="אייקון של איקס" class="status-cell__icon">
       <span>עתידי</span>
       <span>ללא</span>`;

  const subscriptionBlock = isSubscribed
    ? `<span class="subscription-pill subscription-pill--active">מנוי פעיל</span>`
    : `<span class="subscription-pill">ללא מנוי</span>`;

  return `
    <div class="results-table__cell">
      <span class="client-name-box">${
        visibleColumns["clientName"] ? clientName : ""
      }</span>
      <div class="client-details">
        <div class="client-last__details">
          <span class="${lastClassLabelClass}">${
    visibleColumns["lastClass"] ? "אחרון" : ""
  }</span>
          <span class="last-seen-details__date">${
            visibleColumns["lastClass"] ? lastDate : ""
          }</span>
        </div>
        <div class="client-future__details">
          ${visibleColumns["nextClass"] ? futureClassBlock : ""}
        </div>
        ${visibleColumns["isSubscribed"] ? subscriptionBlock : ""}
      </div>
    </div>
  `;
};

export const renderTableMobile = (data, settings) => {
  if (!Array.isArray(data) || data.length === 0) {
    domEl.tableBody.innerHTML =
      '<tr><td colspan="6">לא נמצאו תוצאות.</td></tr>';
    return;
  }

  domEl.tableBody.innerHTML = data
    .map(
      (client) => `
      <tr>
        <td>${createMobileClientBlock(client, settings)}</td>
      </tr>
    `
    )
    .join("");
};

export const updateSortIcons = (settings) => {
  const { defaultSort } = settings;
  document.querySelectorAll(".icon--sort").forEach((icon) => {
    icon.classList.remove("rotate");
  });

  if (defaultSort.column) {
    const sortHeader = document.querySelector(
      `.results-table__head th[data-column="${defaultSort.column}"]`
    );
    const sortIcon = sortHeader?.querySelector(".icon--sort");
    if (sortIcon && defaultSort.direction === "asc") {
      sortIcon.classList.add("rotate");
    }
  }
};

export const closeSidebar = () => {
  if (domEl.filterBtn) {
    domEl.filterBtn.focus();
  }

  domEl.filterSidebar.classList.remove("open");
  domEl.filterSidebar.setAttribute("aria-hidden", "true");
  domEl.filterBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("no-scroll");
};
