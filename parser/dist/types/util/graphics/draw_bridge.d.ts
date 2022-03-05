import { RenderingInfo } from '..';
import { SchematicTile } from '../..';
export interface BridgeDrawOptions {
    tile: SchematicTile;
    info: RenderingInfo;
    category: string;
    opacity?: number;
}
export declare function drawBridge({ tile, info: { canvas, tileMap, blockAsset }, category, opacity, }: BridgeDrawOptions): Promise<void>;
