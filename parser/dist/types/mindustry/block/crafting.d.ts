import { BlockOutput, BlockOutputDirection } from './helper';
import { Block } from './block';
import { ItemCost } from '../item/item_cost';
import { RenderingInfo } from '../../util';
import { SchematicTile } from '../../schematic';
declare abstract class GenericCrafter extends Block {
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class GraphitePress extends GenericCrafter {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
}
export declare class MultiPress extends GenericCrafter {
    name: string;
    requirements: {
        titanium: number;
        silicon: number;
        lead: number;
        graphite: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class SiliconSmelter extends GenericCrafter {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class SiliconCrucible extends GenericCrafter {
    name: string;
    requirements: {
        titanium: number;
        metaglass: number;
        plastanium: number;
        silicon: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class Kiln extends GenericCrafter {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
        lead: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class PlastaniumCompressor extends GenericCrafter {
    name: string;
    requirements: {
        silicon: number;
        lead: number;
        graphite: number;
        titanium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class PhaseWeaver extends GenericCrafter {
    name: string;
    requirements: {
        silicon: number;
        lead: number;
        thorium: number;
    };
    size: number;
    powerConsumption: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class SurgeSmelter extends GenericCrafter {
    name: string;
    requirements: {
        silicon: number;
        lead: number;
        thorium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class CryofluidMixer extends GenericCrafter {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        titanium: number;
    };
    size: number;
    powerConsumption: number;
    output: BlockOutput;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class PyratiteMixer extends GenericCrafter {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class BlastMixer extends GenericCrafter {
    name: string;
    requirements: {
        lead: number;
        titanium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class Melter extends GenericCrafter {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        graphite: number;
    };
    size: number;
    powerConsumption: number;
    output: BlockOutput;
}
export declare class Separator extends GenericCrafter {
    name: string;
    requirements: ItemCost;
    size: number;
    powerConsumption: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Disassembler extends Separator {
    name: string;
    requirements: {
        plastanium: number;
        titanium: number;
        silicon: number;
        thorium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class SporePress extends GenericCrafter {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
    };
    size: number;
    powerConsumption: number;
    output: BlockOutput;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Pulverizer extends GenericCrafter {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
    powerConsumption: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class CoalCentrifuge extends GenericCrafter {
    name: string;
    requirements: {
        titanium: number;
        graphite: number;
        lead: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class Incinerator extends GenericCrafter {
    name: string;
    requirements: {
        graphite: number;
        lead: number;
    };
    size: number;
    powerConsumption: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
}
export {};
