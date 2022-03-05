import { BlockOutput, BlockOutputDirection } from './helper';
import { RenderingInfo } from '../../util';
import { ItemCost } from '../item';
import { Block } from './block';
import { SchematicTile } from '../../schematic';
declare abstract class TransportBlock extends Block {
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Conveyor extends TransportBlock {
    name: string;
    requirements: ItemCost;
    size: number;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class TitaniumConveyor extends Conveyor {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        titanium: number;
    };
}
export declare class PlastaniumConveyor extends TransportBlock {
    name: string;
    requirements: {
        plastanium: number;
        silicon: number;
        graphite: number;
    };
    size: number;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class ArmoredConveyor extends Conveyor {
    name: string;
    requirements: {
        plastanium: number;
        thorium: number;
        metaglass: number;
    };
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Junction extends TransportBlock {
    name: string;
    requirements: {
        copper: number;
    };
    size: number;
}
export declare class ItemBridge extends TransportBlock {
    name: string;
    requirements: ItemCost;
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class PhaseConveyor extends ItemBridge {
    name: string;
    requirements: {
        'phase-fabric': number;
        silicon: number;
        lead: number;
        graphite: number;
    };
    powerConsumption: number;
}
export declare class Sorter extends TransportBlock {
    name: string;
    requirements: {
        lead: number;
        copper: number;
    };
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class InvertedSorter extends Sorter {
    name: string;
}
export declare class Router extends TransportBlock {
    name: string;
    requirements: {
        copper: number;
    };
    size: number;
}
export declare class Distributor extends TransportBlock {
    name: string;
    requirements: {
        lead: number;
        copper: number;
    };
    size: number;
}
export declare class OverflowGate extends TransportBlock {
    name: string;
    requirements: {
        lead: number;
        copper: number;
    };
    size: number;
}
export declare class UnderflowGate extends TransportBlock {
    name: string;
    requirements: {
        lead: number;
        copper: number;
    };
    size: number;
}
export declare class MassDriver extends TransportBlock {
    name: string;
    requirements: {
        titanium: number;
        silicon: number;
        lead: number;
        thorium: number;
    };
    size: number;
    powerConsumption: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Duct extends TransportBlock {
    name: string;
    outputDirection: BlockOutputDirection;
    requirements: {
        graphite: number;
        metaglass: number;
    };
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class DuctRouter extends TransportBlock {
    name: string;
    requirements: {
        graphite: number;
        metaglass: number;
    };
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class DuctBridge extends TransportBlock {
    name: string;
    requirements: {
        graphite: number;
        metaglass: number;
    };
    size: number;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export {};
