import Canvas from 'canvas';
import { RenderingInfo } from './rendering_info';
export declare function resolveAssets(info: RenderingInfo): Promise<(name: string) => Promise<Canvas.Image>>;
