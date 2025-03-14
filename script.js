"use strict";

// Data
const account1 = {
  owner: "Tathagat Harsh",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

const displayMovements = (movements, sort = false) => {
  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;

  // To set the inner html as empty
  containerMovements.innerHTML = "";

  mov.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div> `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  labelBalance.textContent = `${acc.balance}€`;
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

  labelSumIn.textContent = `${deposit}€`;
  labelSumOut.textContent = `${Math.abs(transfer)}€`;
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
  displayMovements(acc.movements);

  //Balance
  calcDisplayBalance(acc);

  //summary
  calcDisplaySummary(acc);
};

let currentUser;

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

btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentUser.movements, !sorted);
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
    tranAcc.movements.push(amount);
    currentUser.movements.push(-amount);

    updateUI(currentUser);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentUser.movements.some((a) => a >= amount * 0.1)) {
    currentUser.movements.push(amount);

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
