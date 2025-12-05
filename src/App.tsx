//import './App.css'
import * as THREE from 'three'
import { Canvas, extend } from '@react-three/fiber'
import { Hud, OrthographicCamera, shaderMaterial } from '@react-three/drei'
import { useControls } from 'leva'
//import './styles.css'
import vertexShader from "./vshader.vert?raw";
//import fragmentShader from "./sankaku.frag?raw";
import fragmentShader from "./cellular.frag?raw";
import { useEffect, useState } from 'react';


declare global
{ namespace JSX
 { interface IntrinsicElements
        { "diffMaterial": any}
 }
}


function App() {
  const { power, wallZ ,theta} = useControls(
	{power :{value:0.5, min: 0.0, max: 2.0, step:0.05},
		wallZ :{value:0.0, min: -2.0, max: 2.0, step:0.01},
		theta :{value:0.5, min:0.0 , max:3.0, step:0.01}
	});

  const [uTime, setUTime] = useState(0.0);

  useEffect(()=>{
	const interval = setInterval(()=>{
		setUTime((uTime)=>uTime+0.1);
		console.log(uTime);
	},100);
	return ()=>clearInterval(interval);
  },[uTime]
	)
  return (
    <>
	<div style={{ height: "100dvh", width: "100dvw" }}>
	    <Canvas>
		<Hud>
		    <OrthographicCamera
			makeDefault
			top={1}
			right={1}
			bottom={-1}
			left={-1}
			near={0}
			far={1}
		    />
		    <OrthographicCamera  makeDefault top={1} right={1} bottom={-1} left={-1} near={0} far={1}/>
		    <mesh>
			<planeGeometry args={[2,2]}/>
			{/* @ts-ignore TS2339: Property 'diffMaterial' does not exist on type 'JSX.IntrinsicElements'.*/}
			<diffMaterial key={DiffMaterial.key} glslVersion={THREE.GLSL3}  power={power} wallZ={wallZ} theta={theta} uTime={uTime}/>
		    </mesh>
		</Hud>
	    </Canvas>
	</div>
    </>
  )
}

const DiffMaterial = shaderMaterial(
  {u_resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
   power: 0.5,
   wallZ: 0.0,
   theta: 0.5,
   uTime: 0.0
  },
  vertexShader,
  fragmentShader
);
extend({DiffMaterial});

export default App
