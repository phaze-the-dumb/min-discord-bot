import { BlockImageRenderingOptions, BlockOutput, BlockOutputDirection, BlockRenderingOptions } from './helper';
import { ItemCost } from '../item';
import { UnlockableContent } from '../content';
/**
 * A generic way to represent a block
 */
export declare abstract class Block extends UnlockableContent {
    abstract readonly name: string;
    abstract requirements: ItemCost;
    abstract size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    powerConsumption: number;
    get energyUsage(): number;
    static fromCode(code: string): Block;
    protected renderImage({ info, image, tile, }: BlockImageRenderingOptions): void;
    protected render({ info, category, layers, tile, }: BlockRenderingOptions): Promise<void>;
}
