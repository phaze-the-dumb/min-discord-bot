import { Block } from './block';
export declare class AirBlock extends Block {
    name: string;
    requirements: {};
    size: number;
    draw(): Promise<void>;
}
