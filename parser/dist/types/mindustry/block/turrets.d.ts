import { RenderingInfo } from '../../util';
import { Block } from './block';
import { SchematicTile } from '../../schematic';
declare abstract class Turret extends Block {
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Duo extends Turret {
    name: string;
    requirements: {
        copper: number;
    };
    size: number;
}
export declare class Scatter extends Turret {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
}
export declare class Scorch extends Turret {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
    };
    size: number;
}
export declare class Hail extends Turret {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
    };
    size: number;
}
export declare class Wave extends Turret {
    name: string;
    requirements: {
        metaglass: number;
        lead: number;
    };
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Lancer extends Turret {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        silicon: number;
    };
    size: number;
}
export declare class Arc extends Turret {
    name: string;
    requirements: {
        copper: number;
        lead: number;
    };
    size: number;
}
export declare class Parallax extends Turret {
    name: string;
    requirements: {
        silicon: number;
        titanium: number;
        graphite: number;
    };
    size: number;
}
export declare class Swarmer extends Turret {
    name: string;
    requirements: {
        graphite: number;
        titanium: number;
        plastanium: number;
        silicon: number;
    };
    size: number;
}
export declare class Salvo extends Turret {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
        titanium: number;
    };
    size: number;
}
export declare class Segment extends Turret {
    name: string;
    requirements: {
        silicon: number;
        thorium: number;
        'phase-fabric': number;
    };
    size: number;
}
export declare class Tsunami extends Turret {
    name: string;
    requirements: {
        metaglass: number;
        lead: number;
        titanium: number;
        thorium: number;
    };
    size: number;
    draw(tile: SchematicTile, info: RenderingInfo): Promise<void>;
}
export declare class Fuse extends Turret {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
        thorium: number;
    };
    size: number;
}
export declare class Ripple extends Turret {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
        titanium: number;
    };
    size: number;
}
export declare class Cyclone extends Turret {
    name: string;
    requirements: {
        copper: number;
        titanium: number;
        plastanium: number;
    };
    size: number;
}
export declare class Foreshadow extends Turret {
    name: string;
    requirements: {
        copper: number;
        metaglass: number;
        'surge-alloy': number;
        plastanium: number;
        silicon: number;
    };
    size: number;
}
export declare class Spectre extends Turret {
    name: string;
    requirements: {
        copper: number;
        graphite: number;
        'surge-alloy': number;
        plastanium: number;
        thorium: number;
    };
    size: number;
}
export declare class Meltdown extends Turret {
    name: string;
    requirements: {
        copper: number;
        lead: number;
        graphite: number;
        'surge-alloy': number;
        silicon: number;
    };
    size: number;
}
export {};
