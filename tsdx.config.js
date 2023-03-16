const images = require('@rollup/plugin-image');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');

const react = require('react');
const reactDom = require('react-dom');
const reactIs = require('react-is');
const styled = require('styled-components');

module.exports = {
    rollup(config, options) {
        if (config.output.format === 'umd') {
            delete config.external;

            config.plugins = config.plugins.map(p =>
                p.name === 'commonjs'
                ? commonjs({
                    namedExports: {
                        'react': Object.keys(react),
                        'react-dom': Object.keys(reactDom),
                        'react-is': Object.keys(reactIs),
                        'styled-components': Object.keys(styled),
                    },
                })
                : p
            );

            config.plugins = config.plugins.map(p =>
                p.name === 'replace'
                ? replace({
                    'process.env.NODE_ENV': JSON.stringify(options.env),
                    preventAssignment: true,
                })
                : p
            );
        }

        config.plugins = [
            images({ include: ['src/**/*.png', 'src/**/*.jpg', 'src/**/*.svg', 'src/**/*.gif'] }),
            ...config.plugins,
        ]
        return config
    },
}
