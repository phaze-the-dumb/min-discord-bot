import { BlockOutput, BlockOutputDirection } from './helper';
import { Block } from './block';
import { RenderingInfo } from '../../util';
import { SchematicTile } from '../../schematic';
declare abstract class Drill extends Block {
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class MechanicalDrill extends Drill {
    name: string;
    requirements: {
        copper: number;
    };
    size: number;
}
export declare class PneumaticDrill extends Drill {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
    };
    size: number;
}
export declare class LaserDrill extends Drill {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
        silicon: number;
        titanium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class BlastDrill extends Drill {
    name: string;
    requirements: {
        copper: number;
        silicon: number;
        titanium: number;
        thorium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class WaterExtractor extends Drill {
    name: string;
    requirements: {
        metaglass: number;
        graphite: number;
        lead: number;
    };
    size: number;
    powerConsumption: number;
    output: BlockOutput;
}
export declare class Cultivator extends Block {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        silicon: number;
    };
    size: number;
    powerConsumption: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class OilExtractor extends Drill {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
        lead: number;
        thorium: number;
        silicon: number;
    };
    size: number;
    powerConsumption: number;
}
export {};
