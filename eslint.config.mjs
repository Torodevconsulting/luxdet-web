import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const config = [
  ...coreWebVitals,
  ...typescript,
  {
    // Ya no se excluye components/ui/** ni hooks/**: se podaron por completo
    // al no usarse. Si se vuelve a añadir un componente con el CLI de shadcn,
    // hay que reponer esos ignores.
    ignores: ['.next/**', 'node_modules/**'],
  },
]

export default config
