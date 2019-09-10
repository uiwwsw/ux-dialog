/*
 MIT License. 
 ux-dialog v0.1.6
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

      window.onkeyup = function (e) {
        console.log(e.keyCode);

        if (contents.closeKey === e.keyCode) {
          _this3.close();
        }

        if (contents.cancelKey) {
          contents.cancel.callback && contents.cancel.callback();

          _this3.close();
        }

        if (contents.confirmKey) {
          contents.confirm.callback && contents.confirm.callback();
        }
      };

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRUZXh0IiwiY29uZmlybSIsImNhbmNlbCIsImNvbnRlbnRzVHlwZSIsInRpdGxlIiwiY29udGVudCIsImNhbGxiYWNrIiwidGV4dCIsInNlbGZDbG9zZSIsImNsb3NlS2V5IiwiY2FuY2VsS2V5IiwiY29uZmlybUtleSIsIlV4RGlhbG9nIiwiY29udGVudHMiLCJnZXREZWZhdWx0Q29udGVudHMiLCJvYmplY3QiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwidmFsIiwia2V5IiwidmFsdWUiLCJjaGVja1R5cGUiLCJ0eXBlIiwiZGlhbG9nIiwiaHRtbFRvRWxlbWVudCIsImJvZHkiLCJkb2N1bWVudCIsImVsZW1lbnQiLCJtYWtlTm9kZSIsImFwcGVuZENoaWxkIiwid2luZG93Iiwib25rZXl1cCIsImUiLCJjb25zb2xlIiwibG9nIiwia2V5Q29kZSIsImNsb3NlIiwicXVlcnlTZWxlY3RvciIsIm9uY2xpY2siLCJuYW1lIiwidGFyZ2V0Iiwib25jZSIsImFzc2lnbiIsImFwcGVuZCIsImJpbmRFdmVudCIsImNsZWFyVGltZW91dCIsInN0byIsInN0eWxlIiwiYW5pbWF0aW9uRHVyYXRpb24iLCJzZXRUaW1lb3V0IiwiY2xhc3NMaXN0IiwiYWRkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZSIsInN0ciIsInRlbXBsYXRlIiwiY3JlYXRlRWxlbWVudCIsInRyaW0iLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsSUFBTUEsV0FBVyxHQUFHO0FBQ2hCQyxFQUFBQSxPQUFPLEVBQUUsSUFETztBQUVoQkMsRUFBQUEsTUFBTSxFQUFFO0FBRlEsQ0FBcEI7QUFLQSxJQUFNQyxZQUFZLEdBQUc7QUFDakJGLEVBQUFBLE9BQU8sRUFBRSxTQURRO0FBRWpCQyxFQUFBQSxNQUFNLEVBQUUsU0FGUztBQUdqQkUsRUFBQUEsS0FBSyxFQUFFLFFBSFU7QUFJ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QUFDVSxhQUFSLENBQXNCLGlCQUF0QixFQUF5Q2UsZ0JBQXpDLENBQTBELGNBQTFELEVBQTBFLFlBQUs7QUFDM0V6QixVQUFBQSxPQUFPLENBQUMwQixNQUFSO0FBQ0gsU0FGRDtBQUdBLGFBQUsxQixPQUFMLEdBQWUsSUFBZjtBQUNIO0FBQ0o7OztrQ0F4Rm9CMkIsRyxFQUFXO0FBQzVCLFVBQU1DLFFBQVEsR0FBRzdCLFFBQVEsQ0FBQzhCLGFBQVQsQ0FBdUIsVUFBdkIsQ0FBakI7QUFDQUYsTUFBQUEsR0FBRyxHQUFHQSxHQUFHLENBQUNHLElBQUosRUFBTjtBQUNBRixNQUFBQSxRQUFRLENBQUNHLFNBQVQsR0FBcUJKLEdBQXJCO0FBQ0EsYUFBT0MsUUFBUSxDQUFDbkQsT0FBVCxDQUFpQnVELFVBQXhCO0FBQ0giLCJmaWxlIjoidXgtZGlhbG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIEJ1dHRvbiB7XHJcbiAgICBjYWxsYmFjaz86IEZ1bmN0aW9uO1xyXG4gICAgdGV4dD86IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIENvbnRlbnRzIHtcclxuICAgIHRpdGxlPzogc3RyaW5nO1xyXG4gICAgY29udGVudD86IHN0cmluZyB8IE5vZGU7XHJcbiAgICBjb25maXJtPzogQnV0dG9uIHwgbnVsbDtcclxuICAgIGNhbmNlbD86IEJ1dHRvbiB8IG51bGw7XHJcbiAgICBzZWxmQ2xvc2U/OiBudW1iZXI7XHJcbiAgICBjbG9zZUtleT86IG51bWJlcjtcclxuICAgIGNhbmNlbEtleT86IG51bWJlcjtcclxuICAgIGNvbmZpcm1LZXk/OiBudW1iZXI7XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRUZXh0ID0ge1xyXG4gICAgY29uZmlybTogJ+2ZleyduCcsXHJcbiAgICBjYW5jZWw6ICfst6jshownXHJcbn07XHJcblxyXG5jb25zdCBjb250ZW50c1R5cGUgPSB7XHJcbiAgICBjb25maXJtOiAnYm9vbGVhbicsXHJcbiAgICBjYW5jZWw6ICdib29sZWFuJyxcclxuICAgIHRpdGxlOiAnc3RyaW5nJyxcclxuICAgIGNvbnRlbnQ6ICdzdHJpbmcnLFxyXG4gICAgY2FsbGJhY2s6ICdmdW5jdGlvbicsXHJcbiAgICB0ZXh0OiAnc3RyaW5nJyxcclxuICAgIHNlbGZDbG9zZTogJ251bWJlcicsXHJcbiAgICBjbG9zZUtleTogJ251bWJlcicsXHJcbiAgICBjYW5jZWxLZXk6ICdudW1iZXInLFxyXG4gICAgY29uZmlybUtleTogJ251bWJlcidcclxufTtcclxuXHJcbmNsYXNzIFV4RGlhbG9nIHtcclxuICAgIHByaXZhdGUgc3RvOiBhbnk7XHJcbiAgICBwcml2YXRlIGVsZW1lbnQ6IGFueTtcclxuICAgIHByaXZhdGUgY29udGVudHM6IENvbnRlbnRzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGNvbnRlbnRzOiBDb250ZW50cykge1xyXG4gICAgICAgIHRoaXMuZ2V0RGVmYXVsdENvbnRlbnRzKGNvbnRlbnRzIHx8IHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNoZWNrVHlwZShvYmplY3Q6IG9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG9iamVjdCkubWFwKCh2YWwpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gdmFsWzBdO1xyXG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbFsxXTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUeXBlKHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBjb250ZW50c1R5cGVba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBgJHt2YWx1ZX3ripQgJHt0eXBlfeydtCDslYTri5nri4jri6QuYFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBtYWtlTm9kZShjb250ZW50czogQ29udGVudHMpOiBhbnkge1xyXG4gICAgICAgIGxldCBjb25maXJtID0gJyc7XHJcbiAgICAgICAgbGV0IGNhbmNlbCA9ICcnO1xyXG4gICAgICAgIGlmIChjb250ZW50cy5jb25maXJtKSB7XHJcbiAgICAgICAgICAgIGNvbmZpcm0gPSBgPGJ1dHRvbiBuYW1lPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj4ke2NvbnRlbnRzLmNvbmZpcm0udGV4dCB8fCBkZWZhdWx0VGV4dC5jb25maXJtfTwvYnV0dG9uPmBcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbnRlbnRzLmNhbmNlbCkge1xyXG4gICAgICAgICAgICBjYW5jZWwgPSBgPGJ1dHRvbiBuYW1lPVwiY2FuY2VsXCIgdHlwZT1cImJ1dHRvblwiPiR7Y29udGVudHMuY2FuY2VsLnRleHQgfHwgZGVmYXVsdFRleHQuY2FuY2VsfTwvYnV0dG9uPmBcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZGlhbG9nID0gYFxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZ1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ1eC1kaWFsb2ctLWNsb3NlXCI+dGhpcyBkaWFsb2cgY2xvc2U8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1oZWFkZXJcIj4ke2NvbnRlbnRzLnRpdGxlfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWNvbnRhaW5lclwiPiR7Y29udGVudHMuY29udGVudH08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1mb290ZXJcIj4ke2NvbmZpcm19JHtjYW5jZWx9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ1eC1kaWFsb2ctLWxvYWRpbmdcIj48L2k+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cInV4LWRpYWxvZy0tZGltXCI+PC9pPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgICAgICByZXR1cm4gVXhEaWFsb2cuaHRtbFRvRWxlbWVudChkaWFsb2cpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBodG1sVG9FbGVtZW50KHN0cjogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XHJcbiAgICAgICAgc3RyID0gc3RyLnRyaW0oKTtcclxuICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XHJcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFwcGVuZChjb250ZW50czogQ29udGVudHMpIHtcclxuICAgICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQuYm9keTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSB0aGlzLm1ha2VOb2RlKGNvbnRlbnRzKTtcclxuICAgICAgICBib2R5LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0Q29udGVudHMoY29udGVudHM6IENvbnRlbnRzKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jaGVja1R5cGUoY29udGVudHMpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb250ZW50cyA9IHt9O1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNvbnRlbnRzKS5tYXAoKHZhbCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzW3ZhbFswXV0gPSB2YWxbMV07XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBiaW5kRXZlbnQoY29udGVudHM/OiBDb250ZW50cykge1xyXG4gICAgICAgIHdpbmRvdy5vbmtleXVwID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUua2V5Q29kZSk7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50cy5jbG9zZUtleSA9PT0gZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzLmNhbmNlbEtleSkge1xyXG4gICAgICAgICAgICAgICAgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaykgJiYgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udGVudHMuY29uZmlybUtleSkge1xyXG4gICAgICAgICAgICAgICAgKGNvbnRlbnRzLmNvbmZpcm0uY2FsbGJhY2spICYmIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tY2xvc2UnKS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tZm9vdGVyJykub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBlLnRhcmdldC5uYW1lO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbmZpcm0nOlxyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NhbmNlbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaykgJiYgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oY29udGVudHM/OiBDb250ZW50cyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgbGV0IG9uY2U6IENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb250ZW50cyk7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1R5cGUoY29udGVudHMpO1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoY29udGVudHMpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdmFsWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRzW2tleV0gIT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2Vba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKG9uY2UpO1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudChvbmNlKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvbmNlLnNlbGZDbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc3RvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1sb2FkaW5nJykuc3R5bGUuYW5pbWF0aW9uRHVyYXRpb24gPSBvbmNlLnNlbGZDbG9zZSAvIDEwMDAgKyAncyc7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0byA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0sIG9uY2Uuc2VsZkNsb3NlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Nsb3NlJyk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tZGltJykuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=
