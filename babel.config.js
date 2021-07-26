module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['module-resolver', {
      alias: {
        '@entities': './src/entities',
        '@repositories': './src/repositories',
        '@providers': './src/providers',
        '@useCases': './src/useCases'
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
