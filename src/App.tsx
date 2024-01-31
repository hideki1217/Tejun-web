import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { Items, Square, Circle, Text } from './domain/entities';
import { CircleView, SquareView, TextView } from './components/ViewItems';
import StartIcon from './components/StartIcon';
import PauseIcon from './components/PauseIcon';
import GestureIcon from './components/GestureIcon'
// import * as faceapi from '@vladmandic/face-api';
import * as handTrack from 'handtrackjs';

type Prediction = { bbox: Array<number>, label: string, score: string, class: number };
type Point = { x: number, y: number, t: number }

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
  const prevItemColorHslRef = useRef<number>(0);
  const getColor = (hsl: number) => `hsl(${hsl}, 80%, 60%)`;
  const [disableKeyDown, setDisableKeyDown] = useState(false);
  const [enableGesture, setEnableGesture] = useState(false);
  const streamRef = useRef<MediaStream>();
  const canvasDrawCallBackIdRef = useRef<number>();
  const modelRef = useRef<handTrack.ObjectDetection>();
  const handDetectingRef = useRef<boolean>(false);
  const handCenterRef = useRef<Point | undefined>(undefined);
  const handOrbitRef = useRef<Array<Point>>([]);

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

  const controlItem = useCallback((direction: "up" | "down" | "left" | "right") => {
    const [bottom, top] = document.querySelectorAll(".slide-item");

    if (direction === 'up') {
      setItemColorHsl((itemColorHsl) => {
        const next = ((itemColorHsl + 90) + 360) % 360;
        prevItemColorHslRef.current = itemColorHsl;
        return next;
      });

      bottom.classList.remove(bottom.classList.item(1)!);
      top.classList.remove(top.classList.item(1)!);
      requestAnimationFrame(() => {
        top.classList.add("slideinTop");
        bottom.classList.add("slideoutBottom");
      });
    }
    if (direction === 'down') {
      setItemColorHsl((itemColorHsl) => {
        const next = ((itemColorHsl - 90) + 360) % 360;
        prevItemColorHslRef.current = itemColorHsl;
        return next;
      });

      bottom.classList.remove(bottom.classList.item(1)!);
      top.classList.remove(top.classList.item(1)!);
      requestAnimationFrame(() => {
        top.classList.add("slideinBottom");
        bottom.classList.add("slideoutTop");
      });
    }
    if (direction === 'left') {
      setItemColorHsl((itemColorHsl) => {
        const next = ((itemColorHsl - 20) + 360) % 360;
        prevItemColorHslRef.current = itemColorHsl;
        return next;
      });

      bottom.classList.remove(bottom.classList.item(1)!);
      top.classList.remove(top.classList.item(1)!);
      requestAnimationFrame(() => {
        top.classList.add("slideinRight");
        bottom.classList.add("slideoutLeft");
      });
    }
    if (direction === 'right') {
      setItemColorHsl((itemColorHsl) => {
        const next = ((itemColorHsl + 20) + 360) % 360;
        prevItemColorHslRef.current = itemColorHsl;
        return next;
      });

      bottom.classList.remove(bottom.classList.item(1)!);
      top.classList.remove(top.classList.item(1)!);
      requestAnimationFrame(() => {
        top.classList.add("slideinLeft");
        bottom.classList.add("slideoutRight");
      });
    }
  }, []);
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
      controlItem('up');
    }
    if (key === 'ArrowDown') {
      controlItem('down');
    }
    if (key === 'ArrowLeft') {
      controlItem('left');
    }
    if (key === 'ArrowRight') {
      controlItem('right');
    }

    setDisableKeyDown(true);
    setTimeout(() => {
      setDisableKeyDown(false);
    }, 1000);
  }, [controlItem]);
  useEffect(() => {
    if (!disableKeyDown && enableCockpit) document.addEventListener("keydown", onKeyDown, true);
    else document.removeEventListener("keydown", onKeyDown, true);
  }, [onKeyDown, disableKeyDown, enableCockpit])

  const videoConstraints = useMemo(() => {
    return {
      width: 200,
      height: 150,
      facingMode: 'user',
      frameRate: 10
    }
  }, [])
  useEffect(() => {
    if (enableGesture) {
      if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) {
        alert("not supported use getUserMedia");
      }

      navigator.mediaDevices.getUserMedia({ video: videoConstraints }).then((stream) => {
        streamRef.current = stream;

        const video = document.querySelector(".display-container video") as HTMLVideoElement;
        video.srcObject = stream;
        video.play();

        const base = document.querySelector(".display-container .base") as HTMLCanvasElement;
        const baseCtx = base.getContext('2d', { willReadFrequently: true })!;

        const overlay = document.querySelector(".display-container .overlay") as HTMLCanvasElement;
        const overlayCtx = overlay.getContext('2d')!;
        _canvasUpdate();

        function _canvasUpdate() {
          baseCtx.drawImage(video, 0, 0, base.width, base.height);

          if (modelRef.current) {
            if (!handDetectingRef.current) {
              handDetectingRef.current = true;
              modelRef.current.detect(base).then((predictions: Prediction[]) => {
                overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

                const isFaceDetected = (predictions.filter((prediction) => prediction.label == "face").length > 0);
                const isOpenHandDetected = (predictions.filter((prediction) => prediction.label == "open").length > 0);
                if (isFaceDetected && isOpenHandDetected) {
                  predictions = predictions.filter((prediction) => prediction.label == "open");
                  const prediction = predictions[0];

                  const bbox = prediction.bbox;
                  overlayCtx.strokeRect(bbox[0], bbox[1], bbox[2], bbox[3]);

                  const centerX = bbox[0] + bbox[2] / 2;
                  const centerY = bbox[1] + bbox[3] / 2;
                  overlayCtx.beginPath();
                  overlayCtx.arc(centerX, centerY, 4, 0, Math.PI * 2);
                  overlayCtx.fillStyle = "red";
                  overlayCtx.fill();
                  
                  const current = handCenterRef.current = { x: centerX, y: centerY, t: Date.now() };
                  handOrbitRef.current.push(handCenterRef.current);
                  if (handOrbitRef.current.length > 10) {
                    const origin = handOrbitRef.current.shift()!;
                    const dtS = (current.t - origin.t) / 1000;
                    if (dtS < 1) {
                      const velocity = {
                        x: (current.x - origin.x) / dtS,
                        y: (current.y - origin.y) / dtS,
                        t: (current.t + origin.t) / 2
                      };
                      console.log(velocity);
                      if (velocity.x < -50) {
                        controlItem('left');
                        handOrbitRef.current = [];
                      } else if (50 < velocity.x) {
                        controlItem('right');
                        handOrbitRef.current = [];
                      } else if (velocity.y < -50) {
                        controlItem('up');
                        handOrbitRef.current = [];
                      } else if (50 < velocity.y) {
                        controlItem('down');
                        handOrbitRef.current = [];
                      }
                    }
                  }
                } else {
                  handCenterRef.current = undefined;
                }

                handDetectingRef.current = false;
              });
            }
          } else {
            handTrack.load({ maxNumBoxes: 3 }).then((model: handTrack.ObjectDetection) => {
              modelRef.current = model;
            })
          }
          canvasDrawCallBackIdRef.current = requestAnimationFrame(_canvasUpdate);
        }
      }).catch(e => console.log(e));
    } else {
      if (streamRef.current) {
        // Close MediaStream
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = undefined;
      }
      if (canvasDrawCallBackIdRef.current != undefined) {
        cancelAnimationFrame(canvasDrawCallBackIdRef.current);
        canvasDrawCallBackIdRef.current = undefined;
      }
    }
  }, [controlItem, enableGesture, videoConstraints])

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
                <video className='raw-video' style={{ display: 'none' }}></video>
                <div className='display' style={{ width: videoConstraints.width, height: videoConstraints.height }}>
                  <div className='canvas-wrap'>
                    <canvas className='base' width={videoConstraints.width} height={videoConstraints.height}></canvas>
                    <canvas className='overlay' width={videoConstraints.width} height={videoConstraints.height}></canvas>
                  </div>
                </div>
              </div>
            ) : null
          }
          <div className='slide-item tmp' style={{ background: getColor(prevItemColorHslRef.current) }}>
          </div>
          <div className='slide-item tmp' style={{ background: getColor(itemColorHsl) }}>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
