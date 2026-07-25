import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const config = [
  ...coreWebVitals,
  ...typescript,
  {
    // Componentes generados por shadcn/ui: se excluyen del lint porque
    // se regeneran con el CLI y no se mantienen a mano.
    ignores: ['.next/**', 'node_modules/**', 'components/ui/**', 'hooks/**'],
  },
]

export default config
