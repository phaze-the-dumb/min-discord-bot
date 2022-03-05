import { RenderingInfo } from '../../util';
import { Block } from './block';
import { SchematicTile } from '../../schematic';
declare abstract class PowerBlock extends Block {
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class PowerNode extends PowerBlock {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
}
export declare class PowerNodeLarge extends PowerBlock {
    name: string;
    requirements: {
        titanium: number;
        lead: number;
        silicon: number;
    };
    size: number;
}
export declare class SurgeTower extends PowerBlock {
    name: string;
    requirements: {
        titanium: number;
        lead: number;
        silicon: number;
        'surge-alloy': number;
    };
    size: number;
}
export declare class Diode extends PowerBlock {
    name: string;
    requirements: {
        silicon: number;
        plastanium: number;
        metaglass: number;
    };
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Battery extends PowerBlock {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
}
export declare class BatteryLarge extends PowerBlock {
    name: string;
    requirements: {
        titanium: number;
        lead: number;
        silicon: number;
    };
    size: number;
}
export declare abstract class PowerGenerator extends PowerBlock {
    abstract powerGeneration: number;
}
export declare class CombustionGenerator extends PowerGenerator {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
    powerGeneration: number;
}
export declare class ThermalGenerator extends PowerGenerator {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
        lead: number;
        silicon: number;
        metaglass: number;
    };
    size: number;
    powerGeneration: number;
}
export declare class SteamGenerator extends PowerGenerator {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
        lead: number;
        silicon: number;
    };
    size: number;
    powerGeneration: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class DifferentialGenerator extends PowerGenerator {
    name: string;
    requirements: {
        copper: number;
        titanium: number;
        lead: number;
        silicon: number;
        metaglass: number;
    };
    size: number;
    powerGeneration: number;
}
export declare class RtgGenerator extends PowerGenerator {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        'phase-fabric': number;
        plastanium: number;
        thorium: number;
    };
    size: number;
    powerGeneration: number;
}
export declare class SolarPanel extends PowerGenerator {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
    };
    size: number;
    powerGeneration: number;
}
export declare class SolarPanelLarge extends PowerGenerator {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        'phase-fabric': number;
    };
    size: number;
    powerGeneration: number;
}
export declare class ThoriumReactor extends PowerGenerator {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        graphite: number;
        thorium: number;
        metaglass: number;
    };
    size: number;
    powerGeneration: number;
}
export declare class ImpactReactor extends PowerGenerator {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        graphite: number;
        thorium: number;
        'surge-alloy': number;
        metaglass: number;
    };
    size: number;
    powerGeneration: number;
    powerConsumption: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export {};
