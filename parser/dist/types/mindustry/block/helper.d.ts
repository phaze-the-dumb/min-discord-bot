import { Canvas, Image } from 'canvas';
import { RenderingInfo } from '../../util';
import { SchematicTile } from '../../schematic';
export interface BlockRenderingOptions {
    tile: SchematicTile;
    info: RenderingInfo;
    category: string;
    layers: string[];
}
export interface BlockImageRenderingOptions {
    tile: SchematicTile;
    info: RenderingInfo;
    image: Image | Canvas;
}
/**
 * Flagged enum with the different output types that a block can have
 *
 * Because this enum is flagged, it can hold more than one value at a time.
 *
 * You can use the `Flags` class to make value checking easier
 *
 * @example
 *    // check if the value has both item and liquid
 *    Flags.has(myValue, BlockOutput.item | BlockOutput.liquid)
 */
export declare enum BlockOutput {
    none = 0,
    item = 2,
    liquid = 4,
    payload = 8,
    duct = 16
}
export declare enum BlockOutputDirection {
    none = 0,
    front = 2,
    back = 4,
    left = 8,
    right = 16,
    all = 30
}
