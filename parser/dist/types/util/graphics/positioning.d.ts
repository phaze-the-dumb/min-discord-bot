import { BlockOutputDirection } from '../../mindustry/block/helper';
import { Canvas } from 'canvas';
import { SchematicTile } from '../../schematic';
export declare type SchematicTileMap = ((SchematicTile | undefined)[] | undefined)[];
export declare function handlePlacement(tile: SchematicTile): {
    x: number;
    y: number;
};
export declare function translatePos(tile: SchematicTile, canvas: Canvas): {
    x: number;
    y: number;
};
export declare function rotateOutputDirection(tile: SchematicTile): BlockOutputDirection;
