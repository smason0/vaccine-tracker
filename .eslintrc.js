
module.exports = {
  'extends': ['react-app', 'react-app/jest'],
  'rules': {
    'semi': ['warn', 'always'],
    'quotes': ['warn', 'single'],
    'jsx-quotes': ['warn', 'prefer-double'],
    'max-len': ['warn', { 'code': 120 }],
    'block-scoped-var': 'warn',
    'eol-last': ['warn', 'always'],
    'no-multiple-empty-lines': ['warn', { 'max': 1 }],
    'no-console': 'warn',
  }
};
