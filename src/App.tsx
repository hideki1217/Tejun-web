import { useState } from 'react'
import './App.css'
import { Item } from './domain/entities';
import { Square, Circle } from './domain/view_items';


function App() {
  const [items, setItems] = useState<Item[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number>();

  const onItemFocused = (index: number) => () => {
    if (focusedIndex == undefined) {
      setFocusedIndex(index);
    }
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (focusedIndex != null) {
      const item = items[focusedIndex];
      item.left += e.movementX;
      item.top += e.movementY;
      setItems([...items]);
    }
  };
  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (focusedIndex != null) {
      const item = items[focusedIndex];
      item.left += e.movementX;
      item.top += e.movementY;
      setItems([...items]);

      setFocusedIndex(undefined);
    }
  };

  const uniform = (low: number, high?: number) => {
    if (high == null) {
      high = low;
      low = 0;
    }
    return Math.floor(Math.random() * (high - low) + low);
  }
  const createRandomItem = (itemName: string) => {
    if (itemName == "square") {
      return new Square(10, uniform(10, 200), uniform(20, 100), uniform(20, 100), `rgb(${uniform(255)},${uniform(255)},${uniform(255)})`)
    }
    if (itemName == "circle") {
      return new Circle(10, uniform(10, 200), uniform(20, 100), uniform(20, 100), `rgb(${uniform(255)},${uniform(255)},${uniform(255)})`)
    }
  }
  const onAddItem = (itemName: string) => {
    const item = createRandomItem(itemName)!;
    setItems([...items, item]);
  }

  return (
    <>
      <div className="window" onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
        {items.map((item, index) => {
          return item.toElement({
            key: String(index),
            onMouseDown: onItemFocused(index)
          });
        })}
        <div className='tool-bar'>
          <div className='add-item square' onClick={() => onAddItem("square")}>◻︎</div>
          <div style={{height: '5px'}}/>
          <div className='add-item circle' onClick={() => onAddItem("circle")}>○</div>
        </div>
      </div>
    </>
  )
}

export default App
