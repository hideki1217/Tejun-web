import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
  const _target = {...target};
  _target.left += delta.x;
  _target.top += delta.y;
  console.log(_target);
  return _target;
};

const calcDelta = (start: Point, end: Point): Delta => {
  return {x: end.left - start.left, y: end.top - start.top};
};


function App() {
  const [count, setCount] = useState(0);
  const [region, setRegion] = useState<Region>({ left: 10, top: 10, width: 10, height: 10 });
  const startDragPoint = useRef<Point>({left: 0, top: 0});

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const x = e.screenX;
    const y = e.screenY;
    startDragPoint.current = {left: x, top: y};
  };
  const createOnDragEndHandler = () => (e: React.DragEvent<HTMLDivElement>) => {
    const x = e.screenX;
    const y = e.screenY;
    console.log(e);
    setRegion(translate(region, calcDelta(startDragPoint.current, {left: x, top: y})));
  };

  const item = (
    <div 
      className='square-item' 
      style={{ width: `${region.width}px`, height: `${region.height}px`, left: `${region.left}px`, top: `${region.top}px` }} 
      draggable="true" 
      onDragStart={onDragStart}
      onDragEnd={createOnDragEndHandler()}>
    </div>
  );



  return (
    <>
      <div className="window">
        {item}
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => {
            setCount((count) => count + 1);

            const logo_list = document.querySelectorAll("a .logo");
            logo_list[count % logo_list.length].classList.remove("spin");
            logo_list[(count + 1) % logo_list.length].classList.add("spin");
          }}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </>
  )
}

export default App
