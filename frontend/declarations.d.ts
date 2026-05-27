// declarations.d.ts

import { ShaderMaterialProps } from '@react-three/fiber'; // Import the necessary types

declare global {
  namespace JSX {
    interface IntrinsicElements {
      shaderMaterial: ShaderMaterialProps;  // Declare shaderMaterial with the appropriate props type
    }
  }
}
