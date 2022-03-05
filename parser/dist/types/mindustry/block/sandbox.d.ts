import { BlockOutput, BlockOutputDirection } from './helper';
import { RenderingInfo } from '../../util';
import { Block } from './block';
import { SchematicTile } from '../../schematic';
declare abstract class SandBoxBlock extends Block {
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class PowerSource extends SandBoxBlock {
    name: string;
    requirements: {};
    size: number;
}
export declare class PowerVoid extends SandBoxBlock {
    name: string;
    requirements: {};
    size: number;
}
export declare class ItemSource extends SandBoxBlock {
    name: string;
    requirements: {};
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class ItemVoid extends SandBoxBlock {
    name: string;
    requirements: {};
    size: number;
}
export declare class LiquidSource extends SandBoxBlock {
    name: string;
    requirements: {};
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class LiquidVoid extends SandBoxBlock {
    name: string;
    requirements: {};
    size: number;
}
export declare abstract class LightBlock extends SandBoxBlock {
}
export declare class Illuminator extends LightBlock {
    name: string;
    requirements: {
        graphite: number;
        silicon: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class PayloadSource extends SandBoxBlock {
    name: string;
    requirements: {};
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class PayloadVoid extends SandBoxBlock {
    name: string;
    requirements: {};
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export {};
