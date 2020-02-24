ux-dialog
=========
[demo](https://jsfiddle.net/uiwwnw/h1xtyosz/show)
타입스크립트기반의 유려한 팝업.
  
UxDialog는 html로 된 컨텐츠를 쉽게 팝업에 담아 띄울 수 있습니다.    
UxDialog는 버튼으로 팝업을 닫거나 컨펌기능을 실행할 수 있습니다.  
UxDialog는 쉬운 방법으로 기본속성지정 및 일회성 속성을 지정할 수 있습니다.  


### 실행
```javascript
//기본
var saveContentPopup = new UxDialog(
  {
    title:'제목',  // 선언할때의 속성은 기본속성이 됩니다. 오픈매소드 실행시 인자를 넘기지 않는다면 제목이라는 타이틀이 노출됩니다.
    content: '내용'
  }
);
saveContentPopup.open();

var justOpenPopup = new UxDialog();
justOpenPopup.open(
  {
    title:'제목', //오픈매소드에 넘긴 속성은 일회성이 됩니다. 다음번에 제목이라는 타이틀을 다시 작성해야합니다.
    content:'내용'
  }
);

var designedHtml = new UxDialog(
  {
    title:'공지', 
    content:'<div class="notice">...</div>'
  }
);
designedHtml.open();

```

### 컨텐츠 타입
```typescript
interface Button {
    callback?: Function;
    text?: string;
}
interface Contents {
    title?: string;          //타이틀
    content?: string | Node; //컨텐츠
    confirm?: Button | null; //확인버튼 사용여부
    cancel?: Button | null;  //취소버튼 사용여부
    close?: boolean;         //닫기버튼 사용여부
    dimClose?: boolean;      //딤 클릭 시 닫힘 여부
    selfClose?: number;      //몇초 뒤 닫힘 기능 시간
    closeKey?: number;       //닫힘버튼 키바인딩. keyCode 입력
    cancelKey?: number;      //취소버튼 키바인딩. keyCode 입력
    confirmKey?: number;     //확인버튼 키바인딩. keyCode 입력
    closed?: Function;     // 오픈 콜백
    opend?: Function;     // 클로즈 콜백
}
```

### 매소드
```typescript
class UxDialog {
    public open(Contents);
    public close();
}
```
