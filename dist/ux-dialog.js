/*
 MIT License. 
 ux-dialog v0.1.14
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
  confirmKey: 'number',
  opend: 'function',
  closed: 'function'
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

        if (once.opend) {
          var action = function action() {
            _this4.element.querySelector('.ux-dialog--dim').removeEventListener('animationend', action);

            once.opend();
          };

          this.element.querySelector('.ux-dialog--dim').addEventListener('animationend', action);
        }

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
    value: function close(callback) {
      var _this5 = this;

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
          if (_this5.contents.closed) {
            _this5.contents.closed();
          }

          if (callback) {
            callback();
          }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImRlZmF1bHRUZXh0IiwiY29uZmlybSIsImNhbmNlbCIsImNvbnRlbnRzVHlwZSIsImNsb3NlIiwiZGltQ2xvc2UiLCJ0aXRsZSIsImNvbnRlbnQiLCJjYWxsYmFjayIsInRleHQiLCJzZWxmQ2xvc2UiLCJjbG9zZUtleSIsImNhbmNlbEtleSIsImNvbmZpcm1LZXkiLCJvcGVuZCIsImNsb3NlZCIsIlV4RGlhbG9nIiwiY29udGVudHMiLCJrZXlVcEV2ZW50cyIsImdldERlZmF1bHRDb250ZW50cyIsIm9iamVjdCIsIk9iamVjdCIsImVudHJpZXMiLCJtYXAiLCJ2YWwiLCJrZXkiLCJ2YWx1ZSIsImNoZWNrVHlwZSIsInR5cGUiLCJkaWFsb2ciLCJodG1sVG9FbGVtZW50IiwiYm9keSIsImRvY3VtZW50IiwiZWxlbWVudCIsIm1ha2VOb2RlIiwiYXBwZW5kQ2hpbGQiLCJ3aW5kb3ciLCJvbmtleXVwIiwicHVzaCIsImUiLCJrZXlDb2RlIiwicXVlcnlTZWxlY3RvciIsIm9uY2xpY2siLCJuYW1lIiwidGFyZ2V0Iiwib25jZSIsImFzc2lnbiIsImFwcGVuZCIsImJpbmRFdmVudCIsImFjdGlvbiIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiY2xlYXJUaW1lb3V0Iiwic3RvIiwic3R5bGUiLCJhbmltYXRpb25EdXJhdGlvbiIsInNldFRpbWVvdXQiLCJrZXlVcExlbmd0aCIsImxlbmd0aCIsInBvcCIsImNsYXNzTGlzdCIsImFkZCIsInJlbW92ZSIsInN0ciIsInRlbXBsYXRlIiwiY3JlYXRlRWxlbWVudCIsInRyaW0iLCJpbm5lckhUTUwiLCJmaXJzdENoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsSUFBTUEsV0FBVyxHQUFHO0FBQ2hCQyxFQUFBQSxPQUFPLEVBQUUsSUFETztBQUVoQkMsRUFBQUEsTUFBTSxFQUFFO0FBRlEsQ0FBcEI7QUFLQSxJQUFNQyxZQUFZLEdBQUc7QUFDakJGLEVBQUFBLE9BQU8sRUFBRSxTQURRO0FBRWpCQyxFQUFBQSxNQUFNLEVBQUUsU0FGUztBQUdqQkUsRUFBQUEsS0FBSyxFQUFFLFNBSFU7QUFJakJDLEVBQUFBLFFBQVEsRUFBRSxTQUpPO0FBS2pCQyxFQUFBQSxLQUFLLEVBQUUsUUFMVTtBQU1qQkMsRUFBQUEsT0FBTyxFQUFFLFFBTlE7QUFPakJDLEVBQUFBLFFBQVEsRUFBRSxVQVBPO0FBUWpCQyxFQUFBQSxJQUFJLEVBQUUsUUFSVztBQVNqQkMsRUFBQUEsU0FBUyxFQUFFLFFBVE07QUFVakJDLEVBQUFBLFFBQVEsRUFBRSxRQVZPO0FBV2pCQyxFQUFBQSxTQUFTLEVBQUUsUUFYTTtBQVlqQkMsRUFBQUEsVUFBVSxFQUFFLFFBWks7QUFhakJDLEVBQUFBLEtBQUssRUFBRSxVQWJVO0FBY2pCQyxFQUFBQSxNQUFNLEVBQUU7QUFkUyxDQUFyQjs7SUFpQk1DLFE7OztBQU1GLG9CQUFZQyxRQUFaLEVBQThCO0FBQUE7O0FBQzFCLFFBQUksQ0FBQ0QsUUFBUSxDQUFDRSxXQUFkLEVBQTJCO0FBQ3ZCRixNQUFBQSxRQUFRLENBQUNFLFdBQVQsR0FBdUIsRUFBdkI7QUFDSDs7QUFDRCxTQUFLQyxrQkFBTCxDQUF3QkYsUUFBUSxJQUFJLEVBQXBDO0FBQ0g7Ozs7OEJBRWlCRyxNLEVBQWM7QUFBQTs7QUFDNUJDLE1BQUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlRixNQUFmLEVBQXVCRyxHQUF2QixDQUEyQixVQUFDQyxHQUFELEVBQVE7QUFDL0IsWUFBTUMsR0FBRyxHQUFHRCxHQUFHLENBQUMsQ0FBRCxDQUFmO0FBQ0EsWUFBTUUsS0FBSyxHQUFHRixHQUFHLENBQUMsQ0FBRCxDQUFqQjs7QUFDQSxZQUFJLFFBQU9FLEtBQVAsTUFBaUIsUUFBckIsRUFBK0I7QUFDM0IsVUFBQSxLQUFJLENBQUNDLFNBQUwsQ0FBZUQsS0FBZjtBQUNILFNBRkQsTUFFTztBQUNILGNBQU1FLElBQUksR0FBR3pCLFlBQVksQ0FBQ3NCLEdBQUQsQ0FBekI7O0FBQ0EsY0FBSSxRQUFPQyxLQUFQLE1BQWlCRSxJQUFyQixFQUEyQjtBQUN2Qiw0QkFBU0YsS0FBVCxvQkFBbUJFLElBQW5CO0FBQ0g7QUFDSjtBQUNKLE9BWEQ7QUFZSDs7OzZCQUVnQlgsUSxFQUFrQjtBQUMvQixVQUFJaEIsT0FBTyxHQUFHLEVBQWQ7QUFDQSxVQUFJQyxNQUFNLEdBQUcsRUFBYjs7QUFDQSxVQUFJZSxRQUFRLENBQUNoQixPQUFiLEVBQXNCO0FBQ2xCQSxRQUFBQSxPQUFPLHNEQUEyQ2dCLFFBQVEsQ0FBQ2hCLE9BQVQsQ0FBaUJRLElBQWpCLElBQXlCVCxXQUFXLENBQUNDLE9BQWhGLGNBQVA7QUFDSDs7QUFDRCxVQUFJZ0IsUUFBUSxDQUFDZixNQUFiLEVBQXFCO0FBQ2pCQSxRQUFBQSxNQUFNLHFEQUEwQ2UsUUFBUSxDQUFDZixNQUFULENBQWdCTyxJQUFoQixJQUF3QlQsV0FBVyxDQUFDRSxNQUE5RSxjQUFOO0FBQ0g7O0FBQ0QsVUFBTTJCLE1BQU0sc0tBRzRDWixRQUFRLENBQUNiLEtBQVQsS0FBbUIsS0FBcEIsSUFBK0Isd0JBSDFFLHlGQUkyQmEsUUFBUSxDQUFDWCxLQUpwQyx1RUFLOEJXLFFBQVEsQ0FBQ1YsT0FMdkMsb0VBTTJCTixPQU4zQixTQU1xQ0MsTUFOckMsNkpBQVo7QUFZQSxhQUFPYyxRQUFRLENBQUNjLGFBQVQsQ0FBdUJELE1BQXZCLENBQVA7QUFDSDs7OzJCQVNjWixRLEVBQWtCO0FBQzdCLFVBQU1jLElBQUksR0FBR0MsUUFBUSxDQUFDRCxJQUF0QjtBQUNBLFdBQUtFLE9BQUwsR0FBZSxLQUFLQyxRQUFMLENBQWNqQixRQUFkLENBQWY7QUFDQWMsTUFBQUEsSUFBSSxDQUFDSSxXQUFMLENBQWlCLEtBQUtGLE9BQXRCO0FBQ0g7Ozt1Q0FFMEJoQixRLEVBQWtCO0FBQUE7O0FBQ3pDLFdBQUtVLFNBQUwsQ0FBZVYsUUFBZjtBQUNBLFdBQUtnQixPQUFMLEdBQWUsSUFBZjtBQUNBLFdBQUtoQixRQUFMLEdBQWdCLEVBQWhCO0FBQ0FJLE1BQUFBLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlTCxRQUFmLEVBQXlCTSxHQUF6QixDQUE2QixVQUFDQyxHQUFELEVBQVE7QUFDakMsUUFBQSxNQUFJLENBQUNQLFFBQUwsQ0FBY08sR0FBRyxDQUFDLENBQUQsQ0FBakIsSUFBd0JBLEdBQUcsQ0FBQyxDQUFELENBQTNCO0FBQ0gsT0FGRDtBQUdIOzs7OEJBRWlCUCxRLEVBQW1CO0FBQUE7O0FBQ2pDLFVBQUltQixNQUFNLENBQUNDLE9BQVgsRUFBb0I7QUFDaEJyQixRQUFBQSxRQUFRLENBQUNFLFdBQVQsQ0FBcUJvQixJQUFyQixDQUEwQkYsTUFBTSxDQUFDQyxPQUFqQztBQUNIOztBQUNERCxNQUFBQSxNQUFNLENBQUNDLE9BQVAsR0FBaUIsVUFBQUUsQ0FBQyxFQUFHO0FBQ2pCLFlBQUl0QixRQUFRLENBQUNOLFFBQVQsS0FBc0I0QixDQUFDLENBQUNDLE9BQTVCLEVBQXFDO0FBQ2pDLFVBQUEsTUFBSSxDQUFDcEMsS0FBTDs7QUFDQTtBQUNIOztBQUNELFlBQUlhLFFBQVEsQ0FBQ0wsU0FBVCxLQUF1QjJCLENBQUMsQ0FBQ0MsT0FBN0IsRUFBc0M7QUFDakN2QixVQUFBQSxRQUFRLENBQUNmLE1BQVQsQ0FBZ0JNLFFBQWpCLElBQStCUyxRQUFRLENBQUNmLE1BQVQsQ0FBZ0JNLFFBQWhCLEVBQS9COztBQUNBLFVBQUEsTUFBSSxDQUFDSixLQUFMOztBQUNBO0FBQ0g7O0FBQ0QsWUFBSWEsUUFBUSxDQUFDSixVQUFULEtBQXdCMEIsQ0FBQyxDQUFDQyxPQUE5QixFQUF1QztBQUNsQ3ZCLFVBQUFBLFFBQVEsQ0FBQ2hCLE9BQVQsQ0FBaUJPLFFBQWxCLElBQWdDUyxRQUFRLENBQUNoQixPQUFULENBQWlCTyxRQUFqQixFQUFoQztBQUNBO0FBQ0g7QUFDSixPQWREOztBQWVBLFVBQUlTLFFBQVEsQ0FBQ1osUUFBYixFQUF1QjtBQUNuQixhQUFLNEIsT0FBTCxDQUFhUSxhQUFiLENBQTJCLGlCQUEzQixFQUE4Q0MsT0FBOUMsR0FBd0QsWUFBSztBQUN6RCxVQUFBLE1BQUksQ0FBQ3RDLEtBQUw7QUFDSCxTQUZEO0FBR0g7O0FBQ0QsV0FBSzZCLE9BQUwsQ0FBYVEsYUFBYixDQUEyQixtQkFBM0IsRUFBZ0RDLE9BQWhELEdBQTBELFlBQUs7QUFDM0QsUUFBQSxNQUFJLENBQUN0QyxLQUFMO0FBQ0gsT0FGRDs7QUFHQSxXQUFLNkIsT0FBTCxDQUFhUSxhQUFiLENBQTJCLG9CQUEzQixFQUFpREMsT0FBakQsR0FBMkQsVUFBQ0gsQ0FBRCxFQUFNO0FBQzdELFlBQU1JLElBQUksR0FBR0osQ0FBQyxDQUFDSyxNQUFGLENBQVNELElBQXRCOztBQUNBLGdCQUFRQSxJQUFSO0FBQ0ksZUFBSyxTQUFMO0FBQ0sxQixZQUFBQSxRQUFRLENBQUNoQixPQUFULENBQWlCTyxRQUFsQixJQUFnQ1MsUUFBUSxDQUFDaEIsT0FBVCxDQUFpQk8sUUFBakIsRUFBaEM7QUFDQTs7QUFDSixlQUFLLFFBQUw7QUFDSSxZQUFBLE1BQUksQ0FBQ0osS0FBTDs7QUFDQ2EsWUFBQUEsUUFBUSxDQUFDZixNQUFULENBQWdCTSxRQUFqQixJQUErQlMsUUFBUSxDQUFDZixNQUFULENBQWdCTSxRQUFoQixFQUEvQjtBQUNBO0FBUFI7QUFTSCxPQVhEO0FBWUg7Ozt5QkFFV1MsUSxFQUFtQjtBQUFBOztBQUMzQixVQUFJLEtBQUtnQixPQUFMLEtBQWlCLElBQXJCLEVBQTJCO0FBQ3ZCLFlBQUlZLElBQUksR0FBYXhCLE1BQU0sQ0FBQ3lCLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUs3QixRQUF2QixDQUFyQjs7QUFDQSxZQUFJQSxRQUFKLEVBQWM7QUFDVixlQUFLVSxTQUFMLENBQWVWLFFBQWY7QUFDQUksVUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVMLFFBQWYsRUFBeUJNLEdBQXpCLENBQTZCLFVBQUNDLEdBQUQsRUFBUTtBQUNqQyxnQkFBTUMsR0FBRyxHQUFHRCxHQUFHLENBQUMsQ0FBRCxDQUFmO0FBQ0EsZ0JBQU1FLEtBQUssR0FBR0YsR0FBRyxDQUFDLENBQUQsQ0FBakI7O0FBQ0EsZ0JBQUksTUFBSSxDQUFDUCxRQUFMLENBQWNRLEdBQWQsTUFBdUJDLEtBQTNCLEVBQWtDO0FBQzlCbUIsY0FBQUEsSUFBSSxDQUFDcEIsR0FBRCxDQUFKLEdBQVlDLEtBQVo7QUFDSDtBQUNKLFdBTkQ7QUFPSDs7QUFDRCxhQUFLcUIsTUFBTCxDQUFZRixJQUFaO0FBQ0EsYUFBS0csU0FBTCxDQUFlSCxJQUFmOztBQUNBLFlBQUlBLElBQUksQ0FBQy9CLEtBQVQsRUFBZ0I7QUFDWixjQUFNbUMsTUFBTSxHQUFHLFNBQVRBLE1BQVMsR0FBSztBQUNoQixZQUFBLE1BQUksQ0FBQ2hCLE9BQUwsQ0FBYVEsYUFBYixDQUEyQixpQkFBM0IsRUFBOENTLG1CQUE5QyxDQUFrRSxjQUFsRSxFQUFrRkQsTUFBbEY7O0FBQ0FKLFlBQUFBLElBQUksQ0FBQy9CLEtBQUw7QUFDSCxXQUhEOztBQUlBLGVBQUttQixPQUFMLENBQWFRLGFBQWIsQ0FBMkIsaUJBQTNCLEVBQThDVSxnQkFBOUMsQ0FBK0QsY0FBL0QsRUFBK0VGLE1BQS9FO0FBQ0g7O0FBQ0QsWUFBSUosSUFBSSxDQUFDbkMsU0FBVCxFQUFvQjtBQUNoQjBDLFVBQUFBLFlBQVksQ0FBQyxLQUFLQyxHQUFOLENBQVo7QUFDQSxlQUFLcEIsT0FBTCxDQUFhUSxhQUFiLENBQTJCLHFCQUEzQixFQUFrRGEsS0FBbEQsQ0FBd0RDLGlCQUF4RCxHQUE0RVYsSUFBSSxDQUFDbkMsU0FBTCxHQUFpQixJQUFqQixHQUF3QixHQUFwRztBQUNBLGVBQUsyQyxHQUFMLEdBQVdHLFVBQVUsQ0FBQyxZQUFLO0FBQ3ZCLFlBQUEsTUFBSSxDQUFDcEQsS0FBTDtBQUNILFdBRm9CLEVBRWxCeUMsSUFBSSxDQUFDbkMsU0FGYSxDQUFyQjtBQUdIO0FBQ0o7QUFDSjs7OzBCQUVZRixRLEVBQW1CO0FBQUE7O0FBQzVCLFVBQU15QixPQUFPLEdBQUcsS0FBS0EsT0FBckI7O0FBQ0EsVUFBSUEsT0FBSixFQUFhO0FBQ1QsWUFBTXdCLFdBQVcsR0FBR3pDLFFBQVEsQ0FBQ0UsV0FBVCxDQUFxQndDLE1BQXpDOztBQUNBLFlBQUlELFdBQUosRUFBaUI7QUFDYnJCLFVBQUFBLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnJCLFFBQVEsQ0FBQ0UsV0FBVCxDQUFxQnlDLEdBQXJCLEVBQWpCO0FBQ0gsU0FGRCxNQUVPO0FBQ0h2QixVQUFBQSxNQUFNLENBQUNDLE9BQVAsR0FBaUIsSUFBakI7QUFDSDs7QUFDREosUUFBQUEsT0FBTyxDQUFDMkIsU0FBUixDQUFrQkMsR0FBbEIsQ0FBc0IsT0FBdEI7QUFDQTVCLFFBQUFBLE9BQU8sQ0FBQ1EsYUFBUixDQUFzQixpQkFBdEIsRUFBeUNVLGdCQUF6QyxDQUEwRCxjQUExRCxFQUEwRSxZQUFLO0FBQzNFLGNBQUksTUFBSSxDQUFDbEMsUUFBTCxDQUFjRixNQUFsQixFQUEwQjtBQUN0QixZQUFBLE1BQUksQ0FBQ0UsUUFBTCxDQUFjRixNQUFkO0FBQ0g7O0FBQ0QsY0FBSVAsUUFBSixFQUFjO0FBQ1ZBLFlBQUFBLFFBQVE7QUFDWDs7QUFDRHlCLFVBQUFBLE9BQU8sQ0FBQzZCLE1BQVI7QUFDSCxTQVJEO0FBU0EsYUFBSzdCLE9BQUwsR0FBZSxJQUFmO0FBQ0g7QUFDSjs7O2tDQXBIb0I4QixHLEVBQVc7QUFDNUIsVUFBTUMsUUFBUSxHQUFHaEMsUUFBUSxDQUFDaUMsYUFBVCxDQUF1QixVQUF2QixDQUFqQjtBQUNBRixNQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ0csSUFBSixFQUFOO0FBQ0FGLE1BQUFBLFFBQVEsQ0FBQ0csU0FBVCxHQUFxQkosR0FBckI7QUFDQSxhQUFPQyxRQUFRLENBQUN6RCxPQUFULENBQWlCNkQsVUFBeEI7QUFDSCIsImZpbGUiOiJ1eC1kaWFsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbnRlcmZhY2UgQnV0dG9uIHtcbiAgICBjYWxsYmFjaz86IEZ1bmN0aW9uO1xuICAgIHRleHQ/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBDb250ZW50cyB7XG4gICAgdGl0bGU/OiBzdHJpbmc7XG4gICAgY29udGVudD86IHN0cmluZyB8IE5vZGU7XG4gICAgY29uZmlybT86IEJ1dHRvbiB8IG51bGw7XG4gICAgY2FuY2VsPzogQnV0dG9uIHwgbnVsbDtcbiAgICBjbG9zZT86IGJvb2xlYW47XG4gICAgZGltQ2xvc2U/OiBib29sZWFuO1xuICAgIHNlbGZDbG9zZT86IG51bWJlcjtcbiAgICBjbG9zZUtleT86IG51bWJlcjtcbiAgICBjYW5jZWxLZXk/OiBudW1iZXI7XG4gICAgY29uZmlybUtleT86IG51bWJlcjtcbiAgICBvcGVuZD86IEZ1bmN0aW9uO1xuICAgIGNsb3NlZD86IEZ1bmN0aW9uO1xufVxuXG5jb25zdCBkZWZhdWx0VGV4dCA9IHtcbiAgICBjb25maXJtOiAn7ZmV7J24JyxcbiAgICBjYW5jZWw6ICfst6jshownXG59O1xuXG5jb25zdCBjb250ZW50c1R5cGUgPSB7XG4gICAgY29uZmlybTogJ2Jvb2xlYW4nLFxuICAgIGNhbmNlbDogJ2Jvb2xlYW4nLFxuICAgIGNsb3NlOiAnYm9vbGVhbicsXG4gICAgZGltQ2xvc2U6ICdib29sZWFuJyxcbiAgICB0aXRsZTogJ3N0cmluZycsXG4gICAgY29udGVudDogJ3N0cmluZycsXG4gICAgY2FsbGJhY2s6ICdmdW5jdGlvbicsXG4gICAgdGV4dDogJ3N0cmluZycsXG4gICAgc2VsZkNsb3NlOiAnbnVtYmVyJyxcbiAgICBjbG9zZUtleTogJ251bWJlcicsXG4gICAgY2FuY2VsS2V5OiAnbnVtYmVyJyxcbiAgICBjb25maXJtS2V5OiAnbnVtYmVyJyxcbiAgICBvcGVuZDogJ2Z1bmN0aW9uJyxcbiAgICBjbG9zZWQ6ICdmdW5jdGlvbicsXG59O1xuXG5jbGFzcyBVeERpYWxvZyB7XG4gICAgc3RhdGljIGtleVVwRXZlbnRzOiBhbnlbXTtcbiAgICBwcml2YXRlIHN0bzogYW55O1xuICAgIHByaXZhdGUgZWxlbWVudDogYW55O1xuICAgIHByaXZhdGUgY29udGVudHM6IENvbnRlbnRzO1xuXG4gICAgY29uc3RydWN0b3IoY29udGVudHM6IENvbnRlbnRzKSB7XG4gICAgICAgIGlmICghVXhEaWFsb2cua2V5VXBFdmVudHMpIHtcbiAgICAgICAgICAgIFV4RGlhbG9nLmtleVVwRXZlbnRzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXREZWZhdWx0Q29udGVudHMoY29udGVudHMgfHwge30pO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tUeXBlKG9iamVjdDogb2JqZWN0KTogdm9pZCB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG9iamVjdCkubWFwKCh2YWwpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHZhbFswXTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdmFsWzFdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHlwZSh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBjb250ZW50c1R5cGVba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGAke3ZhbHVlfeuKlCAke3R5cGV97J20IOyVhOuLmeuLiOuLpC5gXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1ha2VOb2RlKGNvbnRlbnRzOiBDb250ZW50cyk6IGFueSB7XG4gICAgICAgIGxldCBjb25maXJtID0gJyc7XG4gICAgICAgIGxldCBjYW5jZWwgPSAnJztcbiAgICAgICAgaWYgKGNvbnRlbnRzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIGNvbmZpcm0gPSBgPGJ1dHRvbiBuYW1lPVwiY29uZmlybVwiIHR5cGU9XCJidXR0b25cIj4ke2NvbnRlbnRzLmNvbmZpcm0udGV4dCB8fCBkZWZhdWx0VGV4dC5jb25maXJtfTwvYnV0dG9uPmBcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29udGVudHMuY2FuY2VsKSB7XG4gICAgICAgICAgICBjYW5jZWwgPSBgPGJ1dHRvbiBuYW1lPVwiY2FuY2VsXCIgdHlwZT1cImJ1dHRvblwiPiR7Y29udGVudHMuY2FuY2VsLnRleHQgfHwgZGVmYXVsdFRleHQuY2FuY2VsfTwvYnV0dG9uPmBcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkaWFsb2cgPSBgIFxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJ1eC1kaWFsb2ctLWNsb3NlXCIgJHsoY29udGVudHMuY2xvc2UgPT09IGZhbHNlKSAmJiAoJ3N0eWxlPVwiZGlzcGxheTogbm9uZTtcIicpfT50aGlzIGRpYWxvZyBjbG9zZTwvYnV0dG9uPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1oZWFkZXJcIj4ke2NvbnRlbnRzLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXgtZGlhbG9nLS1jb250YWluZXJcIj4ke2NvbnRlbnRzLmNvbnRlbnR9PC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1eC1kaWFsb2ctLWZvb3RlclwiPiR7Y29uZmlybX0ke2NhbmNlbH08L2Rpdj5cbiAgICAgICAgICAgICAgPGkgY2xhc3M9XCJ1eC1kaWFsb2ctLWxvYWRpbmdcIj48L2k+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxpIGNsYXNzPVwidXgtZGlhbG9nLS1kaW1cIj48L2k+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIGA7XG4gICAgICAgIHJldHVybiBVeERpYWxvZy5odG1sVG9FbGVtZW50KGRpYWxvZyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGh0bWxUb0VsZW1lbnQoc3RyOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICAgIHN0ciA9IHN0ci50cmltKCk7XG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IHN0cjtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuZmlyc3RDaGlsZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFwcGVuZChjb250ZW50czogQ29udGVudHMpIHtcbiAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMubWFrZU5vZGUoY29udGVudHMpO1xuICAgICAgICBib2R5LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXREZWZhdWx0Q29udGVudHMoY29udGVudHM6IENvbnRlbnRzKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2hlY2tUeXBlKGNvbnRlbnRzKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5jb250ZW50cyA9IHt9O1xuICAgICAgICBPYmplY3QuZW50cmllcyhjb250ZW50cykubWFwKCh2YWwpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udGVudHNbdmFsWzBdXSA9IHZhbFsxXTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBiaW5kRXZlbnQoY29udGVudHM/OiBDb250ZW50cykge1xuICAgICAgICBpZiAod2luZG93Lm9ua2V5dXApIHtcbiAgICAgICAgICAgIFV4RGlhbG9nLmtleVVwRXZlbnRzLnB1c2god2luZG93Lm9ua2V5dXApO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5vbmtleXVwID0gZSA9PiB7XG4gICAgICAgICAgICBpZiAoY29udGVudHMuY2xvc2VLZXkgPT09IGUua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudHMuY2FuY2VsS2V5ID09PSBlLmtleUNvZGUpIHtcbiAgICAgICAgICAgICAgICAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29udGVudHMuY29uZmlybUtleSA9PT0gZS5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgKGNvbnRlbnRzLmNvbmZpcm0uY2FsbGJhY2spICYmIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKCkpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGNvbnRlbnRzLmRpbUNsb3NlKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tZGltJykub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1jbG9zZScpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1mb290ZXInKS5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBlLnRhcmdldC5uYW1lO1xuICAgICAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29uZmlybSc6XG4gICAgICAgICAgICAgICAgICAgIChjb250ZW50cy5jb25maXJtLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY29uZmlybS5jYWxsYmFjaygpKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY2FuY2VsJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgICAgICAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKSAmJiAoY29udGVudHMuY2FuY2VsLmNhbGxiYWNrKCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBvcGVuKGNvbnRlbnRzPzogQ29udGVudHMpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IG9uY2U6IENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jb250ZW50cyk7XG4gICAgICAgICAgICBpZiAoY29udGVudHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrVHlwZShjb250ZW50cyk7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMoY29udGVudHMpLm1hcCgodmFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IHZhbFswXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB2YWxbMV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRzW2tleV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvbmNlW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hcHBlbmQob25jZSk7XG4gICAgICAgICAgICB0aGlzLmJpbmRFdmVudChvbmNlKTtcbiAgICAgICAgICAgIGlmIChvbmNlLm9wZW5kKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tZGltJykucmVtb3ZlRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgYWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgb25jZS5vcGVuZCgpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51eC1kaWFsb2ctLWRpbScpLmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGFjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob25jZS5zZWxmQ2xvc2UpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5zdG8pO1xuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXgtZGlhbG9nLS1sb2FkaW5nJykuc3R5bGUuYW5pbWF0aW9uRHVyYXRpb24gPSBvbmNlLnNlbGZDbG9zZSAvIDEwMDAgKyAncyc7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG8gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIH0sIG9uY2Uuc2VsZkNsb3NlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBjbG9zZShjYWxsYmFjaz86IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBrZXlVcExlbmd0aCA9IFV4RGlhbG9nLmtleVVwRXZlbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChrZXlVcExlbmd0aCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5vbmtleXVwID0gVXhEaWFsb2cua2V5VXBFdmVudHMucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5vbmtleXVwID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnY2xvc2UnKTtcbiAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvcignLnV4LWRpYWxvZy0tZGltJykuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRzLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRzLmNsb3NlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuIl19
