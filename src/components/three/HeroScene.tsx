import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type LogoPart = {
  name: string;
  color: "navy" | "teal";
  points: Array<[number, number]>;
  hoverOffset: [number, number, number];
};

type ScenePalette = {
  navy: string;
  teal: string;
  hoverTeal: string;
  hoverNavy: string;
  inkEmissive: number;
  inkPulse: number;
  inkHoverEmissive: number;
  inkRoughness: number;
  light: string;
};

const LIGHT_PALETTE: ScenePalette = {
  navy: "#0F2233",
  teal: "#3FD2C6",
  hoverTeal: "#7CF4EC",
  hoverNavy: "#244963",
  inkEmissive: 0.015,
  inkPulse: 0.015,
  inkHoverEmissive: 0.03,
  inkRoughness: 0.36,
  light: "#F7FCFC",
};

function getScenePalette(): ScenePalette {
  if (typeof window === "undefined") return LIGHT_PALETTE;

  const styles = window.getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
  const readNumber = (name: string, fallback: number) => {
    const value = Number.parseFloat(styles.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };

  return {
    navy: read("--logo-ink", LIGHT_PALETTE.navy),
    teal: read("--logo-accent", LIGHT_PALETTE.teal),
    hoverTeal: read("--logo-accent-hover", LIGHT_PALETTE.hoverTeal),
    hoverNavy: read("--logo-ink-hover", LIGHT_PALETTE.hoverNavy),
    inkEmissive: readNumber("--logo-ink-emissive", LIGHT_PALETTE.inkEmissive),
    inkPulse: readNumber("--logo-ink-pulse", LIGHT_PALETTE.inkPulse),
    inkHoverEmissive: readNumber("--logo-ink-hover-emissive", LIGHT_PALETTE.inkHoverEmissive),
    inkRoughness: readNumber("--logo-ink-roughness", LIGHT_PALETTE.inkRoughness),
    light: read("--scene-light", LIGHT_PALETTE.light),
  };
}

const normalize = ([x, y]: [number, number]): [number, number] => [
  (x - 90) / 42,
  (90 - y) / 42,
];

function isPointInPolygon(point: THREE.Vector3, points: Array<[number, number]>) {
  const polygon = points.map(normalize);
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersects =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersects) inside = !inside;
  }

  return inside;
}

function distanceToSegment(point: THREE.Vector3, a: [number, number], b: [number, number]) {
  const [ax, ay] = normalize(a);
  const [bx, by] = normalize(b);
  const vx = bx - ax;
  const vy = by - ay;
  const wx = point.x - ax;
  const wy = point.y - ay;
  const lengthSq = vx * vx + vy * vy;
  const t = lengthSq === 0 ? 0 : THREE.MathUtils.clamp((wx * vx + wy * vy) / lengthSq, 0, 1);
  const x = ax + vx * t;
  const y = ay + vy * t;

  return Math.hypot(point.x - x, point.y - y);
}

function distanceToPolygon(point: THREE.Vector3, points: Array<[number, number]>) {
  let best = Number.POSITIVE_INFINITY;

  for (let i = 0; i < points.length; i++) {
    const next = (i + 1) % points.length;
    best = Math.min(best, distanceToSegment(point, points[i], points[next]));
  }

  return best;
}

function makeRoundedShape(points: Array<[number, number]>, radius = 0.055) {
  const polygon = points.map(normalize).map(([x, y]) => new THREE.Vector2(x, y));
  const shape = new THREE.Shape();

  polygon.forEach((current, index) => {
    const prev = polygon[(index - 1 + polygon.length) % polygon.length];
    const next = polygon[(index + 1) % polygon.length];
    const toPrev = prev.clone().sub(current);
    const toNext = next.clone().sub(current);
    const cornerRadius = Math.min(radius, toPrev.length() * 0.32, toNext.length() * 0.32);
    const start = current.clone().add(toPrev.normalize().multiplyScalar(cornerRadius));
    const end = current.clone().add(toNext.normalize().multiplyScalar(cornerRadius));

    if (index === 0) {
      shape.moveTo(start.x, start.y);
    } else {
      shape.lineTo(start.x, start.y);
    }

    shape.quadraticCurveTo(current.x, current.y, end.x, end.y);
  });

  shape.closePath();
  return shape;
}

const PARTS: LogoPart[] = [
  {
    name: "left-wing",
    color: "navy",
    points: [
      [17.5, 154],
      [23.5, 57.5],
      [41.5, 46],
      [58, 70.5],
      [87, 101.5],
      [87, 154],
      [63.8, 154],
      [58, 91],
      [39.5, 79],
      [45, 154],
    ],
    hoverOffset: [-0.08, -0.02, 0.08],
  },
  {
    name: "right-wing",
    color: "navy",
    points: [
      [98, 154],
      [98, 105],
      [135.5, 66],
      [152, 34.5],
      [170, 66],
      [140, 101],
      [117, 109],
      [108.7, 154],
    ],
    hoverOffset: [0.08, -0.02, 0.08],
  },
  {
    name: "tail",
    color: "teal",
    points: [
      [118, 154],
      [123.3, 127.8],
      [144.5, 115.5],
      [165.7, 102.6],
      [162, 128.2],
      [146.8, 128.2],
      [127.8, 136.8],
      [120.2, 154.1],
    ],
    hoverOffset: [0.13, -0.08, 0.18],
  },
  {
    name: "chevron",
    color: "navy",
    points: [
      [55.2, 47],
      [66.7, 34.5],
      [95.2, 61],
      [121.8, 33],
      [135.2, 47],
      [95.2, 89],
    ],
    hoverOffset: [0, 0.06, 0.1],
  },
  {
    name: "spark",
    color: "teal",
    points: [
      [72, 26],
      [95, 16],
      [117.5, 25],
      [95, 50.5],
    ],
    hoverOffset: [0, 0.12, 0.2],
  },
];

function makeGeometry(points: Array<[number, number]>) {
  const shape = makeRoundedShape(points);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 5,
  });
  geo.computeVertexNormals();

  const colors = new Float32Array(geo.attributes.position.count * 3);
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

function LogoShape({
  part,
  index,
  animate,
  hovered,
  activePoint,
  palette,
  onPointerOver,
  onPointerOut,
}: {
  part: LogoPart;
  index: number;
  animate: boolean;
  hovered: boolean;
  activePoint: THREE.Vector3 | null;
  palette: ScenePalette;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const geometry = useMemo(() => makeGeometry(part.points), [part.points]);
  const isAccent = part.color === "teal";
  const partColor = isAccent ? palette.teal : palette.navy;
  const localPointer = useRef(new THREE.Vector3(999, 999, 999));
  const targetGlow = useRef(0);

  const baseColor = useMemo(() => new THREE.Color(partColor), [partColor]);
  const hoverColor = useMemo(
    () => new THREE.Color(isAccent ? palette.hoverTeal : palette.hoverNavy),
    [isAccent, palette.hoverNavy, palette.hoverTeal],
  );

  const updateVertexGlow = (glow: number) => {
    const position = geometry.attributes.position as THREE.BufferAttribute;
    const color = geometry.attributes.color as THREE.BufferAttribute;
    const pointer = localPointer.current;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);
      const distance = vertex.distanceTo(pointer);
      const falloff = Math.max(0, 1 - distance / (isAccent ? 0.95 : 0.75));
      const mix = Math.pow(falloff, 2.4) * glow;
      color.setXYZ(
        i,
        THREE.MathUtils.lerp(baseColor.r, hoverColor.r, mix),
        THREE.MathUtils.lerp(baseColor.g, hoverColor.g, mix),
        THREE.MathUtils.lerp(baseColor.b, hoverColor.b, mix),
      );
    }

    color.needsUpdate = true;
  };

  useFrame(({ clock }, delta) => {
    const el = mesh.current;
    if (!el) return;

    if (!animate) {
      el.position.set(0, 0, 0);
      el.rotation.set(0, 0, 0);
      el.scale.setScalar(1);
      return;
    }

    const t = clock.getElapsedTime();
    const wave = Math.sin(t * 1.25 + index * 0.82);
    const glow = THREE.MathUtils.damp(targetGlow.current, hovered ? 1 : 0, 8, delta);
    targetGlow.current = glow;

    if (activePoint) {
      localPointer.current.copy(activePoint);
    }

    const hoverLift = glow;
    const pulse = 1 + (isAccent ? 0.018 : 0.008) * wave + hoverLift * (isAccent ? 0.035 : 0.016);
    const hoverTarget = new THREE.Vector3(...part.hoverOffset).multiplyScalar(hoverLift);
    const idleTarget = new THREE.Vector3(
      0,
      wave * (isAccent ? 0.022 : 0.01),
      Math.cos(t * 1.05 + index) * (isAccent ? 0.026 : 0.012),
    );

    el.position.lerp(idleTarget.add(hoverTarget), 1 - Math.pow(0.001, delta));
    el.scale.setScalar(pulse);
    el.rotation.x = THREE.MathUtils.damp(el.rotation.x, 0, 5, delta);
    el.rotation.y = THREE.MathUtils.damp(el.rotation.y, 0, 5, delta);
    el.rotation.z = THREE.MathUtils.damp(
      el.rotation.z,
      Math.sin(t * 0.62 + index) * 0.018 + hoverLift * (index - 2) * 0.006,
      5,
      delta,
    );

    if (material.current) {
      material.current.emissiveIntensity = isAccent
        ? 0.08 + Math.max(0, wave) * 0.1 + hoverLift * 0.22
        : palette.inkEmissive + Math.max(0, wave) * palette.inkPulse + hoverLift * palette.inkHoverEmissive;
    }

    updateVertexGlow(glow);
  });

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!mesh.current) return;
    localPointer.current.copy(mesh.current.worldToLocal(event.point.clone()));
  };

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      onPointerOver={(event) => {
        event.stopPropagation();
        onPointerOver();
        localPointer.current.copy(mesh.current?.worldToLocal(event.point.clone()) ?? localPointer.current);
      }}
      onPointerMove={handlePointerMove}
      onPointerOut={(event) => {
        event.stopPropagation();
        onPointerOut();
        localPointer.current.set(999, 999, 999);
      }}
    >
      <meshStandardMaterial
        ref={material}
        color="#FFFFFF"
        vertexColors
        roughness={isAccent ? 0.24 : palette.inkRoughness}
        metalness={isAccent ? 0.16 : 0.04}
        emissive={partColor}
        emissiveIntensity={isAccent ? 0.08 : palette.inkEmissive}
      />
    </mesh>
  );
}

function AccentGlow({
  animate,
  hovered,
  palette,
}: {
  animate: boolean;
  hovered: boolean;
  palette: ScenePalette;
}) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    if (animate) group.current.rotation.z = Math.sin(t * 0.2) * 0.04;
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, hovered ? 1.08 : 1, 5, 0.016));
    if (material.current) {
      material.current.opacity = THREE.MathUtils.damp(material.current.opacity, hovered ? 0.24 : 0.12, 5, 0.016);
    }
  });

  return (
    <group ref={group} position={[0.08, -0.08, -0.26]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.95, 0.01, 8, 120]} />
        <meshBasicMaterial ref={material} color={palette.teal} transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function Scene({
  animate,
  palette,
  onDragChange,
}: {
  animate: boolean;
  palette: ScenePalette;
  onDragChange: (dragging: boolean) => void;
}) {
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;
  const root = useRef<THREE.Group>(null);
  const system = useRef<THREE.Group>(null);
  const drag = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    velocityX: 0,
    velocityY: 0,
  });
  const dragRotation = useRef(new THREE.Vector2(0, 0));
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [activePoint, setActivePoint] = useState<THREE.Vector3 | null>(null);

  useFrame(({ pointer, clock }, delta) => {
    const wrapper = root.current;
    const el = system.current;
    if (!wrapper || !el) return;
    const t = clock.getElapsedTime();
    const intro = THREE.MathUtils.smoothstep(t / 1.4, 0, 1);
    const idleTurn = animate ? Math.sin(t * 0.35) * 0.06 : 0;
    const hoverBoost = hoveredPart ? 1 : 0;

    if (!drag.current.active) {
      dragRotation.current.y += drag.current.velocityX * delta;
      dragRotation.current.x = THREE.MathUtils.clamp(
        dragRotation.current.x + drag.current.velocityY * delta,
        -0.85,
        0.85,
      );
      drag.current.velocityX *= Math.pow(0.025, delta);
      drag.current.velocityY *= Math.pow(0.025, delta);
    }

    const pointerTilt = drag.current.active ? 0 : 1;
    const targetY =
      dragRotation.current.y +
      pointer.x * (0.18 + hoverBoost * 0.1) * pointerTilt +
      idleTurn * pointerTilt;
    const targetX = THREE.MathUtils.clamp(
      dragRotation.current.x +
        (-pointer.y * (0.1 + hoverBoost * 0.06) + Math.cos(t * 0.3) * 0.025) * pointerTilt,
      -0.95,
      0.95,
    );

    el.rotation.y = THREE.MathUtils.damp(el.rotation.y, targetY, drag.current.active ? 10 : 4, delta);
    el.rotation.x = THREE.MathUtils.damp(el.rotation.x, targetX, drag.current.active ? 10 : 4, delta);
    wrapper.position.y = (animate ? Math.sin(t * 0.7) * 0.05 : 0) + hoverBoost * 0.08;
    wrapper.scale.setScalar(0.58 + intro * 0.04 + hoverBoost * 0.035 + (animate ? Math.sin(t * 0.6) * 0.006 : 0));
  });

  const updateHoverTarget = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!system.current) return;

    const point = system.current.worldToLocal(event.point.clone());
    const containingPart = PARTS.find((part) => isPointInPolygon(point, part.points));
    const nearestPart =
      containingPart ??
      PARTS.reduce<{ part: LogoPart | null; distance: number }>(
        (best, part) => {
          const distance = distanceToPolygon(point, part.points);
          return distance < best.distance ? { part, distance } : best;
        },
        { part: null, distance: Number.POSITIVE_INFINITY },
      ).part;

    const nearestDistance = nearestPart ? distanceToPolygon(point, nearestPart.points) : Number.POSITIVE_INFINITY;

    if (containingPart || nearestDistance < 0.28) {
      setHoveredPart(nearestPart?.name ?? null);
      setActivePoint(point);
      return;
    }

    setHoveredPart(null);
    setActivePoint(null);
  };

  const clearHoverTarget = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHoveredPart(null);
    setActivePoint(null);
  };

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const target = event.target as Element | null;
    target?.setPointerCapture(event.pointerId);
    drag.current.active = true;
    drag.current.lastX = event.nativeEvent.clientX;
    drag.current.lastY = event.nativeEvent.clientY;
    drag.current.velocityX = 0;
    drag.current.velocityY = 0;
    onDragChange(true);
    updateHoverTarget(event);
  };

  const moveDrag = (event: ThreeEvent<PointerEvent>) => {
    updateHoverTarget(event);
    if (!drag.current.active) return;

    const x = event.nativeEvent.clientX;
    const y = event.nativeEvent.clientY;
    const dx = x - drag.current.lastX;
    const dy = y - drag.current.lastY;

    drag.current.lastX = x;
    drag.current.lastY = y;
    drag.current.velocityX = dx * 0.44;
    drag.current.velocityY = dy * 0.28;
    dragRotation.current.y += dx * 0.022;
    dragRotation.current.x = THREE.MathUtils.clamp(dragRotation.current.x + dy * 0.014, -0.95, 0.95);
  };

  const stopDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const target = event.target as Element | null;
    if (target?.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
    drag.current.active = false;
    onDragChange(false);
  };

  return (
    <group
      ref={root}
      scale={0.62}
      position={[isMobile ? -0.08 : 0.16, -0.02, 0]}
    >
      <mesh
        position={[0, 0, 0.7]}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onPointerLeave={stopDrag}
        onPointerOut={clearHoverTarget}
      >
        <planeGeometry args={[6, 5.4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={system} rotation={[0.04, -0.1, 0]}>
        <AccentGlow animate={animate} hovered={Boolean(hoveredPart)} palette={palette} />
        {PARTS.map((part, index) => (
          <LogoShape
            key={part.name}
            part={part}
            index={index}
            animate={animate}
            hovered={hoveredPart === part.name}
            activePoint={hoveredPart === part.name ? activePoint : null}
            palette={palette}
            onPointerOver={() => setHoveredPart(part.name)}
            onPointerOut={() => setHoveredPart((current) => (current === part.name ? null : current))}
          />
        ))}
      </group>
    </group>
  );
}

export default function HeroScene({ animate }: { animate: boolean }) {
  const [dragging, setDragging] = useState(false);
  const [palette, setPalette] = useState<ScenePalette>(getScenePalette);

  useEffect(() => {
    const root = document.documentElement;
    const syncPalette = () => setPalette(getScenePalette());
    const observer = new MutationObserver(syncPalette);

    syncPalette();
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.8], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 5]} intensity={2.15} color={palette.light} />
      <pointLight position={[-4, -2, 2]} intensity={18} color={palette.teal} />
      <pointLight position={[3, -3, 4]} intensity={8} color="#FFFFFF" />
      <Scene animate={animate} palette={palette} onDragChange={setDragging} />
    </Canvas>
  );
}
