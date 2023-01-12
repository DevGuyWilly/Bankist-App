'use strict';

// BANKIST APP
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//creating usernames for login
function createUsername(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(value => value[0])
      .join('');
  });
}
createUsername(accounts);
//
//
let displayMovement = (movements, sort = false) => {
  containerMovements.innerHTML = '';
  let mov = sort ? movements.slice().sort((a, b) => a - b) : movements;
  mov.forEach((value, index) => {
    let tranType = value > 0 ? 'deposit' : 'withdrawal';
    let html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${tranType}">
      ${index + 1} ${tranType}</div>
      <div class="movements__date"> </div>
      <div class="movements__value">${value}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//
//
let calDisplayBal = acc => {
  let balance = acc.movements.reduce((prevcurr, curr) => prevcurr + curr, 0);
  acc.balance = balance;
  labelBalance.textContent = `${acc.balance} €`;
};
//calDisplayBal(accounts);
//
let calDisplaySummary = function (account) {
  //console.log(account);
  //console.log(account.movements);
  let incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = `${incomes} €`;

  let outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(outcome)} €`;

  let interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  //console.log({ interest });
  labelSumInterest.textContent = `${interest} €`;
};
//login functionality
let currentAccount;
btnLogin.addEventListener('click', e => {
  //prevent form from submitting
  e.preventDefault();
  //console.log('LOGIN');
  //checking for account-object in accounts array to see if it matches username input
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //checking for current account pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('LOGIN');
    //display ui and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`;
    containerApp.style.opacity = '100';
    //display bal
    calDisplayBal(currentAccount);
    //display movements
    displayMovement(currentAccount.movements);
    //display summary
    calDisplaySummary(currentAccount);
    //clear fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
  }
});
//
//transfer functionality
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let recieverAcc = inputTransferTo.value;
  let recieverobj = accounts.find(acc => acc.username === recieverAcc);
  inputTransferAmount.value = inputLoginUsername.value = '';
  if (
    currentAccount.balance > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.username !== currentAccount.username
  ) {
    recieverobj.movements.push(amount);
    currentAccount.movements.push(-amount);
    displayMovement(currentAccount.movements);
    calDisplayBal(currentAccount);
    calDisplaySummary(currentAccount);
  }
});
//
//the find method returns the first item that returns true
//close account using the findindex method
btnClose.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputCloseUsername.value
  );
  if (
    currentAccount?.username === inputCloseUsername.value &&
    currentAccount?.pin === Number(inputClosePin.value)
  ) {
    let index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = '0';
    inputCloseUsername.value = inputClosePin.value = '';
    currentAccount = {};
  }
});
//loan functionality
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  let lA = Number(inputLoanAmount.value);

  if (currentAccount.movements.some(mov => mov >= (lA * 10) / 100)) {
    currentAccount.movements.push(lA);
    displayMovement(currentAccount.movements);
    calDisplayBal(currentAccount);
    calDisplaySummary(currentAccount);
    inputLoanAmount.value = '';
  }
});
//
const movementDescription = movements.map((mov, i, arr) => {
  return `Movement ${i + 1}: You ${
    mov > 0 ? 'Deposited' : 'Withdrew'
  } ${Math.abs(mov)}`;
});

let eurToUsd = 1.1;
let totalDepositUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
let firstWithdrawal = movements.find(mov => mov < 0);
let account = accounts.find(acc => acc.owner === 'Jessica Davis');

//flat and flatmap
function totalDepoBal(acc) {
  accMov = acc
    .map(mov => mov.movements)
    .flat()
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
}

//sort functionality
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
});
//////////////////////////////
//coding challenge
// let dogsJulia = [3, 6, 1, 8];
// let dogsKate = [9, 7, 1, 4];

// function checkDogs(dogsJulia, dogsKate) {
//   let juliaCopy = dogsJulia.slice(1, -2);
//   console.log(juliaCopy);

//   let bothData = [...juliaCopy, ...dogsKate];
//   console.log(bothData);

//   bothData.forEach((value, index) => {
//     //console.log(value);
//     value >= 3
//       ? console.log(
//           `Dog number ${index + 1} is an 'ADULT', and is ${value} years old`
//         )
//       : console.log(
//           `Dog number ${index + 1} is an 'PUPPY', and is ${value} years old`
//         );
//   });
// }
// checkDogs(dogsJulia, dogsKate);

// function dogAgeYears(params) {
//   let humanAge = params.map(value => (value <= 2 ? 2 * value : 16 + value * 4));
//   console.log(humanAge);
//   let check = humanAge.filter(values => values >= 18);
//   let avg = check.reduce((acc, curr) => {
//     return (acc += curr);
//   });
//   let mainAvg = avg / check.length;
//   console.log(mainAvg);
// }
// dogAgeYears([5, 2, 4, 1, 15, 8, 3]);
// dogAgeYears([16, 6, 10, 5, 6, 1, 4]);
// let calAvgHumange = params =>
//   params
//     .map(value => (value <= 2 ? 2 * value : 16 + value * 4))
//     .filter(value => value >= 18)
//     .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);
// console.log(calAvgHumange([5, 2, 4, 1, 15, 8, 3]));
// calAvgHumange([16, 6, 10, 5, 6, 1, 4]);
//
