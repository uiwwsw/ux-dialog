/*
 MIT License. 
 ux-dialog v0.0.1
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
  text: 'string'
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

      var dialog = "\n          <div class=\"ux-dialog\">\n            <div class=\"ux-dialog--content\">\n              <button type=\"button\" class=\"ux-dialog--close\">this dialog close</button>\n              <div class=\"ux-dialog--header\">".concat(contents.title, "</div>\n              <div class=\"ux-dialog--container\">").concat(contents.content, "</div>\n              <div class=\"ux-dialog--footer\">").concat(confirm).concat(cancel, "</div>\n            </div>\n            <i class=\"ux-dialog--dim\"></i>\n          </div>\n        ");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRUZXh0IiwiY29uZmlybSIsImNhbmNlbCIsImNvbnRlbnRzVHlwZSIsInRpdGxlIiwiY29udGVudCIsImNhbGxiYWNrIiwidGV4dCIsIlV4RGlhbG9nIiwiY29udGVudHMiLCJnZXREZWZhdWx0Q29udGVudHMiLCJvYmplY3QiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwidmFsIiwia2V5IiwidmFsdWUiLCJjaGVja1R5cGUiLCJ0eXBlIiwiZGlhbG9nIiwiaHRtbFRvRWxlbWVudCIsImJvZHkiLCJkb2N1bWVudCIsImVsZW1lbnQiLCJtYWtlTm9kZSIsImFwcGVuZENoaWxkIiwicXVlcnlTZWxlY3RvciIsIm9uY2xpY2siLCJjbG9zZSIsImUiLCJuYW1lIiwidGFyZ2V0Iiwib25jZSIsImFzc2lnbiIsImFwcGVuZCIsImJpbmRFdmVudCIsImNsYXNzTGlzdCIsImFkZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmUiLCJzdHIiLCJ0ZW1wbGF0ZSIsImNyZWF0ZUVsZW1lbnQiLCJ0cmltIiwiaW5uZXJIVE1MIiwiZmlyc3RDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBWUEsSUFBTUEsV0FBVyxHQUFHO0FBQ2hCQyxFQUFBQSxPQUFPLEVBQUUsSUFETztBQUVoQkMsRUFBQUEsTUFBTSxFQUFFO0FBRlEsQ0FBcEI7QUFLQSxJQUFNQyxZQUFZLEdBQUc7QUFDakJGLEVBQUFBLE9BQU8sRUFBRSxTQURRO0FBRWpCQyxFQUFBQSxNQUFNLEVBQUUsU0FGUztBQUdqQkUsRUFBQUEsS0FBSyxFQUFFLFFBSFU7QUFJakJDLEVBQUFBLE9BQU8sRUFBRSxRQUpRO0FBS2pCQyxFQUFBQSxRQUFRLEVBQUUsVUFMTztBQU1qQkMsRUFBQUEsSUFBSSxFQUFFO0FBTlcsQ0FBckI7O0lBU01DLFE7OztBQUlGLG9CQUFZQyxRQUFaLEVBQThCO0FBQUE7O0FBQzFCLFNBQUtDLGtCQUFMLENBQXdCRCxRQUFR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QUFDNUIsVUFBTUMsUUFBUSxHQUFHbkIsUUFBUSxDQUFDb0IsYUFBVCxDQUF1QixVQUF2QixDQUFqQjtBQUNBRixNQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ0csSUFBSixFQUFOO0FBQ0FGLE1BQUFBLFFBQVEsQ0FBQ0csU0FBVCxHQUFxQkosR0FBckI7QUFDQSxhQUFPQyxRQUFRLENBQUNyQyxPQUFULENBQWlCeUMsVUFBeEI7QUFDSCIsImZpbGUiOiJ1eC1kaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgQnV0dG9uIHtcbiAgICBjYWxsYmFjaz86IEZ1bmN0aW9uO1xuICAgIHRleHQ/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBDb250ZW50cyB7XG4gICAgdGl0bGU/OiBzdHJpbmc7XG4gICAgY29udGVudD86IHN0cmluZyB8IE5vZGU7XG4gICAgY29uZmlybT86IEJ1dHRvbiB8IG51bGw7XG4gICAgY2FuY2VsPzogQnV0dG9uIHwgbnVsbDtcbn1cblxuY29uc3QgZGVmYXVsdFRleHQgPSB7XG4gICAgY29uZmlybTogJ+2ZleyduCcsXG4gICAgY2FuY2VsOiAn7Leo7IaMJ1xufTtcblxuY29uc3QgY29udGVudHNUeXBlID0ge1xuICAgIGNvbmZpcm06ICdib29sZWFuJyxcbiAgICBjYW5jZWw6ICdib29sZWFuJyxcbiAgICB0aXRsZTogJ3N0cmluZycsXG4gICAgY29udGVudDogJ3N0cmluZycsXG4gICAgY2FsbGJhY2s6ICdmdW5jdGlvbicsXG4gICAgdGV4dDogJ3N0cmluZycsXG59O1xuXG5jbGFzcyBVeERpYWxvZyB7XG4gICAgcHJpdmF0ZSBlbGVtZW50OiBhbnk7XG4gICAgcHJpdmF0ZSBjb250ZW50czogQ29udGVudHM7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb250ZW50czogQ29udGVudHMpIHtcbiAgICAgICAgdGhpcy5nZXREZWZhdWx0Q29udGVudHMoY29udGVudHMgfHwge30pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tUeXBlKG9iamVjdDogb2JqZWN0KTogdm9pZCB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG9iamVjdCkubWFwKCh2YWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHZhbFswXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsWzFdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHlwZSh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBjb250ZW50c1R5cGVba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGAke3ZhbHVlfeuKlCAke3R5cGV97J20IOyVhOuLmeuLiOuLpC5gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ha2VOb2RlKGNvbnRlbnRzOiBDb250ZW50cyk6IGFueSB7XG4gICAgICAgIGxldCBjb25maXJtID0gJyc7XG4gICAgICAgIGxldCBjYW5jZWwgPSAnJztcbiAgICAgICAgaWYgKGNvbnRlbnRzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIGNvbmZpcm0gPSBgPGJ1dHRvbiBuYW1lPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj4ke2NvbnRlbnRzLmNvbmZpcm0udGV4dCB8fCBkZWZhdWx0VGV4dC5jb25maXJtfTwvYnV0dG9uPmBcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29udGVudHMuY2FuY2VsKSB7XG4gICAgICAgICAgICBjYW5jZWwgPSBgPGJ1dHRvbiBuYW1lPVwiY2FuY2VsXCIgdHlwZT1cImJ1dHRvblwiPiR7Y29udGVudHMuY2FuY2VsLnRleHQgfHwgZGVmYXVsdFRleHQuY2FuY2VsfTwvYnV0dG9uPmBcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaWFsb2cgPSBgXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZ1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0tY29udGVudFwiPlxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInV4LWRpYWxvZy0tY2xvc2VcIj50aGlzIGRpYWxvZyBjbG9zZTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1oZWFkZXJcIj4ke2NvbnRlbnRzLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1jb250YWluZXJcIj4ke2NvbnRlbnRzLmNvbnRlbnR9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWZvb3RlclwiPiR7Y29uZmlybX0ke2NhbmNlbH08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGkgY2xhc3M9XCJ1eC1kaWFsb2ctLWRpbVwiPjwvaT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgYDtcbiAgICAgICAgcmV0dXJuIFV4RGlhbG9nLmh0bWxUb0VsZW1lbnQoZGlhbG9nKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgaHRtbFRvRWxlbWVudChzdHI6IHN0cmluZyk6IGFueSB7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAgICAgc3RyID0gc3RyLnRyaW0oKTsgXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGVuZChjb250ZW50czogQ29udGVudHMpIHtcbiAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMubWFrZU5vZGUoY29udGVudHMpO1xuICAgICAgICBib2R5LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0Q29udGVudHMoY29udGVudHM6IENvbnRlbnRzKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hlY2tUeXBlKGNvbnRlbnRzKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb250ZW50cyA9IHt9O1xuICAgICAgICBPYmplY3QuZW50cmllcyhjb250ZW50cykubWFwKCh2YWwpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udGVudHNbdmFsWzBdXSA9IHZhbFsxXTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBiaW5kRXZlbnQoY29udGVudHM/OiBDb250ZW50cykge1xuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tY2xvc2UnKS5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tZm9vdGVyJykub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gZS50YXJnZXQubmFtZTtcbiAgICAgICAgICAgIHN3aXRjaChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29uZmlybSc6XG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2FuY2VsJzpcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaykgJiYgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaygpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvcGVuKGNvbnRlbnRzPzogQ29udGVudHMpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5lbGVtZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgb25jZTogQ29udGVudHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbnRlbnRzKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50cykge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUeXBlKGNvbnRlbnRzKTtcbiAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhjb250ZW50cykubWFwKCh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gdmFsWzBdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbFsxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudHNba2V5XSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uY2Vba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFwcGVuZChvbmNlKTtcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50KG9uY2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsb3NlKCkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjbG9zZScpO1xuICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1kaW0nKS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl19
