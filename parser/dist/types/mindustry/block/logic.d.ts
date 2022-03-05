import { Block } from './block';
import { RenderingInfo } from '../../util';
import { SchematicTile } from '../../schematic';
declare abstract class LogicBlock extends Block {
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Message extends LogicBlock {
    name: string;
    requirements: {
        graphite: number;
    };
    size: number;
}
export declare class SwitchBlock extends LogicBlock {
    name: string;
    requirements: {
        graphite: number;
    };
    size: number;
}
export declare class MicroProcessor extends LogicBlock {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        silicon: number;
    };
    size: number;
}
export declare class LogicProcessor extends LogicBlock {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        graphite: number;
        thorium: number;
    };
    size: number;
}
export declare class HyperProcessor extends LogicBlock {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        thorium: number;
        'surge-alloy': number;
    };
    size: number;
}
export declare class MemoryCell extends LogicBlock {
    name: string;
    requirements: {
        graphite: number;
        silicon: number;
    };
    size: number;
}
export declare class MemoryBank extends MemoryCell {
    name: string;
    requirements: {
        graphite: number;
        silicon: number;
        'phase-fabric': number;
    };
    size: number;
}
export declare class LogicDisplay extends LogicBlock {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        metaglass: number;
    };
    size: number;
}
export declare class LargeLogicDisplay extends LogicDisplay {
    name: string;
    requirements: {
        lead: number;
        silicon: number;
        metaglass: number;
        'phase-fabric': number;
    };
    size: number;
}
export {};
