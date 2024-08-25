const currencyEl_one = document.getElementById("currency-one");
const amountEl_one = document.getElementById("amount-one");
const currencyEl_two = document.getElementById("currency-two");
const amountEl_two = document.getElementById("amount-two");
const rateEl = document.getElementById("rate");
const swap = document.getElementById("swap");

const getList = async () => {
  const res = await fetch("https://open.exchangerate-api.com/v6/latest");
  const rates = await res.json();
  const list = rates.rates; // 전체 정보가 필요하지 않기 때문에 rates 정보만 받기
  // console.log(list);
  return list;
};

optionList = async () => {
  const list = await getList();
  console.log(list);
  // 출력된 데이터 타입은 object
  // 1. for...in 루프 : 객체의 열거 가능한 속성들을 순회
  // 2. Object.keys() : 객체의 키들을 배열로 반환하고,
  //    이를 forEach나 다른 배열 메서드와 함께 사용
  // 3. Object.values() : 객체의 값들을 배열로 반환
  // 4. Object.entries(): 객체의 [key, value] 쌍을 배열로 반환

  // 5. for...of와 Object.entries() 조합
  // for (let [key, value] of Object.entries(obj)) {
  //     console.log(key, value);
  // }

  for (let key in list) {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    option1.value = key;
    option1.innerText = key;
    option1.setAttribute("data-rate", list[key]);
    option2.value = key;
    option2.innerText = key;
    option2.setAttribute("data-rate", list[key]);
    currencyEl_one.appendChild(option1);
    currencyEl_two.appendChild(option2);

    if (key === "USD") {
      option1.selected = true;
    }
    if (key === "KRW") {
      option2.selected = true;
    }
  }
  calculate();
};

optionList();

const calculate = () => {
  // 첫 번째 선택된 통화의 값(예: 'USD')을 가져옵니다.
  const currency_one = currencyEl_one.value;

  // 두 번째 선택된 통화의 값(예: 'KRW')을 가져옵니다.
  const currency_two = currencyEl_two.value;

  // 첫 번째 선택된 통화의 환율을 data-rate 속성에서 가져와 숫자로 변환합니다.
  const rate_one = parseFloat(
    currencyEl_one.options[currencyEl_one.selectedIndex].getAttribute(
      "data-rate"
    )
  );

  // 두 번째 선택된 통화의 환율을 data-rate 속성에서 가져와 숫자로 변환합니다.
  const rate_two = parseFloat(
    currencyEl_two.options[currencyEl_two.selectedIndex].getAttribute(
      "data-rate"
    )
  );

  // 두 통화 간의 환율을 계산합니다. (두 번째 통화 / 첫 번째 통화)
  const rate = rate_two / rate_one;

  // 계산된 환율을 화면에 표시합니다. 소수점 4자리까지 표시합니다.
  rateEl.innerText = `1 ${currency_one} = ${rate.toFixed(4)} ${currency_two}`;

  // 입력된 첫 번째 금액에 환율을 곱하여 두 번째 금액을 계산합니다.
  // 결과는 소수점 2자리까지 표시하고, 두 번째 입력 필드에 설정합니다.
  amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
};

currencyEl_one.addEventListener("change", calculate);
amountEl_one.addEventListener("input", calculate);
currencyEl_two.addEventListener("change", calculate);
amountEl_two.addEventListener("input", calculate);

swap.addEventListener("click", () => {
  // 통화 선택 교환
  const temp = currencyEl_one.value;
  currencyEl_one.value = currencyEl_two.value;
  currencyEl_two.value = temp;

  // 입력 값 교환
  const tempAmount = amountEl_one.value;
  amountEl_one.value = amountEl_two.value;
  amountEl_two.value = tempAmount;

  calculate();
});
