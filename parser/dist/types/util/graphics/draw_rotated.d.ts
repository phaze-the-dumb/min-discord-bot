import { Canvas, Image } from 'canvas';
import { SchematicTile } from '../../schematic';
import { TileRotation } from '../../schematic/tile';
export interface TileRotatedDrawOptions {
    canvas: Canvas;
    tile: SchematicTile;
    image: Image;
    angle?: number;
}
export declare function drawRotatedTile({ canvas, image, tile, angle, }: TileRotatedDrawOptions): void;
interface RotatedDrawOptions {
    canvas: Canvas;
    image: Image | Canvas;
    x: number;
    y: number;
    offset: number;
    angle: number;
}
export declare function drawRotated({ canvas, image, x, y, offset, angle, }: RotatedDrawOptions): void;
export declare function tileRotationToAngle(rotation: TileRotation): number;
export declare function degreeToAngle(degree: number): number;
export {};
