/*
 MIT License. 
 ux-dialog v0.1.9
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
        if (!UxDialog.keyUpEvents) {
          UxDialog.keyUpEvents = [];
        }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRUZXh0IiwiY29uZmlybSIsImNhbmNlbCIsImNvbnRlbnRzVHlwZSIsImRpbUNsb3NlIiwidGl0bGUiLCJjb250ZW50IiwiY2FsbGJhY2siLCJ0ZXh0Iiwic2VsZkNsb3NlIiwiY2xvc2VLZXkiLCJjYW5jZWxLZXkiLCJjb25maXJtS2V5IiwiVXhEaWFsb2ciLCJjb250ZW50cyIsImdldERlZmF1bHRDb250ZW50cyIsIm9iamVjdCIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJ2YWwiLCJrZXkiLCJ2YWx1ZSIsImNoZWNrVHlwZSIsInR5cGUiLCJkaWFsb2ciLCJodG1sVG9FbGVtZW50IiwiYm9keSIsImRvY3VtZW50IiwiZWxlbWVudCIsIm1ha2VOb2RlIiwiYXBwZW5kQ2hpbGQiLCJ3aW5kb3ciLCJvbmtleXVwIiwia2V5VXBFdmVudHMiLCJwdXNoIiwiZSIsImtleUNvZGUiLCJjbG9zZSIsInF1ZXJ5U2VsZWN0b3IiLCJvbmNsaWNrIiwibmFtZSIsInRhcmdldCIsIm9uY2UiLCJhc3NpZ24iLCJhcHBlbmQiLCJiaW5kRXZlbnQiLCJjbGVhclRpbWVvdXQiLCJzdG8iLCJzdHlsZSIsImFuaW1hdGlvbkR1cmF0aW9uIiwic2V0VGltZW91dCIsImtleVVwTGVuZ3RoIiwibGVuZ3RoIiwicG9wIiwiY2xhc3NMaXN0IiwiYWRkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZSIsInN0ciIsInRlbXBsYXRlIiwiY3JlYXRlRWxlbWVudCIsInRyaW0iLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBTUEsV0FBVyxHQUFHO0FBQ2hCQyxFQUFBQSxPQUFPLEVBQUUsSUFETztBQUVoQkMsRUFBQUEsTUFBTSxFQUFFO0FBRlEsQ0FBcEI7QUFLQSxJQUFNQyxZQUFZLEdBQUc7QUFDakJGLEVBQUFBLE9BQU8sRUFBRSxTQURRO0FBRWpCQyxFQUFBQSxN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TjtBQUNBRixNQUFBQSxRQUFRLENBQUNHLFNBQVQsR0FBcUJKLEdBQXJCO0FBQ0EsYUFBT0MsUUFBUSxDQUFDdEQsT0FBVCxDQUFpQjBELFVBQXhCO0FBQ0giLCJmaWxlIjoidXgtZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIEJ1dHRvbiB7XHJcbiAgICBjYWxsYmFjaz86IEZ1bmN0aW9uO1xyXG4gICAgdGV4dD86IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIENvbnRlbnRzIHtcclxuICAgIHRpdGxlPzogc3RyaW5nO1xyXG4gICAgY29udGVudD86IHN0cmluZyB8IE5vZGU7XHJcbiAgICBjb25maXJtPzogQnV0dG9uIHwgbnVsbDtcclxuICAgIGNhbmNlbD86IEJ1dHRvbiB8IG51bGw7XHJcbiAgICBkaW1DbG9zZT86IGJvb2xlYW47XHJcbiAgICBzZWxmQ2xvc2U/OiBudW1iZXI7XHJcbiAgICBjbG9zZUtleT86IG51bWJlcjtcclxuICAgIGNhbmNlbEtleT86IG51bWJlcjtcclxuICAgIGNvbmZpcm1LZXk/OiBudW1iZXI7XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRUZXh0ID0ge1xyXG4gICAgY29uZmlybTogJ+2ZleyduCcsXHJcbiAgICBjYW5jZWw6ICfst6jshownXHJcbn07XHJcblxyXG5jb25zdCBjb250ZW50c1R5cGUgPSB7XHJcbiAgICBjb25maXJtOiAnYm9vbGVhbicsXHJcbiAgICBjYW5jZWw6ICdib29sZWFuJyxcclxuICAgIGRpbUNsb3NlOiAnYm9vbGVhbicsXHJcbiAgICB0aXRsZTogJ3N0cmluZycsXHJcbiAgICBjb250ZW50OiAnc3RyaW5nJyxcclxuICAgIGNhbGxiYWNrOiAnZnVuY3Rpb24nLFxyXG4gICAgdGV4dDogJ3N0cmluZycsXHJcbiAgICBzZWxmQ2xvc2U6ICdudW1iZXInLFxyXG4gICAgY2xvc2VLZXk6ICdudW1iZXInLFxyXG4gICAgY2FuY2VsS2V5OiAnbnVtYmVyJyxcclxuICAgIGNvbmZpcm1LZXk6ICdudW1iZXInXHJcbn07XHJcblxyXG5jbGFzcyBVeERpYWxvZyB7XHJcbiAgICBzdGF0aWMga2V5VXBFdmVudHM6IGFueVtdO1xyXG4gICAgcHJpdmF0ZSBzdG86IGFueTtcclxuICAgIHByaXZhdGUgZWxlbWVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBjb250ZW50czogQ29udGVudHM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGVudHM6IENvbnRlbnRzKSB7XHJcbiAgICAgICAgdGhpcy5nZXREZWZhdWx0Q29udGVudHMoY29udGVudHMgfHwge30pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tUeXBlKG9iamVjdDogb2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMob2JqZWN0KS5tYXAoKHZhbCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSB2YWxbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsWzFdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1R5cGUodmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IGNvbnRlbnRzVHlwZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGAke3ZhbHVlfeuKlCAke3R5cGV97J20IOyVhOuLmeuLiOuLpC5gXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1ha2VOb2RlKGNvbnRlbnRzOiBDb250ZW50cyk6IGFueSB7XHJcbiAgICAgICAgbGV0IGNvbmZpcm0gPSAnJztcclxuICAgICAgICBsZXQgY2FuY2VsID0gJyc7XHJcbiAgICAgICAgaWYgKGNvbnRlbnRzLmNvbmZpcm0pIHtcclxuICAgICAgICAgICAgY29uZmlybSA9IGA8YnV0dG9uIG5hbWU9XCJjb25maXJtXCIgdHlwZT1cImJ1dHRvblwiPiR7Y29udGVudHMuY29uZmlybS50ZXh0IHx8IGRlZmF1bHRUZXh0LmNvbmZpcm19PC9idXR0b24+YFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29udGVudHMuY2FuY2VsKSB7XHJcbiAgICAgICAgICAgIGNhbmNlbCA9IGA8YnV0dG9uIG5hbWU9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+JHtjb250ZW50cy5jYW5jZWwudGV4dCB8fCBkZWZhdWx0VGV4dC5jYW5jZWx9PC9idXR0b24+YFxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkaWFsb2cgPSBgXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInV4LWRpYWxvZy0tY2xvc2VcIj50aGlzIGRpYWxvZyBjbG9zZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWhlYWRlclwiPiR7Y29udGVudHMudGl0bGV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0tY29udGFpbmVyXCI+JHtjb250ZW50cy5jb250ZW50fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWZvb3RlclwiPiR7Y29uZmlybX0ke2NhbmNlbH08L2Rpdj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cInV4LWRpYWxvZy0tbG9hZGluZ1wiPjwvaT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwidXgtZGlhbG9nLS1kaW1cIj48L2k+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHJldHVybiBVeERpYWxvZy5odG1sVG9FbGVtZW50KGRpYWxvZyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGh0bWxUb0VsZW1lbnQoc3RyOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcclxuICAgICAgICBzdHIgPSBzdHIudHJpbSgpO1xyXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcclxuICAgICAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXBwZW5kKGNvbnRlbnRzOiBDb250ZW50cykge1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMubWFrZU5vZGUoY29udGVudHMpO1xyXG4gICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldERlZmF1bHRDb250ZW50cyhjb250ZW50czogQ29udGVudHMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNoZWNrVHlwZShjb250ZW50cyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbnRlbnRzID0ge307XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY29udGVudHMpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudHNbdmFsWzBdXSA9IHZhbFsxXTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRFdmVudChjb250ZW50cz86IENvbnRlbnRzKSB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5vbmtleXVwKSB7XHJcbiAgICAgICAgICAgIGlmICghVXhEaWFsb2cua2V5VXBFdmVudHMpIHtcclxuICAgICAgICAgICAgICAgIFV4RGlhbG9nLmtleVVwRXZlbnRzID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVXhEaWFsb2cua2V5VXBFdmVudHMucHVzaCh3aW5kb3cub25rZXl1cCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5vbmtleXVwID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50cy5jbG9zZUtleSA9PT0gZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzLmNhbmNlbEtleSA9PT0gZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50cy5jb25maXJtS2V5ID09PSBlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGNvbnRlbnRzLmRpbUNsb3NlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1kaW0nKS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tY2xvc2UnKS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tZm9vdGVyJykub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBlLnRhcmdldC5uYW1lO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbmZpcm0nOlxyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NhbmNlbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2spICYmIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2soKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oY29udGVudHM/OiBDb250ZW50cyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IG9uY2U6IENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb250ZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1R5cGUoY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoY29udGVudHMpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdmFsWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRzW2tleV0gIT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2Vba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKG9uY2UpO1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudChvbmNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvbmNlLnNlbGZDbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc3RvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1sb2FkaW5nJykuc3R5bGUuYW5pbWF0aW9uRHVyYXRpb24gPSBvbmNlLnNlbGZDbG9zZSAvIDEwMDAgKyAncyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0byA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0sIG9uY2Uuc2VsZkNsb3NlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBrZXlVcExlbmd0aCA9IFV4RGlhbG9nLmtleVVwRXZlbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgaWYgKGtleVVwTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cub25rZXl1cCA9IFV4RGlhbG9nLmtleVVwRXZlbnRzLnBvcCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2luZG93Lm9ua2V5dXAgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2xvc2UnKTtcclxuICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1kaW0nKS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==
