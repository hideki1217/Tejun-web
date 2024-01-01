

export type Delta = {
    x: number;
    y: number;
}

export type Point = {
    left: number,
    top: number,
}

export type Region = Point & {
    width: number,
    height: number,
}

export const translate = <T extends Point>(target: T, delta: Delta): T => {
    const _target = { ...target };
    _target.left += delta.x;
    _target.top += delta.y;
    return _target;
};
