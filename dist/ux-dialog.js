/*
 MIT License. 
 ux-dialog v0.1.2
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRUZXh0IiwiY29uZmlybSIsImNhbmNlbCIsImNvbnRlbnRzVHlwZSIsInRpdGxlIiwiY29udGVudCIsImNhbGxiYWNrIiwidGV4dCIsIlV4RGlhbG9nIiwiY29udGVudHMiLCJnZXREZWZhdWx0Q29udGVudHMiLCJvYmplY3QiLCJPYmplY3QiLCJlbnRyaWVzIiwibWFwIiwidmFsIiwia2V5IiwidmFsdWUiLCJjaGVja1R5cGUiLCJ0eXBlIiwiZGlhbG9nIiwiaHRtbFRvRWxlbWVudCIsImJvZHkiLCJkb2N1bWVudCIsImVsZW1lbnQiLCJtYWtlTm9kZSIsImFwcGVuZENoaWxkIiwicXVlcnlTZWxlY3RvciIsIm9uY2xpY2siLCJjbG9zZSIsImUiLCJuYW1lIiwidGFyZ2V0Iiwib25jZSIsImFzc2lnbiIsImFwcGVuZCIsImJpbmRFdmVudCIsImNsYXNzTGlzdCIsImFkZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmUiLCJzdHIiLCJ0ZW1wbGF0ZSIsImNyZWF0ZUVsZW1lbnQiLCJ0cmltIiwiaW5uZXJIVE1MIiwiZmlyc3RDaGlsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBWUEsSUFBTUEsV0FBVyxHQUFHO0FBQ2hCQyxFQUFBQSxPQUFPLEVBQUUsSUFETztBQUVoQkMsRUFBQUEsTUFBTSxFQUFFO0FBRlEsQ0FBcEI7QUFLQSxJQUFNQyxZQUFZLEdBQUc7QUFDakJGLEVBQUFBLE9BQU8sRUFBRSxTQURRO0FBRWpCQyxFQUFBQSxNQUFNLEVBQUUsU0FGUztBQUdqQkUsRUFBQUEsS0FBSyxFQUFFLFFBSFU7QUFJakJDLEVBQUFBLE9BQU8sRUFBRSxRQUpRO0FBS2pCQyxFQUFBQSxRQUFRLEVBQUUsVUFMTztBQU1qQkMsRUFBQUEsSUFBSSxFQUFFO0FBTlcsQ0FBckI7O0lBU01DLFE7OztBQUlGLG9CQUFZQyxRQUFaLEVBQThCO0FBQUE7O0FBQzFCLFNBQUtDLGtCQUFMLENBQXdCRCxRQUFRLElBQUksRUFBcEM7QUFDSDs7Ozs4QkFFaUJFLE0sRUFBYztBQUFBOztBQUM1QkMsTUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVGLE1BQWYsRUFBdUJHLEdBQXZCLENBQTJCLFVBQUNDLEdBQUQsRUFBUTtBQUMvQixZQUFNQyxHQUFHLEdBQUdELEdBQUcsQ0FBQyxDQUFELENBQWY7QUFDQSxZQUFNRSxLQUFLLEdBQUdGLEdBQUcsQ0FBQyxDQUFELENBQWpCOztBQUNBLFlBQUksUUFBT0UsS0FBUCxNQUFpQixRQUFyQixFQUErQjtBQUMzQixVQUFBLEtBQUksQ0FBQ0MsU0FBTCxDQUFlRCxLQUFmO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsY0FBTUUsSUFBSSxHQUFHaEIsWUFBWSxDQUFDYSxHQUFELENBQXpCOztBQUNBLGNBQUksUUFBT0MsS0FBUCxNQUFpQkUsSUFBckIsRUFBMkI7QUFDdkIsNEJBQVNGLEtBQVQsb0JBQW1CRSxJQUFuQjtBQUNIO0FBQ0o7QUFDSixPQVhEO0FBWUg7Ozs2QkFFZ0JWLFEsRUFBa0I7QUFDL0IsVUFBSVIsT0FBTyxHQUFHLEVBQWQ7QUFDQSxVQUFJQyxNQUFNLEdBQUcsRUFBYjs7QUFDQSxVQUFJTyxRQUFRLENBQUNSLE9BQWIsRUFBc0I7QUFDbEJBLFFBQUFBLE9BQU8sc0RBQTJDUSxRQUFRLENBQUNSLE9BQVQsQ0FBaUJNLElBQWpCLElBQXlCUCxXQUFXLENBQUNDLE9BQWhGLGNBQVA7QUFDSDs7QUFDRCxVQUFJUSxRQUFRLENBQUNQLE1BQWIsRUFBcUI7QUFDakJBLFFBQUFBLE1BQU0scURBQTBDTyxRQUFRLENBQUNQLE1BQVQsQ0FBZ0JLLElBQWhCLElBQXdCUCxXQUFXLENBQUNFLE1BQTlFLGNBQU47QUFDSDs7QUFDRCxVQUFNa0IsTUFBTSxnUEFJMkJYLFFBQVEsQ0FBQ0wsS0FKcEMsdUVBSzhCSyxRQUFRLENBQUNKLE9BTHZDLG9FQU0yQkosT0FOM0IsU0FNcUNDLE1BTnJDLHlHQUFaO0FBV0EsYUFBT00sUUFBUSxDQUFDYSxhQUFULENBQXVCRCxNQUF2QixDQUFQO0FBQ0g7OzsyQkFTY1gsUSxFQUFrQjtBQUM3QixVQUFNYSxJQUFJLEdBQUdDLFFBQVEsQ0FBQ0QsSUFBdEI7QUFDQSxXQUFLRSxPQUFMLEdBQWUsS0FBS0MsUUFBTCxDQUFjaEIsUUFBZCxDQUFmO0FBQ0FhLE1BQUFBLElBQUksQ0FBQ0ksV0FBTCxDQUFpQixLQUFLRixPQUF0QjtBQUNIOzs7dUNBRTBCZixRLEVBQWtCO0FBQUE7O0FBQ3pDLFdBQUtTLFNBQUwsQ0FBZVQsUUFBZjtBQUNBLFdBQUtlLE9BQUwsR0FBZSxJQUFmO0FBQ0EsV0FBS2YsUUFBTCxHQUFnQixFQUFoQjtBQUNBRyxNQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZUosUUFBZixFQUF5QkssR0FBekIsQ0FBNkIsVUFBQ0MsR0FBRCxFQUFRO0FBQ2pDLFFBQUEsTUFBSSxDQUFDTixRQUFMLENBQWNNLEdBQUcsQ0FBQyxDQUFELENBQWpCLElBQXdCQSxHQUFHLENBQUMsQ0FBRCxDQUEzQjtBQUNILE9BRkQ7QUFHSDs7OzhCQUVpQk4sUSxFQUFtQjtBQUFBOztBQUNqQyxXQUFLZSxPQUFMLENBQWFHLGFBQWIsQ0FBMkIsbUJBQTNCLEVBQWdEQyxPQUFoRCxHQUEwRCxZQUFLO0FBQzNELFFBQUEsTUFBSSxDQUFDQyxLQUFMO0FBQ0gsT0FGRDs7QUFHQSxXQUFLTCxPQUFMLENBQWFHLGFBQWIsQ0FBMkIsb0JBQTNCLEVBQWlEQyxPQUFqRCxHQUEyRCxVQUFDRSxDQUFELEVBQU07QUFDN0QsWUFBTUMsSUFBSSxHQUFHRCxDQUFDLENBQUNFLE1BQUYsQ0FBU0QsSUFBdEI7O0FBQ0EsZ0JBQU9BLElBQVA7QUFDSSxlQUFLLFNBQUw7QUFDS3RCLFlBQUFBLFFBQVEsQ0FBQ1IsT0FBVCxDQUFpQkssUUFBbEIsSUFBZ0NHLFFBQVEsQ0FBQ1IsT0FBVCxDQUFpQkssUUFBakIsRUFBaEM7QUFDQTs7QUFDSixlQUFLLFFBQUw7QUFDS0csWUFBQUEsUUFBUSxDQUFDUCxNQUFULENBQWdCSSxRQUFqQixJQUErQkcsUUFBUSxDQUFDUCxNQUFULENBQWdCSSxRQUFoQixFQUEvQjs7QUFDQSxZQUFBLE1BQUksQ0FBQ3VCLEtBQUw7O0FBQ0E7QUFQUjtBQVNILE9BWEQ7QUFZSDs7O3lCQUVXcEIsUSxFQUFtQjtBQUFBOztBQUMzQixVQUFHLEtBQUtlLE9BQUwsS0FBaUIsSUFBcEIsRUFBMEI7QUFDdEIsWUFBSVMsSUFBSSxHQUFhckIsTUFBTSxDQUFDc0IsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS3pCLFFBQXZCLENBQXJCOztBQUNBLFlBQUlBLFFBQUosRUFBYztBQUNWLGVBQUtTLFNBQUwsQ0FBZVQsUUFBZjtBQUNBRyxVQUFBQSxNQUFNLENBQUNDLE9BQVAsQ0FBZUosUUFBZixFQUF5QkssR0FBekIsQ0FBNkIsVUFBQ0MsR0FBRCxFQUFRO0FBQ2pDLGdCQUFNQyxHQUFHLEdBQUdELEdBQUcsQ0FBQyxDQUFELENBQWY7QUFDQSxnQkFBTUUsS0FBSyxHQUFHRixHQUFHLENBQUMsQ0FBRCxDQUFqQjs7QUFDQSxnQkFBSSxNQUFJLENBQUNOLFFBQUwsQ0FBY08sR0FBZCxNQUF1QkMsS0FBM0IsRUFBa0M7QUFDOUJnQixjQUFBQSxJQUFJLENBQUNqQixHQUFELENBQUosR0FBWUMsS0FBWjtBQUNIO0FBQ0osV0FORDtBQU9IOztBQUNELGFBQUtrQixNQUFMLENBQVlGLElBQVo7QUFDQSxhQUFLRyxTQUFMLENBQWVILElBQWY7QUFDSDtBQUNKOzs7NEJBRVc7QUFDUixVQUFNVCxPQUFPLEdBQUcsS0FBS0EsT0FBckI7O0FBQ0EsVUFBSUEsT0FBSixFQUFhO0FBQ1RBLFFBQUFBLE9BQU8sQ0FBQ2EsU0FBUixDQUFrQkMsR0FBbEIsQ0FBc0IsT0FBdEI7QUFDQWQsUUFBQUEsT0FBTyxDQUFDRyxhQUFSLENBQXNCLGlCQUF0QixFQUF5Q1ksZ0JBQXpDLENBQTBELGNBQTFELEVBQTBFLFlBQUs7QUFDM0VmLFVBQUFBLE9BQU8sQ0FBQ2dCLE1BQVI7QUFDSCxTQUZEO0FBR0EsYUFBS2hCLE9BQUwsR0FBZSxJQUFmO0FBQ0g7QUFDSjs7O2tDQW5Fb0JpQixHLEVBQVc7QUFDNUIsVUFBTUMsUUFBUSxHQUFHbkIsUUFBUSxDQUFDb0IsYUFBVCxDQUF1QixVQUF2QixDQUFqQjtBQUNBRixNQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ0csSUFBSixFQUFOO0FBQ0FGLE1BQUFBLFFBQVEsQ0FBQ0csU0FBVCxHQUFxQkosR0FBckI7QUFDQSxhQUFPQyxRQUFRLENBQUNyQyxPQUFULENBQWlCeUMsVUFBeEI7QUFDSCIsImZpbGUiOiJ1eC1kaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgQnV0dG9uIHtcclxuICAgIGNhbGxiYWNrPzogRnVuY3Rpb247XHJcbiAgICB0ZXh0Pzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29udGVudHMge1xyXG4gICAgdGl0bGU/OiBzdHJpbmc7XHJcbiAgICBjb250ZW50Pzogc3RyaW5nIHwgTm9kZTtcclxuICAgIGNvbmZpcm0/OiBCdXR0b24gfCBudWxsO1xyXG4gICAgY2FuY2VsPzogQnV0dG9uIHwgbnVsbDtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdFRleHQgPSB7XHJcbiAgICBjb25maXJtOiAn7ZmV7J24JyxcclxuICAgIGNhbmNlbDogJ+y3qOyGjCdcclxufTtcclxuXHJcbmNvbnN0IGNvbnRlbnRzVHlwZSA9IHtcclxuICAgIGNvbmZpcm06ICdib29sZWFuJyxcclxuICAgIGNhbmNlbDogJ2Jvb2xlYW4nLFxyXG4gICAgdGl0bGU6ICdzdHJpbmcnLFxyXG4gICAgY29udGVudDogJ3N0cmluZycsXHJcbiAgICBjYWxsYmFjazogJ2Z1bmN0aW9uJyxcclxuICAgIHRleHQ6ICdzdHJpbmcnLFxyXG59O1xyXG5cclxuY2xhc3MgVXhEaWFsb2cge1xyXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBhbnk7XHJcbiAgICBwcml2YXRlIGNvbnRlbnRzOiBDb250ZW50cztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZW50czogQ29udGVudHMpIHtcclxuICAgICAgICB0aGlzLmdldERlZmF1bHRDb250ZW50cyhjb250ZW50cyB8fCB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjaGVja1R5cGUob2JqZWN0OiBvYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBPYmplY3QuZW50cmllcyhvYmplY3QpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHZhbFswXTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWxbMV07XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHlwZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gY29udGVudHNUeXBlW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSB0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYCR7dmFsdWV964qUICR7dHlwZX3snbQg7JWE64uZ64uI64ukLmBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbWFrZU5vZGUoY29udGVudHM6IENvbnRlbnRzKTogYW55IHtcclxuICAgICAgICBsZXQgY29uZmlybSA9ICcnO1xyXG4gICAgICAgIGxldCBjYW5jZWwgPSAnJztcclxuICAgICAgICBpZiAoY29udGVudHMuY29uZmlybSkge1xyXG4gICAgICAgICAgICBjb25maXJtID0gYDxidXR0b24gbmFtZT1cImNvbmZpcm1cIiB0eXBlPVwiYnV0dG9uXCI+JHtjb250ZW50cy5jb25maXJtLnRleHQgfHwgZGVmYXVsdFRleHQuY29uZmlybX08L2J1dHRvbj5gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb250ZW50cy5jYW5jZWwpIHtcclxuICAgICAgICAgICAgY2FuY2VsID0gYDxidXR0b24gbmFtZT1cImNhbmNlbFwiIHR5cGU9XCJidXR0b25cIj4ke2NvbnRlbnRzLmNhbmNlbC50ZXh0IHx8IGRlZmF1bHRUZXh0LmNhbmNlbH08L2J1dHRvbj5gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGRpYWxvZyA9IGBcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2dcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0tY29udGVudFwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwidXgtZGlhbG9nLS1jbG9zZVwiPnRoaXMgZGlhbG9nIGNsb3NlPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0taGVhZGVyXCI+JHtjb250ZW50cy50aXRsZX08L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1jb250YWluZXJcIj4ke2NvbnRlbnRzLmNvbnRlbnR9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInV4LWRpYWxvZy0tZm9vdGVyXCI+JHtjb25maXJtfSR7Y2FuY2VsfTwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJ1eC1kaWFsb2ctLWRpbVwiPjwvaT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgcmV0dXJuIFV4RGlhbG9nLmh0bWxUb0VsZW1lbnQoZGlhbG9nKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgaHRtbFRvRWxlbWVudChzdHI6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xyXG4gICAgICAgIHN0ciA9IHN0ci50cmltKCk7IFxyXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcclxuICAgICAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5maXJzdENoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYXBwZW5kKGNvbnRlbnRzOiBDb250ZW50cykge1xyXG4gICAgICAgIGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMubWFrZU5vZGUoY29udGVudHMpO1xyXG4gICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldERlZmF1bHRDb250ZW50cyhjb250ZW50czogQ29udGVudHMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNoZWNrVHlwZShjb250ZW50cyk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbnRlbnRzID0ge307XHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY29udGVudHMpLm1hcCgodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudHNbdmFsWzBdXSA9IHZhbFsxXTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGJpbmRFdmVudChjb250ZW50cz86IENvbnRlbnRzKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWNsb3NlJykub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWZvb3RlcicpLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gZS50YXJnZXQubmFtZTtcclxuICAgICAgICAgICAgc3dpdGNoKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbmZpcm0nOlxyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2NhbmNlbCc6XHJcbiAgICAgICAgICAgICAgICAgICAgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaykgJiYgKGNvbnRlbnRzLmNhbmNlbC5jYWxsYmFjaygpKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9wZW4oY29udGVudHM/OiBDb250ZW50cyk6IHZvaWQge1xyXG4gICAgICAgIGlmKHRoaXMuZWxlbWVudCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgb25jZTogQ29udGVudHMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbnRlbnRzKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHlwZShjb250ZW50cyk7XHJcbiAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhjb250ZW50cykubWFwKCh2YWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSB2YWxbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWxbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudHNba2V5XSAhPT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25jZVtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hcHBlbmQob25jZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYmluZEV2ZW50KG9uY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xvc2UoKTp2b2lkIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xyXG4gICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2xvc2UnKTtcclxuICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1kaW0nKS5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdfQ==
