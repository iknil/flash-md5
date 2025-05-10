import EventEmitter from "./event";

interface FlashMD5Options {
    entry: string
    wasm: string
}

enum ACTION_TYPE {
    INIT = 1001,
    START,
    UPDATE,
    GETSTATE,
    SETSTATE,
    END = 1010,
}

enum CALLBACK_TYPE {
    INIT = 2001,
    OTHERS,
}

export default class FlashMD5 {
    public static BASIS_CHUNK_SIZE = 1024 * 1024 * 5; // default 5MB

    private handler: any = null;

    private worker: Worker | null = null;
    private event: EventEmitter | null = null;

    private readonly entryAddress: string | null= null;
    private readonly wasmAddress: string | null = null;

    constructor(options: FlashMD5Options) {
        this.entryAddress = options.entry;
        this.wasmAddress = options.wasm;

        this.event = new EventEmitter();

        this.handler = {
            start: async () => {
                this.worker?.postMessage([ACTION_TYPE.START]);
                await this.actionDone(CALLBACK_TYPE.OTHERS);
            },
            update: async (chuck: ArrayBuffer) => {
                this.worker?.postMessage([ACTION_TYPE.UPDATE, this.getU8ABFromAB(chuck)]);
                await this.actionDone(CALLBACK_TYPE.OTHERS);
            },
            getState: async () => {
                this.worker?.postMessage([ACTION_TYPE.GETSTATE]);
                const result = await this.actionDone(CALLBACK_TYPE.OTHERS);
                return result;
            },
            setState: async (state: string) => {
                this.worker?.postMessage([ACTION_TYPE.SETSTATE, state]);
                await this.actionDone(CALLBACK_TYPE.OTHERS);
            },
            end: async () => {
                this.worker?.postMessage([ACTION_TYPE.END]);
                return await this.actionDone(CALLBACK_TYPE.OTHERS);
            },
        }
    }

    /**
     * load resources
     * @private
     */
    private async initWorker(): Promise<Worker> {
        return Promise.all([fetch(this.entryAddress as string), fetch(this.wasmAddress as string)]).then(async res => {
            return {
                entry: await res[0].arrayBuffer(),
                wasm: await res[1].arrayBuffer()
            }
        }).then(async map => {
            const entryUrl = URL.createObjectURL(new Blob([new Uint8Array(map.entry)], {type: "text/javascript"}));

            const worker = new Worker(entryUrl);
            worker.onmessage = (ev) => {
                let [callbackType, data] = ev.data;
                this.event?.emit(String(callbackType), data);
            };

            worker.postMessage([ACTION_TYPE.INIT, this.getU8ABFromAB(map.wasm)]);

            await this.actionDone(CALLBACK_TYPE.INIT);

            return worker;
        });
    }
    
    /**
     * get Uint8Array from ArrayBuffer
     * @param data
     * @returns 
     */
    private getU8ABFromAB(data: ArrayBuffer): Uint8Array {
        return new Uint8Array(data);
    }

    /**
     * register action done callback
     * @param callbackType
     * @private
     */
    private async actionDone(callbackType: CALLBACK_TYPE): Promise<any> {
        return new Promise((resolve, reject) => {
            this.event?.once(String(callbackType), (res) => {
                resolve(res);
            })
        })
    }

    public async init(): Promise<FlashMD5> {
        if (this.worker === null) {
            this.worker = await this.initWorker();
        }
        return this;
    }

    public async start(): Promise<FlashMD5> {
        if (!this.handler) {
            throw('please init first');
        }
        await this.handler.start();

        return this;
    }

    public async update(chuck: ArrayBuffer): Promise<FlashMD5> {
        if (!this.handler) {
            throw('please init first');
        }

        await this.handler.update(chuck);

        return this;
    }

    public async getState(): Promise<ArrayBuffer> {
        if (!this.handler) {
            throw('please init first');
        }

        return await this.handler.getState();

    }

    public async setState(chuck: ArrayBuffer): Promise<FlashMD5> {
        if (!this.handler) {
            throw('please init first');
        }

        await this.handler.setState(chuck);

        return this;
    }

    public async end(): Promise<FlashMD5> {
        if (!this.handler) {
            throw('please init first');
        }

        return await this.handler.end();
    }

    public async destroy(): Promise<FlashMD5> {
        this.handler = null;
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        return this;
    }
}