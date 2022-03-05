/**
 * Similar to a DataView, but it has an auto incrementing offset.
 * A mix of `DataView` and the `DataInputStream` java class
 */
export declare class StreamedDataReader {
    readonly buffer: ArrayBuffer;
    /**
     * The `DataView` wrapped by this `StreamedDataView`.
     *
     * This is meant to be exposed as a readonly property, writes to the buffer may cause undefined behaviour
     */
    readonly data: DataView;
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
     * Reads the next 4 bytes as a 32-bit float value. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getFloat32(littleEndian?: boolean): number;
    /**
     * Reads the next 8 bytes as a 64-bit float value. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getFloat64(littleEndian?: boolean): number;
    /**
     * Reads the next byte as a 8-bit int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getInt8(): number;
    /**
     * Reads the next 2 bytes as a 16-bit int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getInt16(littleEndian?: boolean): number;
    /**
     * Reads the next 4 bytes as a 32-bit int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getInt32(littleEndian?: boolean): number;
    /**
     * Reads the next byte as a 8-bit unsigned int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getUint8(): number;
    /**
     * Reads the next 2 bytes as a 16-bit unsigned int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getUint16(littleEndian?: boolean): number;
    /**
     * Reads the next 4 bytes as a 32-bit unsigned int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getUint32(littleEndian?: boolean): number;
    /**
     * Reads the next 8 bytes as a 64-bit int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getBigInt64(littleEndian?: boolean): bigint;
    /**
     * Reads the next 8 bytes as a 64-bit unsigned int. There is
     * no alignment constraint; multi-byte values may be fetched from any offset.
     */
    getBigUint64(littleEndian?: boolean): bigint;
    /**
     * Returns a unicode character with the code from the next byte
     */
    getChar(): string;
    /**
     * Reads a string that has been encoded using a
     * modified UTF-8
     * format.
     */
    getString(): string;
    /**
     * Reads the next byte as a boolean
     */
    getBool(): boolean;
}
