![alt text](image.png)

컴포넌트는 총 4개로 정리된다고 봤다.

1. 환율 계산기 전체 컨테이너

2. Select box 밑 input 창

3. 바꾸기 버튼

4. 2번에서 input 값 변경 및 select 값 변경시에 단위별 환율 보여주는 창

컴포넌트는 (1) 외관 (2) 기능으로 나눌 수 있다.
컴포넌트 분리해서 함수형 프로그래밍을 하는 이유는 반복 및 유지 보수에 강점이 있기 때문이다.

2번에서 일어나는 이벤트가 4번에 전달되야 하고,
3번에서 일어나는 이번트가 2번과 4번에 전달되야 한다.
이런 것들에 대해서 핸들링하려면 2,3,4의 부모인 1번이 이것을 핸들링해야 한다.

# 주의점

          app.innerHTML = `
            <h1>환율계산기</h1>
            <p>통화와 금액을 선택하세요</p>
            <div class="container">
                ${this.currencyOne.render()}
                ${this.swap.render()}
                ${this.currencyTwo.render()}
            </div>
            ${this.rate.render()}
            `;

위 처럼 사용하고 싶은 경우
this.swap.render() 는 아래와 같이 작성되야 한다.
render() {
return `<div class="rate" id="rate"></div>
         `;

아래와 같이 작성하면 dom 객체가 리턴되기 때문에 객체를 toString() 한 [object HTMLDivElement] 문자열이 출력됨.
const element = document.createElement("div");
element.classList.add("rate");
element.id = "rate";
return element;
