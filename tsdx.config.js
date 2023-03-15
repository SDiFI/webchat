const images = require('@rollup/plugin-image');

module.exports = {
  rollup(config, options) {
    config.plugins = [
      images({ include: ['**/*.png', '**/*.jpg', 'src/**/*.svg'] }),
      ...config.plugins,
    ]

    return config
  },
}
