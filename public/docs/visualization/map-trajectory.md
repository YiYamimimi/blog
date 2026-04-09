# 地图轨迹可视化：百度地图 + MapVGL 彩虹轨迹

在环卫作业监控平台中，实时展示车辆、人员、无人机的运动轨迹是核心功能之一。本文将分享如何基于百度地图和 MapVGL 实现高性能、美观的轨迹可视化方案。

## 技术选型

### 为什么选择百度地图而不是高德？

| 特性 | 百度地图 | 高德地图 |
|------|---------|---------|
| 热力图 | ✅ 支持 | ✅ 支持 |
| 轨迹动画 | ✅ Lushu/Track | ✅ 支持 |
| 彩虹轨迹 | ✅ MapVGL | ❌ 需自实现 |
| Three.js 版本 | ✅ 官方支持 | ❌ 无 |
| React 版本 | ✅ 官方支持 | ✅ 社区版 |

**核心原因**：百度地图可以实现热力图和轨迹，同时还有 Three.js 版本和 React 版本。旧版的轨迹是用 Lushu 创建的，没有彩虹效果；要彩虹效果需引入 MapVGL。新版用 Track，可以设置彩虹效果。

## 基础数据结构

```typescript
interface TrackPoint {
  latitude: number
  longitude: number
  time: string
  type: 'drive' | 'job' | 'idle'
  gpsSpeed?: number
}
```

## 初始化地图

```typescript
function initMap() {
  const map = new BMapGL.Map('mapContainer')
  
  map.centerAndZoom(new BMapGL.Point(116.418, 39.918), 16)
  
  map.enableScrollWheelZoom(true)
  
  return map
}
```

> **注意**：`BMapGL` 是通过百度地图 JS API 脚本动态加载到 `window` 上的全局变量。

## 创建轨迹线

```typescript
function createTrack(map: BMapGL.Map, points: TrackPoint[]) {
  const polyline = new BMapGL.Polyline(
    points.map(p => new BMapGL.Point(p.longitude, p.latitude)),
    {
      strokeColor: '#6D97FF',
      strokeWeight: 4,
      strokeOpacity: 0.8
    }
  )
  
  map.addOverlay(polyline)
  
  map.setViewport(points.map(p => new BMapGL.Point(p.longitude, p.latitude)))
}
```

## 路书轨迹动画（Lushu）

### 创建路书实例

```typescript
function initLushu(map: BMapGL.Map, points: BMapGL.Point[], options?: {
  icon?: string
  speed?: number
}) {
  const icon = new BMapGL.Icon(
    options?.icon || 'car.png',
    new BMapGL.Size(40, 47),
    { anchor: new BMapGL.Size(20, 47) }
  )

  const lushu = new BMapGLLib.LuShu(map, points, {
    icon: icon,
    defaultContent: '',
    autoView: true,
    enableRotation: true,
    speed: options?.speed || 4000
  })

  return lushu
}
```

### 播放控制类

```typescript
class TrackPlayer {
  private map: BMapGL.Map
  private points: TrackPoint[]
  private lushu: any
  private currentIndex = 0
  private status: 'stop' | 'pause' | 'start' = 'stop'
  private speed = 1

  constructor(map: BMapGL.Map, points: TrackPoint[]) {
    this.map = map
    this.points = points
  }

  start() {
    if (this.status === 'stop') {
      const bPoints = this.points.map(p => new BMapGL.Point(p.longitude, p.latitude))
      this.lushu = initLushu(this.map, bPoints)
      this.lushu.start()
    } else if (this.status === 'pause') {
      this.lushu.start()
    }
    this.status = 'start'
  }

  pause() {
    this.lushu?.pause()
    this.status = 'pause'
  }

  stop() {
    this.lushu?.stop()
    this.lushu?.clear()
    this.currentIndex = 0
    this.status = 'stop'
  }

  setSpeed(speed: number) {
    this.speed = speed
    this.lushu._opts.speed = 4000 * speed
  }
}
```

### 使用示例

```typescript
const trackPoints = [
  { latitude: 39.918, longitude: 116.418, time: '2024-01-01 08:00:00', type: 'drive' },
  { latitude: 39.919, longitude: 116.419, time: '2024-01-01 08:05:00', type: 'drive' },
  { latitude: 39.920, longitude: 116.420, time: '2024-01-01 08:10:00', type: 'job' },
  { latitude: 39.921, longitude: 116.421, time: '2024-01-01 08:15:00', type: 'drive' },
]

const map = initMap()
createTrack(map, trackPoints)
const player = new TrackPlayer(map, trackPoints)

player.start()
player.pause()
player.setSpeed(2)
player.start()
player.stop()
```

## MapVGL 彩虹轨迹

彩虹轨迹可以直观区分不同类型的行程，提升可视化效果。

### 初始化 MapVGL

```typescript
const mapvgl = await import('mapvgl')
const view = new mapvgl.View({ map })
```

### 创建彩虹轨迹层

```typescript
const lineLayer = new mapvgl.LineRainbowLayer({
  color: ['#22c55e', '#3b82f6', '#ef4444'],
  data: trackPoints.map(p => ({
    geometry: {
      type: 'Point',
      coordinates: [p.longitude, p.latitude]
    }
  }))
})

view.addLayer(lineLayer)
```

### 颜色映射

```typescript
const typeColors = {
  drive: '#22c55e',   // 行驶 - 绿色
  job: '#3b82f6',     // 作业 - 蓝色
  idle: '#ef4444'     // 停留 - 红色
}
```

## 时间刻度尺自适应排布

```typescript
function generateTimeScale(points: TrackPoint[], containerWidth: number) {
  const minGap = 80
  const maxLabels = Math.floor(containerWidth / minGap)
  const step = Math.ceil(points.length / maxLabels)
  
  return points
    .filter((_, i) => i % step === 0)
    .map(p => ({
      time: p.time,
      position: calculatePosition(p)
    }))
}
```

## React 组件封装

```tsx
import { useEffect, useRef, useState } from 'react'

interface TrajectoryMapProps {
  points: TrackPoint[]
  autoPlay?: boolean
}

function TrajectoryMap({ points, autoPlay = false }: TrajectoryMapProps) {
  const mapRef = useRef<BMapGL.Map>()
  const playerRef = useRef<TrackPlayer>()
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const map = initMap()
    mapRef.current = map
    createTrack(map, points)
    playerRef.current = new TrackPlayer(map, points)

    return () => {
      playerRef.current?.stop()
    }
  }, [points])

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pause()
    } else {
      playerRef.current?.start()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="relative">
      <div id="mapContainer" className="w-full h-[600px]" />
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 flex gap-4">
        <button onClick={togglePlay} className="px-4 py-2 bg-accent-green text-white rounded">
          {isPlaying ? '暂停' : '播放'}
        </button>
        <input
          type="range"
          min={0.5}
          max={4}
          step={0.5}
          defaultValue={1}
          onChange={(e) => playerRef.current?.setSpeed(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
```

## 性能优化

### 1. 轨迹点抽稀

```typescript
function simplifyTrajectory(points: TrackPoint[], tolerance: number): TrackPoint[] {
  if (points.length < 3) return points

  const result: TrackPoint[] = [points[0]]
  let prevPoint = points[0]

  for (let i = 1; i < points.length - 1; i++) {
    const distance = calculateDistance(prevPoint, points[i])
    if (distance > tolerance) {
      result.push(points[i])
      prevPoint = points[i]
    }
  }

  result.push(points[points.length - 1])
  return result
}

function calculateDistance(p1: TrackPoint, p2: TrackPoint) {
  const R = 6371000
  const dLat = ((p2.latitude - p1.latitude) * Math.PI) / 180
  const dLng = ((p2.longitude - p1.longitude) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.latitude * Math.PI) / 180) *
      Math.cos((p2.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
```

### 2. 视口裁剪

```typescript
function filterByViewport(points: TrackPoint[], bounds: BMapGL.Bounds): TrackPoint[] {
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()

  return points.filter((p) => {
    return (
      p.longitude >= sw.lng &&
      p.longitude <= ne.lng &&
      p.latitude >= sw.lat &&
      p.latitude <= ne.lat
    )
  })
}
```

## 总结

通过百度地图 + MapVGL 方案，我们实现了：

1. **轨迹动态回放**：基于 Lushu 实现平滑的轨迹动画
2. **彩虹轨迹**：不同颜色区分不同类型的作业行程
3. **时间刻度尺**：自适应排布，清晰展示时间节点
4. **性能优化**：轨迹抽稀、视口裁剪减少渲染压力

这套方案已在环卫监控大屏稳定运行，支持同时展示 50+ 车辆轨迹。
