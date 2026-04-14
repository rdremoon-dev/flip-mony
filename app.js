
// Primary URL (jsDelivr)
const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
// Fallback URL (Cloudflare/Pages) - Use this if the first one fails
const FALLBACK_URL = "https://latest.currency-api.pages.dev/v1/currencies";


const dropdowns = document.querySelectorAll('.dropdown select');
const btn = document.querySelector('form button');
const fromCurr = document.querySelector('.from select');
const toCurr = document.querySelector('.to select');
const msg = document.querySelector('.msg');

// dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement('option');
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === 'from' && currCode === 'USD') {
      newOption.selected = true;
    } else if (select.name === 'to' && currCode === 'BDT') {
      newOption.selected = true;
    }
    select.append(newOption);
  }
  select.addEventListener('change', evt => {
    updateFlag(evt.target);
  });
}

// Fixed Flag logic
const updateFlag = element => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;


  let img = element.closest('.select-container').querySelector('img');
  img.src = newSrc;
};


async function updateExchangeRate() {
  let amountInput = document.querySelector('.amount input');
  let amountVal = amountInput.value;
  if (amountVal === "" || amountVal < 1) {
    amountVal = 1;
    amountInput.value = "1"
}
  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  // Try Primary URL first
  let url = `${BASE_URL}/${from}.json`;

  try {
    msg.innerText = 'Getting exchange rate...';
    let response = await fetch(url);

    // If Primary fails, try Fallback
    if (!response.ok) {
      console.warn('Primary API failed, trying fallback...');
      url = `${FALLBACK_URL}/${from}.json`;
      response = await fetch(url);
    }

    if (!response.ok) throw new Error('Both APIs failed');

    const data = await response.json();
    const rate = data[from][to];
    const finalAmount = (amountVal * rate).toFixed(2);

    msg.innerText = `${amountVal} ${from.toUpperCase()} = ${finalAmount} ${to.toUpperCase()}`;
  } catch (err) {
    msg.innerText =
      'Failed to fetch. Please check your internet or try again later.';
    console.error('Fetch Error:', err);
  }
}

btn.addEventListener('click', evt => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener('load', () => {
  updateExchangeRate();
});
