# Boost Board

This is a dashboard for managing gym reservations.  
Built with **HTML**, **Vanilla JS**, and **CSS3**.  
Data is mocked using JSON files.

---

## Project Structure

```
boost-dashboard/
├── public/
│   └── assets/               # SVG, etc.
├── src/
│   ├── css/                  # CSS files
│   ├── js/                   # JS files
│   ├── mock/                 # Mock data files
│   └── main.js               # App entry point
├── index.html                # HTML file
├── package.json              # Dependencies
└── README.md                 # Documentation
```

---

## Installation and Running Instructions

- Node.js **v20** or higher is required.

1. **Clone the repository**

   ```bash
   git clone git@github.com:JeremyKomarov/boost-board.git
   cd boost-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview the production build**
   ```bash
   npm run preview
   ```

---

## Mock Files Explanation

### `clients.json`

All clients

- **clientName**: Full name of the client.
- **lastClass**: An object with the last class, including class name, date, time, and if he was attended.
- **nextClass**: An object with the next class, including class name, date, time.
- **isSubscribed**: If client has an active subscription.

### `filters.json`

Defines all available filter options for the dashboard:

- **label**: Display name of the filter.
- **value**: The key used for filtering logic(DO NOT CHANGE IT).
- **isActive**: If filter should be active.

### `settings.json`

App settings:

- **absentDays**: The number of days used to determine if a client is absent.
- **defaultSort**: The default column and direction (asc/desc).
- **columns**: Configuration for each table column, including its key(DO NOT TOUCH), display label, and visibility.
- **summary**: Keys and labels for summary counters shown at the top of the dashboard.

---

## Features

- **Search by Name:**  
  Real-time search by client name (debounced for performance)
- **Sort Columns:**  
  Click any table header to sort asc/desc
- **Filters:**  
  Filter clients using up to 6 filter tags:
  - **subscribed:** מנוי
  - **not-subscribed:** ללא מנוי
  - **next-class:** יש שיבוץ עתידי
  - **no-next-class:** ללא שיבוץ עתידי
  - **attended:** השתתף בשיעור האחרון
  - **not-attended:** לא השתתף בשיעור האחרון
- **Active Filter Tags:**  
  See and remove applied filters easily
- **Summary Block:**  
  Shows counts for:
  - Total absent clients (by absent days & attendance)
  - Clients who never signed to a class
  - Clients who signed to last class but didn't attend
  - Absent clients without a next class

---

## Usage

### Customize App

- **settings.json**:
  - Set the number of absent days (`absentDays`)
  - Choose the default sort column and direction (`asc` or `desc`), you can add a col name to derminate with colum will be default sorted,
    - "clientName"
    - "lastClass"
    - "nextClass"
    - "isSubscribed"
  - Change labels or enable/disable columns toggle true/false `isActive` (keys must stay the same for logic)
- **filters.json**:
  - Enable or disable filters by changing true/false `isActive`
- **clients.json**:
  - Edit or add client data, including last and next classes, for testing

---

### How Absence & Summary Work

- If a client does not have a last class
- their last class date is more than the absent days configured in settings,
- then the client is considered absent and included in `לא הגיעו`.

From the absent clients, additional summary counters are calculated:

- If the client is absent and does not have a last class,  
  they are counted in `לא נרשמו כלל`.

- If the client is absent and has a last class but did not attend,  
  they are counted in `נרשמו ולא הגיעו`.

- If the client is absent and does not have a next class,  
  they are counted in `ללא שיבוץ עתידי`.

---

> Made by Jeremy Komarov For Boostapp Team
