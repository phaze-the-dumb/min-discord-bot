/** An abstract top class representing in game content
 *
 * This class should not be instantiated
 */
export declare abstract class Content {
}
/** An abstract top class representing idetifiable in game content
 *
 * This class should not be instantiated
 */
export declare abstract class MappableContent extends Content {
    abstract name: string;
    toString(): string;
}
/** An abstract top class representing unlockable in game content
 *
 * This class should not be instantiated
 */
export declare abstract class UnlockableContent extends MappableContent {
}
