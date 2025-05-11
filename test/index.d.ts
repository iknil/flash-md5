interface FlashMD5Options {
    entry: string;
    wasm: string;
}
declare class FlashMD5 {
    static BASIS_CHUNK_SIZE: number;
    private handler;
    private worker;
    private event;
    private readonly entryAddress;
    private readonly wasmAddress;
    constructor(options: FlashMD5Options);
    /**
     * load resources
     * @private
     */
    private initWorker;
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
    init(): Promise<FlashMD5>;
    start(): Promise<FlashMD5>;
    update(chuck: ArrayBuffer): Promise<FlashMD5>;
    getState(): Promise<ArrayBuffer>;
    setState(chuck: ArrayBuffer): Promise<FlashMD5>;
    end(): Promise<FlashMD5>;
    destroy(): Promise<FlashMD5>;
}

export { FlashMD5 as default };
