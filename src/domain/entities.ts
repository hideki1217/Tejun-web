import { Region } from "./math";

type Fillable = {
    fill?: string
}

type Bounded = {
    border?: string
}

export type Square = Region & Fillable & Bounded & {
    kind: 'square';
}

export type Circle = Region & Fillable & Bounded & {
    kind: 'circle';
}

export type Text = Region & Fillable & Bounded & {
    kind: 'text',

    content: string,
    fontSize?: number,
    fontColor?: string,
}

export type Items = Square | Circle | Text;