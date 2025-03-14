"use strict";

// Data
const account1 = {
  owner: "Tathagat Harsh",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2024-01-10T10:15:30.000Z",
    "2024-01-15T12:30:45.000Z",
    "2024-02-02T14:50:00.000Z",
    "2024-02-20T08:10:20.000Z",
    "2024-03-05T16:30:10.000Z",
    "2024-03-15T19:45:50.000Z",
    "2024-03-25T22:10:05.000Z",
    "2024-04-01T07:00:30.000Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2023-12-12T09:20:10.000Z",
    "2024-01-05T14:45:00.000Z",
    "2024-01-18T18:30:20.000Z",
    "2024-02-07T22:50:30.000Z",
    "2024-02-20T10:15:40.000Z",
    "2024-03-01T13:40:10.000Z",
    "2024-03-10T15:30:00.000Z",
    "2024-03-20T18:00:25.000Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2023-11-20T08:15:10.000Z",
    "2023-12-10T11:45:20.000Z",
    "2023-12-22T13:30:00.000Z",
    "2024-01-12T16:20:40.000Z",
    "2024-01-28T19:05:50.000Z",
    "2024-02-08T20:45:15.000Z",
    "2024-02-25T22:55:30.000Z",
    "2024-03-05T06:30:00.000Z",
  ],
  currency: "GBP",
  locale: "en-GB",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2024-02-01T10:00:00.000Z",
    "2024-02-15T12:20:10.000Z",
    "2024-02-28T14:40:30.000Z",
    "2024-03-12T17:15:45.000Z",
    "2024-03-25T20:30:00.000Z",
  ],
  currency: "EUR",
  locale: "de-DE",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = (acc, sort = false) => {
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  // To set the inner html as empty
  containerMovements.innerHTML = "";

  mov.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const transDate = new Date(acc.movementsDates[i]);

    const day = `${transDate.getDate()}`.padStart(2, 0);
    const month = `${transDate.getMonth() + 1}`.padStart(2, 0);
    const year = transDate.getFullYear();

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${day}/${month}/${year}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div> `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const deposit = acc.movements
    .filter((mov) => mov > 0)
    .reduce((curr, acc) => curr + acc, 0);
  const transfer = acc.movements
    .filter((mov) => mov < 0)
    .reduce((curr, acc) => curr + acc, 0);

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((d) => (d * acc.interestRate) / 100)
    .filter((int) => int > 1)
    .reduce((curr, acc) => curr + acc, 0)
    .toFixed(2);

  labelSumIn.textContent = `${deposit.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(transfer.toFixed(2))}€`;
  labelSumInterest.textContent = `${interest}€`;
};

// Compute Usernames

function createUsername(accs) {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((a) => a[0])
      .join("");
  });
}

createUsername(accounts);

const updateUI = function (acc) {
  //Display Movements
  displayMovements(acc);

  //Balance
  calcDisplayBalance(acc);

  //summary
  calcDisplaySummary(acc);
};

let currentUser;

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = `${now.getHours()}`.padStart(2, 0);
const min = `${now.getMinutes()}`.padStart(2, 0);

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

btnLogin.addEventListener("click", function (e) {
  // To prevent the form from Submitting
  e.preventDefault();

  currentUser = accounts.find((a) => a.username === inputLoginUsername.value);

  if (currentUser.pin === Number(inputLoginPin.value)) {
    // Welcome Text and UI
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur(); //Just To Remove Cursor and Focus From the login
    labelWelcome.textContent = `Welcome ${currentUser.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;

    updateUI(currentUser);
  }
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentUser, !sorted);
  sorted = !sorted;
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const tranAcc = accounts.find((a) => a.username === inputTransferTo.value);

  inputTransferTo.value = inputTransferAmount.value = "";

  if (
    amount > 0 &&
    tranAcc &&
    amount <= currentUser.balance &&
    tranAcc?.username !== currentUser.username
  ) {
    const date = new Date();

    tranAcc.movements.push(amount);
    tranAcc.movementsDates.push(date);
    currentUser.movements.push(-amount);
    currentUser.movementsDates.push(date);

    updateUI(currentUser);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some((a) => a >= amount * 0.1)) {
    const date = new Date();
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(date);

    updateUI(currentUser);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    const index = accounts.findIndex(
      (a) => a.username === inputCloseUsername.value
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

currentUser = account1;
updateUI(currentUser);
containerApp.style.opacity = 100;
