const composeShareConfig = config => config.reduce((a, [deps, cfg]) => [
  ...a, ...deps.map(dep => ({ package: dep, ...cfg }))
], []);
const getPinnedDependencies = config => [ ...new Set(config.filter(c => c.pinned && c.eager).map(c => c.package)) ];
const transformToModFedCfg = config => { const { package, pinned, ...cfg } = config; return cfg };
const getModFedShared = config => config.reduce((a, c) => ({ ...a, [c.package]: transformToModFedCfg(c) }), {});

const getSharedConfig = sharedCfg => (cfg => ({
  pinned: getPinnedDependencies(cfg),
  modFed: getModFedShared(cfg),
  hasEager: !!cfg.find(p => p.eager === true),
  hasPinned: !!cfg.find(p => p.pinned === true)
}))(composeShareConfig(sharedCfg));


class ModifyEntryPlugin {
  constructor(config) {
    this.config = config;
  }

  apply(compiler) {
    const mergeEntry = (keyFn, key) => [
      ...(keyFn(this.config[key]) || []),
      ...(keyFn(compiler.options.entry[key]) || [])
    ];
    const cfgOrRemove = (objFn, valueFn, key) => {
      const values = mergeEntry(valueFn, key);
      return values.length > 0 ? objFn(values) : {};
    };
    Object.keys(this.config).forEach(key => {
      compiler.options.entry[key] = {
        ...cfgOrRemove(v => ({ import: v }), c => c.import, key),
        ...cfgOrRemove(v => ({ dependOn: v }), c => c.dependOn, key)
      };
    });
  }
}


module.exports = {
  getSharedConfig,
  ModifyEntryPlugin
};
