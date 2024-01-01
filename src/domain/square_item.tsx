import { Item, ToElementParams } from "./entities";

export class SquareItem implements Item {
    constructor(
    public left: number,
    public top: number,
    public width: number,
    public height: number,
    public color: string,
    ){}

    toElement = ({onMouseDown, key}: ToElementParams) => (

        <div
            key={key}
            className='square-item'
            style={{
                width: `${this.width}px`,
                height: `${this.height}px`,
                left: `${this.left}px`,
                top: `${this.top}px`,
                background: this.color
            }}
            onMouseDown={onMouseDown? (e) => onMouseDown(this, e) : undefined}>
        </div>
    );
    
}