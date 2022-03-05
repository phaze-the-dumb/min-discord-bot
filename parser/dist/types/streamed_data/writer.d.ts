export declare class StreamedDataWriter {
    buffer: ArrayBuffer;
    /**
     * The `DataView` wrapped by this `StreamedDataView`.
     *
     * This is meant to be exposed as a readonly property, writes to the buffer may cause undefined behaviour
     */
    data: DataView;
    constructor(buffer: ArrayBuffer);
    /**
     * Internal byte offset of this `StreamedDataView`
     */
    private currentOffset;
    /**
     * The current byte offset of this `StreamedDataView`
     */
    get offset(): number;
    /**
     * Ensures that `min` bytes are avaliable for write
     */
    private ensure;
    /**
     * Writes a 32-bit float in the next 4 bytes. There is
     */
    setFloat32(value: number, littleEndian?: boolean): void;
    /**
     * Writes a 64-bit float in the next 8 bytes.
     */
    setFloat64(value: number, littleEndian?: boolean): void;
    /**
     * Writes a 8-bit int in the next byte.
     */
    setInt8(value: number): void;
    /**
     * Writes a 16-bit int in the next 2 bytes.
     */
    setInt16(value: number, littleEndian?: boolean): void;
    /**
     * Writes a 32-bit int in the next 2 bytes.
     */
    setInt32(value: number, littleEndian?: boolean): void;
    /**
     * Writes a 8-bit unsigned int in the next byte.
     */
    setUint8(value: number): void;
    /**
     * Writes a 16-bit unsigned int in the next 2 bytes.
     */
    setUint16(value: number, littleEndian?: boolean): void;
    /**
     * Writes a 32-bit unsigned int in the next 4 bytes.
     */
    setUint32(value: number, littleEndian?: boolean): void;
    /**
     * Writes a 64-bit bigint in the next 8 bytes.
     */
    setBigInt64(value: bigint, littleEndian?: boolean): void;
    /**
     * Writes a 64-bit bigint in the next 8 bytes.
     */
    setBigUint64(value: bigint, littleEndian?: boolean): void;
    /**
     * Returns a unicode character with the code from the next byte
     */
    setChar(value: string): void;
    /**
     * Reads a string that has been encoded using a
     * modified UTF-8
     * format.
     */
    setString(str: string): number;
    /**
     * Writes a boolean in the next byte
     */
    setBool(value: boolean): void;
}
