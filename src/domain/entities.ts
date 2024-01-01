import { Region } from "./math";

export type ToElementParams = {
    key: string,
    onMouseDown?: (self: Item, e: React.MouseEvent<HTMLDivElement>) => void
}

export type Item = Region & {
    toElement: (props: ToElementParams) => React.ReactNode;
}