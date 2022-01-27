const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;
const { getSharedConfig, ModifyEntryPlugin } = require("./mod-fed-utils");

const getModFedConfig = config => {
  const sharedMappings = new mf.SharedMappings();
  sharedMappings.register(
    path.join(__dirname, '../../tsconfig.json'),
    config.repoShared || []
  );

  const sharedConfig = getSharedConfig(config.shared);

  const normalizeRemoteUrl = config => {
    const normalizeUrl = ([remoteNameOrUrl, remoteUrlOrEmpty], key) =>
      config.configType === 'esm' ?
        (remoteUrlOrEmpty ? remoteUrlOrEmpty : remoteNameOrUrl) :
        (remoteUrlOrEmpty ? remoteNameOrUrl + '@' + remoteUrlOrEmpty : key + '@' + remoteNameOrUrl);

    return Object.keys(config.remotes).reduce((a, key) => ({
      ...a,
      [key]: normalizeUrl(config.remotes[key].split('@'), key)
    }), {});
  }

  if (sharedConfig.hasPinned && config.remotes) {
    throw new Error([
      'Pinned dependencies in combination with build-time remotes are not allowed. ',
      'Either remove "pinned: true" from all shared dependencies or delete all ',
      'remotes in your webpack config and use runtime remote loading instead.'
    ].join(''));
  }

  return {
    output: {
      ...(config.name ? {
        uniqueName: config.name
      } : {}),
      publicPath: "auto",
      ...(config.configType === 'esmToVar' ? {
        scriptType: 'text/javascript'
      } : {})
    },
    optimization: {
      runtimeChunk: false
    },
    resolve: {
      alias: {
        ...sharedMappings.getAliases(),
      }
    },
    ...(config.configType === 'esm' ? { experiments: {
      outputModule: true
    }} : {}),
    plugins: [
      new ModuleFederationPlugin({
        ...(config.name ? {
          name: config.name
        } : {}),
        ...(config.configType === 'esm' ? { library: {
          type: "module"
        }} : {}),
        ...(config.remotes ? {
          remotes: normalizeRemoteUrl(config)
        } : {}),
        ...(config.filename ? { filename:
          config.filename
        } : (
          config.exposes ? { filename:
            "remoteEntry.js"
          } : {}
        )),
        ...(config.exposes ? { exposes:
          config.exposes
        } : {}),
        shared: share({
          ...sharedConfig.modFed || [],
          ...sharedMappings.getDescriptors()
        })
      }),
      sharedMappings.getPlugin(),
      ...(sharedConfig.ModifyEntry ?
        [ new ModifyEntryPlugin(sharedConfig.ModifyEntry)] :
        (sharedConfig.hasPinned || sharedConfig.hasEager ?
          [ new ModifyEntryPlugin({
            ...(sharedConfig.hasPinned ? {
              main: { import: sharedConfig.pinned }
            } : {}),
            ...(sharedConfig.hasEager ? {
              styles: { dependOn: ['main'] },
              polyfills: { dependOn: ['main'] }
            } : {})
          })] :
        [])
      )
    ],
  }
};


module.exports = { getModFedConfig };
