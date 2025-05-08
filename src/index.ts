import EventEmitter from "./event";

interface MD5ToolOptions {
    entry: string
    worker: string
    wasm: string
    chunkSize?: number
}

enum ACTION_TYPE {
    INIT = 1001,
    START,
    UPDATE,
    end,
    STATE,
    RESTORE,
}

enum CALLBACK_TYPE {
    INIT = 2001,
    OTHERS,
}

export default class MD5Tool {
    public static BASIS_CHUNK_SIZE = 1024 * 1024 * 5; // default 5MB

    private chunkSize: number = MD5Tool.BASIS_CHUNK_SIZE;
    private handler: any = null;

    private worker: Worker | null = null;
    private event: EventEmitter | null = null;

    private readonly entryAddress: string | null= null;
    private readonly wasmAddress: string | null = null;

    constructor(options: MD5ToolOptions) {
        if (options.chunkSize) {
            if (options.chunkSize / MD5Tool.BASIS_CHUNK_SIZE > 0 &&
                options.chunkSize % MD5Tool.BASIS_CHUNK_SIZE === 0) {
                this.chunkSize = options.chunkSize;
            } else {
                console.warn("The chunkSize should be a multiple of 5MB(MD5Tool.MD5Tool.BASIS_CHUNK_SIZE).");
            }
        }

        this.entryAddress = options.entry;
        this.wasmAddress = options.wasm;

        this.event = new EventEmitter();

        this.handler = {
            start: async () => {
                this.worker?.postMessage([1002]);
                await this.actionDone(CALLBACK_TYPE.OTHERS);
            },
            update: async (chuck: ArrayBuffer) => {
                this.worker?.postMessage([1003, this.getU8ABFromAB(chuck)]);
                await this.actionDone(CALLBACK_TYPE.OTHERS);
            },
            end: async () => {
                this.worker?.postMessage([1004]);
                return await this.actionDone(CALLBACK_TYPE.OTHERS);
            },
            state: async () => {
                this.worker?.postMessage([1005]);
                const result = await this.actionDone(CALLBACK_TYPE.OTHERS);
                return result;
            },
            restore: async (state: string) => {
                this.worker?.postMessage([1006, state]);
                await this.actionDone(CALLBACK_TYPE.OTHERS);
            }
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

    public async init(): Promise<MD5Tool> {
        if (this.worker === null) {
            this.worker = await this.initWorker();
        }
        return this;
    }

    public async start(): Promise<MD5Tool> {
        if (!this.handler) {
            throw('please init first');
        }
        await this.handler.start();

        return this;
    }

    public async update(chuck: ArrayBuffer): Promise<MD5Tool> {
        if (!this.handler) {
            throw('please init first');
        }

        await this.handler.update(chuck);

        return this;
    }

    public async state(): Promise<ArrayBuffer> {
        if (!this.handler) {
            throw('please init first');
        }

        return await this.handler.state();

    }

    public async restore(chuck: ArrayBuffer): Promise<MD5Tool> {
        if (!this.handler) {
            throw('please init first');
        }

        await this.handler.restore(chuck);

        return this;
    }

    public async end(): Promise<MD5Tool> {
        if (!this.handler) {
            throw('please init first');
        }

        return await this.handler.end();
    }

    public async destroy(): Promise<MD5Tool> {
        this.handler = null;
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }

        return this;
    }
}