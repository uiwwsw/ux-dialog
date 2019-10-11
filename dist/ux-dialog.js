/*
 MIT License. 
 ux-dialog v0.1.12
 author: uiwwsw
 homepage:https://github.com/uiwwsw/ux-dialog#readme
 */ "use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var defaultText = {
  confirm: '확인',
  cancel: '취소'
};
var contentsType = {
  confirm: 'boolean',
  cancel: 'boolean',
  close: 'boolean',
  dimClose: 'boolean',
  title: 'string',
  content: 'string',
  callback: 'function',
  text: 'string',
  selfClose: 'number',
  closeKey: 'number',
  cancelKey: 'number',
  confirmKey: 'number'
};

var UxDialog =
/*#__PURE__*/
function () {
  function UxDialog(contents) {
    _classCallCheck(this, UxDialog);

    if (!UxDialog.keyUpEvents) {
      UxDialog.keyUpEvents = [];
    }

    this.getDefaultContents(contents || {});
  }

  _createClass(UxDialog, [{
    key: "checkType",
    value: function checkType(object) {
      var _this = this;

      Object.entries(object).map(function (val) {
        var key = val[0];
        var value = val[1];

        if (_typeof(value) === 'object') {
          _this.checkType(value);
        } else {
          var type = contentsType[key];

          if (_typeof(value) !== type) {
            throw "".concat(value, "\uB294 ").concat(type, "\uC774 \uC544\uB2D9\uB2C8\uB2E4.");
          }
        }
      });
    }
  }, {
    key: "makeNode",
    value: function makeNode(contents) {
      var confirm = '';
      var cancel = '';

      if (contents.confirm) {
        confirm = "<button name=\"confirm\" type=\"button\">".concat(contents.confirm.text || defaultText.confirm, "</button>");
      }

      if (contents.cancel) {
        cancel = "<button name=\"cancel\" type=\"button\">".concat(contents.cancel.text || defaultText.cancel, "</button>");
      }

      var dialog = " \n          <div class=\"ux-dialog\">\n            <div class=\"ux-dialog--content\">\n              <button type=\"button\" class=\"ux-dialog--close\" ".concat(contents.close === false && 'style="display: none;"', ">this dialog close</button>\n              <div class=\"ux-dialog--header\">").concat(contents.title, "</div>\n              <div class=\"ux-dialog--container\">").concat(contents.content, "</div>\n              <div class=\"ux-dialog--footer\">").concat(confirm).concat(cancel, "</div>\n              <i class=\"ux-dialog--loading\"></i>\n            </div>\n            <i class=\"ux-dialog--dim\"></i>\n          </div>\n        ");
      return UxDialog.htmlToElement(dialog);
    }
  }, {
    key: "append",
    value: function append(contents) {
      var body = document.body;
      this.element = this.makeNode(contents);
      body.appendChild(this.element);
    }
  }, {
    key: "getDefaultContents",
    value: function getDefaultContents(contents) {
      var _this2 = this;

      this.checkType(contents);
      this.element = null;
      this.contents = {};
      Object.entries(contents).map(function (val) {
        _this2.contents[val[0]] = val[1];
      });
    }
  }, {
    key: "bindEvent",
    value: function bindEvent(contents) {
      var _this3 = this;

      if (window.onkeyup) {
        UxDialog.keyUpEvents.push(window.onkeyup);
      }

      window.onkeyup = function (e) {
        if (contents.closeKey === e.keyCode) {
          _this3.close();

          return;
        }

        if (contents.cancelKey === e.keyCode) {
          contents.cancel.callback && contents.cancel.callback();

          _this3.close();

          return;
        }

        if (contents.confirmKey === e.keyCode) {
          contents.confirm.callback && contents.confirm.callback();
          return;
        }
      };

      if (contents.dimClose) {
        this.element.querySelector('.ux-dialog--dim').onclick = function () {
          _this3.close();
        };
      }

      this.element.querySelector('.ux-dialog--close').onclick = function () {
        _this3.close();
      };

      this.element.querySelector('.ux-dialog--footer').onclick = function (e) {
        var name = e.target.name;

        switch (name) {
          case 'confirm':
            contents.confirm.callback && contents.confirm.callback();
            break;

          case 'cancel':
            _this3.close();

            contents.cancel.callback && contents.cancel.callback();
            break;
        }
      };
    }
  }, {
    key: "open",
    value: function open(contents) {
      var _this4 = this;

      if (this.element === null) {
        var once = Object.assign({}, this.contents);

        if (contents) {
          this.checkType(contents);
          Object.entries(contents).map(function (val) {
            var key = val[0];
            var value = val[1];

            if (_this4.contents[key] !== value) {
              once[key] = value;
            }
          });
        }

        this.append(once);
        this.bindEvent(once);

        if (once.selfClose) {
          clearTimeout(this.sto);
          this.element.querySelector('.ux-dialog--loading').style.animationDuration = once.selfClose / 1000 + 's';
          this.sto = setTimeout(function () {
            _this4.close();
          }, once.selfClose);
        }
      }
    }
  }, {
    key: "close",
    value: function close() {
      var element = this.element;

      if (element) {
        var keyUpLength = UxDialog.keyUpEvents.length;

        if (keyUpLength) {
          window.onkeyup = UxDialog.keyUpEvents.pop();
        } else {
          window.onkeyup = null;
        }

        element.classList.add('close');
        element.querySelector('.ux-dialog--dim').addEventListener('animationend', function () {
          element.remove();
        });
        this.element = null;
      }
    }
  }], [{
    key: "htmlToElement",
    value: function htmlToElement(str) {
      var template = document.createElement('template');
      str = str.trim();
      template.innerHTML = str;
      return template.content.firstChild;
    }
  }]);

  return UxDialog;
}();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRUZXh0IiwiY29uZmlybSIsImNhbmNlbCIsImNvbnRlbnRzVHlwZSIsImNsb3NlIiwiZGltQ2xvc2UiLCJ0aXRsZSIsImNvbnRlbnQiLCJjYWxsYmFjayIsInRleHQiLCJzZWxmQ2xvc2UiLCJjbG9zZUtleSIsImNhbmNlbEtleSIsImNvbmZpcm1LZXkiLCJVeERpYWxvZyIsImNvbnRlbnRzIiwia2V5VXBFdmVudHMiLCJnZXREZWZhdWx0Q29udGVudHMiLCJvYmplY3QiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwidmFsIiwia2V5IiwidmFsdWUiLCJjaGVja1R5cGUiLCJ0eXBlIiwiZGlhbG9nIiwiaHRtbFRvRWxlbWVudCIsImJvZHkiLCJkb2N1bWVudCIsImVsZW1lbnQiLCJtYWtlTm9kZSIsImFwcGVuZENoaWxkIiwid2luZG93Iiwib25rZXl1cCIsInB1c2giLCJlIiwia2V5Q29kZSIsInF1ZXJ5U2VsZWN0b3IiLCJvbmNsaWNrIiwibmFtZSIsInRhcmdldCIsIm9uY2UiLCJhc3NpZ24iLCJhcHBlbmQiLCJiaW5kRXZlbnQiLCJjbGVhclRpbWVvdXQiLCJzdG8iLCJzdHlsZSIsImFuaW1hdGlvbkR1cmF0aW9uIiwic2V0VGltZW91dCIsImtleVVwTGVuZ3RoIiwibGVuZ3RoIiwicG9wIiwiY2xhc3NMaXN0IiwiYWRkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZSIsInN0ciIsInRlbXBsYXRlIiwiY3JlYXRlRWxlbWVudCIsInRyaW0iLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsSUFBTUEsV0FBVyxHQUFHO0FBQ2hCQyxFQUFBQSxPQUFPLEVBQUUsSUFETztBQUVoQkMsRUFBQUEsTUFBTSxFQUFFO0FBRlEsQ0FBcEI7QUFLQSxJQUFNQyxZQUFZLEdBQUc7QUFDakJGLEVBQUFBLE9BQU8sRUFBRSxTQURRO0FBRWpCQyxFQUFBQSxN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UUFBUSxDQUFDK0IsYUFBVCxDQUF1QixVQUF2QixDQUFqQjtBQUNBRixNQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ0csSUFBSixFQUFOO0FBQ0FGLE1BQUFBLFFBQVEsQ0FBQ0csU0FBVCxHQUFxQkosR0FBckI7QUFDQSxhQUFPQyxRQUFRLENBQUNyRCxPQUFULENBQWlCeUQsVUFBeEI7QUFDSCIsImZpbGUiOiJ1eC1kaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgQnV0dG9uIHtcclxuICAgIGNhbGxiYWNrPzogRnVuY3Rpb247XHJcbiAgICB0ZXh0Pzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29udGVudHMge1xyXG4gICAgdGl0bGU/OiBzdHJpbmc7XHJcbiAgICBjb250ZW50Pzogc3RyaW5nIHwgTm9kZTtcclxuICAgIGNvbmZpcm0/OiBCdXR0b24gfCBudWxsO1xyXG4gICAgY2FuY2VsPzogQnV0dG9uIHwgbnVsbDtcclxuICAgIGNsb3NlPzogYm9vbGVhbjtcclxuICAgIGRpbUNsb3NlPzogYm9vbGVhbjtcclxuICAgIHNlbGZDbG9zZT86IG51bWJlcjtcclxuICAgIGNsb3NlS2V5PzogbnVtYmVyO1xyXG4gICAgY2FuY2VsS2V5PzogbnVtYmVyO1xyXG4gICAgY29uZmlybUtleT86IG51bWJlcjtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdFRleHQgPSB7XHJcbiAgICBjb25maXJtOiAn7ZmV7J24JyxcclxuICAgIGNhbmNlbDogJ+y3qOyGjCdcclxufTtcclxuXHJcbmNvbnN0IGNvbnRlbnRzVHlwZSA9IHtcclxuICAgIGNvbmZpcm06ICdib29sZWFuJyxcclxuICAgIGNhbmNlbDogJ2Jvb2xlYW4nLFxyXG4gICAgY2xvc2U6ICdib29sZWFuJyxcclxuICAgIGRpbUNsb3NlOiAnYm9vbGVhbicsXHJcbiAgICB0aXRsZTogJ3N0cmluZycsXHJcbiAgICBjb250ZW50OiAnc3RyaW5nJyxcclxuICAgIGNhbGxiYWNrOiAnZnVuY3Rpb24nLFxyXG4gICAgdGV4dDogJ3N0cmluZycsXHJcbiAgICBzZWxmQ2xvc2U6ICdudW1iZXInLFxyXG4gICAgY2xvc2VLZXk6ICdudW1iZXInLFxyXG4gICAgY2FuY2VsS2V5OiAnbnVtYmVyJyxcclxuICAgIGNvbmZpcm1LZXk6ICdudW1iZXInXHJcbn07XHJcblxyXG5jbGFzcyBVeERpYWxvZyB7XHJcbiAgICBzdGF0aWMga2V5VXBFdmVudHM6IGFueVtdO1xyXG4gICAgcHJpdmF0ZSBzdG86IGFueTtcclxuICAgIHByaXZhdGUgZWxlbWVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBjb250ZW50czogQ29udGVudHM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGVudHM6IENvbnRlbnRzKSB7XHJcbiAgICAgICAgaWYgKCFVeERpYWxvZy5rZXlVcEV2ZW50cykge1xyXG4gICAgICAgICAgICBVeERpYWxvZy5rZXlVcEV2ZW50cyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdldERlZmF1bHRDb250ZW50cyhjb250ZW50cyB8fCB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja1R5cGUob2JqZWN0OiBvYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhvYmplY3QpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHZhbFswXTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWxbMV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHlwZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gY29udGVudHNUeXBlW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYCR7dmFsdWV964qUICR7dHlwZX3snbQg7JWE64uZ64uI64ukLmBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFrZU5vZGUoY29udGVudHM6IENvbnRlbnRzKTogYW55IHtcclxuICAgICAgICBsZXQgY29uZmlybSA9ICcnO1xyXG4gICAgICAgIGxldCBjYW5jZWwgPSAnJztcclxuICAgICAgICBpZiAoY29udGVudHMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBjb25maXJtID0gYDxidXR0b24gbmFtZT1cImNvbmZpcm1cIiB0eXBlPVwiYnV0dG9uXCI+JHtjb250ZW50cy5jb25maXJtLnRleHQgfHwgZGVmYXVsdFRleHQuY29uZmlybX08L2J1dHRvbj5gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb250ZW50cy5jYW5jZWwpIHtcclxuICAgICAgICAgICAgY2FuY2VsID0gYDxidXR0b24gbmFtZT1cImNhbmNlbFwiIHR5cGU9XCJidXR0b25cIj4ke2NvbnRlbnRzLmNhbmNlbC50ZXh0IHx8IGRlZmF1bHRUZXh0LmNhbmNlbH08L2J1dHRvbj5gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IGAgXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInV4LWRpYWxvZy0tY2xvc2VcIiAkeyhjb250ZW50cy5jbG9zZSA9PT0gZmFsc2UpICYmICgnc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiJyl9PnRoaXMgZGlhbG9nIGNsb3NlPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0taGVhZGVyXCI+JHtjb250ZW50cy50aXRsZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1jb250YWluZXJcIj4ke2NvbnRlbnRzLmNvbnRlbnR9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0tZm9vdGVyXCI+JHtjb25maXJtfSR7Y2FuY2VsfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwidXgtZGlhbG9nLS1sb2FkaW5nXCI+PC9pPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJ1eC1kaWFsb2ctLWRpbVwiPjwvaT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgcmV0dXJuIFV4RGlhbG9nLmh0bWxUb0VsZW1lbnQoZGlhbG9nKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaHRtbFRvRWxlbWVudChzdHI6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xyXG4gICAgICAgIHN0ciA9IHN0ci50cmltKCk7XHJcbiAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gc3RyO1xyXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmZpcnN0Q2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhcHBlbmQoY29udGVudHM6IENvbnRlbnRzKSB7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gdGhpcy5tYWtlTm9kZShjb250ZW50cyk7XHJcbiAgICAgICAgYm9keS5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0RGVmYXVsdENvbnRlbnRzKGNvbnRlbnRzOiBDb250ZW50cyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2hlY2tUeXBlKGNvbnRlbnRzKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29udGVudHMgPSB7fTtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhjb250ZW50cykubWFwKCh2YWwpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50c1t2YWxbMF1dID0gdmFsWzFdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZEV2ZW50KGNvbnRlbnRzPzogQ29udGVudHMpIHtcclxuICAgICAgICBpZiAod2luZG93Lm9ua2V5dXApIHtcclxuICAgICAgICAgICAgVXhEaWFsb2cua2V5VXBFdmVudHMucHVzaCh3aW5kb3cub25rZXl1cCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5vbmtleXVwID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50cy5jbG9zZUtleSA9PT0gZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzLmNhbmNlbEtleSA9PT0gZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50cy5jb25maXJtS2V5ID09PSBlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGNvbnRlbnRzLmRpbUNsb3NlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1kaW0nKS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tY2xvc2UnKS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tZm9vdGVyJykub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBlLnRhcmdldC5uYW1lO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbmZpcm0nOlxyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NhbmNlbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2spICYmIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2soKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oY29udGVudHM/OiBDb250ZW50cyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IG9uY2U6IENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb250ZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1R5cGUoY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoY29udGVudHMpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdmFsWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRzW2tleV0gIT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2Vba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKG9uY2UpO1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudChvbmNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvbmNlLnNlbGZDbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc3RvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1sb2FkaW5nJykuc3R5bGUuYW5pbWF0aW9uRHVyYXRpb24gPSBvbmNlLnNlbGZDbG9zZSAvIDEwMDAgKyAncyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0byA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0sIG9uY2Uuc2VsZkNsb3NlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBrZXlVcExlbmd0aCA9IFV4RGlhbG9nLmtleVVwRXZlbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGtleVVwTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cub25rZXl1cCA9IFV4RGlhbG9nLmtleVVwRXZlbnRzLnBvcCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2luZG93Lm9ua2V5dXAgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2xvc2UnKTtcclxuICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1kaW0nKS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==
