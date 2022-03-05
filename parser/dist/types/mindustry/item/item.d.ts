import { ItemName } from './item_name';
/** A wrapper for `ItemCode`, can be useful with `instanceof` */
export declare class Item {
    readonly code: ItemName;
    private static itemMap;
    readonly color: string;
    private constructor();
    static create(name: ItemName): Item;
    static fromCode(code: number): Item;
}
