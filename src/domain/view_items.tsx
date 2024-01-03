import { Item, ToElementParams } from "./entities";

export class Square implements Item {
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
            className='item square'
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

export class Circle implements Item {
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
            className='item circle'
            style={{
                width: `${this.width}px`,
                height: `${this.height}px`,
                left: `${this.left}px`,
                top: `${this.top}px`,
                borderRadius: `${this.width}px`,
                background: this.color
            }}
            onMouseDown={onMouseDown? (e) => onMouseDown(this, e) : undefined}>
        </div>
    );
}