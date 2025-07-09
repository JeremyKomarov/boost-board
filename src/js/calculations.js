import { parseDate } from "./utils.js";

export const calcSummary = (clients, settings) => {
  const { absentDays, summary } = settings;

  const absentDate = new Date();
  absentDate.setDate(absentDate.getDate() - absentDays);
  absentDate.setHours(0, 0, 0, 0);

  const absentClients = {
    totalAbsences: [],
    unRegistered: [],
    registeredDidntShow: [],
    withoutNextClass: [],
  };

  clients.forEach((client) => {
    const { lastClass } = client;
    const lastClassDate = lastClass ? parseDate(lastClass?.date) : null;

    if (lastClassDate && lastClassDate > new Date()) return;

    let isAbsent = false;

    if (!lastClass) {
      absentClients.unRegistered.push(client);
      isAbsent = true;
    } else if (!lastClass.wasAttented && lastClassDate > absentDate) {
      absentClients.registeredDidntShow.push(client);
      isAbsent = true;
    } else if (lastClassDate <= absentDate) {
      isAbsent = true;
    }

    if (isAbsent) {
      absentClients.totalAbsences.push(client);
      if (!client.nextClass) {
        absentClients.withoutNextClass.push(client);
      }
    }
  });

  const subtitles = {
    totalAbsences: ` ב-${absentDays} הימים האחרונים`,
    unRegistered: "לא נרשמו כלל",
    registeredDidntShow: "נרשמו ולא הגיעו",
    withoutNextClass: "ללא שיבוץ עתידי",
  };

  return summary.map((sum) => ({
    type: sum.type,
    title: sum.title,
    value: absentClients[sum.key].length,
    subtitle: subtitles[sum.key],
  }));
};

export const applyFilters = (clients, term, activeFilters) => {
  term = term.toLowerCase().trim();
  return clients.filter((client) => {
    const matchText = !term || client.clientName.toLowerCase().includes(term);
    const matchFilters = activeFilters.every((key) => {
      switch (key) {
        case "subscribed":
          return client.isSubscribed;
        case "not-subscribed":
          return !client.isSubscribed;
        case "next-class":
          return !!client.nextClass;
        case "no-next-class":
          return !client.nextClass;
        case "attended":
          return !!client.lastClass?.wasAttented;
        case "not-attended":
          return !client.lastClass?.wasAttented;
        default:
          return true;
      }
    });
    return matchText && matchFilters;
  });
};

export const sortClients = (clients, settings) => {
  const { defaultSort } = settings;
  if (!defaultSort?.column) return clients;

  const getVal = (client) => {
    switch (defaultSort.column) {
      case "clientName":
        return client.clientName;
      case "lastClass":
        return client.lastClass
          ? parseDate(client.lastClass.date)
          : new Date(0);
      case "nextClass":
        return client.nextClass
          ? parseDate(client.nextClass.date)
          : new Date(0);
      case "isSubscribed":
        return client.isSubscribed ? 1 : 0;
      default:
        return null;
    }
  };

  return [...clients].sort((a, b) => {
    const valA = getVal(a);
    const valB = getVal(b);

    let compare;
    if (valA instanceof Date) {
      compare = valA - valB;
    } else if (typeof valA === "string") {
      compare = valA.localeCompare(valB, "he", { sensitivity: "base" });
    } else {
      compare = valA - valB;
    }
    return defaultSort.direction === "asc" ? compare : -compare;
  });
};
