import { Block } from './block';
import { RenderingInfo } from '../../util';
import { SchematicTile } from '../../schematic';
declare abstract class DefenseBlock extends Block {
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare abstract class Wall extends DefenseBlock {
}
export declare class CopperWall extends Wall {
    name: string;
    requirements: {
        copper: number;
    };
    size: number;
}
export declare class CopperWallLarge extends CopperWall {
    name: string;
    size: number;
    constructor();
}
export declare class TitaniumWall extends Wall {
    name: string;
    requirements: {
        titanium: number;
    };
    size: number;
}
export declare class TitaniumWallLarge extends TitaniumWall {
    name: string;
    size: number;
    constructor();
}
export declare class PlastaniumWall extends Wall {
    name: string;
    requirements: {
        plastanium: number;
        metaglass: number;
    };
    size: number;
}
export declare class PlastaniumWallLarge extends PlastaniumWall {
    name: string;
    size: number;
    constructor();
}
export declare class ThoriumWall extends Wall {
    name: string;
    requirements: {
        thorium: number;
    };
    size: number;
}
export declare class ThoriumWallLarge extends ThoriumWall {
    name: string;
    size: number;
    constructor();
}
export declare class PhaseWall extends Wall {
    name: string;
    requirements: {
        'phase-fabric': number;
    };
    size: number;
}
export declare class PhaseWallLarge extends PhaseWall {
    name: string;
    size: number;
    constructor();
}
export declare class SurgeWall extends Wall {
    name: string;
    requirements: {
        'surge-alloy': number;
    };
    size: number;
}
export declare class SurgeWallLarge extends SurgeWall {
    name: string;
    size: number;
    constructor();
}
export declare class Door extends DefenseBlock {
    name: string;
    requirements: {
        titanium: number;
        silicon: number;
    };
    size: number;
}
export declare class DoorLarge extends Door {
    name: string;
    size: number;
    constructor();
}
export declare class ScrapWall extends Wall {
    name: string;
    requirements: {
        scrap: number;
    };
    size: number;
}
export declare class ScrapWallLarge extends ScrapWall {
    name: string;
    size: number;
    constructor();
}
export declare class ScrapWallHuge extends ScrapWall {
    name: string;
    size: number;
    constructor();
}
export declare class ScrapWallGigantic extends ScrapWall {
    name: string;
    size: number;
    constructor();
}
export declare class Mender extends DefenseBlock {
    name: string;
    requirements: {
        lead: number;
        copper: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class MendProjector extends DefenseBlock {
    name: string;
    requirements: {
        lead: number;
        titanium: number;
        silicon: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class OverdriveProjector extends DefenseBlock {
    name: string;
    requirements: {
        lead: number;
        titanium: number;
        silicon: number;
        plastanium: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class OverdriveDome extends DefenseBlock {
    name: string;
    requirements: {
        lead: number;
        titanium: number;
        silicon: number;
        plastanium: number;
        'surge-alloy': number;
    };
    size: number;
    powerConsumption: number;
}
export declare class ForceProjector extends DefenseBlock {
    name: string;
    requirements: {
        lead: number;
        titanium: number;
        silicon: number;
    };
    size: number;
    powerConsumption: number;
}
export declare class ShockMine extends DefenseBlock {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
    };
    size: number;
}
export {};
