/// <reference types="node" />
import { ItemCost } from '../mindustry';
import Canvas from 'canvas';
import { MindustryVersion } from './version';
import { SchematicTile } from './tile';
export interface SchematicProperties {
    /**
     * The tiles that compose this schematic
     */
    tiles: SchematicTile[];
    /** These tags contain the schematic metadata (like its name and description) */
    tags: Map<string, string>;
    /** With of the schematic in tiles */
    width: number;
    /** Height of the schematic in tiles */
    height: number;
    /** The base64 code that generated this schematic */
    base64?: string;
    /** The version of mindustry that encoded this schematic */
    version?: MindustryVersion;
}
export interface SchematicRenderingOptions {
    /** Options for rendering coveyors */
    conveyors?: {
        render: boolean;
    };
    /** Options for rendering conduits */
    conduits?: {
        render: boolean;
    };
    /** Options for rendering normal bridges */
    bridges?: {
        render?: boolean;
        opacity: number;
    };
    /** Options for rendering phase bridges */
    phaseBridges?: {
        render?: boolean;
        opacity: number;
    };
    /** The max size in pixels for this image */
    maxSize?: number;
    /**
     * The size the preview must have.
     * Using this option overshadows `maxSize`
     */
    size?: number;
    /** Whether the image should have a background */
    background?: boolean;
}
export interface WebSchematicRenderingOptions extends SchematicRenderingOptions {
    assetsBaseUrl: string;
}
/**
 * A simple representation for a mindustry schematic
 */
export declare class Schematic implements SchematicProperties {
    constructor(properties: SchematicProperties);
    readonly tiles: SchematicTile[];
    readonly tags: Map<string, string>;
    readonly width: number;
    readonly height: number;
    base64?: string;
    version: MindustryVersion;
    labels: string[];
    static decode(data: string | Buffer): Schematic;
    static encode(schematic: Schematic): string;
    /**
     * The name of this schematic
     *
     * Shorhand for `tags.get('name')`
     */
    get name(): string;
    set name(value: string);
    /**
     * The description of this schematic
     *
     * Shorhand for `tags.get('name')`
     */
    get description(): string;
    set description(value: string);
    /**
     * The amount of power this schematic can produce
     *
     * This is a separated measurement that does not interfere with `powerConsumption`
     *
     * This measurement may vary if there is an `OverdriveProjector` or an `OverdriveDome` contained in this schematic
     */
    get powerProduction(): number;
    /**
     * The amount of power this schematic consumes to work properly
     *
     * This is a separated measurement that does not interfere with `powerConsumption`
     *
     * This measurement may vary if there is an `OverdriveProjector` or an `OverdriveDome` contained in this schematic
     */
    get powerConsumption(): number;
    /**
     * The overall power balance of this schematic
     */
    get powerBalance(): number;
    /**
     * The items needed to build this schematic
     */
    get requirements(): ItemCost;
    /**
     * Converts this schematic to a base 64 string
     */
    encode(): string;
    /**
     * Creates an image that represents this schematic's preview
     *
     * @deprecated This function is deprecated, and will be removed on the next breaking release.
     * Please use {@link render} as it is more flexible and compatible with web browsers.
     */
    toImageBuffer(options?: SchematicRenderingOptions): Promise<Buffer>;
    /**
     * Draws this schematic onto a canvas.
     *
     * This method is supported works on both nodejs and the browser.
     *
     * When using this method inside a browser, you must provide the `assetsBaseUrl` option
     * so this package know where to find its assets.
     *
     * Making the assets available is
     * straightforward, you only need to serve them as static assets (node_modules/mindustry-schematic-parser/assets)
     * @param options
     */
    render(options?: SchematicRenderingOptions): Promise<Canvas.Canvas>;
    render(options: WebSchematicRenderingOptions): Promise<HTMLCanvasElement>;
}
