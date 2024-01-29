import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { Items, Square, Circle, Text } from './domain/entities';
import { CircleView, SquareView, TextView } from './components/ViewItems';
import StartIcon from './components/StartIcon';
import PauseIcon from './components/PauseIcon';
import GestureIcon from './components/GestureIcon';

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

  const [enableCockpit, setEnableCockpit] = useState(false);
  const [itemColorHsl, setItemColorHsl] = useState(0);
  const itemColor = `hsl(${itemColorHsl}, 80%, 60%)`
  const [disableKeyDown, setDisableKeyDown] = useState(false);
  const [enableGesture, setEnableGesture] = useState(false);
  const streamRef = useRef<MediaStream>();

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
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.code;
    if (key === 'ArrowUp') {
      setItemColorHsl((itemColorHsl) => (itemColorHsl + 90) % 360);
    }
    if (key === 'ArrowDown') {
      setItemColorHsl((itemColorHsl) => ((itemColorHsl - 90) + 360) % 360);
    }
    if (key === 'ArrowLeft') {
      setItemColorHsl((itemColorHsl) => ((itemColorHsl - 10) + 360) % 360);
    }
    if (key === 'ArrowRight') {
      setItemColorHsl((itemColorHsl) => (itemColorHsl + 10) % 360);
    }

    setDisableKeyDown(true);
    setTimeout(() => {
      setDisableKeyDown(false);
    }, 200);
  }, []);
  useEffect(() => {
    if (!disableKeyDown && enableCockpit) document.addEventListener("keydown", onKeyDown, true);
    else document.removeEventListener("keydown", onKeyDown, true);
  }, [onKeyDown, disableKeyDown, enableCockpit])

  const videoConstraints = useMemo(() => {
    return {
      width: 200,
      height: 150,
      facingMode: 'user',
      frameRate: 5
    }
  }, [])
  useEffect(() => {
    if (enableGesture) {
      if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        console.log("Let's get this party started");
      }

      navigator.mediaDevices.getUserMedia({ video: videoConstraints }).then((stream) => {
        streamRef.current = stream;

        const video = document.querySelector(".display-container video") as HTMLVideoElement;
        video.srcObject = stream;
        video.play();

        const canvas = document.querySelector(".display-container .raw-canvas") as HTMLCanvasElement;
        const canvasCtx = canvas.getContext('2d', {willReadFrequently: true})!;
        _canvasUpdate();

        function _canvasUpdate() {
          canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const rawFrame = canvasCtx.getImageData(0, 0, videoConstraints.width, videoConstraints.height);

          const width = videoConstraints.width;
          const height = videoConstraints.height;
          for (let i = 0; i < width * height; i++) {
            const r = rawFrame.data[i * 4 + 0];
            const g = rawFrame.data[i * 4 + 1];
            const b = rawFrame.data[i * 4 + 2];
            const mean = Math.floor((r + g + b) / 3);
            rawFrame.data[i * 4 + 0] = mean;
            rawFrame.data[i * 4 + 1] = mean;
            rawFrame.data[i * 4 + 2] = mean;
            rawFrame.data[i * 4 + 3] = 255;
          }
          canvasCtx.putImageData(rawFrame, 0, 0);

          requestAnimationFrame(_canvasUpdate);
        }
      }).catch(e => console.log(e));
    } else {
      if (streamRef.current) {
        // Close MediaStream
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = undefined;
      }
    }
  }, [enableGesture, videoConstraints])

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
            <p>テキストボックスを追加する</p>
            <p>
              <input type='text' ref={textInputRef} placeholder='テキストを入力' />
              <input type='number' ref={textSizeRef} style={{ width: '40px', marginLeft: '5px' }} placeholder='10' />
            </p>
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
            cockpit?.classList.toggle("show");
            setEnableCockpit(true);
          }}>
            <StartIcon size={20} />
          </div>
        </div>
      </div>
      <div className="cockpit">
        <div className='tool-bar'>
          <div className='add-item pause' onClick={() => {
            const cockpit = document.querySelector(".cockpit");
            cockpit?.classList.toggle("show");
            setEnableCockpit(false);
          }} style={{ margin: '2px', background: 'inherit' }}>
            <PauseIcon size={20} />
          </div>
          <div className='add-item gesture' onClick={() => {
            setEnableGesture((enableGesture) => !enableGesture);
          }} style={{ margin: '2px', background: 'inherit', }}>
            <GestureIcon size={23} fill={enableGesture ? '#7ef3b6' : undefined} filled={enableGesture} />
          </div>
        </div>
        <div className='slide-container'>
          {
            enableGesture ? (
              <div className="display-container">
                <video className='display raw-video' style={{display: 'none'}}></video>
                <canvas className='display raw-canvas' width={videoConstraints.width} height={videoConstraints.height}></canvas>
              </div>
            ) : null
          }
          <div className='slide-item' style={{ background: itemColor }}>
            {itemColor}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
