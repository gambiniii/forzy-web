import { useEffect, useRef, useMemo, useState } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

const MATERIAL_HOVER = new THREE.MeshStandardMaterial({
  color: "#22c55e",
  metalness: 0.4,
  roughness: 0.3,
  emissive: "#15803d",
  emissiveIntensity: 0.3,
});

/** Cor + mensagem de causa-raiz para um segmento do modelo — ver
 * `buildHighlightMap` em `pages/machine-detail/diagnosticoUtils.ts`. */
export interface HighlightInfo {
  color: string;
  emissive: string;
  message: string;
}

interface DiagnosisMarker {
  name: string;
  position: THREE.Vector3;
  info: HighlightInfo;
}

interface LoadModelProps {
  onHover?: (name: string | null, x: number, y: number) => void;
  /** nome do segmento OBJ → destaque de causa-raiz (persiste mesmo sem hover). */
  highlightMap?: Record<string, HighlightInfo>;
  [key: string]: unknown;
}

export function LoadModel({ onHover, highlightMap, ...props }: LoadModelProps) {
  const obj = useLoader(OBJLoader, "/3d/Engine1.obj");
  const ref = useRef<THREE.Object3D>(null);
  const { camera } = useThree();
  const { theme } = useTheme();
  const [markers, setMarkers] = useState<DiagnosisMarker[]>([]);

  const materialDefault = useMemo(() => new THREE.MeshStandardMaterial(
    theme === "light"
      ? { color: "#94a1a7", metalness: 0.6, roughness: 0.4 }
      : { color: "#8a9bb0", metalness: 0.6, roughness: 0.4 }
  ), [theme]);

  const diagnosisMaterials = useMemo(() => {
    const cache = new Map<string, THREE.MeshStandardMaterial>();
    Object.entries(highlightMap ?? {}).forEach(([name, info]) => {
      cache.set(name, new THREE.MeshStandardMaterial({
        color: info.color,
        metalness: 0.4,
        roughness: 0.3,
        emissive: info.emissive,
        emissiveIntensity: 0.6,
      }));
    });
    return cache;
  }, [highlightMap]);

  const applyMaterials = () => {
    if (!ref.current) return;
    ref.current.updateMatrixWorld(true);
    const found: DiagnosisMarker[] = [];
    ref.current.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      const diag = diagnosisMaterials.get(mesh.name);
      mesh.material = diag ?? materialDefault;
      const info = highlightMap?.[mesh.name];
      if (diag && info) {
        const position = new THREE.Vector3();
        mesh.getWorldPosition(position);
        found.push({ name: mesh.name, position, info });
      }
    });
    setMarkers(found);
  };

  // câmera e posição — roda só quando o modelo carrega
  useEffect(() => {
    if (!ref.current) return;

    const box = new THREE.Box3().setFromObject(ref.current);
    const center = box.getCenter(new THREE.Vector3());
    ref.current.position.sub(center);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const distance = (maxDim / 2 / Math.tan(fov / 2)) * 1.8;

    camera.position.set(0, 0, distance);
    camera.near = distance / 100;
    camera.far = distance * 10;
    camera.updateProjectionMatrix();

    applyMaterials();
  }, [obj, camera]); // eslint-disable-line react-hooks/exhaustive-deps

  // material/destaque de diagnóstico — roda quando tema ou highlightMap mudam,
  // sem recentralizar a câmera
  useEffect(() => {
    applyMaterials();
  }, [materialDefault, diagnosisMaterials]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePointerOver = (e: { stopPropagation: () => void; object: THREE.Object3D; nativeEvent: PointerEvent }) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    mesh.material = MATERIAL_HOVER;
    document.body.style.cursor = "pointer";
    const name = mesh.name || mesh.parent?.name || "Componente";
    onHover?.(name, e.nativeEvent.clientX, e.nativeEvent.clientY);
  };

  const handlePointerOut = (e: { object: THREE.Object3D }) => {
    const mesh = e.object as THREE.Mesh;
    mesh.material = diagnosisMaterials.get(mesh.name) ?? materialDefault;
    document.body.style.cursor = "default";
    onHover?.(null, 0, 0);
  };

  const handlePointerMove = (e: { nativeEvent: PointerEvent; object: THREE.Object3D }) => {
    const mesh = e.object as THREE.Mesh;
    const name = mesh.name || mesh.parent?.name || "Componente";
    onHover?.(name, e.nativeEvent.clientX, e.nativeEvent.clientY);
  };

  return (
    <>
      <primitive
        ref={ref}
        object={obj}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
        {...props}
      />
      {markers.map((m) => (
        <Html key={m.name} position={m.position} center distanceFactor={8} zIndexRange={[10, 0]}>
          <div
            style={{
              background: "rgba(15,23,42,0.94)",
              border: `1px solid ${m.info.color}`,
              color: m.info.color,
              fontSize: 10,
              fontFamily: "var(--mono, monospace)",
              padding: "4px 8px",
              borderRadius: 4,
              pointerEvents: "none",
              transform: "translateY(-140%)",
              maxWidth: 200,
              lineHeight: 1.4,
              whiteSpace: "normal",
            }}
          >
            {m.info.message}
          </div>
        </Html>
      ))}
    </>
  );
}
