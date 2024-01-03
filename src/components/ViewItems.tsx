import DeleteIcon from './DeleteIcon';
import { Circle, Square } from '../domain/entities';
import './ViewItems.css'


type ViewBaseProps<T> = T & {
    isFocused?: boolean,
    onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void,
    onDelete?: () => void,
};
export const SquareView: React.FC<ViewBaseProps<Square>> = ({ width, height, left, top, fill, border, onMouseDown, onDelete, isFocused = false }) => {
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
                    border: isFocused ? `dashed ${focusedBorderWidth}px black` : undefined,
                }}
            >
                <div className="item square"
                    style={{
                        width: "100%",
                        height: "100%",
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
                    border: isFocused ? `dashed ${focusedBorderWidth}px black` : undefined,
                }}
            >
                <div className="item circle"
                    style={{
                        width: "100%",
                        height: "100%",
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
            </div>
        </>
    );
};