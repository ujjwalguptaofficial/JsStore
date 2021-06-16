export class EventBus {

    constructor(ctx?) {
        this._ctx = ctx;
    }

    private _ctx;

    private _events: {
        [key: string]: Function[]
    } = {};

    on(event: string, cb: Function) {
        if (this._events[event] == null) {
            this._events[event] = [];
        }
        this._events[event].push(cb);
        return this;
    }

    off(event: string, cb: Function) {
        if (this._events[event]) {
            if (cb) {
                const index = this._events[event].indexOf(cb);
                this._events[event].splice(index, 1);
            }
            else {
                this._events[event] = [];
            }
        }
    }

    emit(event: string, ...args) {
        const events = this._events[event] || [];
        let index = 0;
        let length = events.length;
        const results = [];
        const callMethod = () => {
            const eventCb = events[index++];
            if (eventCb) {
                const result = eventCb.call(this._ctx, ...args);
                return result && result.then ? result : Promise.resolve(result);
            }
        }

        return new Promise<any[]>((res) => {
            const checkAndCall = () => {
                if (index < length) {
                    callMethod().then(result => {
                        results.push(result);
                        checkAndCall();
                    })
                }
                else {
                    res(results);
                }
            };
            checkAndCall();
        })

    }

    destroy() {
        this._events = null;
        this._ctx = null;
    }
}