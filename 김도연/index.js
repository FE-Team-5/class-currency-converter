class CurrencyInput {
  constructor(num) {
    this.num = num;
  }

  render() {
    const div = document.createElement('div');
    div.className = 'currency';
    div.innerHTML = `
       <select id="currency-${this.num}"></select>
       <input type="number" id="amount-${this.num}" placeholder="0" value='${
      this.num === 'one' ? '1' : ''
    }' />
     `;
    return div.outerHTML;
  }
}

class SwapRate {
  render() {
    const div = document.createElement('div');
    div.className = 'swap-rate-container';
    div.innerHTML = `<button class="btn" id="swap">바꾸기</button>`;
    return div.outerHTML;
  }
}

class DisplayRate {
  render() {
    return `
       <div id="rate" class="rate"></div>
     `;
  }
}

class CreateOptions {
  static create(key, value) {
    const option = document.createElement('option');
    [option.value, option.innerText] = [key, key];
    option.setAttribute('data-rate', value);
    return option;
  }
}

class App {
  constructor() {
    this.currencyOne = null;
    this.currencyTwo = null;
    this.amountOne = null;
    this.amountTwo = null;
    this.displayRate = null;
  }

  async getList() {
    const res = await fetch('https://open.exchangerate-api.com/v6/latest');
    const rates = await res.json();
    return rates.rates;
  }

  async optionList() {
    const list = await this.getList();

    for (let key in list) {
      const option1 = CreateOptions.create(key, list[key]);
      const option2 = CreateOptions.create(key, list[key]);

      this.currencyOne.appendChild(option1);
      this.currencyTwo.appendChild(option2);

      if (key === 'USD') option1.selected = true;
      if (key === 'KRW') option2.selected = true;
    }

    this.calculate();
  }

  calculate() {
    const rateOne = parseFloat(
      this.currencyOne.options[this.currencyOne.selectedIndex].dataset.rate,
    );
    const rateTwo = parseFloat(
      this.currencyTwo.options[this.currencyTwo.selectedIndex].dataset.rate,
    );
    const rate = rateTwo / rateOne;

    this.displayRate.innerHTML = `1 ${this.currencyOne.value} = ${rate.toFixed(
      4,
    )} ${this.currencyTwo.value}`;
    this.amountTwo.value = (this.amountOne.value * rate).toFixed(2);
  }

  addEventListeners() {
    this.currencyOne.addEventListener('change', () => this.calculate());
    this.amountOne.addEventListener('input', () => this.calculate());
    this.currencyTwo.addEventListener('change', () => this.calculate());
    this.amountTwo.addEventListener('input', () => this.calculate());

    document.getElementById('swap').addEventListener('click', () => {
      [this.currencyOne.value, this.currencyTwo.value] = [
        this.currencyTwo.value,
        this.currencyOne.value,
      ];

      [this.amountOne.value, this.amountTwo.value] = [
        this.amountTwo.value,
        this.amountOne.value,
      ];

      this.calculate();
    });
  }

  async render() {
    const app = document.getElementById('app');

    app.innerHTML = `
       <h1>환율계산기</h1>
       <p>통화와 금액을 선택하세요</p>
       <div class="container">
         ${new CurrencyInput('one').render()}
         ${new SwapRate().render()}
         ${new CurrencyInput('two').render()}
         </div>
         ${new DisplayRate().render()}
     `;

    this.currencyOne = document.getElementById('currency-one');
    this.currencyTwo = document.getElementById('currency-two');
    this.amountOne = document.getElementById('amount-one');
    this.amountTwo = document.getElementById('amount-two');
    this.displayRate = document.getElementById('rate');

    await this.optionList();
    this.addEventListeners();
  }
}

const app = new App();
app.render();
