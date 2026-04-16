/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'import-notation': 'string',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'theme',
          'utility',
          'variant',
          'source',
          'plugin',
          'config',
          'apply'
        ]
      }
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'alpha', 'spacing']
      }
    ],
    'declaration-property-value-no-unknown': null,

    'color-named': 'never',
    'color-no-invalid-hex': true,

    'color-function-notation': 'modern',
    'color-function-alias-notation': 'with-alpha',

    'length-zero-no-unit': true,

    'shorthand-property-no-redundant-values': true,
    'declaration-block-no-redundant-longhand-properties': [
      true,
      {
        ignoreShorthands: ['grid-template', 'transition', 'animation']
      }
    ],

    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,

    'declaration-no-important': true,

    'selector-max-type': [
      2,
      {
        ignore: ['descendant', 'compounded']
      }
    ],

    'unit-allowed-list': [
      'rem',
      'em',
      'px',
      'vh',
      'vw',
      'vmin',
      'vmax',
      'svh',
      'svw',
      'dvh',
      'dvw',
      'lvh',
      'lvw',
      '%',
      'fr',
      'deg',
      'turn',
      's',
      'ms',
      'ch',
      'ex'
    ],
    'alpha-value-notation': 'number',
    'value-keyword-case': 'lower',
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local']
      }
    ]
  }
}
