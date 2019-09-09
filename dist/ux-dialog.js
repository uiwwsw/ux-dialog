/*
 MIT License. 
 ux-dialog v0.1.5
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
  selfClose: 'number'
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRUZXh0IiwiY29uZmlybSIsImNhbmNlbCIsImNvbnRlbnRzVHlwZSIsInRpdGxlIiwiY29udGVudCIsImNhbGxiYWNrIiwidGV4dCIsInNlbGZDbG9zZSIsIlV4RGlhbG9nIiwiY29udGVudHMiLCJnZXREZWZhdWx0Q29udGVudHMiLCJvYmplY3QiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwidmFsIiwia2V5IiwidmFsdWUiLCJjaGVja1R5cGUiLCJ0eXBlIiwiZGlhbG9nIiwiaHRtbFRvRWxlbWVudCIsImJvZHkiLCJkb2N1bWVudCIsImVsZW1lbnQiLCJtYWtlTm9kZSIsImFwcGVuZENoaWxkIiwicXVlcnlTZWxlY3RvciIsIm9uY2xpY2siLCJjbG9zZSIsImUiLCJuYW1lIiwidGFyZ2V0Iiwib25jZSIsImFzc2lnbiIsImFwcGVuZCIsImJpbmRFdmVudCIsImNsZWFyVGltZW91dCIsInN0byIsInN0eWxlIiwiYW5pbWF0aW9uRHVyYXRpb24iLCJzZXRUaW1lb3V0IiwiY2xhc3NMaXN0IiwiYWRkIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZSIsInN0ciIsInRlbXBsYXRlIiwiY3JlYXRlRWxlbWVudCIsInRyaW0iLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFhQSxJQUFNQSxXQUFXLEdBQUc7QUFDaEJDLEVBQUFBLE9BQU8sRUFBRSxJQURPO0FBRWhCQyxFQUFBQSxNQUFNLEVBQUU7QUFGUSxDQUFwQjtBQUtBLElBQU1DLFlBQVksR0FBRztBQUNqQkYsRUFBQUEsT0FBTyxFQUFFLFNBRFE7QUFFakJDLEVBQUFBLE1BQU0sRUFBRSxTQUZTO0FBR2pCRSxFQUFBQSxLQUFLLEVBQUUsUUFIVTtBQUlqQkMsRUFBQUEsT0FBTyxFQUFFLFFBSlE7QUFLakJDLEVBQUFBLFFBQVEsRUFBRSxVQUxPO0FBTWpCQyxFQUFBQSxJQUFJLEVBQUUsUUFOVztB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K0IsR0FBTCxHQUFXRyxVQUFVLENBQUMsWUFBSztBQUN2QixZQUFBLE1BQUksQ0FBQ1osS0FBTDtBQUNILFdBRm9CLEVBRWxCSSxJQUFJLENBQUMxQixTQUZhLENBQXJCO0FBR0g7QUFDSjtBQUNKOzs7NEJBRVc7QUFDUixVQUFNaUIsT0FBTyxHQUFHLEtBQUtBLE9BQXJCOztBQUNBLFVBQUlBLE9BQUosRUFBYTtBQUNUQSxRQUFBQSxPQUFPLENBQUNrQixTQUFSLENBQWtCQyxHQUFsQixDQUFzQixPQUF0QjtBQUNBbkIsUUFBQUEsT0FBTyxDQUFDRyxhQUFSLENBQXNCLGlCQUF0QixFQUF5Q2lCLGdCQUF6QyxDQUEwRCxjQUExRCxFQUEwRSxZQUFLO0FBQzNFcEIsVUFBQUEsT0FBTyxDQUFDcUIsTUFBUjtBQUNILFNBRkQ7QUFHQSxhQUFLckIsT0FBTCxHQUFlLElBQWY7QUFDSDtBQUNKOzs7a0NBM0VvQnNCLEcsRUFBVztBQUM1QixVQUFNQyxRQUFRLEdBQUd4QixRQUFRLENBQUN5QixhQUFULENBQXVCLFVBQXZCLENBQWpCO0FBQ0FGLE1BQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUFDRyxJQUFKLEVBQU47QUFDQUYsTUFBQUEsUUFBUSxDQUFDRyxTQUFULEdBQXFCSixHQUFyQjtBQUNBLGFBQU9DLFFBQVEsQ0FBQzNDLE9BQVQsQ0FBaUIrQyxVQUF4QjtBQUNIIiwiZmlsZSI6InV4LWRpYWxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImludGVyZmFjZSBCdXR0b24ge1xyXG4gICAgY2FsbGJhY2s/OiBGdW5jdGlvbjtcclxuICAgIHRleHQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBDb250ZW50cyB7XHJcbiAgICB0aXRsZT86IHN0cmluZztcclxuICAgIGNvbnRlbnQ/OiBzdHJpbmcgfCBOb2RlO1xyXG4gICAgY29uZmlybT86IEJ1dHRvbiB8IG51bGw7XHJcbiAgICBjYW5jZWw/OiBCdXR0b24gfCBudWxsO1xyXG4gICAgc2VsZkNsb3NlPzogbnVtYmVyO1xyXG59XHJcblxyXG5jb25zdCBkZWZhdWx0VGV4dCA9IHtcclxuICAgIGNvbmZpcm06ICftmZXsnbgnLFxyXG4gICAgY2FuY2VsOiAn7Leo7IaMJ1xyXG59O1xyXG5cclxuY29uc3QgY29udGVudHNUeXBlID0ge1xyXG4gICAgY29uZmlybTogJ2Jvb2xlYW4nLFxyXG4gICAgY2FuY2VsOiAnYm9vbGVhbicsXHJcbiAgICB0aXRsZTogJ3N0cmluZycsXHJcbiAgICBjb250ZW50OiAnc3RyaW5nJyxcclxuICAgIGNhbGxiYWNrOiAnZnVuY3Rpb24nLFxyXG4gICAgdGV4dDogJ3N0cmluZycsXHJcbiAgICBzZWxmQ2xvc2U6ICdudW1iZXInXHJcbn07XHJcblxyXG5jbGFzcyBVeERpYWxvZyB7XHJcbiAgICBwcml2YXRlIHN0bzogYW55O1xyXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBhbnk7XHJcbiAgICBwcml2YXRlIGNvbnRlbnRzOiBDb250ZW50cztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZW50czogQ29udGVudHMpIHtcclxuICAgICAgICB0aGlzLmdldERlZmF1bHRDb250ZW50cyhjb250ZW50cyB8fCB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja1R5cGUob2JqZWN0OiBvYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhvYmplY3QpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHZhbFswXTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWxbMV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHlwZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gY29udGVudHNUeXBlW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYCR7dmFsdWV964qUICR7dHlwZX3snbQg7JWE64uZ64uI64ukLmBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFrZU5vZGUoY29udGVudHM6IENvbnRlbnRzKTogYW55IHtcclxuICAgICAgICBsZXQgY29uZmlybSA9ICcnO1xyXG4gICAgICAgIGxldCBjYW5jZWwgPSAnJztcclxuICAgICAgICBpZiAoY29udGVudHMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBjb25maXJtID0gYDxidXR0b24gbmFtZT1cImNvbmZpcm1cIiB0eXBlPVwiYnV0dG9uXCI+JHtjb250ZW50cy5jb25maXJtLnRleHQgfHwgZGVmYXVsdFRleHQuY29uZmlybX08L2J1dHRvbj5gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb250ZW50cy5jYW5jZWwpIHtcclxuICAgICAgICAgICAgY2FuY2VsID0gYDxidXR0b24gbmFtZT1cImNhbmNlbFwiIHR5cGU9XCJidXR0b25cIj4ke2NvbnRlbnRzLmNhbmNlbC50ZXh0IHx8IGRlZmF1bHRUZXh0LmNhbmNlbH08L2J1dHRvbj5gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IGBcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2dcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0tY29udGVudFwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwidXgtZGlhbG9nLS1jbG9zZVwiPnRoaXMgZGlhbG9nIGNsb3NlPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0taGVhZGVyXCI+JHtjb250ZW50cy50aXRsZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1jb250YWluZXJcIj4ke2NvbnRlbnRzLmNvbnRlbnR9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0tZm9vdGVyXCI+JHtjb25maXJtfSR7Y2FuY2VsfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxpIGNsYXNzPVwidXgtZGlhbG9nLS1sb2FkaW5nXCI+PC9pPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJ1eC1kaWFsb2ctLWRpbVwiPjwvaT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgcmV0dXJuIFV4RGlhbG9nLmh0bWxUb0VsZW1lbnQoZGlhbG9nKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaHRtbFRvRWxlbWVudChzdHI6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xyXG4gICAgICAgIHN0ciA9IHN0ci50cmltKCk7IFxyXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcclxuICAgICAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXBwZW5kKGNvbnRlbnRzOiBDb250ZW50cykge1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMubWFrZU5vZGUoY29udGVudHMpO1xyXG4gICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldERlZmF1bHRDb250ZW50cyhjb250ZW50czogQ29udGVudHMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNoZWNrVHlwZShjb250ZW50cyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbnRlbnRzID0ge307XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY29udGVudHMpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudHNbdmFsWzBdXSA9IHZhbFsxXTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRFdmVudChjb250ZW50cz86IENvbnRlbnRzKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWNsb3NlJykub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWZvb3RlcicpLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gZS50YXJnZXQubmFtZTtcclxuICAgICAgICAgICAgc3dpdGNoKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbmZpcm0nOlxyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NhbmNlbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaykgJiYgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oY29udGVudHM/OiBDb250ZW50cyk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuZWxlbWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgb25jZTogQ29udGVudHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbnRlbnRzKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHlwZShjb250ZW50cyk7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhjb250ZW50cykubWFwKCh2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB2YWxbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWxbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudHNba2V5XSAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25jZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hcHBlbmQob25jZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50KG9uY2UpO1xyXG5cclxuICAgICAgICAgICAgaWYob25jZS5zZWxmQ2xvc2UpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnN0byk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tbG9hZGluZycpLnN0eWxlLmFuaW1hdGlvbkR1cmF0aW9uID0gb25jZS5zZWxmQ2xvc2UgLyAxMDAwICsgJ3MnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG8gPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9LCBvbmNlLnNlbGZDbG9zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsb3NlKCk6dm9pZCB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2Nsb3NlJyk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tZGltJykuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4iXX0=
