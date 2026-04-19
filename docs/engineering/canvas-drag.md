# 使用 Canvas 在图片上绘制和拖拽方框

> **Canvas 画布的特点：**
> - 画了就画了，不会自动更新
> - 如果要改变显示（平移、缩放……），必须重新画一遍

- 获取canvas上下文，加载图片；绘画——使用上下文画框
- 当鼠标按下，移动，松开时，更新对应框的坐标和宽高，框变化触发重绘：
```jsx


+---------------------------------------------------------------+
|  1. 鼠标按下- 获取鼠标坐标 (x, y)                                     |
+---------------------------------------------------------------+
                                |- 【判断】：坐标是否在已有的方框内？(碰撞检测) 
                +---------------+---------------+
           [是：点中了]                     [否：没点中]
+---------------------------+   +-----------------------------------+
| 分支 A: 准备拖拽          |   | 分支 B: 准备绘制                  |
| 1. 记录 ID：当前方框      |    | 1. 创建临时方框：                 |
| 2. 计算偏移量：           |   |    - x = 鼠标 x (起点)            |
|    (鼠标 - 方框左上角)    |   |    - y = 鼠标 y (起点)            |
|                           |   |    - w = 0, h = 0                 |
+---------------------------+   +-----------------------------------+
                |                               |
+---------------------------------------------------------------+
|  2. 鼠标移动 - 获取最新鼠标坐标 (newX, newY)                           |
+---------------------------------------------------------------+
                                |
                +---------------+---------------+
         [处于拖拽模式]                   [处于绘制模式]
+---------------------------+   +-----------------------------------+
| 动作：更新位置            |   | 动作：更新尺寸                    |
| 新 x = 鼠标 x - 偏移量 x  |   | 新宽 = 鼠标 x - 起点 x            |
| 新 y = 鼠标 y - 偏移量 y  |   | 新高 = 鼠标 y - 起点 y            |
+---------------------------+   +-----------------------------------+
                |                               |
+---------------------------------------------------------------+
|  3. 鼠标松开（保存结果）                                       |
+---------------------------------------------------------------+
                                |
                      [ 触发重绘 (Draw) ]
```

## 1. Canvas 基础用法

```tsx
const draw = () => {
  const canvas = canvasRef.current;
  // 1. 获取 Canvas 上下文
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || !imageLoaded) return;

  // 2. 加载图片
  canvas.width = imgRef.current.naturalWidth;
  canvas.height = imgRef.current.naturalHeight;

  // 3. 绘制图片
  ctx.drawImage(imgRef.current, 0, 0);
  
  // 4. 利用 Canvas 上下文画框
  ctx.strokeRect();
  
  // 5. 离屏 Canvas 可以生成 Base64 图片
  const dataUrl = canvas.toDataURL();  
};
```

## 2. 画框 Hook

使用 `CurrentBox` 存储框的起点坐标和宽高。

```tsx
import { useState } from 'react';

export const useBoxDrawing = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState(null);

  // 开始画：创建一个起点，宽高暂时为 0
  const startDrawing = (x, y) => {
    setIsDrawing(true);
    setCurrentBox({ id: Date.now(), x, y, width: 0, height: 0 });
  };

  // 正在画：更新宽高
  const updateDrawing = (x, y) => {
    if (!isDrawing || !currentBox) return;
    
    setCurrentBox({
      ...currentBox,
      width: x - currentBox.x,
      height: y - currentBox.y
    });
  };

  // 结束画
  const stopDrawing = () => {
    setIsDrawing(false);
    const finishedBox = currentBox;
    setCurrentBox(null);
    return finishedBox;
  };

  return {
    isDrawing,
    currentBox,
    startDrawing,
    updateDrawing,
    stopDrawing
  };
};
```

## 3. 拖拽 Hook

更新当前拖拽框的坐标。

```tsx
import { useState } from 'react';

export const useBoxDragging = (boxes, setBoxes) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeBoxId, setActiveBoxId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 尝试开始拖拽：检测有没有点中框
  const startDragging = (x, y) => {
    const clickedBox = [...boxes].reverse().find(box => 
      x >= box.x && x <= box.x + box.width &&
      y >= box.y && y <= box.y + box.height);

    if (clickedBox) {
      setIsDragging(true);
      setActiveBoxId(clickedBox.id);
      // 记录鼠标距离框左上角的距离
      setDragOffset({ x: x - clickedBox.x, y: y - clickedBox.y });
      return true;
    }
    return false;
  };

  // 正在拖拽：更新框的位置
  const updateDragging = (x, y) => {
    if (!isDragging || !activeBoxId) return;

    setBoxes(prevBoxes => prevBoxes.map(box => {
      if (box.id === activeBoxId) {
        return { ...box, x: x - dragOffset.x, y: y - dragOffset.y };
      }
      return box;
    }));
  };

  // 结束拖拽
  const stopDragging = () => {
    setIsDragging(false);
    setActiveBoxId(null);
  };

  return {
    isDragging,
    activeBoxId,
    startDragging,
    updateDragging,
    stopDragging
  };
};
```

## 4. 相对位置转换

把「鼠标在屏幕上的位置」转成「鼠标在图片里的真实位置」。

```tsx
const getMousePos = (e) => {
  const canvas = canvasRef.current;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
};
```

## 5. 完整示例

整合画框 Hook 和拖拽 Hook 的主组件。

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { useBoxDrawing } from './useBoxDrawing';
import { useBoxDragging } from './useBoxDragging';

const ImageBoxAnnotator = () => {
  const [boxes, setBoxes] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { 
    currentBox, startDrawing, updateDrawing, stopDrawing 
  } = useBoxDrawing();

  const { 
    activeBoxId, startDragging, updateDragging, stopDragging 
  } = useBoxDragging(boxes, setBoxes);

  // 图片加载
  const canvasRef = useRef(null);
  const imgRef = useRef(new Image());
  const imageUrl = ''; 

  useEffect(() => {
    const img = imgRef.current;
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageLoaded) return;

    canvas.width = imgRef.current.naturalWidth;
    canvas.height = imgRef.current.naturalHeight;
    ctx.drawImage(imgRef.current, 0, 0);

    // 画图片里的框
    boxes.forEach(box => drawSingleBox(ctx, box, box.id === activeBoxId));
    // 画正在画的框
    if (currentBox) drawSingleBox(ctx, currentBox, false);
  };

  // 绘制单个框
  const drawSingleBox = (ctx, box, isSelected) => {
    ctx.strokeStyle = isSelected ? 'red' : 'lime';
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    ctx.fillStyle = isSelected ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.1)';
    ctx.fillRect(box.x, box.y, box.width, box.height);
  };

  // 框有变化就需要重新画
  useEffect(() => { draw(); }, [boxes, currentBox, imageLoaded, activeBoxId]);

  // 相对坐标转换
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  // 鼠标按下
  const handleMouseDown = (e) => {
    const { x, y } = getMousePos(e);
    const isClickingBox = startDragging(x, y);
  
    if (!isClickingBox) {
      startDrawing(x, y);
    }
  };

  // 鼠标移动
  const handleMouseMove = (e) => {
    const { x, y } = getMousePos(e);
    updateDragging(x, y); // 拖拽模式
    updateDrawing(x, y); // 绘画模式
  };
  
  // 鼠标松开
  const handleMouseUp = () => {
    stopDragging();
    const newBox = stopDrawing();
    if (newBox && newBox.width > 5 && newBox.height > 5) {
      setBoxes(prev => [...prev, normalizeBox(newBox)]);
    }
  };

  // 处理从右下往左上画（负宽高）的情况
  const normalizeBox = (box) => {
    let { x, y, width, height } = box;
    if (width < 0) { x += width; width = Math.abs(width); }
    if (height < 0) { y += height; height = Math.abs(height); }
    return { ...box, x, y, width, height };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h2>组件化标注工具</h2>
      <div style={{ border: '1px solid #ccc' }}>
        {!imageLoaded && <div>加载中...</div>}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ display: 'block', maxWidth: '100%', cursor: 'crosshair' }}
        />
      </div>
      <button onClick={() => setBoxes([])} style={{marginTop: 10}}>清空</button>
    </div>
  );
};

export default ImageBoxAnnotator;
