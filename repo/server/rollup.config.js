import typescript from 'rollup-plugin-typescript2'

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
    typescript({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true }),
  ]
}