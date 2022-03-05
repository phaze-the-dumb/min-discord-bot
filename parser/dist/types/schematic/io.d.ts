import { Schematic } from './schematic';
export declare abstract class SchematicIO {
    static readonly header = "msch";
    static readonly version = 1;
    private static isValid;
    private static compressedData;
    private static tags;
    private static blocks;
    private static mapConfig;
    private static readConfigObject;
    private static tiles;
    private static schematicSize;
    /**
     * Parses the data and returns a schematic
     *  @param encoded The encoded schematic data
     */
    static decode(encoded: string | Uint8Array): Schematic;
    /** Takes a decoded schematic and saves its new tags
     * @param schematic A decoded schematic in wich the tags were modified
     */
    static encodeTags(schematic: Schematic): string;
}
