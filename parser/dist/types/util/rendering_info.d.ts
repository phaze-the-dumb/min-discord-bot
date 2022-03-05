import { Schematic } from '../schematic';
import { SchematicTileMap } from './graphics';
import Canvas from 'canvas';
import { SchematicRenderingOptions } from '../schematic/schematic';
export declare class RenderingInfo {
    readonly schematic: Schematic;
    readonly canvas: Canvas.Canvas;
    readonly options: SchematicRenderingOptions;
    private _tileMap;
    readonly renderingQueue: RenderingQueue;
    getAsset: (path: string) => Promise<Canvas.Image>;
    constructor(schematic: Schematic, canvas: Canvas.Canvas, options: SchematicRenderingOptions);
    get tileMap(): SchematicTileMap;
    init(): Promise<void>;
    blockAsset(category: string, name: string): Promise<Canvas.Image>;
}
declare type RenderingExecutor = () => Promise<void>;
declare class RenderingQueue {
    private _map;
    add(level: number, executor: RenderingExecutor): void;
    execute(): Promise<void>;
}
export {};
