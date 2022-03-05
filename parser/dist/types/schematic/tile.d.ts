import { Block, Item, Liquid } from '../mindustry';
import { Point2 } from '../arc';
export declare class SchematicTile {
    /**
     * The block occupying this tile
     */
    block: Block;
    /**
     * The x coordinate of this tile
     */
    x: number;
    /**
     * The y coordinate of this tile
     */
    y: number;
    /**
     * The configuration of this tile (varies according to the block), may be `undefined` or `null`
     */
    config: string | number | bigint | boolean | number[] | Point2 | Point2[] | Item | Liquid | null | undefined;
    /**
     * The rotation of this tile
     */
    rotation: TileRotation;
    constructor(
    /**
     * The block occupying this tile
     */
    block: Block, 
    /**
     * The x coordinate of this tile
     */
    x: number, 
    /**
     * The y coordinate of this tile
     */
    y: number, 
    /**
     * The configuration of this tile (varies according to the block), may be `undefined` or `null`
     */
    config: string | number | bigint | boolean | number[] | Point2 | Point2[] | Item | Liquid | null | undefined, 
    /**
     * The rotation of this tile
     */
    rotation: TileRotation);
}
export declare enum TileRotation {
    right = 0,
    top = 1,
    left = 2,
    bottom = 3
}
