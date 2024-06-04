/// <reference types="vite/client" />
/// <reference path="../source/shared/index.d.ts" />

declare module "*.style.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
}
declare module "*.wav";
declare module "*.mp3";
declare module "*.webp";
declare module "*.webm";
declare module "*.png";
interface Mp {
    events: EventMpPool;
    trigger(name: string, ...args: any[]): void;
    invoke(name: string, ...args: any[]): void;
}

interface EventMpPool {
    /**
     * This function calls registered Remote Procedure Call (RPC) from browser to client-side and expects a callback.
     *
     * @param procName
     * @param args Data you want to send to the client.
     * @returns Returns a promise
     *
     * @example
     * ```js
     * await mp.events.callProc('test_proc', 'test');
     * ```
     *
     *
     */
    callProc<T = any>(procName: string, ...args: any[]): Promise<T>;

    /**
     * Adds browser event that can be called from client side
     * @param name Event name
     * @param callback
     */
    add(name: string, callback: (...args: any[]) => void): void;
    add(names: { [name: string]: (...args: any[]) => void }): void;
    remove(name: string): void;
    call(name: string): void;
}

interface Window {
    mp: Mp;
}

declare var mp: Mp;
