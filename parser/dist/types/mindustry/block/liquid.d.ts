import { BlockOutput, BlockOutputDirection } from './helper';
import { RenderingInfo } from '../../util';
import { Block } from './block';
import { ItemCost } from '../item';
import { SchematicTile } from '../../schematic';
declare abstract class Pump extends Block {
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class MechanicalPump extends Pump {
    name: string;
    requirements: {
        copper: number;
        metaglass: number;
    };
    size: number;
}
export declare class RotaryPump extends Pump {
    name: string;
    requirements: {
        copper: number;
        metaglass: number;
        silicon: number;
        titanium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class ThermalPump extends Pump {
    name: string;
    requirements: {
        copper: number;
        metaglass: number;
        silicon: number;
        titanium: number;
        thorium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class Conduit extends Block {
    name: string;
    requirements: {
        metaglass: number;
    };
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class PulseConduit extends Conduit {
    name: string;
    requirements: {
        titanium: number;
        metaglass: number;
    };
}
export declare class PlatedConduit extends Conduit {
    name: string;
    requirements: {
        thorium: number;
        metaglass: number;
        plastanium: number;
    };
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class LiquidRouter extends Block {
    name: string;
    requirements: ItemCost;
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class LiquidTank extends LiquidRouter {
    name: string;
    requirements: {
        titanium: number;
        metaglass: number;
    };
    size: number;
}
export declare class LiquidJunction extends Block {
    name: string;
    requirements: {
        graphite: number;
        metaglass: number;
    };
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class BridgeConduit extends Block {
    name: string;
    requirements: ItemCost;
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class PhaseConduit extends BridgeConduit {
    name: string;
    powerConsumption: number;
    requirements: {
        'phase-fabric': number;
        silicon: number;
        metaglass: number;
        titanium: number;
    };
}
export {};
