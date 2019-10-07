ux-dialog
=========
[demo](https://jsfiddle.net/uiwwnw/h1xtyosz/show)
타입스크립트로 제작된 팝업

### 실행
```javascript
var popup = new UxDialog({contents});
```

### 옵션리스트
```typescript
interface Button {
    callback?: Function;
    text?: string;
}
interface Contents {
    title?: string;
    content?: string | Node;
    confirm?: Button | null;
    cancel?: Button | null;
    close?: boolean;
    dimClose?: boolean;
    selfClose?: number;
    closeKey?: number;
    cancelKey?: number;
    confirmKey?: number;
}
```

### 매소드
```javascript

open(Contents?); //필요 시 contents 전달가능, 휘발성
```
