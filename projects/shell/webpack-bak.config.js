const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;
// const webpack = require('webpack');
const { getSharedConfig, ModifyEntryPlugin } = require("./mod-fed-utils");

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [/* mapped paths to share */]);

const sharedConfig = getSharedConfig([
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
]);

const webpackConfig = {
  /* entry: {
    main: [
      ...sharedConfig.pinned,
      './projects/shell/src/main.ts'
    ],
    styles: {
      import: './projects/shell/src/styles.css',
      dependOn: ['main']
    },
    polyfills: {
      import: './projects/shell/src/polyfills.ts',
      dependOn: ['main']
    }
  }, */
  output: {
    uniqueName: "shell",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false,
    /* splitChunks: {
      cacheGroups: {
        shared_async: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          reuseExistingChunk: true,
        }
      }
    } */
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      library: { type: "module" },
      shared: share({
        ...sharedConfig.modFed,
        ...sharedMappings.getDescriptors()
      })
    }),
    /* new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 6,
    }), */
    sharedMappings.getPlugin(),
    new ModifyEntryPlugin({
      main: { import: sharedConfig.pinned },
      styles: { dependOn: ['main'] },
      polyfills: { dependOn: ['main'] }
    })
  ],
};


module.exports = {};
