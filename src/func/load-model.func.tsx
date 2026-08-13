import { useEffect, useRef, useMemo } from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

const MATERIAL_HOVER = new THREE.MeshStandardMaterial({
  color: "#22c55e",
  metalness: 0.4,
  roughness: 0.3,
  emissive: "#15803d",
  emissiveIntensity: 0.3,
});

interface LoadModelProps {
  onHover?: (name: string | null, x: number, y: number) => void;
  [key: string]: unknown;
}

export function LoadModel({ onHover, ...props }: LoadModelProps) {
  const obj = useLoader(OBJLoader, "/3d/Engine1.obj");
  const ref = useRef<THREE.Object3D>(null);
  const { camera } = useThree();
  const { theme } = useTheme();

  const materialDefault = useMemo(() => new THREE.MeshStandardMaterial(
    theme === "light"
      ? { color: "#94a1a7", metalness: 0.6, roughness: 0.4 }
      : { color: "#8a9bb0", metalness: 0.6, roughness: 0.4 }
  ), [theme]);

  // câmera e posição — roda só quando o modelo carrega
  useEffect(() => {
    if (!ref.current) return;

    ref.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = materialDefault;
      }
    });

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
  }, [obj, camera]); // eslint-disable-line react-hooks/exhaustive-deps

  // material — roda só quando o tema muda, sem mexer na câmera
  useEffect(() => {
    if (!ref.current) return;
    ref.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = materialDefault;
      }
    });
  }, [materialDefault]);

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
    mesh.material = materialDefault;
    document.body.style.cursor = "default";
    onHover?.(null, 0, 0);
  };

  const handlePointerMove = (e: { nativeEvent: PointerEvent; object: THREE.Object3D }) => {
    const mesh = e.object as THREE.Mesh;
    const name = mesh.name || mesh.parent?.name || "Componente";
    onHover?.(name, e.nativeEvent.clientX, e.nativeEvent.clientY);
  };

  return (
    <primitive
      ref={ref}
      object={obj}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
      {...props}
    />
  );
}
