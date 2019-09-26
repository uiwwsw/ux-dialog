/*
 MIT License. 
 ux-dialog v0.1.8
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

      var dialog = "\n          <div class=\"ux-dialog\">\n            <div class=\"ux-dialog--content\">\n              <button type=\"button\" class=\"ux-dialog--close\">this dialog close</button>\n              <div class=\"ux-dialog--header\">".concat(contents.title, "</div>\n              <div class=\"ux-dialog--container\">").concat(contents.content, "</div>\n              <div class=\"ux-dialog--footer\">").concat(confirm).concat(cancel, "</div>\n              <i class=\"ux-dialog--loading\"></i>\n            </div>\n            <i class=\"ux-dialog--dim\"></i>\n          </div>\n        ");
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
      this.keyUpEvents = [];
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
        this.keyUpEvents.push(window.onkeyup);
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
            contents.cancel.callback && contents.cancel.callback();

            _this3.close();

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
        var keyUpLength = this.keyUpEvents.length;

        if (this.keyUpEvents.length) {
          window.onkeyup = this.keyUpEvents[keyUpLength - 1];
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRUZXh0IiwiY29uZmlybSIsImNhbmNlbCIsImNvbnRlbnRzVHlwZSIsImRpbUNsb3NlIiwidGl0bGUiLCJjb250ZW50IiwiY2FsbGJhY2siLCJ0ZXh0Iiwic2VsZkNsb3NlIiwiY2xvc2VLZXkiLCJjYW5jZWxLZXkiLCJjb25maXJtS2V5IiwiVXhEaWFsb2ciLCJjb250ZW50cyIsImdldERlZmF1bHRDb250ZW50cyIsIm9iamVjdCIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJ2YWwiLCJrZXkiLCJ2YWx1ZSIsImNoZWNrVHlwZSIsInR5cGUiLCJkaWFsb2ciLCJodG1sVG9FbGVtZW50IiwiYm9keSIsImRvY3VtZW50IiwiZWxlbWVudCIsIm1ha2VOb2RlIiwiYXBwZW5kQ2hpbGQiLCJrZXlVcEV2ZW50cyIsIndpbmRvdyIsIm9ua2V5dXAiLCJwdXNoIiwiZSIsImtleUNvZGUiLCJjbG9zZSIsInF1ZXJ5U2VsZWN0b3IiLCJvbmNsaWNrIiwibmFtZSIsInRhcmdldCIsIm9uY2UiLCJhc3NpZ24iLCJhcHBlbmQiLCJiaW5kRXZlbnQiLCJjbGVhclRpbWVvdXQiLCJzdG8iLCJzdHlsZSIsImFuaW1hdGlvbkR1cmF0aW9uIiwic2V0VGltZW91dCIsImtleVVwTGVuZ3RoIiwibGVuZ3RoIiwiY2xhc3NMaXN0IiwiYWRkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZSIsInN0ciIsInRlbXBsYXRlIiwiY3JlYXRlRWxlbWVudCIsInRyaW0iLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBTUEsV0FBVyxHQUFHO0FBQ2hCQyxFQUFBQSxPQUFPLEVBQUUsSUFETztBQUVoQkMsRUFBQUEsTUFBTSxFQUFFO0FBRlEsQ0FBcEI7QUFLQSxJQUFNQyxZQUFZLEdBQUc7QUFDakJGLEVBQUFBLE9BQU8sRUFBRSxTQURRO0FBRWpCQyxFQUFBQSxNQUFNLEVB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ckQsT0FBVCxDQUFpQnlELFVBQXhCO0FBQ0giLCJmaWxlIjoidXgtZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIEJ1dHRvbiB7XHJcbiAgICBjYWxsYmFjaz86IEZ1bmN0aW9uO1xyXG4gICAgdGV4dD86IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIENvbnRlbnRzIHtcclxuICAgIHRpdGxlPzogc3RyaW5nO1xyXG4gICAgY29udGVudD86IHN0cmluZyB8IE5vZGU7XHJcbiAgICBjb25maXJtPzogQnV0dG9uIHwgbnVsbDtcclxuICAgIGNhbmNlbD86IEJ1dHRvbiB8IG51bGw7XHJcbiAgICBkaW1DbG9zZT86IGJvb2xlYW47XHJcbiAgICBzZWxmQ2xvc2U/OiBudW1iZXI7XHJcbiAgICBjbG9zZUtleT86IG51bWJlcjtcclxuICAgIGNhbmNlbEtleT86IG51bWJlcjtcclxuICAgIGNvbmZpcm1LZXk/OiBudW1iZXI7XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRUZXh0ID0ge1xyXG4gICAgY29uZmlybTogJ+2ZleyduCcsXHJcbiAgICBjYW5jZWw6ICfst6jshownXHJcbn07XHJcblxyXG5jb25zdCBjb250ZW50c1R5cGUgPSB7XHJcbiAgICBjb25maXJtOiAnYm9vbGVhbicsXHJcbiAgICBjYW5jZWw6ICdib29sZWFuJyxcclxuICAgIGRpbUNsb3NlOiAnYm9vbGVhbicsXHJcbiAgICB0aXRsZTogJ3N0cmluZycsXHJcbiAgICBjb250ZW50OiAnc3RyaW5nJyxcclxuICAgIGNhbGxiYWNrOiAnZnVuY3Rpb24nLFxyXG4gICAgdGV4dDogJ3N0cmluZycsXHJcbiAgICBzZWxmQ2xvc2U6ICdudW1iZXInLFxyXG4gICAgY2xvc2VLZXk6ICdudW1iZXInLFxyXG4gICAgY2FuY2VsS2V5OiAnbnVtYmVyJyxcclxuICAgIGNvbmZpcm1LZXk6ICdudW1iZXInXHJcbn07XHJcblxyXG5jbGFzcyBVeERpYWxvZyB7XHJcbiAgICBwcml2YXRlIGtleVVwRXZlbnRzOiBhbnlbXTtcclxuICAgIHByaXZhdGUgc3RvOiBhbnk7XHJcbiAgICBwcml2YXRlIGVsZW1lbnQ6IGFueTtcclxuICAgIHByaXZhdGUgY29udGVudHM6IENvbnRlbnRzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRlbnRzOiBDb250ZW50cykge1xyXG4gICAgICAgIHRoaXMuZ2V0RGVmYXVsdENvbnRlbnRzKGNvbnRlbnRzIHx8IHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrVHlwZShvYmplY3Q6IG9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG9iamVjdCkubWFwKCh2YWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gdmFsWzBdO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbFsxXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUeXBlKHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBjb250ZW50c1R5cGVba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgJHt2YWx1ZX3ripQgJHt0eXBlfeydtCDslYTri5nri4jri6QuYFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYWtlTm9kZShjb250ZW50czogQ29udGVudHMpOiBhbnkge1xyXG4gICAgICAgIGxldCBjb25maXJtID0gJyc7XHJcbiAgICAgICAgbGV0IGNhbmNlbCA9ICcnO1xyXG4gICAgICAgIGlmIChjb250ZW50cy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIGNvbmZpcm0gPSBgPGJ1dHRvbiBuYW1lPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj4ke2NvbnRlbnRzLmNvbmZpcm0udGV4dCB8fCBkZWZhdWx0VGV4dC5jb25maXJtfTwvYnV0dG9uPmBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbnRlbnRzLmNhbmNlbCkge1xyXG4gICAgICAgICAgICBjYW5jZWwgPSBgPGJ1dHRvbiBuYW1lPVwiY2FuY2VsXCIgdHlwZT1cImJ1dHRvblwiPiR7Y29udGVudHMuY2FuY2VsLnRleHQgfHwgZGVmYXVsdFRleHQuY2FuY2VsfTwvYnV0dG9uPmBcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZGlhbG9nID0gYFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ1eC1kaWFsb2ctLWNsb3NlXCI+dGhpcyBkaWFsb2cgY2xvc2U8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1oZWFkZXJcIj4ke2NvbnRlbnRzLnRpdGxlfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWNvbnRhaW5lclwiPiR7Y29udGVudHMuY29udGVudH08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1mb290ZXJcIj4ke2NvbmZpcm19JHtjYW5jZWx9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ1eC1kaWFsb2ctLWxvYWRpbmdcIj48L2k+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cInV4LWRpYWxvZy0tZGltXCI+PC9pPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgICAgICByZXR1cm4gVXhEaWFsb2cuaHRtbFRvRWxlbWVudChkaWFsb2cpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBodG1sVG9FbGVtZW50KHN0cjogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XHJcbiAgICAgICAgc3RyID0gc3RyLnRyaW0oKTtcclxuICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XHJcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFwcGVuZChjb250ZW50czogQ29udGVudHMpIHtcclxuICAgICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSB0aGlzLm1ha2VOb2RlKGNvbnRlbnRzKTtcclxuICAgICAgICBib2R5LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0Q29udGVudHMoY29udGVudHM6IENvbnRlbnRzKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jaGVja1R5cGUoY29udGVudHMpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5rZXlVcEV2ZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29udGVudHMgPSB7fTtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhjb250ZW50cykubWFwKCh2YWwpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZW50c1t2YWxbMF1dID0gdmFsWzFdO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYmluZEV2ZW50KGNvbnRlbnRzPzogQ29udGVudHMpIHtcclxuICAgICAgICBpZiAod2luZG93Lm9ua2V5dXApIHtcclxuICAgICAgICAgICAgdGhpcy5rZXlVcEV2ZW50cy5wdXNoKHdpbmRvdy5vbmtleXVwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93Lm9ua2V5dXAgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzLmNsb3NlS2V5ID09PSBlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udGVudHMuY2FuY2VsS2V5ID09PSBlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2spICYmIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2soKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzLmNvbmZpcm1LZXkgPT09IGUua2V5Q29kZSkge1xyXG4gICAgICAgICAgICAgICAgKGNvbnRlbnRzLmNvbmZpcm0uY2FsbGJhY2spICYmIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoY29udGVudHMuZGltQ2xvc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWRpbScpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1jbG9zZScpLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1mb290ZXInKS5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGUudGFyZ2V0Lm5hbWU7XHJcbiAgICAgICAgICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY29uZmlybSc6XHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRlbnRzLmNvbmZpcm0uY2FsbGJhY2spICYmIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnY2FuY2VsJzpcclxuICAgICAgICAgICAgICAgICAgICAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3Blbihjb250ZW50cz86IENvbnRlbnRzKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgb25jZTogQ29udGVudHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbnRlbnRzKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHlwZShjb250ZW50cyk7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhjb250ZW50cykubWFwKCh2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB2YWxbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWxbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudHNba2V5XSAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25jZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hcHBlbmQob25jZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50KG9uY2UpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9uY2Uuc2VsZkNsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zdG8pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWxvYWRpbmcnKS5zdHlsZS5hbmltYXRpb25EdXJhdGlvbiA9IG9uY2Uuc2VsZkNsb3NlIC8gMTAwMCArICdzJztcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RvID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSwgb25jZS5zZWxmQ2xvc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjbG9zZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xyXG4gICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleVVwTGVuZ3RoID0gdGhpcy5rZXlVcEV2ZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmtleVVwRXZlbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93Lm9ua2V5dXAgPSB0aGlzLmtleVVwRXZlbnRzW2tleVVwTGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cub25rZXl1cCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjbG9zZScpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWRpbScpLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuIl19
