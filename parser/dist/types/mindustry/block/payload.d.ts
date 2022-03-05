import { BlockOutput, BlockOutputDirection } from './helper';
import { RenderingInfo } from '../../util';
import { Block } from './block';
import { SchematicTile } from '../../schematic';
export declare class PayloadConveyor extends Block {
    name: string;
    requirements: {
        graphite: number;
        copper: number;
    };
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, { canvas, blockAsset }: RenderingInfo): Promise<void>;
}
export declare class PayloadRouter extends Block {
    name: string;
    requirements: {
        graphite: number;
        copper: number;
    };
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class PayloadPropulsionTower extends Block {
    name: string;
    requirements: {
        thorium: number;
        silicon: number;
        plastanium: number;
        'phase-fabric': number;
    };
    size: number;
    powerConsumption: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
