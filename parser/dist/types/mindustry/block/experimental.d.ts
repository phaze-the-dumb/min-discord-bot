import { BlockOutput, BlockOutputDirection } from './helper';
import { Block } from './block';
import { RenderingInfo } from '../../util';
import { SchematicTile } from '../../schematic';
declare abstract class ExperimentalBlock extends Block {
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class BlockForge extends ExperimentalBlock {
    name: string;
    requirements: {
        thorium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class BlockLoader extends ExperimentalBlock {
    name: string;
    requirements: {
        thorium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class BlockUnloader extends ExperimentalBlock {
    name: string;
    requirements: {
        thorium: number;
    };
    size: number;
    powerConsumption: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
}
export {};
