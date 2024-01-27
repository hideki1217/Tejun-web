import { useRef, useState } from 'react'
import './App.css'
import { Items, Square, Circle, Text } from './domain/entities';
import { CircleView, SquareView, TextView } from './components/ViewItems';
import StartIcon from './components/StartIcon';
import PauseIcon from './components/PauseIcon';

function App() {
  const [items, setItems] = useState<Items[]>([])
  const [focusedIndex, setFocusedIndex] = useState<number>();
  const [isPicked, setIsPicked] = useState<boolean>(false);

  const textDialogRef = useRef<HTMLDialogElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const textSizeRef = useRef<HTMLInputElement>(null);
  const textDialogOpenHandler = () => {
    if (textInputRef.current != null) textInputRef.current.value = "";
    if (textSizeRef.current != null) textSizeRef.current.value = "";
    textDialogRef.current!.showModal()
  }
  const textDialogCloseHandler = () => {
    textDialogRef.current!.close()
  }

  const onItemFocused = (index: number) => (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();

    setFocusedIndex(index);
    setIsPicked(true);
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPicked) {
      if (focusedIndex == null) throw Error("TODO: unexpected state");

      const item = items[focusedIndex];
      item.left += e.movementX;
      item.top += e.movementY;
      setItems([...items]);
    }
  };
  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPicked) {
      if (focusedIndex == null) throw Error("TODO: unexpected state");

      const item = items[focusedIndex];
      item.left += e.movementX;
      item.top += e.movementY;
      setItems([...items]);

      setIsPicked(false);
    } else if (focusedIndex != null) {
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
      const item: Square = {
        kind: 'square',
        left: 10,
        top: uniform(10, 200),
        width: uniform(20, 100),
        height: uniform(20, 100),
        fill: `hsl(${uniform(360)}, 80%, 60%)`
      };
      return item;
    }
    if (itemName == "circle") {
      const item: Circle = {
        kind: 'circle',
        left: 10,
        top: uniform(10, 200),
        width: uniform(20, 100),
        height: uniform(20, 100),
        fill: `hsl(${uniform(360)}, 80%, 60%)`
      };
      return item;
    }
    if (itemName == "text") {
      const item: Text = {
        kind: 'text',
        content: textInputRef.current?.value ?? "sample test",
        fontSize: Number(textSizeRef.current!.value),

        left: 10,
        top: uniform(10, 200),
        width: uniform(20, 100),
        height: uniform(20, 100),
        fill: `hsl(${uniform(360)}, 80%, 60%)`
      };
      return item;
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
          switch (item.kind) {
            case 'square':
              return <SquareView key={index} {...item} isFocused={index == focusedIndex}
                onMouseDown={onItemFocused(index)}
                onDelete={() => {
                  setItems(items.filter((_e, i) => i !== index));
                  setFocusedIndex(undefined);
                }} />
            case 'circle':
              return <CircleView key={index} {...item} isFocused={index == focusedIndex}
                onMouseDown={onItemFocused(index)}
                onDelete={() => {
                  setItems(items.filter((_e, i) => i !== index));
                  setFocusedIndex(undefined);
                }} />
            case 'text':
              return <TextView key={index} {...item} isFocused={index == focusedIndex}
                onMouseDown={onItemFocused(index)}
                onDelete={() => {
                  setItems(items.filter((_e, i) => i !== index));
                  setFocusedIndex(undefined);
                }} />
          }
        })}
        <div className='tool-bar'>
          <div className='add-item square' onClick={() => onAddItem("square")}>◻︎</div>
          <div style={{ height: '5px' }} />
          <div className='add-item circle' onClick={() => onAddItem("circle")}>○</div>
          <div style={{ height: '5px' }} />
          <dialog ref={textDialogRef}>
            <p>ダイアログです。</p>
            <p><input type='text' ref={textInputRef} /></p>
            <p><input type='number' ref={textSizeRef} /></p>
            <p>
              <button onClick={() => {
                onAddItem("text");
                textDialogCloseHandler();
              }} type="button">
                作成
              </button>
              <button onClick={textDialogCloseHandler} type="button">
                キャンセル
              </button>
            </p>

          </dialog>
          <div className='add-item text' onClick={textDialogOpenHandler}>T</div>
          <div style={{ height: '5px' }} />
          <div className='add-item start' onClick={() => {
            const cockpit = document.querySelector(".cockpit");
            console.log(cockpit);
            cockpit?.classList.toggle("show");
          }}>
            <StartIcon size={20}/>
          </div>
        </div>
      </div>
      <div className="cockpit">
        <div className='tool-bar'>
          <div className='add-item pause' onClick={() => {
              const cockpit = document.querySelector(".cockpit");
              console.log(cockpit);
              cockpit?.classList.toggle("show");
            }} style={{margin: '2px', background: 'inherit'}}>
              <PauseIcon size={20}/>
          </div>
        </div>
        
      </div>
    </>
  )
}

export default App
