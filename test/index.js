/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.on = function (eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [listener];
        }
        else {
            this.events[eventName].push(listener);
        }
        return this;
    };
    EventEmitter.prototype.emit = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.events[eventName])
            return false;
        this.events[eventName].forEach(function (listener) { return listener.apply(void 0, args); });
        return true;
    };
    EventEmitter.prototype.off = function (eventName, listener) {
        var listeners = this.events[eventName];
        if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
                if (listeners[i] === listener || listeners[i] === listener.fn) {
                    listeners.splice(i, 1);
                }
            }
        }
        return this;
    };
    EventEmitter.prototype.once = function (eventName, listener) {
        var _this = this;
        var on = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            listener.apply(void 0, args);
            _this.off(eventName, on);
        };
        on.fn = listener;
        this.on(eventName, on);
        return this;
    };
    return EventEmitter;
}());

var ACTION_TYPE;
(function (ACTION_TYPE) {
    ACTION_TYPE[ACTION_TYPE["INIT"] = 1001] = "INIT";
    ACTION_TYPE[ACTION_TYPE["START"] = 1002] = "START";
    ACTION_TYPE[ACTION_TYPE["UPDATE"] = 1003] = "UPDATE";
    ACTION_TYPE[ACTION_TYPE["GETSTATE"] = 1004] = "GETSTATE";
    ACTION_TYPE[ACTION_TYPE["SETSTATE"] = 1005] = "SETSTATE";
    ACTION_TYPE[ACTION_TYPE["END"] = 1010] = "END";
})(ACTION_TYPE || (ACTION_TYPE = {}));
var CALLBACK_TYPE;
(function (CALLBACK_TYPE) {
    CALLBACK_TYPE[CALLBACK_TYPE["INIT"] = 2001] = "INIT";
    CALLBACK_TYPE[CALLBACK_TYPE["OTHERS"] = 2002] = "OTHERS";
})(CALLBACK_TYPE || (CALLBACK_TYPE = {}));
var MD5Tool = /** @class */ (function () {
    function MD5Tool(options) {
        var _this = this;
        this.chunkSize = MD5Tool.BASIS_CHUNK_SIZE;
        this.handler = null;
        this.worker = null;
        this.event = null;
        this.entryAddress = null;
        this.wasmAddress = null;
        if (options.chunkSize) {
            if (options.chunkSize / MD5Tool.BASIS_CHUNK_SIZE > 0 &&
                options.chunkSize % MD5Tool.BASIS_CHUNK_SIZE === 0) {
                this.chunkSize = options.chunkSize;
            }
            else {
                console.warn("The chunkSize should be a multiple of 5MB(MD5Tool.MD5Tool.BASIS_CHUNK_SIZE).");
            }
        }
        this.entryAddress = options.entry;
        this.wasmAddress = options.wasm;
        this.event = new EventEmitter();
        this.handler = {
            start: function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage([ACTION_TYPE.START]);
                            return [4 /*yield*/, this.actionDone(CALLBACK_TYPE.OTHERS)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); },
            update: function (chuck) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage([ACTION_TYPE.UPDATE, this.getU8ABFromAB(chuck)]);
                            return [4 /*yield*/, this.actionDone(CALLBACK_TYPE.OTHERS)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); },
            getState: function () { return __awaiter(_this, void 0, void 0, function () {
                var result;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage([ACTION_TYPE.GETSTATE]);
                            return [4 /*yield*/, this.actionDone(CALLBACK_TYPE.OTHERS)];
                        case 1:
                            result = _b.sent();
                            return [2 /*return*/, result];
                    }
                });
            }); },
            setState: function (state) { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage([ACTION_TYPE.SETSTATE, state]);
                            return [4 /*yield*/, this.actionDone(CALLBACK_TYPE.OTHERS)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            }); },
            end: function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            (_a = this.worker) === null || _a === void 0 ? void 0 : _a.postMessage([ACTION_TYPE.END]);
                            return [4 /*yield*/, this.actionDone(CALLBACK_TYPE.OTHERS)];
                        case 1: return [2 /*return*/, _b.sent()];
                    }
                });
            }); },
        };
    }
    /**
     * load resources
     * @private
     */
    MD5Tool.prototype.initWorker = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all([fetch(this.entryAddress), fetch(this.wasmAddress)]).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = {};
                                    return [4 /*yield*/, res[0].arrayBuffer()];
                                case 1:
                                    _a.entry = _b.sent();
                                    return [4 /*yield*/, res[1].arrayBuffer()];
                                case 2: return [2 /*return*/, (_a.wasm = _b.sent(),
                                        _a)];
                            }
                        });
                    }); }).then(function (map) { return __awaiter(_this, void 0, void 0, function () {
                        var entryUrl, worker;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    entryUrl = URL.createObjectURL(new Blob([new Uint8Array(map.entry)], { type: "text/javascript" }));
                                    worker = new Worker(entryUrl);
                                    worker.onmessage = function (ev) {
                                        var _a;
                                        var _b = ev.data, callbackType = _b[0], data = _b[1];
                                        (_a = _this.event) === null || _a === void 0 ? void 0 : _a.emit(String(callbackType), data);
                                    };
                                    worker.postMessage([ACTION_TYPE.INIT, this.getU8ABFromAB(map.wasm)]);
                                    return [4 /*yield*/, this.actionDone(CALLBACK_TYPE.INIT)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/, worker];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * get SharedArrayBuffer(Uint8Array) from ArrayBuffer
     * @param data
     * @private
     */
    // private getU8ASABFromAB(data: ArrayBuffer): Uint8Array {
    //     let u8a = new Uint8Array(data)
    //     let sab = new SharedArrayBuffer(u8a.byteLength);
    //     // let t_u8a = new Uint8Array(sab);
    //     // t_u8a = u8a;
    //     // return t_u8a;
    //     return u8a;
    // }
    /**
     * get Uint8Array from ArrayBuffer
     * @param data
     * @returns
     */
    MD5Tool.prototype.getU8ABFromAB = function (data) {
        return new Uint8Array(data);
    };
    /**
     * register action done callback
     * @param callbackType
     * @private
     */
    MD5Tool.prototype.actionDone = function (callbackType) {
        return __awaiter(this, void 0, Promise, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var _a;
                        (_a = _this.event) === null || _a === void 0 ? void 0 : _a.once(String(callbackType), function (res) {
                            resolve(res);
                        });
                    })];
            });
        });
    };
    MD5Tool.prototype.init = function () {
        return __awaiter(this, void 0, Promise, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.worker === null)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.initWorker()];
                    case 1:
                        _a.worker = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this];
                }
            });
        });
    };
    MD5Tool.prototype.start = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.handler) {
                            throw ('please init first');
                        }
                        return [4 /*yield*/, this.handler.start()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    MD5Tool.prototype.update = function (chuck) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.handler) {
                            throw ('please init first');
                        }
                        return [4 /*yield*/, this.handler.update(chuck)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    MD5Tool.prototype.getState = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.handler) {
                            throw ('please init first');
                        }
                        return [4 /*yield*/, this.handler.getState()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MD5Tool.prototype.setState = function (chuck) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.handler) {
                            throw ('please init first');
                        }
                        return [4 /*yield*/, this.handler.setState(chuck)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    MD5Tool.prototype.end = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.handler) {
                            throw ('please init first');
                        }
                        return [4 /*yield*/, this.handler.end()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MD5Tool.prototype.destroy = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                this.handler = null;
                if (this.worker) {
                    this.worker.terminate();
                    this.worker = null;
                }
                return [2 /*return*/, this];
            });
        });
    };
    MD5Tool.BASIS_CHUNK_SIZE = 1024 * 1024 * 5; // default 5MB
    return MD5Tool;
}());

export { MD5Tool as default };
