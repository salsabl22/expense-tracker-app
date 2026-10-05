const STORAGE_KEY = 'transactions';
const UPDATE_EVENT = 'transaction:updated';

let transactions = loadTransactions();
let editingId = null;

const incomeListEl = document.getElementById('incomeList');
const expenseListEl = document.getElementById('expenseList');

const balanceAmountEl = document.querySelector('.tracker-summary__balance-amount');
const incomeAmountEl = document.querySelector('.tracker-summary__stat-amount--income');
const expenseAmountEl = document.querySelector('.tracker-summary__stat-amount--expense');

const transactionForm = document.getElementById('transactionForm');
const titleInput = document.getElementById('transactionFormTitleInput');
const amountInput = document.getElementById('transactionFormAmountInput');
const dateInput = document.getElementById('transactionFormDateInput');
const typeSelect = document.getElementById('transactionFormTypeSelect');
const submitButton = document.querySelector('[data-testid="transactionFormSubmitButton"]');

const searchForm = document.getElementById('searchTransactionForm');
const searchInput = document.getElementById('searchTransactionFormTitleInput');

/** Kalender */
const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

let calendarViewDate = new Date();
let calendarEl = null;

function pad2(num) {
  return String(num).padStart(2, '0');
}

function toISODate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function buildCalendar() {
  const calendar = document.createElement('div');
  calendar.className = 'tracker-datepicker';

  const header = document.createElement('div');
  header.className = 'tracker-datepicker__header';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'tracker-datepicker__nav';
  prevBtn.textContent = '‹';
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarViewDate.setMonth(calendarViewDate.getMonth() - 1);
    renderCalendarBody();
  });

  const monthLabel = document.createElement('span');
  monthLabel.className = 'tracker-datepicker__month';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'tracker-datepicker__nav';
  nextBtn.textContent = '›';
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarViewDate.setMonth(calendarViewDate.getMonth() + 1);
    renderCalendarBody();
  });

  header.append(prevBtn, monthLabel, nextBtn);

  const weekdaysRow = document.createElement('div');
  weekdaysRow.className = 'tracker-datepicker__weekdays';
  DAY_NAMES.forEach((day) => {
    const dayEl = document.createElement('span');
    dayEl.textContent = day;
    weekdaysRow.appendChild(dayEl);
  });

  const grid = document.createElement('div');
  grid.className = 'tracker-datepicker__grid';

  const footer = document.createElement('div');
  footer.className = 'tracker-datepicker__footer';

  const todayBtn = document.createElement('button');
  todayBtn.type = 'button';
  todayBtn.className = 'tracker-datepicker__today';
  todayBtn.textContent = 'Hari Ini';
  todayBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectCalendarDate(new Date());
  });

  footer.appendChild(todayBtn);

  calendar.append(header, weekdaysRow, grid, footer);
  calendar.dataset.monthLabel = '';

  calendar._monthLabel = monthLabel;
  calendar._grid = grid;

  return calendar;
}

function renderCalendarBody() {
  if (!calendarEl) return;

  const monthLabel = calendarEl._monthLabel;
  const grid = calendarEl._grid;

  monthLabel.textContent = `${MONTH_NAMES[calendarViewDate.getMonth()]} ${calendarViewDate.getFullYear()}`;
  grid.innerHTML = '';

  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const selectedISO = dateInput.value ? dateInput.value : null;
  const todayISO = toISODate(new Date());

  for (let i = 0; i < firstDayOfMonth; i++) {
    const filler = document.createElement('span');
    filler.className = 'tracker-datepicker__day tracker-datepicker__day--empty';
    grid.appendChild(filler);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cellDate = new Date(year, month, day);
    const cellISO = toISODate(cellDate);

    const dayBtn = document.createElement('button');
    dayBtn.type = 'button';
    dayBtn.className = 'tracker-datepicker__day';
    dayBtn.textContent = day;

    if (cellISO === selectedISO) dayBtn.classList.add('tracker-datepicker__day--selected');
    if (cellISO === todayISO) dayBtn.classList.add('tracker-datepicker__day--today');

    dayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectCalendarDate(cellDate);
    });

    grid.appendChild(dayBtn);
  }
}

function selectCalendarDate(date) {
  const isoDate = toISODate(date);
  dateInput.value = isoDate;
  dateInput.dispatchEvent(new Event('change'));
  closeCalendar();
}

function openCalendar() {
  if (calendarEl) return;

  calendarViewDate = dateInput.value ? new Date(dateInput.value) : new Date();
  calendarEl = buildCalendar();
  dateInput.closest('.tracker-form__field--date').appendChild(calendarEl);
  renderCalendarBody();

  document.addEventListener('click', handleOutsideCalendarClick);
}

function closeCalendar() {
  if (!calendarEl) return;
  calendarEl.remove();
  calendarEl = null;
  document.removeEventListener('click', handleOutsideCalendarClick);
}

function handleOutsideCalendarClick(e) {
  if (calendarEl && !calendarEl.contains(e.target) && e.target !== dateInput) {
    closeCalendar();
  }
}

dateInput.addEventListener('click', (e) => {
  e.stopPropagation();
  if (calendarEl) {
    closeCalendar();
  } else {
    openCalendar();
  }
});

/** Storage */
function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Gagal memuat data transaksi:', error);
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function generateId() {
  return +new Date();
}

function notifyUpdate() {
  document.dispatchEvent(new Event(UPDATE_EVENT));
}

/** Formatting */
function formatCurrency(amount) {
  return 'Rp' + Number(amount).toLocaleString('id-ID');
}

function formatTypeLabel(type) {
  return type === 'income' ? 'Pemasukan' : 'Pengeluaran';
}

/** Rendering */
function createTransactionCard(transaction) {
  const { id, title, amount, date, type } = transaction;

  const card = document.createElement('div');
  card.dataset.testid = 'transactionItem';
  card.className = 'tracker-transaction-card';

  const titleEl = document.createElement('h3');
  titleEl.dataset.testid = 'transactionItemTitle';
  titleEl.textContent = title;

  const amountEl = document.createElement('p');
  amountEl.dataset.testid = 'transactionItemAmount';
  amountEl.textContent = `Nominal: ${formatCurrency(amount)}`;

  const dateEl = document.createElement('p');
  dateEl.dataset.testid = 'transactionItemDate';
  dateEl.textContent = `Tanggal: ${date}`;

  const typeEl = document.createElement('p');
  typeEl.dataset.testid = 'transactionItemType';
  typeEl.textContent = `Tipe: ${formatTypeLabel(type)}`;

  const actionsWrapper = document.createElement('div');
  actionsWrapper.className = 'tracker-transaction-card__actions';

  const editTypeButton = document.createElement('button');
  editTypeButton.dataset.testid = 'transactionItemEditTypeButton';
  editTypeButton.type = 'button';
  editTypeButton.textContent = 'Ubah Tipe';
  editTypeButton.addEventListener('click', () => toggleTransactionType(id));

  const deleteButton = document.createElement('button');
  deleteButton.dataset.testid = 'transactionItemDeleteButton';
  deleteButton.type = 'button';
  deleteButton.textContent = 'Hapus';
  deleteButton.addEventListener('click', () => deleteTransaction(id));

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => startEditTransaction(id));

  actionsWrapper.append(editButton, editTypeButton, deleteButton);
  card.append(titleEl, amountEl, dateEl, typeEl, actionsWrapper);

  return card;
}

function renderTransactions(list = transactions) {
  incomeListEl.innerHTML = '';
  expenseListEl.innerHTML = '';

  list.forEach((transaction) => {
    const card = createTransactionCard(transaction);
    if (transaction.type === 'income') {
      incomeListEl.appendChild(card);
    } else {
      expenseListEl.appendChild(card);
    }
  });
}

function updateDashboard() {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  balanceAmountEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(totalIncome);
  expenseAmountEl.textContent = formatCurrency(totalExpense);
}

function updateView() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filtered = keyword
    ? transactions.filter((t) => t.title.toLowerCase().includes(keyword))
    : transactions;

  renderTransactions(filtered);
  updateDashboard();
}

document.addEventListener(UPDATE_EVENT, updateView);

/** Form add / edit transaction */
function resetForm() {
  transactionForm.reset();
  editingId = null;
  submitButton.textContent = 'Simpan';
}

function startEditTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  titleInput.value = transaction.title;
  amountInput.value = transaction.amount;
  dateInput.value = transaction.date;
  typeSelect.value = transaction.type;

  editingId = id;
  submitButton.textContent = 'Perbarui';

  titleInput.focus();
}

transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value;
  const type = typeSelect.value;

  if (title === '') {
    alert('Judul transaksi tidak boleh kosong.');
    return;
  }

  if (!amount || amount < 1) {
    alert('Nominal harus lebih besar atau sama dengan 1 rupiah.');
    return;
  }

  if (editingId !== null) {
    const index = transactions.findIndex((t) => t.id === editingId);
    if (index !== -1) {
      transactions[index] = { ...transactions[index], title, amount, date, type };
    }
  } else {
    transactions.push({
      id: generateId(),
      title,
      amount,
      date,
      type,
    });
  }

  saveTransactions();
  resetForm();
  notifyUpdate();
});

/** Delete & toggle type */
function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions();

  if (editingId === id) {
    resetForm();
  }

  notifyUpdate();
}

function toggleTransactionType(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  transaction.type = transaction.type === 'income' ? 'expense' : 'income';
  saveTransactions();
  notifyUpdate();
}

/** Search */
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  updateView();
});

searchInput.addEventListener('input', () => {
  updateView();
});

/** Init */
notifyUpdate();