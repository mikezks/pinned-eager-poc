const { getModFedConfig } = require("../mod-fed-utils/mod-fed-config");

module.exports = getModFedConfig({
  name: 'shell',
  configType: 'esm', // 'esm', 'esmToVar', 'var'
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
        requiredVersion: 'auto',
        eager: true,
        pinned: true
      }
    ]
  ],
  repoShared: [],
  /* modifyEntry: {
    main: { import: [
      '@angular/core',
      '@angular/common',
      '@angular/common/http',
      '@angular/router',
      '@ngrx/store'
    ] },
    styles: { dependOn: ['main'] },
    polyfills: { dependOn: ['main'] }
  }, */
  /* remotes: {
    mf: 'http://localhost:3000/remoteEntry.js'
  } */
});
