import { useState } from 'react'
import './App.css'
import { Item } from './domain/entities';
import { SquareItem } from './domain/square_item';


function App() {
  const [items, setItems] = useState<Item[]>([
    new SquareItem(10, 10, 30, 30, "rgb(255,0,0)"),
    new SquareItem(10, 45, 30, 30, "rgb(89, 0, 255)"),
    new SquareItem(10, 80, 30, 30, "rgb(0, 255, 76)"),
  ])
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
      return new SquareItem(10, uniform(10, 200), uniform(20, 100), uniform(20, 100), `rgb(${uniform(255)},${uniform(255)},${uniform(255)})`)
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
          <div className='add-square' onClick={() => onAddItem("square")}>+</div>
        </div>
      </div>
    </>
  )
}

export default App
