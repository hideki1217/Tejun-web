import DeleteIcon from './DeleteIcon';
import { Circle, Square, Text } from '../domain/entities';
import './ViewItems.css'
import { Region } from '../domain/math';

type FrameProps = Region & {
    isFocused?: boolean,
    onDelete?: () => void,
};

const Frame: React.FC<FrameProps & {children: React.ReactNode}> = ({ children, width, height, left, top, isFocused, onDelete }) => {
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
                <div className='item-box' style={{ padding: `${isFocused ? 1 : 0}px` }}>
                    {children}
                </div>

                {isFocused ?
                    <div className="delete-button" onMouseUp={onMouseUpOnDelete}>
                        <DeleteIcon size={12} fill="#fff" />
                    </div> : null}
                {isFocused ? <div className="item-border" /> : null}
            </div>
        </>
    )
};


type ViewBaseProps<T extends Region> = T & FrameProps & {
    onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void,
};
export const SquareView: React.FC<ViewBaseProps<Square>> = ({ width, height, left, top, fill, border, onMouseDown, onDelete, isFocused = false }) => {
    return (
        <Frame width={width} height={height} left={left} top={top} onDelete={onDelete} isFocused={isFocused}>
            <div className="item square"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    background: fill ?? undefined,
                    border: border ?? undefined
                }}
                onMouseDown={onMouseDown}
            />
        </Frame>
    );
};

export const CircleView: React.FC<ViewBaseProps<Circle>> = ({ width, height, left, top, fill, border, onMouseDown, onDelete, isFocused = false }) => {
    return (
        <Frame width={width} height={height} left={left} top={top} onDelete={onDelete} isFocused={isFocused}>
            <div className="item circle"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    borderRadius: '999px',
                    background: fill ?? undefined,
                    border: border ?? undefined
                }}
                onMouseDown={onMouseDown}
            />
        </Frame>
    );
};

export const TextView: React.FC<ViewBaseProps<Text>> = ({ content, fontSize=12, fontColor='black', width, height, left, top, fill, border, onMouseDown, onDelete, isFocused = false }) => {
    return (
        <Frame width={width} height={height} left={left} top={top} onDelete={onDelete} isFocused={isFocused}>
            <div className="item text"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    background: fill ?? undefined,
                    border: border ?? undefined
                }}
                onMouseDown={onMouseDown}
            ><span style={{fontSize: fontSize, color: fontColor}}>{content}</span></div>
        </Frame>
    );
};