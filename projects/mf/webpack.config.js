const { getModFedConfig } = require("../mod-fed-utils/mod-fed-config");

module.exports = getModFedConfig({
  name: 'mf',
  configType: 'esm',
  exposes: {
    './module': './projects/mf/src/app/mf-feature-a/mf-feature-a.module.ts',
  },
  shared: [
    [
      [
        '@angular/core',
        '@angular/common',
        '@angular/common/http',
        '@angular/router',
        '@ngrx/store'
      ],
      {
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto'
      }
    ]
  ]
});
