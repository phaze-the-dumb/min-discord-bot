import { RenderingInfo } from '../../util';
import { Block } from './block';
import { ItemCost } from '../item';
import { SchematicTile } from '../..';
declare abstract class Pad extends Block {
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class LaunchPad extends Pad {
    name: string;
    requirements: ItemCost;
    size: number;
    powerConsumption: number;
}
export declare class InterplanetaryAccelerator extends Block {
    name: string;
    requirements: {
        copper: number;
        silicon: number;
        thorium: number;
        titanium: number;
        'surge-alloy': number;
        'phase-fabric': number;
    };
    size: number;
    powerConsumption: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export {};
