import { ItemName } from './item_name';
/**
 * Represents item usage by an action
 */
export declare type ItemCost = {
    [x in ItemName]?: number;
};
