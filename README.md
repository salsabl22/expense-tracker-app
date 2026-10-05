# Expense Tracker App

A lightweight, browser-based personal finance tracker for recording income and expenses, searching transactions, and keeping an eye on your current balance. Built with plain HTML, CSS, and JavaScript, with no frameworks, no build step, and no dependencies.

All data is stored locally in your browser, so there is no account to create and nothing is ever sent to a server.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Data and Persistence](#data-and-persistence)
- [Validation Rules](#validation-rules)
- [Design Notes](#design-notes)
- [Acknowledgments](#acknowledgments)
- [Author](#author)

## Features

- **Add transactions** with a description, amount, date, and type (income or expense).
- **Live financial summary** showing current balance, total income, and total expenses, all formatted in Indonesian Rupiah.
- **Two separate cash-flow lists**, one for income and one for expenses, so each side of your finances is easy to scan.
- **Edit transactions** in place. The form switches into update mode and returns to normal after saving.
- **Switch transaction type** with a single click if an entry was classified incorrectly.
- **Delete transactions** instantly, with the summary updating right away.
- **Search by title**, filtering results as you type or when you submit the search form.
- **Custom date picker** with month navigation and a "today" shortcut, built from scratch without any library.
- **Persistent storage** through `localStorage`, so your records survive page reloads and browser restarts.
- **Responsive layout** that adapts to desktop, tablet, and mobile screens.

## Tech Stack

| Layer      | Technology                                   |
| ---------- | -------------------------------------------- |
| Markup     | HTML5 (semantic elements, ARIA attributes)   |
| Styling    | CSS3 (custom properties, grid, flexbox)      |
| Logic      | Vanilla JavaScript (ES6+)                    |
| Storage    | Browser `localStorage`                       |
| Typography | Poppins via Google Fonts                     |

## Project Structure

```
expense-tracker-app/
|-- index.html   # Page structure and semantic markup
|-- style.css    # Visual design, theme variables, and responsive rules
|-- main.js      # Application logic, rendering, storage, and date picker
`-- README.md    # Project documentation
```

## Getting Started

The project is a static website, so nothing needs to be installed.

### Option 1: Open the file directly

Double-click `index.html`, or drag it into any modern browser.

### Option 2: Use a local server (recommended)

With the **Live Server** extension in VS Code:

1. Open the project folder in VS Code.
2. Right-click `index.html`.
3. Choose **Open with Live Server**.
4. The app opens automatically, usually at `http://127.0.0.1:5500`.

Any other static server works as well, for example:

```bash
npx serve .
```

## How to Use

1. **Add a transaction.** Fill in the description, amount, and date, choose whether it is money coming in or going out, then press **Simpan** (Save).
2. **Pick a date.** Click the date field to open the calendar, move between months with the arrow buttons, and select a day or press **Hari Ini** (Today).
3. **Review your summary.** The balance, total income, and total expenses at the top update after every change.
4. **Edit an entry.** Press **Edit** on a transaction card. Its values load into the form, and the submit button changes to **Perbarui** (Update).
5. **Change the type.** Press **Ubah Tipe** to move a transaction between the income and expense lists.
6. **Delete an entry.** Press **Hapus** to remove a transaction permanently.
7. **Search.** Type in the search field to filter both lists by title, case-insensitively.

## Data and Persistence

Transactions are saved to `localStorage` under the key `transactions` as a JSON array. Each record has the following shape:

```json
{
  "id": 1760000000000,
  "title": "Lunch",
  "amount": 50000,
  "date": "2026-01-15",
  "type": "expense"
}
```

- `id` is a timestamp-based unique identifier.
- `type` is either `income` or `expense`.
- `date` is stored in ISO format (`YYYY-MM-DD`).

To reset the app, clear the site data for the page in your browser, or run `localStorage.removeItem('transactions')` in the developer console.

## Validation Rules

- The description must not be empty.
- The amount must be at least 1 rupiah.

If either rule is broken, the transaction is not saved and the user is shown an alert explaining the problem.

## Design Notes

- A dark theme with a blue accent, green for income, and red for expenses, so the meaning of each figure is clear at a glance.
- Theme colors, spacing, radii, shadows, and easing curves are defined as CSS custom properties in `:root`, which makes restyling simple.
- Semantic landmarks (`header`, `main`, `section`, `footer`), labelled form controls, and visually hidden headings support assistive technologies.
- Breakpoints at 1024px, 768px, and 480px keep the layout comfortable on every screen size.

## Acknowledgments

The initial HTML structure and CSS styling were provided as a starter project by the Dicoding Front-End Web course. The JavaScript logic, including rendering, storage, search, editing, and the custom date picker, was implemented as part of the course assignment.

## Author

**Salsabila**

Feedback and suggestions are welcome through GitHub issues.
