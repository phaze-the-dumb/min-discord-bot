'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Canvas = require('canvas');
var Pako = require('pako');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var Canvas__default = /*#__PURE__*/_interopDefaultLegacy(Canvas);
var Pako__default = /*#__PURE__*/_interopDefaultLegacy(Pako);

/**
 * A point in a 2D grid, with integer x and y coordinates
 * @author badlogic
 *
 * Copied from `Anuken/Arc`
 */
class Point2 {
    /**
     * Constructs a new 2D grid point.
     * @param x X coordinate
     * @param y Y coordinate
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /** @return a point unpacked from an integer. */
    static unpack(pos) {
        return new Point2(pos >>> 16, pos & 0xffff);
    }
    /** @return this point packed into a single int by casting its components to shorts. */
    static pack(x, y) {
        return (x << 16) | (y & 0xffff);
    }
    /** @return the x component of a packed position. */
    static x(pos) {
        return pos >>> 16;
    }
    /** @return the y component of a packed position. */
    static y(pos) {
        return pos & 0xffff;
    }
    /** @return this point packed into a single int by casting its components to shorts. */
    pack() {
        return Point2.pack(this.x, this.y);
    }
    set(...args) {
        if (args[0] instanceof Point2) {
            const [point] = args;
            this.x = point.x;
            this.y = point.y;
            return this;
        }
        const [x, y] = args;
        this.x = x;
        this.y = y;
        return this;
    }
    dst2(...args) {
        if (args[0] instanceof Point2) {
            const [other] = args;
            const xd = other.x - this.x;
            const yd = other.y - this.y;
            return xd * xd + yd * yd;
        }
        const [x, y] = args;
        const xd = x - this.x;
        const yd = y - this.y;
        return xd * xd + yd * yd;
    }
    dst(...args) {
        if (args[0] instanceof Point2) {
            const [other] = args;
            const xd = other.x - this.x;
            const yd = other.y - this.y;
            return Math.sqrt(xd * xd + yd * yd);
        }
        const [x, y] = args;
        const xd = x - this.x;
        const yd = y - this.y;
        return Math.sqrt(xd * xd + yd * yd);
    }
    add(...args) {
        if (args[0] instanceof Point2) {
            const [other] = args;
            this.x += other.x;
            this.y += other.y;
            return this;
        }
        const [x, y] = args;
        this.x += x;
        this.y += y;
        return this;
    }
    sub(...args) {
        if (args[0] instanceof Point2) {
            const [other] = args;
            this.x -= other.x;
            this.y -= other.y;
            return this;
        }
        const [x, y] = args;
        this.x -= x;
        this.y -= y;
        return this;
    }
    /**
     * @return a copy of this grid point
     */
    cpy() {
        return new Point2(this.x, this.y);
    }
    /** Rotates this point in 90-degree increments several times. */
    rotate(steps) {
        for (let i = 0; i < Math.abs(steps); i++) {
            const { x } = this;
            if (steps >= 0) {
                this.x = -this.y;
                this.y = x;
            }
            else {
                this.x = this.y;
                this.y = -x;
            }
        }
        return this;
    }
    static equals(x, y, ox, oy) {
        return x === ox && y === oy;
    }
    equals(...args) {
        {
            if (args[0] instanceof Point2) {
                const [other] = args;
                return this.x === other.x && this.y === other.y;
            }
            const [x, y] = args;
            return this.x === x && this.y === y;
        }
    }
    hashCode() {
        return this.x * 0xc13f + this.y * 0x91e1;
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Point2: Point2
});

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
var BlockOutput;
(function (BlockOutput) {
    BlockOutput[BlockOutput["none"] = 0] = "none";
    BlockOutput[BlockOutput["item"] = 2] = "item";
    BlockOutput[BlockOutput["liquid"] = 4] = "liquid";
    BlockOutput[BlockOutput["payload"] = 8] = "payload";
    BlockOutput[BlockOutput["duct"] = 16] = "duct";
})(BlockOutput || (BlockOutput = {}));
var BlockOutputDirection;
(function (BlockOutputDirection) {
    BlockOutputDirection[BlockOutputDirection["none"] = 0] = "none";
    BlockOutputDirection[BlockOutputDirection["front"] = 2] = "front";
    BlockOutputDirection[BlockOutputDirection["back"] = 4] = "back";
    BlockOutputDirection[BlockOutputDirection["left"] = 8] = "left";
    BlockOutputDirection[BlockOutputDirection["right"] = 16] = "right";
    BlockOutputDirection[BlockOutputDirection["all"] = 30] = "all";
})(BlockOutputDirection || (BlockOutputDirection = {}));

function tintImage(image, color, opacity = 0.5) {
    const canvas = Canvas__default["default"].createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.save();
    context.fillStyle = color;
    context.globalAlpha = opacity;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'destination-atop';
    context.globalAlpha = 1;
    context.drawImage(image, 0, 0);
    context.restore();
    return canvas;
}

class Flags {
    constructor(value = 0) {
        this.value = value;
    }
    add(value) {
        this.value |= value;
    }
    remove(value) {
        this.value &= ~value;
    }
    /**
     * Use it to check whether this has one or more flag values
     *
     * @example
     *    flags.has(1 | 4 | 8); // check if the flags has all of those values
     */
    has(value) {
        return (this.value & value) === value;
    }
    static has(target, value) {
        return (target & value) === value;
    }
    static subtract(target, value) {
        return target & ~value;
    }
    valueOf() {
        return this.value;
    }
}

function handlePlacement(tile) {
    const { size } = tile.block;
    const { x, y } = tile;
    const offset = Math.ceil(size / 2) - 1;
    return {
        x: x - offset,
        y: y - offset,
    };
}
function translatePos(tile, canvas) {
    const { x, y } = tile;
    const { size } = tile.block;
    const offsetX = -Math.ceil(size / 2) + 1;
    const offsetY = Math.floor(size / 2) + 1;
    return {
        x: (x + offsetX) * 32,
        y: canvas.height - (y + offsetY) * 32,
    };
}
const directions = [
    BlockOutputDirection.front,
    BlockOutputDirection.left,
    BlockOutputDirection.back,
    BlockOutputDirection.right,
];
function rotateOutputDirection(tile) {
    const { rotation } = tile;
    const { outputDirection } = tile.block;
    if (outputDirection === BlockOutputDirection.all)
        return outputDirection;
    let result = BlockOutputDirection.none;
    // rotates the output direction
    for (let i = 0; i < directions.length; i++) {
        if (Flags.has(outputDirection, directions[i]))
            result |= directions[(rotation + i) % 4];
    }
    return result;
}

/**
 * Outlines an image using an offset array.
 *
 * This function modifies the canvas and returns it.
 *
 */
function outlineImage({ image, fillStyle = 'black', thickness = 2, }) {
    const canvas = Canvas__default["default"].createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1]; // offset array
    let i = 0; // iterator
    // draw images at offsets from the array scaled by thickness
    for (; i < dArr.length; i += 2)
        context.drawImage(image, dArr[i] * thickness, dArr[i + 1] * thickness);
    // fill with color
    context.globalCompositeOperation = 'source-in';
    context.fillStyle = fillStyle;
    context.fillRect(0, 0, canvas.width, canvas.height);
    // draw original image in normal mode
    context.globalCompositeOperation = 'source-over';
    context.drawImage(image, 0, 0);
    return canvas;
}

function drawRotatedTile({ canvas, image, tile, angle = tileRotationToAngle(tile.rotation), }) {
    drawRotated({
        canvas,
        image,
        ...translatePos(tile, canvas),
        offset: tile.block.size * 16,
        angle,
    });
}
function drawRotated({ canvas, image, x, y, offset, angle, }) {
    const context = canvas.getContext('2d');
    context.save();
    context.translate(x + offset, y + offset);
    context.rotate(angle);
    context.translate(-offset, -offset);
    context.drawImage(image, 0, 0);
    context.restore();
}
function tileRotationToAngle(rotation) {
    return ((rotation % 2 ? rotation + 2 : rotation) * Math.PI) / 2;
}
function degreeToAngle(degree) {
    return (degree * Math.PI) / 180;
}

class SchematicTile {
    constructor(
    /**
     * The block occupying this tile
     */
    block, 
    /**
     * The x coordinate of this tile
     */
    x, 
    /**
     * The y coordinate of this tile
     */
    y, 
    /**
     * The configuration of this tile (varies according to the block), may be `undefined` or `null`
     */
    config, 
    /**
     * The rotation of this tile
     */
    rotation) {
        this.block = block;
        this.x = x;
        this.y = y;
        this.config = config;
        this.rotation = rotation;
    }
}
var TileRotation;
(function (TileRotation) {
    TileRotation[TileRotation["right"] = 0] = "right";
    TileRotation[TileRotation["top"] = 1] = "top";
    TileRotation[TileRotation["left"] = 2] = "left";
    TileRotation[TileRotation["bottom"] = 3] = "bottom";
})(TileRotation || (TileRotation = {}));

async function drawBridge({ tile, info: { canvas, tileMap, blockAsset }, category, opacity, }) {
    var _a;
    const config = tile.config;
    if (!config)
        return;
    const { block } = tile;
    const targetPos = config.cpy().add(tile.x, tile.y);
    const target = (_a = tileMap[targetPos.x]) === null || _a === void 0 ? void 0 : _a[targetPos.y];
    if ((target === null || target === void 0 ? void 0 : target.block.name) !== block.name)
        return;
    const distance = Math.abs(config.x === 0 ? config.y : config.x);
    const bridge = await blockAsset(category, block.name + '-bridge');
    const arrow = await blockAsset(category, block.name + '-arrow');
    const context = canvas.getContext('2d');
    const tcanvas = Canvas__default["default"].createCanvas((distance + 1) * 32, 32);
    const tcontext = tcanvas.getContext('2d');
    let rotation;
    if (config.x) {
        rotation = config.x > 0 ? TileRotation.right : TileRotation.left;
    }
    else {
        rotation = config.y > 0 ? TileRotation.top : TileRotation.bottom;
    }
    const end = await blockAsset(category, block.name + '-end');
    drawRotated({
        canvas: tcanvas,
        image: end,
        x: 0,
        y: 0,
        offset: 16,
        angle: degreeToAngle(-90),
    });
    drawRotated({
        canvas: tcanvas,
        image: end,
        x: distance * 32,
        y: 0,
        offset: 16,
        angle: degreeToAngle(90),
    });
    for (let i = 0; i < distance - 1; i++) {
        tcontext.drawImage(bridge, (i + 1) * 32, 0);
    }
    const { x, y } = translatePos(tile, canvas);
    tcontext.drawImage(arrow, (tcanvas.width - arrow.width) / 2, 0);
    // const opacity =
    //   block instanceof PhaseConduit || block instanceof PhaseConveyor
    //     ? options.phaseBridges?.opacity
    //     : options.bridges?.opacity
    context.save();
    context.globalAlpha = opacity !== null && opacity !== void 0 ? opacity : 1;
    drawRotated({
        canvas,
        image: tcanvas,
        x,
        y,
        angle: tileRotationToAngle(rotation),
        offset: 16,
    });
    context.restore();
}

const ticksPerSecond = 60;

function basicJoin(...parts) {
    return parts.join('/').replace(/\\/g, '/').replace(/\/+/g, '/');
}

let assetsFolder;
async function resolveAssets(info) {
    if (typeof window !== 'undefined') {
        const { assetsBaseUrl } = info.options;
        const base = new URL(assetsBaseUrl, location.href);
        return path => Canvas__default["default"].loadImage(new URL(basicJoin(base.pathname, path), base).href);
    }
    if (!assetsFolder) {
        const { fileURLToPath } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('url')); });
        const { packageDirectory } = await import('pkg-dir');
        const filePath = fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href))).replace(/\\/g, '/');
        const rootFolder = await packageDirectory({
            cwd: filePath.substring(0, filePath.lastIndexOf('/')),
        });
        assetsFolder = basicJoin(rootFolder, 'assets');
    }
    return path => Canvas__default["default"].loadImage(basicJoin(assetsFolder, path));
}

class RenderingInfo {
    constructor(schematic, canvas, options) {
        this.schematic = schematic;
        this.canvas = canvas;
        this.options = options;
        this._tileMap = null;
        this.renderingQueue = new RenderingQueue();
        this.blockAsset = this.blockAsset.bind(this);
    }
    get tileMap() {
        if (this._tileMap === null)
            this._tileMap = mapTiles(this.schematic);
        return this._tileMap;
    }
    async init() {
        this.getAsset = await resolveAssets(this);
    }
    blockAsset(category, name) {
        const path = basicJoin('sprites/blocks', category, name + '.png');
        return this.getAsset(path);
    }
}
class RenderingQueue {
    constructor() {
        this._map = new Map();
    }
    add(level, executor) {
        if (!this._map.has(level)) {
            this._map.set(level, []);
        }
        const executors = this._map.get(level);
        executors.push(executor);
    }
    async execute() {
        if (this._map.size === 0)
            return;
        const keys = Array.from(this._map.keys()).sort((a, b) => a - b);
        for (const key of keys) {
            const executors = this._map.get(key);
            for (const executor of executors) {
                await executor();
            }
        }
    }
}
function mapTiles(schematic) {
    const { width } = schematic;
    const result = [];
    for (let x = 0; x < width; x++) {
        result[x] = [];
    }
    for (const tile of schematic.tiles) {
        const { size } = tile.block;
        const start = handlePlacement(tile);
        const end = {
            x: start.x + size,
            y: start.y + size,
        };
        for (let { x } = start; x < end.x && x < schematic.width; x++) {
            for (let { y } = start; y < end.y && y < schematic.height; y++) {
                result[x][y] = tile;
            }
        }
    }
    return result;
}

var ConnectionSupport;
(function (ConnectionSupport) {
    ConnectionSupport[ConnectionSupport["regular"] = 0] = "regular";
    ConnectionSupport[ConnectionSupport["strict"] = 1] = "strict";
})(ConnectionSupport || (ConnectionSupport = {}));
// export async function drawChained({
//   connections,
// }: ChainedDrawOptions): Promise<void> {}
function getConnections(tile, info, support) {
    var _a, _b, _c, _d;
    const result = {
        bottom: false,
        left: false,
        right: false,
        top: false,
    };
    const { x, y } = tile;
    const { size } = tile.block;
    const tiles = {
        top: (_a = info.tileMap[x]) === null || _a === void 0 ? void 0 : _a[y + size],
        bottom: (_b = info.tileMap[x]) === null || _b === void 0 ? void 0 : _b[y - size],
        left: (_c = info.tileMap[x - size]) === null || _c === void 0 ? void 0 : _c[y],
        right: (_d = info.tileMap[x + size]) === null || _d === void 0 ? void 0 : _d[y],
    };
    if (support === ConnectionSupport.regular) {
        const content = tile.block.output;
        const directions = {
            top: BlockOutputDirection.right,
            bottom: BlockOutputDirection.left,
            left: BlockOutputDirection.front,
            right: BlockOutputDirection.back,
        };
        for (const k in tiles) {
            const key = k;
            const t = tiles[key];
            if (!t)
                continue;
            const direction = rotateOutputDirection(t);
            result[key] || (result[key] = Flags.has(t.block.output, content) &&
                t !== tile &&
                Flags.has(direction, directions[key]));
        }
    }
    else {
        const [, type] = support;
        for (const k in tiles) {
            const key = k;
            const t = tiles[key];
            if (!t)
                continue;
            result[key] || (result[key] = (Flags.has(t.block.output, BlockOutput.item) &&
                key === TileRotation[(tile.rotation + 2) % 4]) ||
                (t.block instanceof type && t.rotation === (TileRotation[key] + 2) % 4));
        }
    }
    return result;
}
function getChainedSpriteVariation(tile, connections) {
    const { rotation } = tile;
    const right = TileRotation[rotation % 4];
    const top = TileRotation[(rotation + 1) % 4];
    const left = TileRotation[(rotation + 2) % 4];
    const bottom = TileRotation[(rotation + 3) % 4];
    const c = connections;
    let activeConnections = 0;
    for (const k in connections) {
        const key = k;
        if (rotation === TileRotation[key])
            continue;
        if (connections[key])
            activeConnections++;
    }
    let imageIndex = 0, scaleX = 1, scaleY = 1;
    switch (activeConnections) {
        case 1:
            if (c[top]) {
                imageIndex = 1;
            }
            else if (c[bottom]) {
                if (rotation === TileRotation.bottom || rotation === TileRotation.top)
                    scaleX = -1;
                else if (rotation === TileRotation.left ||
                    rotation === TileRotation.right)
                    scaleY = -1;
                imageIndex = 1;
            }
            break;
        case 2:
            if (c[top] && c[bottom]) {
                imageIndex = 4;
            }
            else if (c[left] && c[bottom]) {
                imageIndex = 2;
            }
            else if (c[left] && c[top]) {
                imageIndex = 2;
                if (rotation === TileRotation.bottom || rotation === TileRotation.top)
                    scaleX = -1;
                else if (rotation === TileRotation.right ||
                    rotation === TileRotation.left)
                    scaleY = -1;
            }
            else if (c[right] && c[bottom]) {
                imageIndex = 2;
            }
            else if (c[right] && c[top]) {
                imageIndex = 2;
            }
            break;
        case 3:
            imageIndex = 3;
            break;
    }
    return { imageIndex, scaleX, scaleY };
}

/** An abstract top class representing in game content
 *
 * This class should not be instantiated
 */
class Content {
}
/** An abstract top class representing idetifiable in game content
 *
 * This class should not be instantiated
 */
class MappableContent extends Content {
    toString() {
        return this.name;
    }
}
/** An abstract top class representing unlockable in game content
 *
 * This class should not be instantiated
 */
class UnlockableContent extends MappableContent {
}

/**
 * A generic way to represent a block
 */
class Block extends UnlockableContent {
    constructor() {
        super(...arguments);
        this.output = BlockOutput.none;
        this.outputDirection = BlockOutputDirection.none;
        this.powerConsumption = 0;
    }
    get energyUsage() {
        return this.powerConsumption * ticksPerSecond;
    }
    static fromCode(code) {
        const block = this.codes.get(code);
        if (block) {
            return block;
        }
        throw new Error('the block is not registered not exist');
    }
    renderImage({ info, image, tile, }) {
        const context = info.canvas.getContext('2d');
        const { x, y } = translatePos(tile, info.canvas);
        context.drawImage(image, x, y);
    }
    async render({ info, category, layers, tile, }) {
        for (const layer of layers) {
            const image = await info.blockAsset(category, layer);
            this.renderImage({
                info,
                image,
                tile,
            });
        }
    }
}
/**
 * @internal
 */
Block.codes = new Map();

const category$d = 'campaign';
class Pad extends Block {
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$d,
            layers: [this.name],
        });
    }
}
class LaunchPad extends Pad {
    constructor() {
        super(...arguments);
        this.name = 'launch-pad';
        this.requirements = {
            copper: 350,
            silicon: 140,
            lead: 200,
            titanium: 150,
        };
        this.size = 3;
        this.powerConsumption = 4.0;
    }
}
class InterplanetaryAccelerator extends Block {
    constructor() {
        super(...arguments);
        this.name = 'interplanetary-accelerator';
        this.requirements = {
            copper: 16000,
            silicon: 11000,
            thorium: 13000,
            titanium: 12000,
            'surge-alloy': 6000,
            'phase-fabric': 5000,
        };
        this.size = 7;
        this.powerConsumption = 10.0;
    }
    async draw(tile, info) {
        await this.render({ tile, info, category: category$d, layers: [this.name] });
        const image = await info.blockAsset(category$d, this.name + '-team');
        this.renderImage({
            info,
            tile,
            image: tintImage(image, '#ffa600'),
        });
    }
}

var campaign = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LaunchPad: LaunchPad,
    InterplanetaryAccelerator: InterplanetaryAccelerator
});

const category$c = 'crafting';
class GenericCrafter extends Block {
    constructor() {
        super(...arguments);
        this.output = BlockOutput.item;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$c,
            layers: [this.name],
        });
    }
}
class GraphitePress extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'graphite-press';
        this.requirements = {
            copper: 75,
            lead: 30,
        };
        this.size = 2;
    }
}
class MultiPress extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'multi-press';
        this.requirements = {
            titanium: 100,
            silicon: 25,
            lead: 100,
            graphite: 50,
        };
        this.size = 3;
        this.powerConsumption = 1.8;
    }
}
class SiliconSmelter extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'silicon-smelter';
        this.requirements = { copper: 30, lead: 25 };
        this.size = 2;
        this.powerConsumption = 0.5;
    }
}
class SiliconCrucible extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'silicon-crucible';
        this.requirements = {
            titanium: 120,
            metaglass: 80,
            plastanium: 35,
            silicon: 60,
        };
        this.size = 3;
        this.powerConsumption = 4.0;
    }
}
class Kiln extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'kiln';
        this.requirements = {
            copper: 60,
            graphite: 30,
            lead: 30,
        };
        this.size = 2;
        this.powerConsumption = 0.6;
    }
}
class PlastaniumCompressor extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'plastanium-compressor';
        this.requirements = { silicon: 80, lead: 115, graphite: 60, titanium: 80 };
        this.size = 2;
        this.powerConsumption = 3.0;
    }
}
class PhaseWeaver extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'phase-weaver';
        this.requirements = { silicon: 130, lead: 120, thorium: 75 };
        this.size = 2;
        this.powerConsumption = 5.0;
    }
    async draw(tile, info) {
        await this.render({
            info,
            category: category$c,
            tile,
            layers: [this.name + '-bottom', this.name, this.name + '-weave'],
        });
    }
}
class SurgeSmelter extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'alloy-smelter';
        this.requirements = { silicon: 80, lead: 80, thorium: 70 };
        this.size = 3;
        this.powerConsumption = 4.0;
    }
}
class CryofluidMixer extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'cryofluid-mixer';
        this.requirements = { lead: 65, silicon: 40, titanium: 60 };
        this.size = 2;
        this.powerConsumption = 1.0;
        this.output = BlockOutput.liquid;
    }
    async draw(tile, info) {
        await this.render({
            info,
            category: category$c,
            tile,
            layers: [this.name, this.name + '-top'],
        });
    }
}
class PyratiteMixer extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'pyratite-mixer';
        this.requirements = { copper: 50, lead: 25 };
        this.size = 2;
        this.powerConsumption = 0.2;
    }
}
class BlastMixer extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'blast-mixer';
        this.requirements = { lead: 30, titanium: 20 };
        this.size = 2;
        this.powerConsumption = 0.4;
    }
}
class Melter extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'melter';
        this.requirements = { copper: 30, lead: 35, graphite: 45 };
        this.size = 1;
        this.powerConsumption = 1.0;
        this.output = BlockOutput.liquid;
    }
}
class Separator extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'separator';
        this.requirements = { copper: 30, titanium: 25 };
        this.size = 2;
        this.powerConsumption = 1.1;
    }
    async draw(tile, info) {
        await this.render({
            info,
            category: category$c,
            tile,
            layers: [this.name, this.name + '-spinner'],
        });
    }
}
class Disassembler extends Separator {
    constructor() {
        super(...arguments);
        this.name = 'disassembler';
        this.requirements = {
            plastanium: 40,
            titanium: 100,
            silicon: 150,
            thorium: 80,
        };
        this.size = 3;
        this.powerConsumption = 4;
    }
}
class SporePress extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'spore-press';
        this.requirements = { lead: 35, silicon: 30 };
        this.size = 2;
        this.powerConsumption = 0.7;
        this.output = BlockOutput.liquid;
    }
    async draw(tile, info) {
        await this.render({
            info,
            category: category$c,
            tile,
            layers: [this.name, this.name + '-top'],
        });
    }
}
class Pulverizer extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'pulverizer';
        this.requirements = { copper: 30, lead: 25 };
        this.size = 1;
        this.powerConsumption = 0.5;
    }
    async draw(tile, info) {
        await this.render({
            info,
            category: category$c,
            tile,
            layers: [this.name, this.name + '-rotator'],
        });
    }
}
class CoalCentrifuge extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'coal-centrifuge';
        this.requirements = { titanium: 20, graphite: 40, lead: 30 };
        this.size = 2;
        this.powerConsumption = 0.7;
    }
}
class Incinerator extends GenericCrafter {
    constructor() {
        super(...arguments);
        this.name = 'incinerator';
        this.requirements = { graphite: 5, lead: 15 };
        this.size = 1;
        this.powerConsumption = 0.5;
        this.output = BlockOutput.none;
        this.outputDirection = BlockOutputDirection.none;
    }
}

var crafting = /*#__PURE__*/Object.freeze({
    __proto__: null,
    GraphitePress: GraphitePress,
    MultiPress: MultiPress,
    SiliconSmelter: SiliconSmelter,
    SiliconCrucible: SiliconCrucible,
    Kiln: Kiln,
    PlastaniumCompressor: PlastaniumCompressor,
    PhaseWeaver: PhaseWeaver,
    SurgeSmelter: SurgeSmelter,
    CryofluidMixer: CryofluidMixer,
    PyratiteMixer: PyratiteMixer,
    BlastMixer: BlastMixer,
    Melter: Melter,
    Separator: Separator,
    Disassembler: Disassembler,
    SporePress: SporePress,
    Pulverizer: Pulverizer,
    CoalCentrifuge: CoalCentrifuge,
    Incinerator: Incinerator
});

const category$b = 'defense';
function multiplyRequirements(requirements, multiplier = 4) {
    for (const requirement in requirements) {
        const code = requirement;
        const cost = requirements[code];
        if (cost) {
            requirements[code] = cost * multiplier;
        }
    }
}
class DefenseBlock extends Block {
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$b,
            layers: [this.name],
        });
    }
}
class Wall extends DefenseBlock {
}
class CopperWall extends Wall {
    constructor() {
        super(...arguments);
        this.name = 'copper-wall';
        this.requirements = {
            copper: 6,
        };
        this.size = 1;
    }
}
class CopperWallLarge extends CopperWall {
    constructor() {
        super();
        this.name = 'copper-wall-large';
        this.size = 2;
        multiplyRequirements(this.requirements);
    }
}
class TitaniumWall extends Wall {
    constructor() {
        super(...arguments);
        this.name = 'titanium-wall';
        this.requirements = {
            titanium: 6,
        };
        this.size = 1;
    }
}
class TitaniumWallLarge extends TitaniumWall {
    constructor() {
        super();
        this.name = 'titanium-wall-large';
        this.size = 2;
        multiplyRequirements(this.requirements);
    }
}
class PlastaniumWall extends Wall {
    constructor() {
        super(...arguments);
        this.name = 'plastanium-wall';
        this.requirements = {
            plastanium: 5,
            metaglass: 2,
        };
        this.size = 1;
    }
}
class PlastaniumWallLarge extends PlastaniumWall {
    constructor() {
        super();
        this.name = 'plastanium-wall-large';
        this.size = 2;
        multiplyRequirements(this.requirements);
    }
}
class ThoriumWall extends Wall {
    constructor() {
        super(...arguments);
        this.name = 'thorium-wall';
        this.requirements = {
            thorium: 6,
        };
        this.size = 1;
    }
}
class ThoriumWallLarge extends ThoriumWall {
    constructor() {
        super();
        this.name = 'thorium-wall-large';
        this.size = 2;
        multiplyRequirements(this.requirements);
    }
}
class PhaseWall extends Wall {
    constructor() {
        super(...arguments);
        this.name = 'phase-wall';
        this.requirements = {
            'phase-fabric': 6,
        };
        this.size = 1;
    }
}
class PhaseWallLarge extends PhaseWall {
    constructor() {
        super();
        this.name = 'phase-wall-large';
        this.size = 2;
        multiplyRequirements(this.requirements);
    }
}
class SurgeWall extends Wall {
    constructor() {
        super(...arguments);
        this.name = 'surge-wall';
        this.requirements = {
            'surge-alloy': 6,
        };
        this.size = 1;
    }
}
class SurgeWallLarge extends SurgeWall {
    constructor() {
        super();
        this.name = 'surge-wall-large';
        this.size = 2;
        multiplyRequirements(this.requirements);
    }
}
class Door extends DefenseBlock {
    constructor() {
        super(...arguments);
        this.name = 'door';
        this.requirements = {
            titanium: 6,
            silicon: 4,
        };
        this.size = 1;
    }
}
class DoorLarge extends Door {
    constructor() {
        super();
        this.name = 'door-large';
        this.size = 2;
        multiplyRequirements(this.requirements);
    }
}
class ScrapWall extends Wall {
    constructor() {
        super(...arguments);
        this.name = 'scrap-wall';
        this.requirements = { scrap: 6 };
        this.size = 1;
    }
}
class ScrapWallLarge extends ScrapWall {
    constructor() {
        super();
        this.name = 'scrap-wall-large';
        this.size = 2;
        multiplyRequirements(this.requirements);
    }
}
class ScrapWallHuge extends ScrapWall {
    constructor() {
        super();
        this.name = 'scrap-wall-huge';
        this.size = 3;
        multiplyRequirements(this.requirements, 9);
    }
}
class ScrapWallGigantic extends ScrapWall {
    constructor() {
        super();
        this.name = 'scrap-wall-gigantic';
        this.size = 4;
        multiplyRequirements(this.requirements, 16);
    }
}
class Mender extends DefenseBlock {
    constructor() {
        super(...arguments);
        this.name = 'mender';
        this.requirements = { lead: 30, copper: 25 };
        this.size = 1;
        this.powerConsumption = 0.3;
    }
}
class MendProjector extends DefenseBlock {
    constructor() {
        super(...arguments);
        this.name = 'mend-projector';
        this.requirements = { lead: 100, titanium: 25, silicon: 40 };
        this.size = 2;
        this.powerConsumption = 1.5;
    }
}
class OverdriveProjector extends DefenseBlock {
    constructor() {
        super(...arguments);
        this.name = 'overdrive-projector';
        this.requirements = { lead: 100, titanium: 75, silicon: 75, plastanium: 30 };
        this.size = 2;
        this.powerConsumption = 3.5;
    }
}
class OverdriveDome extends DefenseBlock {
    constructor() {
        super(...arguments);
        this.name = 'overdrive-dome';
        this.requirements = {
            lead: 200,
            titanium: 130,
            silicon: 130,
            plastanium: 80,
            'surge-alloy': 120,
        };
        this.size = 3;
        this.powerConsumption = 10.0;
    }
}
class ForceProjector extends DefenseBlock {
    constructor() {
        super(...arguments);
        this.name = 'force-projector';
        this.requirements = { lead: 100, titanium: 75, silicon: 125 };
        this.size = 3;
        this.powerConsumption = 4.0;
    }
}
class ShockMine extends DefenseBlock {
    constructor() {
        super(...arguments);
        this.name = 'shock-mine';
        this.requirements = { lead: 25, silicon: 12 };
        this.size = 1;
    }
}

var defense = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Wall: Wall,
    CopperWall: CopperWall,
    CopperWallLarge: CopperWallLarge,
    TitaniumWall: TitaniumWall,
    TitaniumWallLarge: TitaniumWallLarge,
    PlastaniumWall: PlastaniumWall,
    PlastaniumWallLarge: PlastaniumWallLarge,
    ThoriumWall: ThoriumWall,
    ThoriumWallLarge: ThoriumWallLarge,
    PhaseWall: PhaseWall,
    PhaseWallLarge: PhaseWallLarge,
    SurgeWall: SurgeWall,
    SurgeWallLarge: SurgeWallLarge,
    Door: Door,
    DoorLarge: DoorLarge,
    ScrapWall: ScrapWall,
    ScrapWallLarge: ScrapWallLarge,
    ScrapWallHuge: ScrapWallHuge,
    ScrapWallGigantic: ScrapWallGigantic,
    Mender: Mender,
    MendProjector: MendProjector,
    OverdriveProjector: OverdriveProjector,
    OverdriveDome: OverdriveDome,
    ForceProjector: ForceProjector,
    ShockMine: ShockMine
});

const category$a = 'distribution';
class TransportBlock extends Block {
    constructor() {
        super(...arguments);
        this.output = BlockOutput.item;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$a,
            layers: [this.name],
        });
    }
}
class Conveyor extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'conveyor';
        this.requirements = { copper: 1 };
        this.size = 1;
        this.outputDirection = BlockOutputDirection.front;
    }
    async draw(tile, info) {
        const connections = getConnections(tile, info, ConnectionSupport.regular);
        const { imageIndex, scaleX, scaleY } = getChainedSpriteVariation(tile, connections);
        const { x, y } = translatePos(tile, info.canvas);
        const context = info.canvas.getContext('2d');
        const image = await info.blockAsset(`${category$a}/conveyors`, `${tile.block.name}-${imageIndex}-0`);
        context.save();
        context.translate(x + 16, y + 16);
        context.scale(scaleX, scaleY);
        context.rotate(tileRotationToAngle(tile.rotation));
        context.translate(-16, -16);
        context.drawImage(image, 0, 0);
        context.restore();
    }
}
class TitaniumConveyor extends Conveyor {
    constructor() {
        super(...arguments);
        this.name = 'titanium-conveyor';
        this.requirements = { copper: 1, lead: 1, titanium: 1 };
    }
}
class PlastaniumConveyor extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'plastanium-conveyor';
        this.requirements = { plastanium: 1, silicon: 1, graphite: 1 };
        this.size = 1;
        // only the end of a lane actually outputs something
        this.outputDirection = BlockOutputDirection.none;
    }
    async draw(tile, info) {
        var _a, _b, _c, _d;
        const connections = {
            top: false,
            bottom: false,
            left: false,
            right: false,
        };
        // scoped variables to get connections for this block
        {
            const { x, y } = tile;
            const { size } = tile.block;
            const tiles = {
                top: (_a = info.tileMap[x]) === null || _a === void 0 ? void 0 : _a[y + size],
                bottom: (_b = info.tileMap[x]) === null || _b === void 0 ? void 0 : _b[y - size],
                left: (_c = info.tileMap[x - size]) === null || _c === void 0 ? void 0 : _c[y],
                right: (_d = info.tileMap[x + size]) === null || _d === void 0 ? void 0 : _d[y],
            };
            for (const k in tiles) {
                const key = k;
                const t = tiles[key];
                if (!t)
                    continue;
                connections[key] || (connections[key] = t.block instanceof PlastaniumConveyor &&
                    (t.rotation === (TileRotation[key] + 2) % 4 ||
                        key === TileRotation[tile.rotation]));
            }
        }
        const { canvas } = info;
        const { block } = tile;
        const { x, y } = translatePos(tile, canvas);
        const base = await info.blockAsset(`${category$a}/conveyors`, block.name + '-0');
        const edge = await info.blockAsset(`${category$a}/conveyors`, block.name + '-edge');
        drawRotated({
            canvas,
            image: base,
            x,
            y,
            offset: 16,
            angle: tileRotationToAngle(tile.rotation),
        });
        for (const k in connections) {
            const key = k;
            if (connections[key])
                continue;
            drawRotated({
                canvas,
                image: edge,
                x,
                y,
                offset: 16,
                angle: tileRotationToAngle(TileRotation[key]),
            });
        }
    }
}
class ArmoredConveyor extends Conveyor {
    constructor() {
        super(...arguments);
        this.name = 'armored-conveyor';
        this.requirements = { plastanium: 1, thorium: 1, metaglass: 1 };
    }
    async draw(tile, info) {
        const connections = getConnections(tile, info, [
            ConnectionSupport.strict,
            Conveyor,
        ]);
        const { imageIndex, scaleX, scaleY } = getChainedSpriteVariation(tile, connections);
        const { x, y } = translatePos(tile, info.canvas);
        const context = info.canvas.getContext('2d');
        const image = await info.blockAsset(`${category$a}/conveyors`, `${tile.block.name}-${imageIndex}-0`);
        context.save();
        context.translate(x + 16, y + 16);
        context.scale(scaleX, scaleY);
        context.rotate(tileRotationToAngle(tile.rotation));
        context.translate(-16, -16);
        context.drawImage(image, 0, 0);
        context.restore();
    }
}
class Junction extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'junction';
        this.requirements = { copper: 2 };
        this.size = 1;
    }
}
class ItemBridge$1 extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'bridge-conveyor';
        this.requirements = { lead: 6, copper: 6 };
        this.size = 1;
    }
    async draw(tile, info) {
        var _a;
        await super.draw(tile, info);
        const type = this instanceof PhaseConveyor$1 ? 'phaseBridges' : 'bridges';
        if ((_a = info.options[type]) === null || _a === void 0 ? void 0 : _a.render) {
            info.renderingQueue.add(1, () => {
                var _a;
                return drawBridge({
                    tile,
                    info,
                    category: category$a,
                    opacity: (_a = info.options[type]) === null || _a === void 0 ? void 0 : _a.opacity,
                });
            });
        }
    }
}
class PhaseConveyor$1 extends ItemBridge$1 {
    constructor() {
        super(...arguments);
        this.name = 'phase-conveyor';
        this.requirements = {
            'phase-fabric': 5,
            silicon: 7,
            lead: 10,
            graphite: 10,
        };
        this.powerConsumption = 0.3;
    }
}
class Sorter$1 extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'sorter';
        this.requirements = { lead: 2, copper: 2 };
        this.size = 1;
    }
    async draw(tile, info) {
        await this.render({ tile, info, category: category$a, layers: [this.name] });
        const config = tile.config;
        const imgName = config ? 'center' : 'cross';
        const image = await info.blockAsset(category$a, imgName);
        this.renderImage({
            info,
            tile,
            image: config ? tintImage(image, config.color, 1) : image,
        });
    }
}
class InvertedSorter$1 extends Sorter$1 {
    constructor() {
        super(...arguments);
        this.name = 'inverted-sorter';
    }
}
class Router extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'router';
        this.requirements = { copper: 3 };
        this.size = 1;
    }
}
class Distributor extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'distributor';
        this.requirements = { lead: 4, copper: 4 };
        this.size = 2;
    }
}
class OverflowGate extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'overflow-gate';
        this.requirements = { lead: 2, copper: 4 };
        this.size = 1;
    }
}
class UnderflowGate extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'underflow-gate';
        this.requirements = { lead: 2, copper: 4 };
        this.size = 1;
    }
}
class MassDriver$1 extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'mass-driver';
        this.requirements = { titanium: 125, silicon: 75, lead: 125, thorium: 50 };
        this.size = 3;
        this.powerConsumption = 1.75;
    }
    async draw(tile, info) {
        await this.render({
            info,
            category: category$a,
            tile,
            layers: [this.name + '-base'],
        });
        const top = outlineImage({
            image: await info.blockAsset(category$a, this.name),
            fillStyle: '#353535',
            thickness: 3,
        });
        this.renderImage({
            info,
            image: top,
            tile,
        });
    }
}
class Duct extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'duct';
        this.outputDirection = BlockOutputDirection.front;
        this.requirements = {
            graphite: 5,
            metaglass: 2,
        };
        this.size = 1;
    }
    async draw(tile, info) {
        const connections = getConnections(tile, info, [
            ConnectionSupport.strict,
            Duct,
        ]);
        const { imageIndex, scaleX, scaleY } = getChainedSpriteVariation(tile, connections);
        const { x, y } = translatePos(tile, info.canvas);
        const context = info.canvas.getContext('2d');
        const image = await info.blockAsset(`${category$a}/ducts`, `${tile.block.name}-top-${imageIndex}`);
        context.save();
        context.translate(x + 16, y + 16);
        context.scale(scaleX, scaleY);
        context.rotate(tileRotationToAngle(tile.rotation));
        context.translate(-16, -16);
        context.drawImage(image, 0, 0);
        context.restore();
    }
}
class DuctRouter extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'duct-router';
        this.requirements = {
            graphite: 10,
            metaglass: 4,
        };
        this.size = 1;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$a,
            layers: [`ducts/${this.name}`],
        });
        drawRotatedTile({
            canvas: info.canvas,
            tile,
            image: await info.blockAsset(category$a, `ducts/${this.name}-top`),
        });
    }
}
class DuctBridge extends TransportBlock {
    constructor() {
        super(...arguments);
        this.name = 'duct-bridge';
        this.requirements = {
            graphite: 20,
            metaglass: 8,
        };
        this.size = 1;
        this.outputDirection = BlockOutputDirection.front;
    }
    async draw(tile, info) {
        var _a;
        await this.render({
            tile,
            info,
            category: category$a,
            layers: [`ducts/${this.name}`],
        });
        drawRotatedTile({
            canvas: info.canvas,
            tile,
            image: await info.blockAsset(category$a, `ducts/${this.name}-dir`),
        });
        if ((_a = info.options.bridges) === null || _a === void 0 ? void 0 : _a.render) {
            info.renderingQueue.add(1, () => {
                var _a;
                return drawBridge({
                    tile,
                    info,
                    category: `${category$a}/ducts`,
                    opacity: (_a = info.options.bridges) === null || _a === void 0 ? void 0 : _a.opacity,
                });
            });
        }
    }
}

var distribution = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Conveyor: Conveyor,
    TitaniumConveyor: TitaniumConveyor,
    PlastaniumConveyor: PlastaniumConveyor,
    ArmoredConveyor: ArmoredConveyor,
    Junction: Junction,
    ItemBridge: ItemBridge$1,
    PhaseConveyor: PhaseConveyor$1,
    Sorter: Sorter$1,
    InvertedSorter: InvertedSorter$1,
    Router: Router,
    Distributor: Distributor,
    OverflowGate: OverflowGate,
    UnderflowGate: UnderflowGate,
    MassDriver: MassDriver$1,
    Duct: Duct,
    DuctRouter: DuctRouter,
    DuctBridge: DuctBridge
});

class AirBlock$1 extends Block {
    constructor() {
        super(...arguments);
        this.name = 'air';
        this.requirements = {};
        this.size = 1;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async draw() { }
}

var environment = /*#__PURE__*/Object.freeze({
    __proto__: null,
    AirBlock: AirBlock$1
});

const category$9 = 'experimental';
class ExperimentalBlock extends Block {
    async draw(tile, info) {
        await this.render({ tile, info, category: category$9, layers: [this.name] });
    }
}
class BlockForge extends ExperimentalBlock {
    constructor() {
        super(...arguments);
        this.name = 'block-forge';
        this.requirements = { thorium: 100 };
        this.size = 3;
        this.powerConsumption = 2.0;
    }
}
class BlockLoader extends ExperimentalBlock {
    constructor() {
        super(...arguments);
        this.name = 'block-loader';
        this.requirements = { thorium: 100 };
        this.size = 3;
        this.powerConsumption = 2.0;
    }
}
class BlockUnloader extends ExperimentalBlock {
    constructor() {
        super(...arguments);
        this.name = 'block-unloader';
        this.requirements = { thorium: 100 };
        this.size = 3;
        this.powerConsumption = 2.0;
        this.output = BlockOutput.item;
        this.outputDirection = BlockOutputDirection.all;
    }
}

var experimental = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BlockForge: BlockForge,
    BlockLoader: BlockLoader,
    BlockUnloader: BlockUnloader
});

const category$8 = 'liquid';
class Pump extends Block {
    constructor() {
        super(...arguments);
        this.output = BlockOutput.liquid;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({ tile, info, category: category$8, layers: [this.name] });
    }
}
class MechanicalPump extends Pump {
    constructor() {
        super(...arguments);
        this.name = 'mechanical-pump';
        this.requirements = { copper: 15, metaglass: 10 };
        this.size = 1;
    }
}
class RotaryPump extends Pump {
    constructor() {
        super(...arguments);
        this.name = 'rotary-pump';
        this.requirements = { copper: 70, metaglass: 50, silicon: 20, titanium: 35 };
        this.size = 2;
        this.powerConsumption = 0.3;
    }
}
class ThermalPump extends Pump {
    constructor() {
        super(...arguments);
        this.name = 'thermal-pump';
        this.requirements = {
            copper: 80,
            metaglass: 90,
            silicon: 30,
            titanium: 40,
            thorium: 35,
        };
        this.size = 3;
        this.powerConsumption = 1.3;
    }
}
class Conduit extends Block {
    constructor() {
        super(...arguments);
        this.name = 'conduit';
        this.requirements = { metaglass: 1 };
        this.size = 1;
        this.output = BlockOutput.liquid;
        this.outputDirection = BlockOutputDirection.front;
    }
    async draw(tile, info) {
        const connections = getConnections(tile, info, ConnectionSupport.regular);
        const { imageIndex, scaleX, scaleY } = getChainedSpriteVariation(tile, connections);
        const { x, y } = translatePos(tile, info.canvas);
        const context = info.canvas.getContext('2d');
        const image = await info.blockAsset(category$8, `${tile.block.name}-top-${imageIndex}`);
        context.save();
        context.translate(x + 16, y + 16);
        context.scale(scaleX, scaleY);
        context.rotate(tileRotationToAngle(tile.rotation));
        context.translate(-16, -16);
        context.drawImage(image, 0, 0);
        context.restore();
    }
}
class PulseConduit extends Conduit {
    constructor() {
        super(...arguments);
        this.name = 'pulse-conduit';
        this.requirements = { titanium: 2, metaglass: 1 };
    }
}
class PlatedConduit extends Conduit {
    constructor() {
        super(...arguments);
        this.name = 'plated-conduit';
        this.requirements = { thorium: 2, metaglass: 1, plastanium: 1 };
    }
    async draw(tile, info) {
        const connections = getConnections(tile, info, [
            ConnectionSupport.strict,
            Conduit,
        ]);
        const { imageIndex, scaleX, scaleY } = getChainedSpriteVariation(tile, connections);
        const { x, y } = translatePos(tile, info.canvas);
        const context = info.canvas.getContext('2d');
        const image = await info.blockAsset(category$8, `${tile.block.name}-top-${imageIndex}`);
        context.save();
        context.translate(x + 16, y + 16);
        context.scale(scaleX, scaleY);
        context.rotate(tileRotationToAngle(tile.rotation));
        context.translate(-16, -16);
        context.drawImage(image, 0, 0);
        context.restore();
    }
}
class LiquidRouter extends Block {
    constructor() {
        super(...arguments);
        this.name = 'liquid-router';
        this.requirements = { graphite: 4, metaglass: 2 };
        this.size = 1;
        this.output = BlockOutput.liquid;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$8,
            layers: [this.name + '-bottom', this.name + '-top'],
        });
    }
}
class LiquidTank extends LiquidRouter {
    constructor() {
        super(...arguments);
        this.name = 'liquid-tank';
        this.requirements = { titanium: 25, metaglass: 25 };
        this.size = 3;
    }
}
class LiquidJunction extends Block {
    constructor() {
        super(...arguments);
        this.name = 'liquid-junction';
        this.requirements = { graphite: 2, metaglass: 2 };
        this.size = 1;
        this.output = BlockOutput.liquid;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({ tile, info, category: category$8, layers: [this.name] });
    }
}
class BridgeConduit extends Block {
    constructor() {
        super(...arguments);
        this.name = 'bridge-conduit';
        this.requirements = { graphite: 4, metaglass: 8 };
        this.size = 1;
        this.output = BlockOutput.liquid;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        var _a;
        await this.render({
            tile,
            info,
            category: category$8,
            layers: [this.name],
        });
        const type = this instanceof PhaseConduit ? 'phaseBridges' : 'bridges';
        if ((_a = info.options[type]) === null || _a === void 0 ? void 0 : _a.render) {
            info.renderingQueue.add(1, () => {
                var _a;
                return drawBridge({
                    tile,
                    info,
                    category: category$8,
                    opacity: (_a = info.options[type]) === null || _a === void 0 ? void 0 : _a.opacity,
                });
            });
        }
    }
}
class PhaseConduit extends BridgeConduit {
    constructor() {
        super(...arguments);
        this.name = 'phase-conduit';
        this.powerConsumption = 0.3;
        this.requirements = {
            'phase-fabric': 5,
            silicon: 7,
            metaglass: 20,
            titanium: 10,
        };
    }
}

var liquid = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MechanicalPump: MechanicalPump,
    RotaryPump: RotaryPump,
    ThermalPump: ThermalPump,
    Conduit: Conduit,
    PulseConduit: PulseConduit,
    PlatedConduit: PlatedConduit,
    LiquidRouter: LiquidRouter,
    LiquidTank: LiquidTank,
    LiquidJunction: LiquidJunction,
    BridgeConduit: BridgeConduit,
    PhaseConduit: PhaseConduit
});

const category$7 = 'logic';
class LogicBlock extends Block {
    async draw(tile, info) {
        await this.render({ tile, info, category: category$7, layers: [this.name] });
    }
}
class Message extends LogicBlock {
    constructor() {
        super(...arguments);
        this.name = 'message';
        this.requirements = { graphite: 5 };
        this.size = 1;
    }
}
class SwitchBlock extends LogicBlock {
    constructor() {
        super(...arguments);
        this.name = 'switch';
        this.requirements = { graphite: 5 };
        this.size = 1;
    }
}
class MicroProcessor extends LogicBlock {
    constructor() {
        super(...arguments);
        this.name = 'micro-processor';
        this.requirements = { copper: 90, lead: 50, silicon: 50 };
        this.size = 1;
    }
}
class LogicProcessor extends LogicBlock {
    constructor() {
        super(...arguments);
        this.name = 'logic-processor';
        this.requirements = { lead: 320, silicon: 80, graphite: 60, thorium: 50 };
        this.size = 2;
    }
}
class HyperProcessor extends LogicBlock {
    constructor() {
        super(...arguments);
        this.name = 'hyper-processor';
        this.requirements = { lead: 450, silicon: 150, thorium: 75, 'surge-alloy': 50 };
        this.size = 3;
    }
}
class MemoryCell extends LogicBlock {
    constructor() {
        super(...arguments);
        this.name = 'memory-cell';
        this.requirements = { graphite: 30, silicon: 30 };
        this.size = 1;
    }
}
class MemoryBank extends MemoryCell {
    constructor() {
        super(...arguments);
        this.name = 'memory-bank';
        this.requirements = { graphite: 80, silicon: 80, 'phase-fabric': 30 };
        this.size = 2;
    }
}
class LogicDisplay extends LogicBlock {
    constructor() {
        super(...arguments);
        this.name = 'logic-display';
        this.requirements = { lead: 100, silicon: 50, metaglass: 50 };
        this.size = 3;
    }
}
class LargeLogicDisplay extends LogicDisplay {
    constructor() {
        super(...arguments);
        this.name = 'large-logic-display';
        this.requirements = {
            lead: 200,
            silicon: 150,
            metaglass: 100,
            'phase-fabric': 75,
        };
        this.size = 6;
    }
}

var logic = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Message: Message,
    SwitchBlock: SwitchBlock,
    MicroProcessor: MicroProcessor,
    LogicProcessor: LogicProcessor,
    HyperProcessor: HyperProcessor,
    MemoryCell: MemoryCell,
    MemoryBank: MemoryBank,
    LogicDisplay: LogicDisplay,
    LargeLogicDisplay: LargeLogicDisplay
});

const category$6 = 'payload';
class PayloadConveyor extends Block {
    constructor() {
        super(...arguments);
        this.name = 'payload-conveyor';
        this.requirements = { graphite: 10, copper: 20 };
        this.size = 3;
        this.output = BlockOutput.payload;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, { canvas, blockAsset }) {
        drawRotatedTile({
            canvas,
            image: await blockAsset(category$6, this.name + '-icon'),
            tile,
        });
    }
}
class PayloadRouter extends Block {
    constructor() {
        super(...arguments);
        this.name = 'payload-router';
        this.requirements = { graphite: 15, copper: 20 };
        this.size = 3;
        this.output = BlockOutput.payload;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$6,
            layers: [this.name, this.name + '-over'],
        });
        drawRotatedTile({
            canvas: info.canvas,
            image: await info.blockAsset(category$6, this.name + '-top'),
            tile,
        });
    }
}
class PayloadPropulsionTower extends Block {
    constructor() {
        super(...arguments);
        this.name = 'payload-propulsion-tower';
        this.requirements = {
            thorium: 300,
            silicon: 200,
            plastanium: 200,
            'phase-fabric': 50,
        };
        this.size = 5;
        this.powerConsumption = 6;
        this.output = BlockOutput.payload;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$6,
            layers: [`${this.name}-base`],
        });
        const top = outlineImage({
            image: await info.blockAsset(category$6, this.name),
            fillStyle: '#353535',
            thickness: 3,
        });
        this.renderImage({
            tile,
            info,
            image: top,
        });
    }
}

var payload = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PayloadConveyor: PayloadConveyor,
    PayloadRouter: PayloadRouter,
    PayloadPropulsionTower: PayloadPropulsionTower
});

const category$5 = 'power';
class PowerBlock extends Block {
    async draw(tile, info) {
        await this.render({ tile, info, category: category$5, layers: [this.name] });
    }
}
class PowerNode extends PowerBlock {
    constructor() {
        super(...arguments);
        this.name = 'power-node';
        this.requirements = {
            copper: 1,
            lead: 3,
        };
        this.size = 1;
    }
}
class PowerNodeLarge extends PowerBlock {
    constructor() {
        super(...arguments);
        this.name = 'power-node-large';
        this.requirements = {
            titanium: 5,
            lead: 10,
            silicon: 3,
        };
        this.size = 2;
    }
}
class SurgeTower extends PowerBlock {
    constructor() {
        super(...arguments);
        this.name = 'surge-tower';
        this.requirements = {
            titanium: 7,
            lead: 10,
            silicon: 15,
            'surge-alloy': 15,
        };
        this.size = 2;
    }
}
class Diode extends PowerBlock {
    constructor() {
        super(...arguments);
        this.name = 'diode';
        this.requirements = {
            silicon: 10,
            plastanium: 5,
            metaglass: 10,
        };
        this.size = 1;
    }
    async draw(tile, info) {
        await super.draw(tile, info);
        drawRotatedTile({
            canvas: info.canvas,
            tile,
            image: await info.blockAsset(category$5, this.name + '-arrow'),
        });
    }
}
class Battery extends PowerBlock {
    constructor() {
        super(...arguments);
        this.name = 'battery';
        this.requirements = {
            copper: 5,
            lead: 20,
        };
        this.size = 1;
    }
}
class BatteryLarge extends PowerBlock {
    constructor() {
        super(...arguments);
        this.name = 'battery-large';
        this.requirements = {
            titanium: 20,
            lead: 40,
            silicon: 20,
        };
        this.size = 3;
    }
}
class PowerGenerator$1 extends PowerBlock {
}
class CombustionGenerator extends PowerGenerator$1 {
    constructor() {
        super(...arguments);
        this.name = 'combustion-generator';
        this.requirements = {
            copper: 25,
            lead: 15,
        };
        this.size = 1;
        this.powerGeneration = 1;
    }
}
class ThermalGenerator extends PowerGenerator$1 {
    constructor() {
        super(...arguments);
        this.name = 'thermal-generator';
        this.requirements = {
            copper: 40,
            graphite: 35,
            lead: 50,
            silicon: 35,
            metaglass: 40,
        };
        this.size = 2;
        this.powerGeneration = 1.8;
    }
}
class SteamGenerator extends PowerGenerator$1 {
    constructor() {
        super(...arguments);
        this.name = 'steam-generator';
        this.requirements = {
            copper: 35,
            graphite: 25,
            lead: 40,
            silicon: 30,
        };
        this.size = 2;
        this.powerGeneration = 5.5;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$5,
            layers: [
                this.name,
                this.name + '-turbine0',
                this.name + '-turbine1',
                this.name + '-cap',
            ],
        });
    }
}
class DifferentialGenerator extends PowerGenerator$1 {
    constructor() {
        super(...arguments);
        this.name = 'differential-generator';
        this.requirements = {
            copper: 70,
            titanium: 50,
            lead: 100,
            silicon: 65,
            metaglass: 50,
        };
        this.size = 3;
        this.powerGeneration = 18;
    }
}
class RtgGenerator extends PowerGenerator$1 {
    constructor() {
        super(...arguments);
        this.name = 'rtg-generator';
        this.requirements = {
            lead: 100,
            silicon: 75,
            'phase-fabric': 25,
            plastanium: 75,
            thorium: 50,
        };
        this.size = 2;
        this.powerGeneration = 4.5;
    }
}
class SolarPanel extends PowerGenerator$1 {
    constructor() {
        super(...arguments);
        this.name = 'solar-panel';
        this.requirements = {
            lead: 10,
            silicon: 15,
        };
        this.size = 1;
        this.powerGeneration = 0.1;
    }
}
class SolarPanelLarge extends PowerGenerator$1 {
    constructor() {
        super(...arguments);
        this.name = 'solar-panel-large';
        this.requirements = {
            lead: 80,
            silicon: 110,
            'phase-fabric': 15,
        };
        this.size = 3;
        this.powerGeneration = 1.3;
    }
}
class ThoriumReactor extends PowerGenerator$1 {
    constructor() {
        super(...arguments);
        this.name = 'thorium-reactor';
        this.requirements = {
            lead: 300,
            silicon: 200,
            graphite: 150,
            thorium: 150,
            metaglass: 50,
        };
        this.size = 3;
        this.powerGeneration = 15;
    }
}
class ImpactReactor extends PowerGenerator$1 {
    constructor() {
        super(...arguments);
        this.name = 'impact-reactor';
        this.requirements = {
            lead: 500,
            silicon: 300,
            graphite: 400,
            thorium: 100,
            'surge-alloy': 250,
            metaglass: 250,
        };
        this.size = 4;
        this.powerGeneration = 130;
        this.powerConsumption = 25;
    }
    async draw(tile, info) {
        await this.render({
            info,
            category: category$5,
            tile,
            layers: [this.name + '-bottom', this.name],
        });
    }
}

var power = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PowerNode: PowerNode,
    PowerNodeLarge: PowerNodeLarge,
    SurgeTower: SurgeTower,
    Diode: Diode,
    Battery: Battery,
    BatteryLarge: BatteryLarge,
    PowerGenerator: PowerGenerator$1,
    CombustionGenerator: CombustionGenerator,
    ThermalGenerator: ThermalGenerator,
    SteamGenerator: SteamGenerator,
    DifferentialGenerator: DifferentialGenerator,
    RtgGenerator: RtgGenerator,
    SolarPanel: SolarPanel,
    SolarPanelLarge: SolarPanelLarge,
    ThoriumReactor: ThoriumReactor,
    ImpactReactor: ImpactReactor
});

const category$4 = 'production';
class Drill extends Block {
    constructor() {
        super(...arguments);
        this.output = BlockOutput.item;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$4,
            layers: [this.name, this.name + '-rotator', this.name + '-top'],
        });
    }
}
class MechanicalDrill extends Drill {
    constructor() {
        super(...arguments);
        this.name = 'mechanical-drill';
        this.requirements = { copper: 12 };
        this.size = 2;
    }
}
class PneumaticDrill extends Drill {
    constructor() {
        super(...arguments);
        this.name = 'pneumatic-drill';
        this.requirements = { copper: 18, graphite: 10 };
        this.size = 2;
    }
}
class LaserDrill extends Drill {
    constructor() {
        super(...arguments);
        this.name = 'laser-drill';
        this.requirements = { copper: 35, graphite: 30, silicon: 30, titanium: 20 };
        this.size = 3;
        this.powerConsumption = 1.1;
    }
}
class BlastDrill extends Drill {
    constructor() {
        super(...arguments);
        this.name = 'blast-drill';
        this.requirements = { copper: 65, silicon: 60, titanium: 50, thorium: 75 };
        this.size = 4;
        this.powerConsumption = 3.0;
    }
}
class WaterExtractor extends Drill {
    constructor() {
        super(...arguments);
        this.name = 'water-extractor';
        this.requirements = { metaglass: 30, graphite: 30, lead: 30 };
        this.size = 2;
        this.powerConsumption = 1.5;
        this.output = BlockOutput.liquid;
    }
}
class Cultivator extends Block {
    constructor() {
        super(...arguments);
        this.name = 'cultivator';
        this.requirements = { copper: 25, lead: 25, silicon: 10 };
        this.size = 2;
        this.powerConsumption = 0.9;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$4,
            layers: [this.name, this.name + '-top'],
        });
    }
}
class OilExtractor extends Drill {
    constructor() {
        super(...arguments);
        this.name = 'oil-extractor';
        this.requirements = {
            copper: 150,
            graphite: 175,
            lead: 115,
            thorium: 115,
            silicon: 75,
        };
        this.size = 3;
        this.powerConsumption = 3.0;
    }
}

var production = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MechanicalDrill: MechanicalDrill,
    PneumaticDrill: PneumaticDrill,
    LaserDrill: LaserDrill,
    BlastDrill: BlastDrill,
    WaterExtractor: WaterExtractor,
    Cultivator: Cultivator,
    OilExtractor: OilExtractor
});

const category$3 = 'sandbox';
class SandBoxBlock extends Block {
    async draw(tile, info) {
        await this.render({ tile, info, category: category$3, layers: [this.name] });
    }
}
class PowerSource extends SandBoxBlock {
    constructor() {
        super(...arguments);
        this.name = 'power-source';
        this.requirements = {};
        this.size = 1;
    }
}
class PowerVoid extends SandBoxBlock {
    constructor() {
        super(...arguments);
        this.name = 'power-void';
        this.requirements = {};
        this.size = 1;
    }
}
class ItemSource$1 extends SandBoxBlock {
    constructor() {
        super(...arguments);
        this.name = 'item-source';
        this.requirements = {};
        this.size = 1;
        this.output = BlockOutput.item;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({ tile, info, category: category$3, layers: [this.name] });
        const config = tile.config;
        const imgName = config ? 'center' : 'cross';
        const image = await info.blockAsset(category$3, imgName);
        this.renderImage({
            info,
            tile,
            image: config ? tintImage(image, config.color, 1) : image,
        });
    }
}
class ItemVoid extends SandBoxBlock {
    constructor() {
        super(...arguments);
        this.name = 'item-void';
        this.requirements = {};
        this.size = 1;
    }
}
class LiquidSource$1 extends SandBoxBlock {
    constructor() {
        super(...arguments);
        this.name = 'liquid-source';
        this.requirements = {};
        this.size = 1;
        this.output = BlockOutput.liquid;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({ tile, info, category: category$3, layers: [this.name] });
        const config = tile.config;
        const imgName = config ? 'center' : 'cross';
        const image = await info.blockAsset(category$3, imgName);
        this.renderImage({
            info,
            tile,
            image: config ? tintImage(image, config.color, 1) : image,
        });
    }
}
class LiquidVoid extends SandBoxBlock {
    constructor() {
        super(...arguments);
        this.name = 'liquid-void';
        this.requirements = {};
        this.size = 1;
    }
}
class LightBlock$1 extends SandBoxBlock {
}
class Illuminator extends LightBlock$1 {
    constructor() {
        super(...arguments);
        this.name = 'illuminator';
        this.requirements = { graphite: 12, silicon: 8 };
        this.size = 1;
        this.powerConsumption = 0.05;
    }
}
class PayloadSource extends SandBoxBlock {
    constructor() {
        super(...arguments);
        this.name = 'payload-source';
        this.requirements = {};
        this.size = 5;
        this.output = BlockOutput.payload;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$3,
            layers: [this.name, `${this.name}-top`],
        });
    }
}
class PayloadVoid extends SandBoxBlock {
    constructor() {
        super(...arguments);
        this.name = 'payload-void';
        this.requirements = {};
        this.size = 5;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$3,
            layers: [this.name, `${this.name}-top`],
        });
    }
}

var sandbox = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PowerSource: PowerSource,
    PowerVoid: PowerVoid,
    ItemSource: ItemSource$1,
    ItemVoid: ItemVoid,
    LiquidSource: LiquidSource$1,
    LiquidVoid: LiquidVoid,
    LightBlock: LightBlock$1,
    Illuminator: Illuminator,
    PayloadSource: PayloadSource,
    PayloadVoid: PayloadVoid
});

const category$2 = 'storage';
class StorageBlock extends Block {
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$2,
            layers: [this.name],
        });
        const image = await info.blockAsset(category$2, this.name + '-team');
        this.renderImage({
            info,
            image: tintImage(image, '#ffa600'),
            tile,
        });
    }
}
class CoreShard extends StorageBlock {
    constructor() {
        super(...arguments);
        this.name = 'core-shard';
        this.requirements = { copper: 1000, lead: 800 };
        this.size = 3;
    }
}
class CoreFoundation extends StorageBlock {
    constructor() {
        super(...arguments);
        this.name = 'core-foundation';
        this.requirements = { copper: 3000, lead: 3000, silicon: 2000 };
        this.size = 4;
    }
}
class CoreNucleus extends StorageBlock {
    constructor() {
        super(...arguments);
        this.name = 'core-nucleus';
        this.requirements = { copper: 8000, lead: 8000, silicon: 5000, thorium: 4000 };
        this.size = 5;
    }
}
class Container extends StorageBlock {
    constructor() {
        super(...arguments);
        this.name = 'container';
        this.requirements = { titanium: 100 };
        this.size = 2;
    }
}
class Vault extends Container {
    constructor() {
        super(...arguments);
        this.name = 'vault';
        this.requirements = { titanium: 250, thorium: 125 };
        this.size = 3;
    }
}
class Unloader$1 extends Block {
    constructor() {
        super(...arguments);
        this.name = 'unloader';
        this.requirements = { titanium: 25, silicon: 30 };
        this.size = 1;
        this.output = BlockOutput.item;
        this.outputDirection = BlockOutputDirection.all;
    }
    async draw(tile, info) {
        await this.render({ tile, info, category: category$2, layers: [this.name] });
        const config = tile.config;
        if (config) {
            const image = await info.blockAsset(category$2, this.name + '-center');
            this.renderImage({
                info,
                image: tintImage(image, config.color, 1),
                tile,
            });
        }
    }
}

var storage = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CoreShard: CoreShard,
    CoreFoundation: CoreFoundation,
    CoreNucleus: CoreNucleus,
    Container: Container,
    Vault: Vault,
    Unloader: Unloader$1
});

const category$1 = 'turrets';
class Turret extends Block {
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: category$1,
            layers: ['bases/block-' + this.size],
        });
        const top = outlineImage({
            image: await info.blockAsset(category$1, this.name),
            fillStyle: '#353535',
            thickness: 3,
        });
        this.renderImage({
            info,
            image: top,
            tile,
        });
    }
}
class Duo extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'duo';
        this.requirements = { copper: 35 };
        this.size = 1;
    }
}
class Scatter extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'scatter';
        this.requirements = { copper: 85, lead: 45 };
        this.size = 2;
    }
}
class Scorch extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'scorch';
        this.requirements = { copper: 25, graphite: 22 };
        this.size = 1;
    }
}
class Hail extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'hail';
        this.requirements = { copper: 40, graphite: 17 };
        this.size = 1;
    }
}
class Wave extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'wave';
        this.requirements = { metaglass: 45, lead: 75 };
        this.size = 2;
    }
    async draw(tile, info) {
        await super.draw(tile, info);
        await this.render({
            info,
            category: category$1,
            layers: [this.name + '-top'],
            tile,
        });
    }
}
class Lancer extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'lancer';
        this.requirements = { copper: 60, lead: 70, silicon: 50 };
        this.size = 2;
    }
}
class Arc extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'arc';
        this.requirements = { copper: 50, lead: 50 };
        this.size = 1;
    }
}
class Parallax extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'parallax';
        this.requirements = { silicon: 120, titanium: 90, graphite: 30 };
        this.size = 2;
    }
}
class Swarmer extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'swarmer';
        this.requirements = { graphite: 35, titanium: 35, plastanium: 45, silicon: 30 };
        this.size = 2;
    }
}
class Salvo extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'salvo';
        this.requirements = { copper: 100, graphite: 80, titanium: 50 };
        this.size = 2;
    }
}
class Segment extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'segment';
        this.requirements = { silicon: 130, thorium: 80, 'phase-fabric': 40 };
        this.size = 2;
    }
}
class Tsunami extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'tsunami';
        this.requirements = { metaglass: 100, lead: 400, titanium: 250, thorium: 100 };
        this.size = 3;
    }
    async draw(tile, info) {
        await super.draw(tile, info);
        await this.render({
            info,
            category: category$1,
            layers: [this.name + '-top'],
            tile,
        });
    }
}
class Fuse extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'fuse';
        this.requirements = { copper: 225, graphite: 225, thorium: 100 };
        this.size = 3;
    }
}
class Ripple extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'ripple';
        this.requirements = { copper: 150, graphite: 135, titanium: 60 };
        this.size = 3;
    }
}
class Cyclone extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'cyclone';
        this.requirements = { copper: 200, titanium: 125, plastanium: 80 };
        this.size = 3;
    }
}
class Foreshadow extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'foreshadow';
        this.requirements = {
            copper: 1000,
            metaglass: 600,
            'surge-alloy': 300,
            plastanium: 200,
            silicon: 600,
        };
        this.size = 4;
    }
}
class Spectre extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'spectre';
        this.requirements = {
            copper: 900,
            graphite: 300,
            'surge-alloy': 250,
            plastanium: 175,
            thorium: 250,
        };
        this.size = 4;
    }
}
class Meltdown extends Turret {
    constructor() {
        super(...arguments);
        this.name = 'meltdown';
        this.requirements = {
            copper: 1200,
            lead: 350,
            graphite: 300,
            'surge-alloy': 325,
            silicon: 325,
        };
        this.size = 4;
    }
}

var turrets = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Duo: Duo,
    Scatter: Scatter,
    Scorch: Scorch,
    Hail: Hail,
    Wave: Wave,
    Lancer: Lancer,
    Arc: Arc,
    Parallax: Parallax,
    Swarmer: Swarmer,
    Salvo: Salvo,
    Segment: Segment,
    Tsunami: Tsunami,
    Fuse: Fuse,
    Ripple: Ripple,
    Cyclone: Cyclone,
    Foreshadow: Foreshadow,
    Spectre: Spectre,
    Meltdown: Meltdown
});

const category = 'units';
class Factory extends Block {
    constructor() {
        super(...arguments);
        this.output = BlockOutput.payload;
        this.outputDirection = BlockOutputDirection.front;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category,
            layers: [this.name],
        });
        drawRotatedTile({
            canvas: info.canvas,
            image: await info.blockAsset(category, 'factory-out-' + this.size),
            tile,
        });
        await this.render({
            tile,
            info,
            category,
            layers: ['factory-top-' + this.size],
        });
    }
}
class Reconstructor extends Block {
    constructor() {
        super(...arguments);
        this.output = BlockOutput.payload;
        this.outputDirection = BlockOutputDirection.front;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category,
            layers: [this.name],
        });
        const input = await info.blockAsset(category, 'factory-in-' + this.size);
        const output = await info.blockAsset(category, 'factory-out-' + this.size);
        drawRotatedTile({
            canvas: info.canvas,
            image: input,
            tile,
        });
        drawRotatedTile({
            canvas: info.canvas,
            image: output,
            tile,
        });
        await this.render({
            tile,
            info,
            category,
            layers: [this.name + '-top'],
        });
    }
}
class CommandCenter extends Block {
    constructor() {
        super(...arguments);
        this.name = 'command-center';
        this.requirements = { copper: 200, lead: 250, silicon: 250, graphite: 100 };
        this.size = 2;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category,
            layers: [this.name],
        });
        const detail = await info.blockAsset(category, this.name + '-team');
        this.renderImage({
            info,
            image: tintImage(detail, '#ffa600'),
            tile,
        });
    }
}
class GroundFactory extends Factory {
    constructor() {
        super(...arguments);
        this.name = 'ground-factory';
        this.requirements = { copper: 50, lead: 120, silicon: 80 };
        this.size = 3;
        this.powerConsumption = 1.2;
    }
}
class AirFactory extends Factory {
    constructor() {
        super(...arguments);
        this.name = 'air-factory';
        this.requirements = { copper: 60, lead: 70 };
        this.size = 3;
        this.powerConsumption = 1.2;
    }
}
class NavalFactory extends Factory {
    constructor() {
        super(...arguments);
        this.name = 'naval-factory';
        this.requirements = { copper: 150, lead: 130, metaglass: 120 };
        this.size = 3;
        this.powerConsumption = 1.2;
    }
}
class AdditiveReconstructor extends Reconstructor {
    constructor() {
        super(...arguments);
        this.name = 'additive-reconstructor';
        this.requirements = { copper: 200, lead: 120, silicon: 90 };
        this.size = 3;
        this.powerConsumption = 3.0;
    }
}
class MultiplicativeReconstructor extends Reconstructor {
    constructor() {
        super(...arguments);
        this.name = 'multiplicative-reconstructor';
        this.requirements = { lead: 650, silicon: 450, titanium: 350, thorium: 650 };
        this.size = 5;
        this.powerConsumption = 6.0;
    }
}
class ExponentialReconstructor extends Reconstructor {
    constructor() {
        super(...arguments);
        this.name = 'exponential-reconstructor';
        this.requirements = {
            lead: 2000,
            silicon: 1000,
            titanium: 2000,
            thorium: 750,
            plastanium: 450,
            'phase-fabric': 600,
        };
        this.size = 7;
        this.powerConsumption = 13.0;
    }
}
class TetrativeReconstructor extends Reconstructor {
    constructor() {
        super(...arguments);
        this.name = 'tetrative-reconstructor';
        this.requirements = {
            lead: 4000,
            silicon: 3000,
            thorium: 1000,
            plastanium: 600,
            'phase-fabric': 600,
            'surge-alloy': 800,
        };
        this.size = 9;
        this.powerConsumption = 25.0;
    }
}
class RepairPoint extends Block {
    constructor() {
        super(...arguments);
        this.name = 'repair-point';
        this.requirements = { lead: 30, copper: 30, silicon: 20 };
        this.size = 1;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category,
            layers: [this.name + '-base', this.name],
        });
        const top = outlineImage({
            image: await info.blockAsset(category, this.name),
            fillStyle: '#353535',
            thickness: 3,
        });
        this.renderImage({
            tile,
            info,
            image: top,
        });
    }
}
class RepairTurret extends RepairPoint {
    constructor() {
        super(...arguments);
        this.name = 'repair-turret';
        this.requirements = { silicon: 90, thorium: 80, plastanium: 60 };
        this.size = 2;
    }
    async draw(tile, info) {
        await this.render({
            tile,
            info,
            category: 'turrets',
            layers: ['bases/block-2'],
        });
        const top = outlineImage({
            image: await info.blockAsset(category, this.name),
            fillStyle: '#353535',
            thickness: 3,
        });
        this.renderImage({
            tile,
            info,
            image: top,
        });
    }
}
class ResupplyPoint extends Block {
    constructor() {
        super(...arguments);
        this.name = 'resupply-point';
        this.requirements = { lead: 20, copper: 15, silicon: 15 };
        this.size = 2;
    }
    async draw(tile, info) {
        await this.render({ tile, info, category, layers: [this.name] });
    }
}

var units = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CommandCenter: CommandCenter,
    GroundFactory: GroundFactory,
    AirFactory: AirFactory,
    NavalFactory: NavalFactory,
    AdditiveReconstructor: AdditiveReconstructor,
    MultiplicativeReconstructor: MultiplicativeReconstructor,
    ExponentialReconstructor: ExponentialReconstructor,
    TetrativeReconstructor: TetrativeReconstructor,
    RepairPoint: RepairPoint,
    RepairTurret: RepairTurret,
    ResupplyPoint: ResupplyPoint
});

function registerBlocks(domain) {
    for (const k in domain) {
        const key = k;
        const Class = domain[key];
        if (Class) {
            const block = new Class();
            Block.codes.set(block.name, block);
        }
    }
}
registerBlocks(campaign);
registerBlocks(crafting);
registerBlocks({
    ...defense,
    Wall: undefined,
});
registerBlocks(distribution);
registerBlocks(environment);
registerBlocks(experimental);
registerBlocks(liquid);
registerBlocks(logic);
registerBlocks(payload);
registerBlocks({
    ...power,
    PowerGenerator: undefined,
});
registerBlocks(production);
registerBlocks({
    ...sandbox,
    LightBlock: undefined,
});
registerBlocks(storage);
registerBlocks(turrets);
registerBlocks(units);
const Blocks = {
    campaign,
    crafting,
    defense,
    distribution,
    environment,
    experimental,
    liquid,
    logic,
    payload,
    power,
    production,
    sandbox,
    storage,
    turrets,
    units,
};

const itemColors = {
    copper: '#d99d73',
    lead: '#8c7fa9',
    metaglass: '#ebeef5',
    graphite: '#b2c6d2',
    sand: '#f7cba4',
    coal: '#272727',
    titanium: '#8da1e3',
    thorium: '#f9a3c7',
    scrap: '#777777',
    silicon: '#53565c',
    plastanium: '#cbd97f',
    'phase-fabric': '#f4ba6e',
    'surge-alloy': '#f3e979',
    'spore-pod': '#7457ce',
    'blast-compound': '#ff795e',
    pyratite: '#ffaa5f',
};
/** A wrapper for `ItemCode`, can be useful with `instanceof` */
class Item {
    constructor(code) {
        this.code = code;
        this.color = itemColors[code];
    }
    static create(name) {
        let item = this.itemMap.get(name);
        if (!item) {
            item = new Item(name);
            this.itemMap.set(name, item);
        }
        return item;
    }
    static fromCode(code) {
        var _a;
        const items = [
            'copper',
            'lead',
            'metaglass',
            'graphite',
            'sand',
            'coal',
            'titanium',
            'thorium',
            'scrap',
            'silicon',
            'plastanium',
            'phase-fabric',
            'surge-alloy',
            'spore-pod',
            'blast-compound',
            'pyratite',
        ];
        if (code > items.length - 1)
            throw new Error('Unknown item code: ' + code);
        const name = items[code];
        const item = (_a = this.itemMap.get(name)) !== null && _a !== void 0 ? _a : this.create(name);
        return item;
    }
}
Item.itemMap = new Map();

const Items = {
    copper: Item.create('copper'),
    lead: Item.create('lead'),
    metaglass: Item.create('metaglass'),
    graphite: Item.create('graphite'),
    sand: Item.create('sand'),
    coal: Item.create('coal'),
    titanium: Item.create('titanium'),
    thorium: Item.create('thorium'),
    scrap: Item.create('scrap'),
    silicon: Item.create('silicon'),
    plastanium: Item.create('plastanium'),
    phaseFabric: Item.create('phase-fabric'),
    surgeAlloy: Item.create('surge-alloy'),
    sporePod: Item.create('spore-pod'),
    blastCompound: Item.create('blast-compound'),
    pyratite: Item.create('pyratite'),
};

var UnitCommand;
(function (UnitCommand) {
    UnitCommand[UnitCommand["attack"] = 0] = "attack";
    UnitCommand[UnitCommand["rally"] = 1] = "rally";
    UnitCommand[UnitCommand["idle"] = 2] = "idle";
})(UnitCommand || (UnitCommand = {}));

const liquidColors = {
    water: '#596ab8',
    slag: '#ffa166',
    oil: '#313131',
    cryofluid: '#6ecdec',
};
class Liquid {
    constructor(name) {
        this.name = name;
        this.color = liquidColors[name];
    }
    static create(name) {
        let liquid = this.liquidMap.get(name);
        if (!liquid) {
            liquid = new Liquid(name);
            this.liquidMap.set(name, liquid);
        }
        return liquid;
    }
    static fromCode(code) {
        var _a;
        const liquids = ['water', 'slag', 'oil', 'cryofluid'];
        if (code > liquids.length - 1)
            throw new Error('Unknown liquid code: ' + code);
        const name = liquids[code];
        return (_a = this.liquidMap.get(name)) !== null && _a !== void 0 ? _a : this.create(name);
    }
}
Liquid.liquidMap = new Map();

const Liquids = {
    water: Liquid.create('water'),
    slag: Liquid.create('slag'),
    oil: Liquid.create('oil'),
    cryofluid: Liquid.create('cryofluid'),
};

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Block: Block,
    Blocks: Blocks,
    get BlockOutput () { return BlockOutput; },
    get BlockOutputDirection () { return BlockOutputDirection; },
    Content: Content,
    MappableContent: MappableContent,
    UnlockableContent: UnlockableContent,
    Item: Item,
    Items: Items,
    get UnitCommand () { return UnitCommand; },
    Liquid: Liquid,
    Liquids: Liquids
});

async function drawBackground({ blockAsset }, backgroundCanvas, size) {
    const context = backgroundCanvas.getContext('2d');
    const floor = await blockAsset('environment', 'metal-floor');
    const pattern = context.createPattern(floor, 'repeat');
    context.save();
    context.fillStyle = pattern;
    context.fillRect(0, 0, size, size);
    context.restore();
    context.shadowColor = 'black';
    context.shadowBlur = 20;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
}

/**
 * Similar to a DataView, but it has an auto incrementing offset.
 * A mix of `DataView` and the `DataInputStream` java class
 */
class StreamedDataReader {
    constructor(buffer) {
        this.buffer = buffer;
        /**
         * Internal byte offset of this `StreamedDataView`
         */
        this.currentOffset = 0;
        this.data = new DataView(buffer);
    }
    /**
     * The current byte offset of this `StreamedDataView`
     */
    get offset() {
        return this.currentOffset;
    }
    /**
     * Reads the next 4 bytes as a 32-bit float value. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getFloat32(littleEndian = false) {
        const value = this.data.getFloat32(this.currentOffset, littleEndian);
        this.currentOffset += 4;
        return value;
    }
    /**
     * Reads the next 8 bytes as a 64-bit float value. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getFloat64(littleEndian = false) {
        const value = this.data.getFloat64(this.currentOffset, littleEndian);
        this.currentOffset += 8;
        return value;
    }
    /**
     * Reads the next byte as a 8-bit int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getInt8() {
        const value = this.data.getInt8(this.currentOffset);
        this.currentOffset++;
        return value;
    }
    /**
     * Reads the next 2 bytes as a 16-bit int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getInt16(littleEndian = false) {
        const value = this.data.getInt16(this.currentOffset, littleEndian);
        this.currentOffset += 2;
        return value;
    }
    /**
     * Reads the next 4 bytes as a 32-bit int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getInt32(littleEndian = false) {
        const value = this.data.getInt32(this.currentOffset, littleEndian);
        this.currentOffset += 4;
        return value;
    }
    /**
     * Reads the next byte as a 8-bit unsigned int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getUint8() {
        const value = this.data.getUint8(this.currentOffset);
        this.currentOffset++;
        return value;
    }
    /**
     * Reads the next 2 bytes as a 16-bit unsigned int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getUint16(littleEndian = false) {
        const value = this.data.getUint16(this.currentOffset, littleEndian);
        this.currentOffset += 2;
        return value;
    }
    /**
     * Reads the next 4 bytes as a 32-bit unsigned int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getUint32(littleEndian = false) {
        const value = this.data.getUint32(this.currentOffset, littleEndian);
        this.currentOffset += 4;
        return value;
    }
    /**
     * Reads the next 8 bytes as a 64-bit int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getBigInt64(littleEndian = false) {
        const value = this.data.getBigInt64(this.currentOffset, littleEndian);
        this.currentOffset += 8;
        return value;
    }
    /**
     * Reads the next 8 bytes as a 64-bit unsigned int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getBigUint64(littleEndian = false) {
        const value = this.data.getBigUint64(this.currentOffset, littleEndian);
        this.currentOffset += 8;
        return value;
    }
    /**
     * Returns a unicode character with the code from the next byte
     */
    getChar() {
        return String.fromCharCode(this.getUint8());
    }
    /**
     * Reads a string that has been encoded using a
     * modified UTF-8
     * format.
     */
    getString() {
        const utflen = this.getUint16();
        const buffer = this.buffer.slice(this.currentOffset, this.currentOffset + utflen);
        this.currentOffset += utflen;
        return new TextDecoder().decode(buffer);
    }
    /**
     * Reads the next byte as a boolean
     */
    getBool() {
        const value = this.getInt8();
        if (value < 0)
            throw new Error('Bat byte input');
        return value !== 0;
    }
}

class StreamedDataWriter {
    constructor(buffer) {
        this.buffer = buffer;
        /**
         * Internal byte offset of this `StreamedDataView`
         */
        this.currentOffset = 0;
        this.data = new DataView(buffer);
    }
    /**
     * The current byte offset of this `StreamedDataView`
     */
    get offset() {
        return this.currentOffset;
    }
    /**
     * Ensures that `min` bytes are avaliable for write
     */
    ensure(min) {
        const length = this.buffer.byteLength;
        if (this.currentOffset + min <= length)
            return;
        // get the minimum power of 2 that can multiply length
        const p = Math.ceil(Math.log2((length + min) / length));
        const result = new Uint8Array(length * Math.pow(2, p));
        result.set(new Uint8Array(this.buffer));
        this.buffer = result.buffer;
        this.data = new DataView(this.buffer);
    }
    /**
     * Writes a 32-bit float in the next 4 bytes. There is
     */
    setFloat32(value, littleEndian = false) {
        this.ensure(4);
        this.data.setFloat32(this.currentOffset, value, littleEndian);
        this.currentOffset += 4;
    }
    /**
     * Writes a 64-bit float in the next 8 bytes.
     */
    setFloat64(value, littleEndian = false) {
        this.ensure(8);
        this.data.setFloat64(this.currentOffset, value, littleEndian);
        this.currentOffset += 8;
    }
    /**
     * Writes a 8-bit int in the next byte.
     */
    setInt8(value) {
        this.ensure(1);
        this.data.setInt8(this.currentOffset, value);
        this.currentOffset++;
    }
    /**
     * Writes a 16-bit int in the next 2 bytes.
     */
    setInt16(value, littleEndian = false) {
        this.ensure(2);
        this.data.setInt16(this.currentOffset, value, littleEndian);
        this.currentOffset += 2;
    }
    /**
     * Writes a 32-bit int in the next 2 bytes.
     */
    setInt32(value, littleEndian = false) {
        this.ensure(4);
        this.data.setInt32(this.currentOffset, value, littleEndian);
        this.currentOffset += 4;
    }
    /**
     * Writes a 8-bit unsigned int in the next byte.
     */
    setUint8(value) {
        this.ensure(1);
        this.data.setUint8(this.currentOffset, value);
        this.currentOffset++;
    }
    /**
     * Writes a 16-bit unsigned int in the next 2 bytes.
     */
    setUint16(value, littleEndian = false) {
        this.ensure(2);
        this.data.setUint16(this.currentOffset, value, littleEndian);
        this.currentOffset += 2;
    }
    /**
     * Writes a 32-bit unsigned int in the next 4 bytes.
     */
    setUint32(value, littleEndian = false) {
        this.ensure(4);
        this.data.setUint32(this.currentOffset, value, littleEndian);
        this.currentOffset += 4;
    }
    /**
     * Writes a 64-bit bigint in the next 8 bytes.
     */
    setBigInt64(value, littleEndian = false) {
        this.ensure(8);
        this.data.setBigInt64(this.currentOffset, value, littleEndian);
        this.currentOffset += 8;
    }
    /**
     * Writes a 64-bit bigint in the next 8 bytes.
     */
    setBigUint64(value, littleEndian = false) {
        this.ensure(8);
        this.data.setBigUint64(this.currentOffset, value, littleEndian);
        this.currentOffset += 8;
    }
    /**
     * Returns a unicode character with the code from the next byte
     */
    setChar(value) {
        this.ensure(1);
        this.setUint8(value.charCodeAt(0));
    }
    /**
     * Reads a string that has been encoded using a
     * modified UTF-8
     * format.
     */
    setString(str) {
        const result = new TextEncoder().encode(str);
        const length = result.byteLength;
        this.ensure(length + 2);
        this.setInt16(length);
        new Uint8Array(this.buffer).set(result, this.currentOffset);
        this.currentOffset += length;
        return length;
    }
    /**
     * Writes a boolean in the next byte
     */
    setBool(value) {
        this.ensure(1);
        this.setInt8(value ? 1 : 0);
    }
}

const { distribution: { Sorter, InvertedSorter, MassDriver, ItemBridge, PhaseConveyor, }, storage: { Unloader }, sandbox: { ItemSource, LiquidSource, LightBlock }, environment: { AirBlock }, } = Blocks;
class SchematicIO {
    static isValid(data, consumeData = false) {
        const { header } = SchematicIO;
        if (consumeData) {
            for (const char of header) {
                if (char !== data.getChar())
                    return false;
            }
            return true;
        }
        for (let i = 0; i < header.length; i++) {
            if (header[i] !== String.fromCharCode(data.data.getUint8(i))) {
                return false;
            }
        }
        return true;
    }
    static compressedData(data) {
        const bytes = Pako__default["default"].inflate(new Uint8Array(data.buffer).subarray(data.offset));
        return new StreamedDataReader(bytes.buffer);
    }
    static tags(cData) {
        const tags = new Map();
        const numberOfTags = cData.getInt8();
        for (let i = 0; i < numberOfTags; i++) {
            const name = cData.getString();
            const value = cData.getString();
            tags.set(name, value);
        }
        return tags;
    }
    static blocks(cData) {
        const length = cData.getInt8();
        const blocks = [];
        for (let i = 0; i < length; i++) {
            const block = Block.fromCode(cData.getString());
            blocks.push(block);
        }
        return blocks;
    }
    static mapConfig(block, value, position) {
        // by now, lets just throw the config info away
        if (block instanceof Sorter ||
            block instanceof InvertedSorter ||
            block instanceof Unloader ||
            block instanceof ItemSource) {
            return Item.fromCode(value);
        }
        if (block instanceof LiquidSource) {
            return Liquid.fromCode(value);
        }
        if (block instanceof MassDriver ||
            block instanceof ItemBridge ||
            block instanceof PhaseConveyor) {
            return Point2.unpack(value).sub(Point2.x(position), Point2.y(position));
        }
        if (block instanceof LightBlock)
            return value;
        return null;
    }
    static readConfigObject(cData) {
        const type = cData.getInt8();
        switch (type) {
            case 0:
                return null;
            case 1:
                return cData.getInt32();
            case 2:
                return cData.getBigInt64();
            case 3:
                return cData.getFloat32();
            case 4: {
                const exists = cData.getInt8();
                if (exists !== 0) {
                    return cData.getString();
                }
                return null;
            }
            case 5: {
                const value = cData.getInt8();
                const code = cData.getInt16();
                switch (value) {
                    case 0:
                        return Item.fromCode(code);
                    case 4:
                        return Liquid.fromCode(code);
                    default:
                        // consume the short to avoid errors
                        cData.getInt16();
                        return;
                }
            }
            // return Vars.content.getByID(
            //   (ContentType[
            //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //     ContentType[cData.getInt8()] as any
            //   ] as unknown) as ContentType,
            //   cData.getInt16()
            // )
            // original code:
            // return content.getByID(ContentType.all[read.b()], read.s());
            case 6: {
                const length = cData.getInt16();
                const arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push(cData.getInt32());
                }
                return arr;
            }
            // original code
            // short length = read.s(); IntSeq arr = new IntSeq(); for (int i = 0; i < length; i++) arr.add(read.i()); return arr;
            case 7:
                return new Point2(cData.getInt32(), cData.getInt32());
            case 8: {
                const len = cData.getInt8();
                const out = [];
                for (let i = 0; i < len; i++) {
                    out.push(Point2.unpack(cData.getInt32()));
                }
                // byte len = read.b(); Point2[] out = new Point2[len]; for (int i = 0; i < len; i++) out[i] = Point2.unpack(read.i());
                return out;
            }
            // TODO: somehow implement java code bellow
            case 9:
                //  by now just ignore the config data
                cData.getInt8();
                cData.getInt16();
                break;
            // return TechTree.getNotNull(content.getByID(ContentType.all[read.b()], read.s()));
            case 10:
                return cData.getBool();
            // return read.bool();
            case 11:
                return cData.getFloat64();
            // return read.d();
            case 12:
                cData.getInt32();
                return;
            // return world.build(read.i());
            case 13:
                cData.getInt16();
                return;
            // return LAccess.all[read.s()];
            case 14: {
                const blen = cData.getInt32();
                const bytes = [];
                for (let i = 0; i < blen; i++)
                    bytes.push(cData.getInt8());
                return bytes;
            }
            // int blen = read.i(); byte[] bytes = new byte[blen]; read.b(bytes); return bytes;
            case 15:
                return UnitCommand[cData.getInt8()];
            default:
                throw new Error('Unknown object type: ' + type);
            // throw new IllegalArgumentException('Unknown object type: ' + type)
        }
    }
    static tiles(cData, blocks, version) {
        const total = cData.getInt32();
        const tiles = [];
        for (let i = 0; i < total; i++) {
            const block = blocks[cData.getInt8()];
            const position = cData.getInt32();
            const config = version === 0
                ? this.mapConfig(block, cData.getInt32(), position)
                : this.readConfigObject(cData);
            const rotation = cData.getInt8();
            if (block instanceof AirBlock)
                continue;
            tiles.push(new SchematicTile(block, Point2.x(position), Point2.y(position), config, rotation));
        }
        return tiles;
    }
    static schematicSize(cData) {
        const width = cData.getInt16(), height = cData.getInt16();
        return { width, height };
    }
    /**
     * Parses the data and returns a schematic
     *  @param encoded The encoded schematic data
     */
    static decode(encoded) {
        const decoded = typeof encoded === 'string' ? base64ToBytes(encoded.trim()) : encoded;
        const arr = new Uint8Array(decoded);
        const data = new StreamedDataReader(arr.buffer);
        if (!this.isValid(data, true)) {
            throw new Error('Parsing error: this is not a valid schematic');
        }
        const version = data.getInt8();
        const cData = this.compressedData(data);
        const { width, height } = this.schematicSize(cData);
        const tags = this.tags(cData);
        const blocks = this.blocks(cData);
        const tiles = this.tiles(cData, blocks, version);
        const base64 = typeof encoded === 'string' ? encoded : bytesToBase64(encoded);
        return new Schematic({
            height,
            tags,
            tiles,
            width,
            base64,
            version: `v${version + 5}`,
        });
    }
    /** Takes a decoded schematic and saves its new tags
     * @param schematic A decoded schematic in wich the tags were modified
     */
    static encodeTags(schematic) {
        if (!schematic.base64)
            throw new Error('cannot save the tags of a non parsed schematic');
        const decoded = base64ToBytes(schematic.base64);
        const arr = new Uint8Array(decoded);
        const data = new StreamedDataReader(arr.buffer);
        // read header
        this.isValid(data, true);
        // read version
        data.getInt8();
        const cData = this.compressedData(data);
        // read size
        this.schematicSize(cData);
        const tagsStart = cData.offset;
        // read old tags
        this.tags(cData);
        const tagsEnd = cData.offset;
        const newTags = schematic.tags;
        const writer = new StreamedDataWriter(new ArrayBuffer(1024));
        writer.setInt8(newTags.size);
        newTags.forEach((value, key) => {
            writer.setString(key);
            writer.setString(value !== null && value !== void 0 ? value : '');
        });
        const result = concatBytes(new Uint8Array(cData.buffer).subarray(0, tagsStart), new Uint8Array(writer.buffer).subarray(0, writer.offset), new Uint8Array(cData.buffer).subarray(tagsEnd));
        const bytes = Pako__default["default"].deflate(result);
        const resultWriter = new StreamedDataWriter(new ArrayBuffer(bytes.byteLength + 5));
        resultWriter.setChar('m');
        resultWriter.setChar('s');
        resultWriter.setChar('c');
        resultWriter.setChar('h');
        resultWriter.setInt8(schematic.version === 'v5' ? 0 : 1);
        const resultBuffer = new Uint8Array(resultWriter.buffer);
        resultBuffer.set(bytes, 5);
        return bytesToBase64(resultBuffer);
    }
}
SchematicIO.header = 'msch';
SchematicIO.version = 1;
function concatBytes(...arrays) {
    let totalLength = 0;
    for (const arr of arrays) {
        totalLength += arr.byteLength;
    }
    const result = new Uint8Array(totalLength);
    let currentOffset = 0;
    for (const arr of arrays) {
        result.set(arr, currentOffset);
        currentOffset += arr.length;
    }
    return result;
}
function base64ToBytes(source) {
    if (typeof window === 'undefined')
        return Buffer.from(source, 'base64');
    const binaryString = atob(source);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
function bytesToBase64(source) {
    if ('write' in source)
        return source.toString('base64');
    if (typeof window === 'undefined')
        return Buffer.from(source).toString('base64');
    let result = '';
    for (let i = 0; i < source.length; i++) {
        result += String.fromCharCode(source[i]);
    }
    return btoa(result);
}

const { power: { PowerGenerator }, } = Blocks;
/**
 * A simple representation for a mindustry schematic
 */
class Schematic {
    constructor(properties) {
        // this prevents the user for assignin any property through the constructor
        let version;
        ({
            tiles: this.tiles,
            height: this.height,
            tags: this.tags,
            width: this.width,
            base64: this.base64,
            version = 'v6',
        } = properties);
        this.version = version;
        if (!this.description) {
            this.description = '';
        }
        this.labels = this.tags.has('labels')
            ? JSON.parse(this.tags.get('labels'))
            : [];
    }
    static decode(data) {
        return SchematicIO.decode(data);
    }
    static encode(schematic) {
        return schematic.encode();
    }
    /**
     * The name of this schematic
     *
     * Shorhand for `tags.get('name')`
     */
    get name() {
        return this.tags.get('name');
    }
    set name(value) {
        this.tags.set('name', value);
    }
    /**
     * The description of this schematic
     *
     * Shorhand for `tags.get('name')`
     */
    get description() {
        var _a;
        return (_a = this.tags.get('description')) !== null && _a !== void 0 ? _a : '';
    }
    set description(value) {
        this.tags.set('description', value);
    }
    /**
     * The amount of power this schematic can produce
     *
     * This is a separated measurement that does not interfere with `powerConsumption`
     *
     * This measurement may vary if there is an `OverdriveProjector` or an `OverdriveDome` contained in this schematic
     */
    get powerProduction() {
        let result = 0;
        for (const tile of this.tiles) {
            result +=
                tile.block instanceof PowerGenerator
                    ? tile.block.powerGeneration * ticksPerSecond
                    : 0;
        }
        return result;
    }
    /**
     * The amount of power this schematic consumes to work properly
     *
     * This is a separated measurement that does not interfere with `powerConsumption`
     *
     * This measurement may vary if there is an `OverdriveProjector` or an `OverdriveDome` contained in this schematic
     */
    get powerConsumption() {
        let result = 0;
        for (const tile of this.tiles) {
            result += tile.block.powerConsumption * ticksPerSecond;
        }
        return result;
    }
    /**
     * The overall power balance of this schematic
     */
    get powerBalance() {
        return this.powerProduction - this.powerConsumption;
    }
    /**
     * The items needed to build this schematic
     */
    get requirements() {
        var _a;
        const requirements = {};
        for (const tile of this.tiles) {
            const { block } = tile;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const req = block.requirements;
            for (const key in req) {
                // console.log(block.name, req)
                const item = key;
                const cost = req[item];
                const currentCost = (_a = requirements[item]) !== null && _a !== void 0 ? _a : 0;
                requirements[item] = currentCost + cost;
            }
        }
        return requirements;
    }
    /**
     * Converts this schematic to a base 64 string
     */
    encode() {
        if (!this.base64)
            throw new Error('by now, the schematic needs to be generated from a SchematicDecoder');
        return SchematicIO.encodeTags(this);
    }
    /**
     * Creates an image that represents this schematic's preview
     *
     * @deprecated This function is deprecated, and will be removed on the next breaking release.
     * Please use {@link render} as it is more flexible and compatible with web browsers.
     */
    async toImageBuffer(options = {}) {
        const result = await this.render(options);
        return result.toBuffer();
    }
    async render(options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        var _j, _k;
        if (typeof window !== 'undefined' &&
            !((_a = options) === null || _a === void 0 ? void 0 : _a.assetsBaseUrl)) {
            throw new Error('The base url for assets must be specified when in web contexts');
        }
        // default options
        (_b = options.background) !== null && _b !== void 0 ? _b : (options.background = true);
        (_c = options.bridges) !== null && _c !== void 0 ? _c : (options.bridges = { opacity: 0.7, render: true });
        (_d = (_j = options.bridges).render) !== null && _d !== void 0 ? _d : (_j.render = true);
        (_e = options.conduits) !== null && _e !== void 0 ? _e : (options.conduits = { render: true });
        (_f = options.conveyors) !== null && _f !== void 0 ? _f : (options.conveyors = { render: true });
        (_g = options.phaseBridges) !== null && _g !== void 0 ? _g : (options.phaseBridges = { opacity: 1, render: true });
        (_h = (_k = options.phaseBridges).render) !== null && _h !== void 0 ? _h : (_k.render = true);
        const canvas = Canvas__default["default"].createCanvas(this.width * 32, this.height * 32);
        let size = Math.max(this.width, this.height) * 32;
        if (options.background)
            size += 64;
        if (options.size) {
            ({ size } = options);
        }
        else if (options.maxSize) {
            size = Math.min(options.maxSize, size);
        }
        const renderingInfo = new RenderingInfo(this, canvas, options);
        await renderingInfo.init();
        for (const tile of this.tiles) {
            await tile.block.draw(tile, renderingInfo);
        }
        await renderingInfo.renderingQueue.execute();
        const background = Canvas__default["default"].createCanvas(size, size);
        if (options.background) {
            await drawBackground(renderingInfo, background, size);
        }
        const bcontext = background.getContext('2d');
        const border = options.background ? 64 : 0;
        const scale = (size - border) / Math.max(canvas.height, canvas.width);
        const width = canvas.width * scale, height = canvas.height * scale;
        bcontext.drawImage(canvas, (size - width) / 2, (size - height) / 2, width, height);
        return background;
    }
}

exports.Blocks = Blocks;
exports.Items = Items;
exports.Liquids = Liquids;
exports.Schematic = Schematic;
exports.SchematicTile = SchematicTile;
exports.arc = index$1;
exports.mindustry = index;
//# sourceMappingURL=index.cjs.map
