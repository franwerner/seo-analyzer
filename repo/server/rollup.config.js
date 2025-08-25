import terser from "@rollup/plugin-terser"
import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'

export default {
  input: [
    './src/index.ts',
  ],
  output: [
    {
      dir: "dist",
      format: 'esm',
    }
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  plugins: [
    terser(),
    typescript({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true }),
    del({ targets: "dist" })
  ]
}