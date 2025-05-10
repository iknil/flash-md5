interface MD5ToolOptions {
    entry: string;
    worker: string;
    wasm: string;
    chunkSize?: number;
}
declare class MD5Tool {
    static BASIS_CHUNK_SIZE: number;
    private chunkSize;
    private handler;
    private worker;
    private event;
    private readonly entryAddress;
    private readonly wasmAddress;
    constructor(options: MD5ToolOptions);
    /**
     * load resources
     * @private
     */
    private initWorker;
    /**
     * get SharedArrayBuffer(Uint8Array) from ArrayBuffer
     * @param data
     * @private
     */
    /**
     * get Uint8Array from ArrayBuffer
     * @param data
     * @returns
     */
    private getU8ABFromAB;
    /**
     * register action done callback
     * @param callbackType
     * @private
     */
    private actionDone;
    init(): Promise<MD5Tool>;
    start(): Promise<MD5Tool>;
    update(chuck: ArrayBuffer): Promise<MD5Tool>;
    getState(): Promise<ArrayBuffer>;
    setState(chuck: ArrayBuffer): Promise<MD5Tool>;
    end(): Promise<MD5Tool>;
    destroy(): Promise<MD5Tool>;
}

export { MD5Tool as default };
