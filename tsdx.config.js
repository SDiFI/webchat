const images = require('@rollup/plugin-image');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const nodeResolve = require('@rollup/plugin-node-resolve').default;
const nodePolyfill = require('rollup-plugin-polyfill-node');

const react = require('react');
const reactDom = require('react-dom');
const reactIs = require('react-is');
const styled = require('styled-components');

module.exports = {
    rollup(config, options) {
        if (config.output.format === 'umd') {
            delete config.external;

            config.plugins = config.plugins.map(p => {
                if (p.name === 'commonjs') {
                    return commonjs({
                        namedExports: {
                            'react': Object.keys(react),
                            'react-dom': Object.keys(reactDom),
                            'react-is': Object.keys(reactIs),
                            'styled-components': Object.keys(styled),
                            'nice-grpc-web': ['createChannel', 'createClient'],
                        },
                    });
                } else if (p.name === 'node-resolve') {
                    return nodeResolve({
                        browser: true,
                        preferBuiltins: false,
                    });
                }

                return p
            });

            config.plugins = [
                ...config.plugins.slice(0, 1),
                nodePolyfill({
                    include: ["buffer", "stream", "events"],
                }), ...config.plugins.slice(1)];

        }

        config.plugins = config.plugins.map(p =>
            p.name === 'replace'
            ? replace({
                'process.env.NODE_ENV': JSON.stringify(options.env),
                preventAssignment: true,
            })
            : p
        );

        config.plugins = [
            images({ include: ['src/**/*.png', 'src/**/*.jpg', 'src/**/*.svg', 'src/**/*.gif'] }),
            ...config.plugins,
        ]
        return config
    },
}
