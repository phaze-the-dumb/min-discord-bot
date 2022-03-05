export declare class Flags<T extends number> {
    value: number;
    constructor(value?: 0 | T);
    add(value: T): void;
    remove(value: T): void;
    /**
     * Use it to check whether this has one or more flag values
     *
     * @example
     *    flags.has(1 | 4 | 8); // check if the flags has all of those values
     */
    has(value: number): boolean;
    static has(target: number, value: number): boolean;
    static subtract(target: number, value: number): number;
    valueOf(): number;
}
