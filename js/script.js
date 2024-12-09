// Variables
let transactions = {};
let income = 0;
let expense = 0;
let balance = 0;
let yValues = [0,0];

var modal = document.getElementById("myModal");
var btn = document.getElementById("add-btn");
var span = document.getElementsByClassName("close")[0];

const amount = document.querySelector("#amount");
let amountType = document.querySelectorAll("input[name='amount-type']");
const dateTime = document.querySelector("#date-time");
const amountCategory = document.querySelector("#amount-category");
const description = document.querySelector("#description");

window.onload = () => {
  transactions = JSON.parse(localStorage.getItem("transactions")) || {};
  transactionType();
  updateValues();
};

// Event Listeners

btn.onclick = function () {
  modal.style.display = "flex";
  document
    .getElementById("submit-btn")
    .setAttribute("onclick", "addTransaction()");
  document.getElementById("submit-btn").textContent = "Add Transaction";
};

span.onclick = function () {
  modal.style.display = "none";
  amount.value = "";
  dateTime.value = "";
  amountCategory.value = "";
  description.value = "";
  document.getElementById("amount-type-hidden").checked = true;
  removeValidationMarks("amount-error", amount);
  removeValidationMarks("amount-type-error");
  removeValidationMarks("date-error", dateTime);
  removeValidationMarks("amount-category-error", amountCategory);
  removeValidationMarks("description-error", description);
  noType();
};

// Pie Chart Function
function statsChart() {
  let xValues = ["Balance", "Expense"];
  let barColors = ["#00aba9", "#2b5797"];
  document.getElementById("chart-area").innerHTML = "";
  let canvas = document.createElement("canvas");
  canvas.id = "stats-chart";
  document.getElementById("chart-area").appendChild(canvas);

  new Chart("stats-chart", {
    type: "pie",
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: yValues,
        },
      ],
    },
  });
}

// Add Transaction Function
function addTransaction() {
  let amountVal = amount.value.trim();
  let amountTypeVal = [...amountType].filter((val) => val.checked == true);
  amountTypeVal = amountTypeVal[0].value.trim();
  let dateVal = dateTime.value.trim();
  let amountCategoryVal = amountCategory.value.trim();
  let descriptionVal = description.value.trim();

  // Validation
  let isamount = validate(amountVal, "amount-error", amount);
  let isamountType = validate(amountTypeVal, "amount-type-error");
  let isdateTime = validate(dateVal, "date-error", dateTime);
  let isamountCategory = validate(
    amountCategoryVal,
    "amount-category-error",
    amountCategory
  );
  let isdescription = validate(
    descriptionVal,
    "description-error",
    description
  );

  // afterValidation
  if (isamount & isamountType & isdateTime & isamountCategory & isdescription) {
    let id = Date.now();
    let transaction = {
      amount: amountVal,
      amountType: amountTypeVal,
      date: dateVal,
      amountCategory: amountCategoryVal,
      description: descriptionVal,
    };
    transactions[id] = transaction;

    localStorage.setItem("transactions", JSON.stringify(transactions));
    transactionType();
    amount.value = "";
    document.getElementById("amount-type-hidden").checked = true;
    dateTime.value = "";
    amountCategory.value = "";
    description.value = "";
    transaction = [];
    document
      .getElementById("submit-btn")
      .removeAttribute("onclick", "addTransaction()");
    document.getElementById("submit-btn").textContent = "";
    modal.style.display = "none";
    updateValues();
  }
}

// Validation Function
function validate(...arguments) {
  if (arguments[0] == "") {
    document.getElementById(arguments[1]).classList.replace("hidden", "block");
    if (arguments[2]) {
      arguments[2].classList.replace("border-slate-500", "border-red-500");
    }
    return false;
  } else {
    if (document.getElementById(arguments[1]).classList.contains("block")) {
      document
        .getElementById(arguments[1])
        .classList.replace("block", "hidden");
      if (arguments[2]) {
        arguments[2].classList.replace("border-red-500", "border-green-700");
      }
    }
    if (arguments[2]) {
      arguments[2].classList.replace("border-red-500", "border-green-700");
    }
    return true;
  }
}

// Reset Application
function resetApp() {
  if (confirm("Are you sure want to Reset ?")) {
    transactions = [];
    localStorage.clear();
    transactionType();
  }
}

function transactionType() {
  let transactionType = document.getElementById("transaction-type").value;
  document.getElementById("transaction-container").innerHTML = "";
  let sortedObject = Object.keys(transactions)
    .sort()
    .reduce((Obj, key) => {
      Obj[key] = transactions[key];
      return Obj;
    }, {});
  transactions = sortedObject;
  for (let key in transactions) {
    if (transactionType == "All") {
      transactionElements(
        transactions[key].amount,
        transactions[key].amountType,
        transactions[key].date,
        transactions[key].amountCategory,
        transactions[key].description,
        key
      );
    } else {
      if (transactionType === transactions[key].amountType) {
        transactionElements(
          transactions[key].amount,
          transactions[key].amountType,
          transactions[key].date,
          transactions[key].amountCategory,
          transactions[key].description,
          key
        );
      }
    }
  }
}

function transactionElements(...args) {
  let transactionElements = document.createElement("div");
  transactionElements.setAttribute("id", "transaction-card");
  transactionElements.classList.add(
    "bg-white",
    "p-4",
    "rounded-md",
    "flex",
    "flex-col",
    "justify-between",
    "shadow-lg",
    "gap-4"
  );

  // card-header-section...
  let cardHeader = document.createElement("div");
  cardHeader.setAttribute("id", "card-header");
  cardHeader.classList.add("flex", "justify-between", "items-center");
  let cardAmount = document.createElement("h3");
  cardAmount.classList.add(
    "font-semibold",
    "py-1",
    "px-2",
    "rounded-md",
    "text-white"
  );
  if (arguments[1] == "Income") {
    cardAmount.classList.add("bg-green-500");
  } else {
    cardAmount.classList.add("bg-red-500");
  }
  cardAmount.innerHTML = `&#8377; ${arguments[0]}`;
  cardHeader.appendChild(cardAmount);
  let cardDate = document.createElement("h3");
  cardDate.classList.add("bg-white", "py-1", "px-2", "rounded-md");
  cardDate.textContent = ` ${arguments[2]}`;
  cardHeader.appendChild(cardDate);
  transactionElements.appendChild(cardHeader);

  // card-content-section...
  let cardContent = document.createElement("div");
  cardContent.setAttribute("id", "card-content");
  cardContent.classList.add("flex", "flex-col", "gap-2");
  let cardType = document.createElement("h2");
  cardType.classList.add(
    "text-lg",
    "font-semibold",
    "text-indigo-800",
    "text-center",
    "uppercase",
    "volkhov"
  );
  cardType.textContent = ` ${arguments[3]}`;
  cardContent.appendChild(cardType);
  let cardDescription = document.createElement("p");
  cardDescription.classList.add(
    "text-left",
    "rounded-md",
    "p-2",
    "bg-slate-100",
    "w-full",
    "h-fit"
  );
  cardDescription.textContent = ` ${arguments[4]}`;
  cardContent.appendChild(cardDescription);
  transactionElements.appendChild(cardContent);

  // card-footer-section...
  let cardFooter = document.createElement("div");
  cardFooter.setAttribute("id", "card-footer");
  cardFooter.classList.add("flex", "justify-between", "items-center");
  let editBtn = document.createElement("button");
  editBtn.classList.add(
    "bg-white",
    "hover:bg-blue-500",
    "py-1",
    "px-4",
    "rounded-md",
    "text-blue-500",
    "hover:text-white",
    "border-2",
    "border-blue-500"
  );
  editBtn.setAttribute("onclick", `editTransaction(${arguments[5]})`);
  editBtn.textContent = `Edit`;
  cardFooter.appendChild(editBtn);
  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add(
    "bg-white",
    "hover:bg-orange-500",
    "py-1",
    "text-orange-500",
    "px-4",
    "rounded-md",
    "hover:text-white",
    "border-2",
    "border-orange-500"
  );
  deleteBtn.setAttribute("onclick", `deleteTransaction(${arguments[5]})`);
  deleteBtn.textContent = `Delete`;
  cardFooter.appendChild(deleteBtn);
  transactionElements.appendChild(cardFooter);
  document
    .getElementById("transaction-container")
    .appendChild(transactionElements);
}

function deleteTransaction(id) {
  if (confirm("Are you sure want to delete this transaction ?")) {
    delete transactions[id];
    transactionType();
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateValues();
  }
}

function editTransaction(id) {
  console.log(id);
  modal.style.display = "flex";
  amount.value = transactions[id].amount;
  dateTime.value = transactions[id].date;
  description.value = transactions[id].description;
  amountType.value = transactions[id].amountType;
  document.getElementById(
    `amount-type-${transactions[id].amountType}`
  ).checked = true;
  if (transactions[id].amountType == "Income") {
    showIncomeType();
  } else {
    showExpenseType();
  }
  amountCategory.value = transactions[id].amountCategory;
  document
    .getElementById("submit-btn")
    .setAttribute("onclick", `updateTransaction(${id})`);
  document.getElementById("submit-btn").textContent = "Update Transaction";
}

function updateTransaction(id) {
  let amountVal = amount.value;
  let amountTypeVal = [...amountType].filter((val) => val.checked == true);
  amountTypeVal = amountTypeVal[0].value.trim();
  let dateVal = dateTime.value.trim();
  let amountCategoryVal = amountCategory.value.trim();
  let descriptionVal = description.value.trim();

  // Validation
  let isamount = validate(amountVal, "amount-error", amount);
  let isamountType = validate(amountTypeVal, "amount-type-error");
  let isdateTime = validate(dateVal, "date-error", dateTime);
  let isamountCategory = validate(
    amountCategoryVal,
    "amount-category-error",
    amountCategory
  );
  let isdescription = validate(
    descriptionVal,
    "description-error",
    description
  );

  // afterValidation
  if (isamount & isamountType & isdateTime & isamountCategory & isdescription) {
    let transactionid = id;
    let transaction = {
      amount: amountVal,
      amountType: amountTypeVal,
      date: dateVal,
      amountCategory: amountCategoryVal,
      description: descriptionVal,
    };
    transactions[transactionid] = transaction;
    transactionType();
    localStorage.setItem("transactions", JSON.stringify(transactions));
    amount.value = "";
    document.getElementById("amount-type-hidden").checked = true;
    dateTime.value = "";
    amountCategory.value = "";
    description.value = "";
    transaction = [];
    document
      .getElementById("submit-btn")
      .removeAttribute("onclick", `updateTransaction(${id})`);
    document.getElementById("submit-btn").textContent = "";
    modal.style.display = "none";
    updateValues();
  }
}

function updateValues() {
  yValues = [];
  income = 0;
  expense = 0;
  balance = 0;
  for (let key in transactions) {
    if (transactions[key].amountType === "Income") {
      income += parseInt(transactions[key].amount);
    } else {
      expense += parseInt(transactions[key].amount);
    }
  }
  balance = income - expense;
  document.getElementById("income-amount").textContent = `${income.toFixed(2)}`;
  document.getElementById("expense-amount").textContent = `${expense.toFixed(
    2
  )}`;
  document.getElementById("balance").textContent = `${balance.toFixed(2)}`;
  yValues = [balance, expense];
  statsChart();
  noType();
}

function showIncomeType() {
  const categories = [
    { value: "", text: "-select-", selected: true },
    { value: "cash", text: "Cash" },
    { value: "account", text: "Account" },
  ];

  const selectElement = document.getElementById("amount-category");
  selectElement.innerHTML = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.text;
    if (category.selected) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });
}

function showExpenseType() {
  const categories = [
    { value: "", text: "-select-", selected: true },
    { value: "food", text: "Food" },
    { value: "social-life", text: "Social Life" },
    { value: "pets", text: "Pets" },
    { value: "transport", text: "Transport" },
    { value: "culture", text: "Culture" },
    { value: "household", text: "Household" },
    { value: "beauty", text: "Beauty" },
    { value: "health", text: "Health" },
    { value: "education", text: "Education" },
    { value: "gift", text: "Gift" },
    { value: "others", text: "Others" },
  ];

  const selectElement = document.getElementById("amount-category");
  selectElement.innerHTML = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.text;
    if (category.selected) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  });
}

function noType() {
  const selectElement = document.getElementById("amount-category");
  selectElement.innerHTML = "";
  const option = document.createElement("option");
  option.value = " ";
  option.textContent = "-select-";
  option.selected = true;
  selectElement.appendChild(option);
}

function removeValidationMarks(...args) {
  if (document.getElementById(arguments[0]).classList.contains("block")) {
    document.getElementById(arguments[0]).classList.replace("block", "hidden");
    if (arguments[1]) {
      arguments[1].classList.replace("border-red-500", "border-slate-500");
    }
  }
  if (arguments[1]) {
    arguments[1].classList.replace("border-red-500", "border-slate-500");
  }
  return true;
}
