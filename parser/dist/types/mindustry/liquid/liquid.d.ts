import { LiquidName } from './liquid_name';
export declare class Liquid {
    readonly name: LiquidName;
    private static liquidMap;
    readonly color: string;
    private constructor();
    static create(name: LiquidName): Liquid;
    static fromCode(code: number): Liquid;
}
