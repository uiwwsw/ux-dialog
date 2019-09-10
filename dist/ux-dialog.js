/*
 MIT License. 
 ux-dialog v0.1.7
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRUZXh0IiwiY29uZmlybSIsImNhbmNlbCIsImNvbnRlbnRzVHlwZSIsInRpdGxlIiwiY29udGVudCIsImNhbGxiYWNrIiwidGV4dCIsInNlbGZDbG9zZSIsImNsb3NlS2V5IiwiY2FuY2VsS2V5IiwiY29uZmlybUtleSIsIlV4RGlhbG9nIiwiY29udGVudHMiLCJnZXREZWZhdWx0Q29udGVudHMiLCJvYmplY3QiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwidmFsIiwia2V5IiwidmFsdWUiLCJjaGVja1R5cGUiLCJ0eXBlIiwiZGlhbG9nIiwiaHRtbFRvRWxlbWVudCIsImJvZHkiLCJkb2N1bWVudCIsImVsZW1lbnQiLCJtYWtlTm9kZSIsImFwcGVuZENoaWxkIiwid2luZG93Iiwib25rZXl1cCIsImUiLCJrZXlDb2RlIiwiY2xvc2UiLCJxdWVyeVNlbGVjdG9yIiwib25jbGljayIsIm5hbWUiLCJ0YXJnZXQiLCJvbmNlIiwiYXNzaWduIiwiYXBwZW5kIiwiYmluZEV2ZW50IiwiY2xlYXJUaW1lb3V0Iiwic3RvIiwic3R5bGUiLCJhbmltYXRpb25EdXJhdGlvbiIsInNldFRpbWVvdXQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlIiwic3RyIiwidGVtcGxhdGUiLCJjcmVhdGVFbGVtZW50IiwidHJpbSIsImlubmVySFRNTCIsImZpcnN0Q2hpbGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxJQUFNQSxXQUFXLEdBQUc7QUFDaEJDLEVBQUFBLE9BQU8sRUFBRSxJQURPO0FBRWhCQyxFQUFBQSxNQUFNLEVBQUU7QUFGUSxDQUFwQjtBQUtBLElBQU1DLFlBQVksR0FBRztBQUNqQkYsRUFBQUEsT0FBTyxFQUFFLFNBRFE7QUFFakJDLEVBQUFBLE1BQU0sRUFBRSxTQUZTO0FBR2pCRSxFQUFBQSxLQUFLLEVBQUUsUUFIVTtBQUlqQkMsRUFBQUEsT0FBTyxF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LENBQUNRLGFBQVIsQ0FBc0IsaUJBQXRCLEVBQXlDZSxnQkFBekMsQ0FBMEQsY0FBMUQsRUFBMEUsWUFBSztBQUMzRXZCLFVBQUFBLE9BQU8sQ0FBQ3dCLE1BQVI7QUFDSCxTQUZEO0FBR0EsYUFBS3hCLE9BQUwsR0FBZSxJQUFmO0FBQ0g7QUFDSjs7O2tDQTFGb0J5QixHLEVBQVc7QUFDNUIsVUFBTUMsUUFBUSxHQUFHM0IsUUFBUSxDQUFDNEIsYUFBVCxDQUF1QixVQUF2QixDQUFqQjtBQUNBRixNQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ0csSUFBSixFQUFOO0FBQ0FGLE1BQUFBLFFBQVEsQ0FBQ0csU0FBVCxHQUFxQkosR0FBckI7QUFDQSxhQUFPQyxRQUFRLENBQUNqRCxPQUFULENBQWlCcUQsVUFBeEI7QUFDSCIsImZpbGUiOiJ1eC1kaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgQnV0dG9uIHtcclxuICAgIGNhbGxiYWNrPzogRnVuY3Rpb247XHJcbiAgICB0ZXh0Pzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29udGVudHMge1xyXG4gICAgdGl0bGU/OiBzdHJpbmc7XHJcbiAgICBjb250ZW50Pzogc3RyaW5nIHwgTm9kZTtcclxuICAgIGNvbmZpcm0/OiBCdXR0b24gfCBudWxsO1xyXG4gICAgY2FuY2VsPzogQnV0dG9uIHwgbnVsbDtcclxuICAgIHNlbGZDbG9zZT86IG51bWJlcjtcclxuICAgIGNsb3NlS2V5PzogbnVtYmVyO1xyXG4gICAgY2FuY2VsS2V5PzogbnVtYmVyO1xyXG4gICAgY29uZmlybUtleT86IG51bWJlcjtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdFRleHQgPSB7XHJcbiAgICBjb25maXJtOiAn7ZmV7J24JyxcclxuICAgIGNhbmNlbDogJ+y3qOyGjCdcclxufTtcclxuXHJcbmNvbnN0IGNvbnRlbnRzVHlwZSA9IHtcclxuICAgIGNvbmZpcm06ICdib29sZWFuJyxcclxuICAgIGNhbmNlbDogJ2Jvb2xlYW4nLFxyXG4gICAgdGl0bGU6ICdzdHJpbmcnLFxyXG4gICAgY29udGVudDogJ3N0cmluZycsXHJcbiAgICBjYWxsYmFjazogJ2Z1bmN0aW9uJyxcclxuICAgIHRleHQ6ICdzdHJpbmcnLFxyXG4gICAgc2VsZkNsb3NlOiAnbnVtYmVyJyxcclxuICAgIGNsb3NlS2V5OiAnbnVtYmVyJyxcclxuICAgIGNhbmNlbEtleTogJ251bWJlcicsXHJcbiAgICBjb25maXJtS2V5OiAnbnVtYmVyJ1xyXG59O1xyXG5cclxuY2xhc3MgVXhEaWFsb2cge1xyXG4gICAgcHJpdmF0ZSBzdG86IGFueTtcclxuICAgIHByaXZhdGUgZWxlbWVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBjb250ZW50czogQ29udGVudHM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoY29udGVudHM6IENvbnRlbnRzKSB7XHJcbiAgICAgICAgdGhpcy5nZXREZWZhdWx0Q29udGVudHMoY29udGVudHMgfHwge30pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2hlY2tUeXBlKG9iamVjdDogb2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMob2JqZWN0KS5tYXAoKHZhbCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSB2YWxbMF07XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsWzFdO1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGVja1R5cGUodmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IGNvbnRlbnRzVHlwZVtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGAke3ZhbHVlfeuKlCAke3R5cGV97J20IOyVhOuLmeuLiOuLpC5gXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG1ha2VOb2RlKGNvbnRlbnRzOiBDb250ZW50cyk6IGFueSB7XHJcbiAgICAgICAgbGV0IGNvbmZpcm0gPSAnJztcclxuICAgICAgICBsZXQgY2FuY2VsID0gJyc7XHJcbiAgICAgICAgaWYgKGNvbnRlbnRzLmNvbmZpcm0pIHtcclxuICAgICAgICAgICAgY29uZmlybSA9IGA8YnV0dG9uIG5hbWU9XCJjb25maXJtXCIgdHlwZT1cImJ1dHRvblwiPiR7Y29udGVudHMuY29uZmlybS50ZXh0IHx8IGRlZmF1bHRUZXh0LmNvbmZpcm19PC9idXR0b24+YFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29udGVudHMuY2FuY2VsKSB7XHJcbiAgICAgICAgICAgIGNhbmNlbCA9IGA8YnV0dG9uIG5hbWU9XCJjYW5jZWxcIiB0eXBlPVwiYnV0dG9uXCI+JHtjb250ZW50cy5jYW5jZWwudGV4dCB8fCBkZWZhdWx0VGV4dC5jYW5jZWx9PC9idXR0b24+YFxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkaWFsb2cgPSBgXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInV4LWRpYWxvZy0tY2xvc2VcIj50aGlzIGRpYWxvZyBjbG9zZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWhlYWRlclwiPiR7Y29udGVudHMudGl0bGV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0tY29udGFpbmVyXCI+JHtjb250ZW50cy5jb250ZW50fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWZvb3RlclwiPiR7Y29uZmlybX0ke2NhbmNlbH08L2Rpdj5cclxuICAgICAgICAgICAgICA8aSBjbGFzcz1cInV4LWRpYWxvZy0tbG9hZGluZ1wiPjwvaT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwidXgtZGlhbG9nLS1kaW1cIj48L2k+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgICAgIHJldHVybiBVeERpYWxvZy5odG1sVG9FbGVtZW50KGRpYWxvZyk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGh0bWxUb0VsZW1lbnQoc3RyOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcclxuICAgICAgICBzdHIgPSBzdHIudHJpbSgpO1xyXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcclxuICAgICAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXBwZW5kKGNvbnRlbnRzOiBDb250ZW50cykge1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMubWFrZU5vZGUoY29udGVudHMpO1xyXG4gICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldERlZmF1bHRDb250ZW50cyhjb250ZW50czogQ29udGVudHMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNoZWNrVHlwZShjb250ZW50cyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbnRlbnRzID0ge307XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY29udGVudHMpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudHNbdmFsWzBdXSA9IHZhbFsxXTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRFdmVudChjb250ZW50cz86IENvbnRlbnRzKSB7XHJcbiAgICAgICAgd2luZG93Lm9ua2V5dXAgPSBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzLmNsb3NlS2V5ID09PSBlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29udGVudHMuY2FuY2VsS2V5ID09PSBlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2spICYmIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2soKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzLmNvbmZpcm1LZXkgID09PSBlLmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWNsb3NlJykub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWZvb3RlcicpLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gZS50YXJnZXQubmFtZTtcclxuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjb25maXJtJzpcclxuICAgICAgICAgICAgICAgICAgICAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaykgJiYgKGNvbnRlbnRzLmNvbmZpcm0uY2FsbGJhY2soKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdjYW5jZWwnOlxyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2spICYmIChjb250ZW50cy5jYW5jZWwuY2FsbGJhY2soKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcGVuKGNvbnRlbnRzPzogQ29udGVudHMpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5lbGVtZW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBvbmNlOiBDb250ZW50cyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29udGVudHMpO1xyXG4gICAgICAgICAgICBpZiAoY29udGVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUeXBlKGNvbnRlbnRzKTtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKGNvbnRlbnRzKS5tYXAoKHZhbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHZhbFswXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbFsxXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250ZW50c1trZXldICE9PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNlW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFwcGVuZChvbmNlKTtcclxuICAgICAgICAgICAgdGhpcy5iaW5kRXZlbnQob25jZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAob25jZS5zZWxmQ2xvc2UpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnN0byk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tbG9hZGluZycpLnN0eWxlLmFuaW1hdGlvbkR1cmF0aW9uID0gb25jZS5zZWxmQ2xvc2UgLyAxMDAwICsgJ3MnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG8gPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBvbmNlLnNlbGZDbG9zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjbG9zZScpO1xyXG4gICAgICAgICAgICBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWRpbScpLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuIl19
