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
    opend?: Function;
    closed?: Function;
}

const defaultText = {
    confirm: '확인',
    cancel: '취소'
};

const contentsType = {
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
    closed: 'function',
};

class UxDialog {
    static keyUpEvents: any[];
    private sto: any;
    private element: any;
    private contents: Contents;

    constructor(contents: Contents) {
        if (!UxDialog.keyUpEvents) {
            UxDialog.keyUpEvents = [];
        }
        this.getDefaultContents(contents || {});
    }

    private checkType(object: object): void {
        Object.entries(object).map((val) => {
            const key = val[0];
            const value = val[1];
            if (typeof value === 'object') {
                this.checkType(value);
            } else {
                const type = contentsType[key];
                if (typeof value !== type) {
                    throw `${value}는 ${type}이 아닙니다.`
                }
            }
        });
    }

    private makeNode(contents: Contents): any {
        let confirm = '';
        let cancel = '';
        if (contents.confirm) {
            confirm = `<button name="confirm" type="button">${contents.confirm.text || defaultText.confirm}</button>`
        }
        if (contents.cancel) {
            cancel = `<button name="cancel" type="button">${contents.cancel.text || defaultText.cancel}</button>`
        }
        const dialog = ` 
          <div class="ux-dialog">
            <div class="ux-dialog--content">
              <button type="button" class="ux-dialog--close" ${(contents.close === false) && ('style="display: none;"')}>this dialog close</button>
              <div class="ux-dialog--header">${contents.title}</div>
              <div class="ux-dialog--container">${contents.content}</div>
              <div class="ux-dialog--footer">${confirm}${cancel}</div>
              <i class="ux-dialog--loading"></i>
            </div>
            <i class="ux-dialog--dim"></i>
          </div>
        `;
        return UxDialog.htmlToElement(dialog);
    }

    static htmlToElement(str: string): any {
        const template = document.createElement('template');
        str = str.trim();
        template.innerHTML = str;
        return template.content.firstChild;
    }

    private append(contents: Contents) {
        const body = document.body;
        this.element = this.makeNode(contents);
        body.appendChild(this.element);
    }

    private getDefaultContents(contents: Contents): void {
        this.checkType(contents);
        this.element = null;
        this.contents = {};
        Object.entries(contents).map((val) => {
            this.contents[val[0]] = val[1];
        });
    }

    private bindEvent(contents?: Contents) {
        if (window.onkeyup) {
            UxDialog.keyUpEvents.push(window.onkeyup);
        }
        window.onkeyup = e => {
            if (contents.closeKey === e.keyCode) {
                this.close();
                return;
            }
            if (contents.cancelKey === e.keyCode) {
                (contents.cancel.callback) && (contents.cancel.callback());
                this.close();
                return;
            }
            if (contents.confirmKey === e.keyCode) {
                (contents.confirm.callback) && (contents.confirm.callback());
                return;
            }
        };
        if (contents.dimClose) {
            this.element.querySelector('.ux-dialog--dim').onclick = () => {
                this.close();
            };
        }
        this.element.querySelector('.ux-dialog--close').onclick = () => {
            this.close();
        };
        this.element.querySelector('.ux-dialog--footer').onclick = (e) => {
            const name = e.target.name;
            switch (name) {
                case 'confirm':
                    (contents.confirm.callback) && (contents.confirm.callback());
                    break;
                case 'cancel':
                    this.close();
                    (contents.cancel.callback) && (contents.cancel.callback());
                    break;
            }
        }
    }

    public open(contents?: Contents): void {
        if (this.element === null) {
            let once: Contents = Object.assign({}, this.contents);
            if (contents) {
                this.checkType(contents);
                Object.entries(contents).map((val) => {
                    const key = val[0];
                    const value = val[1];
                    if (this.contents[key] !== value) {
                        once[key] = value;
                    }
                });
            }
            this.append(once);
            this.bindEvent(once);
            if (once.opend) {
                const action = () => {
                    this.element.querySelector('.ux-dialog--dim').removeEventListener('animationend', action);
                    once.opend();
                };
                this.element.querySelector('.ux-dialog--dim').addEventListener('animationend', action);
            }
            if (once.selfClose) {
                clearTimeout(this.sto);
                this.element.querySelector('.ux-dialog--loading').style.animationDuration = once.selfClose / 1000 + 's';
                this.sto = setTimeout(() => {
                    this.close();
                }, once.selfClose);
            }
        }
    }

    public close(callback?: Function): void {
        const element = this.element;
        if (element) {
            const keyUpLength = UxDialog.keyUpEvents.length;
            if (keyUpLength) {
                window.onkeyup = UxDialog.keyUpEvents.pop();
            } else {
                window.onkeyup = null;
            }
            element.classList.add('close');
            element.querySelector('.ux-dialog--dim').addEventListener('animationend', () => {
                if (this.contents.closed) {
                    this.contents.closed();
                }
                if (callback) {
                    callback();
                }
                element.remove();
            });
            this.element = null;
        }
    }
}

