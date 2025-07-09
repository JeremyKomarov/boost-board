const MOBILE_BREAKPOINT = 402;

export const isMobile = () => {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
};

export const debounce = (fn, ms = 300) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export const extractTime = (stringHour) => {
  if (!stringHour) return null;
  const [hour, minute] = stringHour.split(":").map(Number);
  return { hour, minute };
};

export const parseDate = (stringDate) => {
  if (!stringDate) return null;
  const [d, m, y] = stringDate.split("/").map(Number);
  return new Date(y, m - 1, d);
};

export const formatDate = (date) => {
  if (!date) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
};
