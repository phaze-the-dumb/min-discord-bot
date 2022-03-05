import { BlockOutput, BlockOutputDirection } from './helper';
import { RenderingInfo } from '../../util';
import { Block } from './block';
import { SchematicTile } from '../../schematic';
declare abstract class StorageBlock extends Block {
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class CoreShard extends StorageBlock {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
}
export declare class CoreFoundation extends StorageBlock {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        silicon: number;
    };
    size: number;
}
export declare class CoreNucleus extends StorageBlock {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        silicon: number;
        thorium: number;
    };
    size: number;
}
export declare class Container extends StorageBlock {
    name: string;
    requirements: {
        titanium: number;
    };
    size: number;
}
export declare class Vault extends Container {
    name: string;
    requirements: {
        titanium: number;
        thorium: number;
    };
    size: number;
}
export declare class Unloader extends Block {
    name: string;
    requirements: {
        titanium: number;
        silicon: number;
    };
    size: number;
    output: BlockOutput;
    outputDirection: BlockOutputDirection;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export {};
