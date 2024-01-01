import { useState } from 'react'
import './App.css'

type Delta = {
  x: number;
  y: number;
}

type Point = {
  left: number,
  top: number,
}

type Region = Point & {
  width: number,
  height: number,
}

const translate = <T extends Point>(target: T, delta: Delta): T => {
  const _target = { ...target };
  _target.left += delta.x;
  _target.top += delta.y;
  return _target;
};


function App() {
  const [region, setRegion] = useState<Region>({ left: 10, top: 10, width: 30, height: 30 });
  const [isFocused, setIsFocused] = useState(false);

  const onItemFocused = () => () => {
    if (!isFocused) {
      setIsFocused(true);
    }
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFocused) {
      setRegion(translate(region, { x: e.movementX, y: e.movementY }))
    }
  };
  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFocused) {
      setRegion(translate(region, { x: e.movementX, y: e.movementY }))
      setIsFocused(false);
    }
  };

  const item = (
    <div
      className='square-item'
      style={{ width: `${region.width}px`, height: `${region.height}px`, left: `${region.left}px`, top: `${region.top}px` }}
      onMouseDown={onItemFocused()}>
    </div>
  );

  return (
    <>
      <div className="window" onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
        {item}
      </div>
    </>
  )
}

export default App
