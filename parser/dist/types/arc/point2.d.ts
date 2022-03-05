/**
 * A point in a 2D grid, with integer x and y coordinates
 * @author badlogic
 *
 * Copied from `Anuken/Arc`
 */
export declare class Point2 {
    x: number;
    y: number;
    /**
     * Constructs a new 2D grid point.
     * @param x X coordinate
     * @param y Y coordinate
     */
    constructor(x: number, y: number);
    /** @return a point unpacked from an integer. */
    static unpack(pos: number): Point2;
    /** @return this point packed into a single int by casting its components to shorts. */
    static pack(x: number, y: number): number;
    /** @return the x component of a packed position. */
    static x(pos: number): number;
    /** @return the y component of a packed position. */
    static y(pos: number): number;
    /** @return this point packed into a single int by casting its components to shorts. */
    pack(): number;
    /**
     * Sets the coordinates of this 2D grid point.
     * @param x X coordinate
     * @param y Y coordinate
     * @return this 2D grid point for chaining.
     */
    set(x: number, y: number): Point2;
    /**
     * Sets the coordinates of this 2D grid point to that of another.
     * @param point The 2D grid point to copy the coordinates of.
     * @return this 2D grid point for chaining.
     */
    set(point: Point2): Point2;
    /**
     * @param other The other point
     * @return the squared distance between this point and the other point.
     */
    dst2(other: Point2): number;
    /**
     * @param x The x-coordinate of the other point
     * @param y The y-coordinate of the other point
     * @return the squared distance between this point and the other point.
     */
    dst2(x: number, y: number): number;
    /**
     * @param other The other point
     * @return the distance between this point and the other vector.
     */
    dst(other: Point2): number;
    /**
     * @param x The x-coordinate of the other point
     * @param y The y-coordinate of the other point
     * @return the distance between this point and the other point.
     */
    dst(x: number, y: number): number;
    /**
     * Adds another 2D grid point to this point.
     * @param other The other point
     * @return this 2d grid point for chaining.
     */
    add(other: Point2): Point2;
    /**
     * Adds another 2D grid point to this point.
     * @param x The x-coordinate of the other point
     * @param y The y-coordinate of the other point
     * @return this 2d grid point for chaining.
     */
    add(x: number, y: number): Point2;
    /**
     * Subtracts another 2D grid point from this point.
     * @param other The other point
     * @return this 2d grid point for chaining.
     */
    sub(other: Point2): Point2;
    /**
     * Subtracts another 2D grid point from this point.
     * @param x The x-coordinate of the other point
     * @param y The y-coordinate of the other point
     * @return this 2d grid point for chaining.
     */
    sub(x: number, y: number): Point2;
    /**
     * @return a copy of this grid point
     */
    cpy(): Point2;
    /** Rotates this point in 90-degree increments several times. */
    rotate(steps: number): Point2;
    static equals(x: number, y: number, ox: number, oy: number): boolean;
    equals(other: Point2): boolean;
    equals(x: number, y: number): boolean;
    hashCode(): number;
    toString(): string;
}
