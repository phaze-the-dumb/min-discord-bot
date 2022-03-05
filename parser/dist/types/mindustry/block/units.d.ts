import { BlockOutput, BlockOutputDirection } from './helper';
import { RenderingInfo } from '../../util';
import { Block } from './block';
import { ItemCost } from '../item';
import { SchematicTile } from '../../schematic';
declare abstract class Factory extends Block {
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
declare abstract class Reconstructor extends Block {
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class CommandCenter extends Block {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        silicon: number;
        graphite: number;
    };
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class GroundFactory extends Factory {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        silicon: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class AirFactory extends Factory {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class NavalFactory extends Factory {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        metaglass: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class AdditiveReconstructor extends Reconstructor {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        silicon: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class MultiplicativeReconstructor extends Reconstructor {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        titanium: number;
        thorium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class ExponentialReconstructor extends Reconstructor {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        titanium: number;
        thorium: number;
        plastanium: number;
        'phase-fabric': number;
    };
    size: number;
    powerConsumption: number;
}
export declare class TetrativeReconstructor extends Reconstructor {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        thorium: number;
        plastanium: number;
        'phase-fabric': number;
        'surge-alloy': number;
    };
    size: number;
    powerConsumption: number;
}
export declare class RepairPoint extends Block {
    name: string;
    requirements: ItemCost;
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class RepairTurret extends RepairPoint {
    name: string;
    requirements: {
        silicon: number;
        thorium: number;
        plastanium: number;
    };
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class ResupplyPoint extends Block {
    name: string;
    requirements: {
        lead: number;
        copper: number;
        silicon: number;
    };
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export {};
