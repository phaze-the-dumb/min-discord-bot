import Canvas from 'canvas';
export interface OutlineOptions {
    image: Canvas.Image;
    fillStyle?: string | Canvas.CanvasGradient | Canvas.CanvasPattern;
    x?: number;
    y?: number;
    thickness?: number;
}
/**
 * Outlines an image using an offset array.
 *
 * This function modifies the canvas and returns it.
 *
 */
export declare function outlineImage({ image, fillStyle, thickness, }: OutlineOptions): Canvas.Canvas;
