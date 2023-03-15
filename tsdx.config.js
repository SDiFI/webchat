const images = require('@rollup/plugin-image');

module.exports = {
  rollup(config, options) {
    config.plugins = [
      images({ include: ['src/**/*.png', 'src/**/*.jpg', 'src/**/*.svg', 'src/**/*.gif'] }),
      ...config.plugins,
    ]

    return config
  },
}
