# CSS3 Examples

[Live demos with github pages](https://thatseeyou.github.io/css3-examples/)

## cssom

## font family

## paragraph
### line-height
여러 줄에 걸친 글을 감싸고 있는 p의 높이는 어떻게 결정되는가? font-size에 따라서 적당히 결정된다고 생각하지만 정확하게는 line-height에 의해서 결정되는 것이다. 
각 줄의 line-height의 총합이라고 할 수 있다. 대략 line-height의 기본값이 1.2(font-size의 120%)이기 때문에 font-size에 비례한다고 막연하게 생각하는 것이다. 그러면 개별 줄의 line-height는 어떻게 결정되는가? 다양한 inline 요소로 개별 줄은 구성이 될 수 있으며 각각의 inline 요소는 자신의 line-height를 갖는다.
개별 줄을 구성하는 inline 요소의 line-height 중에 가장 큰 값이 해당 줄의 line-height를 결정하게 되며 이 값이 container의 height를 결정짓게 되는 것이다.

줄간격을 line-height라고 이해를 하고 있지만 시작 줄의 위와 마지막 줄의 아래에도 공간이 생기게 되므로 line-height를 줄간격이라고 이해하는 것은 현상을 이해할 때 장애가 될 수 있다. 원어의 뜻 그대로 줄높이라고 불러야 한다고 본다.

line-height의 기본값은 정확하게 1.2는 아니다. 문서와 실제 결과를 보면 font-family에 따라서 다르다. 동일하게 font-size를 지정한 경우라도 container의 높이가 변경이 되고 이로 인해 이해하기 어려운 현상이 발생하기도 한다. 특히 영어만 사용하다 한글을 사용할 경우에 미묘하게 차이가 발생해서 전체 레이아웃이 틀어질 수도 있다. 반드시 line-height를 명시적으로 지정하도록 하자. 

명시적으로 line-height를 1.2로 지정하는 것은 기본값인 normal로 유지하는 것과는 엄염히 다르다. 특히 float로 box를 나열할 경우에 문제가 될 수 있다.

지금까지의 설명은 vertical-align의 기본값인 baseline에 대한 설명이다. inline 요소에 text가 존재하는 경우에 해당한다. Text가 존재하지 않는 inline-block가 있다면 bottom이 baseline이 되기 때문에 최종 line-height 계산이 위의 설명과 다를 수 있다. 

# 예제 작성 요령
\<style class="example"\>, \<p\>, \<div\> 순서로 작성해야 정상적으로 소스가 표시된다.

# Prism
CSS와 html을 페이지에 표시하기 위해서 [Prism](http://prismjs.com)을 사용하고 있다.

사용한 플러그인 2가지는 다음과 같다.
* [Normalize Whitespace](http://prismjs.com/plugins/normalize-whitespace/) : 불필요한 공백을 제거하기 위해서 사용
* [Toolbar](http://prismjs.com/plugins/toolbar/) : 버튼을 추가해서 뷰가 변경되도록 처리