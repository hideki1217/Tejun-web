import DeleteIcon from './DeleteIcon';
import { Circle, Square } from '../domain/entities';
import './ViewItems.css'


type ViewBaseProps<T> = T & {
    isFocused?: boolean,
    onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void,
    onDelete?: () => void,
};
export const SquareView: React.FC<ViewBaseProps<Square>> = ({ width, height, left, top, fill, border, onMouseDown, onDelete, isFocused = false }) => {
    const onMouseUpOnDelete = onDelete != null ? (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    } : undefined;

    return (
        <>
            <div
                className="item-container"
                style={{
                    width: `${width + (isFocused ? 2 : 0)}px`,
                    height: `${height + (isFocused ? 2 : 0)}px`,
                    left: `${left - (isFocused ? 1 : 0)}px`,
                    top: `${top - (isFocused ? 1 : 0)}px`,
                }}
            >
                <div className="item square"
                    style={{
                        margin: `${isFocused ? 1 : 0}px`,
                        width: `${width}px`,
                        height: `${height}px`,
                        background: fill ?? undefined,
                        border: border ?? undefined
                    }}
                    onMouseDown={onMouseDown}
                >
                </div>

                {isFocused ?
                    <div className="delete-button" onMouseUp={onMouseUpOnDelete}>
                        <DeleteIcon size={12} fill="#fff" />
                    </div> : null}
                {isFocused ? <div className="item-border" /> : null}
            </div>
        </>
    );
};

export const CircleView: React.FC<ViewBaseProps<Circle>> = ({ width, height, left, top, fill, border, onMouseDown, onDelete, isFocused = false }) => {
    const focusedBorderWidth = 1;
    const onMouseUpOnDelete = onDelete != null ? (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    } : undefined;

    return (
        <>
            <div
                className="item-container"
                style={{
                    width: `${width + (isFocused ? focusedBorderWidth * 2 : 0)}px`,
                    height: `${height + (isFocused ? focusedBorderWidth * 2 : 0)}px`,
                    left: `${left - (isFocused ? focusedBorderWidth : 0)}px`,
                    top: `${top - (isFocused ? focusedBorderWidth : 0)}px`,
                }}
            >
                <div className="item circle"
                    style={{
                        margin: `${isFocused ? 1 : 0}px`,
                        width: `${width}px`,
                        height: `${height}px`,
                        borderRadius: '999px',
                        background: fill ?? undefined,
                        border: border ?? undefined
                    }}
                    onMouseDown={onMouseDown}
                >
                </div>

                {isFocused ?
                    <div className="delete-button" onMouseUp={onMouseUpOnDelete}>
                        <DeleteIcon size={12} fill="#fff" />
                    </div> : null}
                {isFocused ?
                    <div className="item-border"
                        style={{ border: `dashed ${focusedBorderWidth}px black`, }} /> : null}
            </div>
        </>
    );
};