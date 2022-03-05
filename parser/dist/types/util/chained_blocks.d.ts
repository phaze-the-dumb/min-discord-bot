import { SchematicTile } from '../schematic/tile';
import { Block } from '../mindustry/block';
import { RenderingInfo } from './rendering_info';
export declare enum ConnectionSupport {
    regular = 0,
    strict = 1
}
export interface ConnectionData {
    top: boolean;
    left: boolean;
    right: boolean;
    bottom: boolean;
}
export interface ChainedDrawOptions {
    connections: ConnectionData;
}
export declare function getConnections(tile: SchematicTile, info: RenderingInfo, support: ConnectionSupport.regular | [ConnectionSupport.strict, new () => Block]): ConnectionData;
export declare function getChainedSpriteVariation(tile: SchematicTile, connections: ConnectionData): {
    imageIndex: number;
    scaleX: number;
    scaleY: number;
};
