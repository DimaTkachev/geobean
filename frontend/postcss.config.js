module.exports = {
    plugins: [
        require('postcss-import'),
        require('postcss-nested'),
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
            stage: 1,
            features: {
                'nesting-rules': false,
                'custom-properties': true,
                'custom-media-queries': true,
                'media-query-ranges': true,
                'custom-selectors': true,
                'cascade-layers': true,
                'logical-properties-and-values': true,
            },
            autoprefixer: {
                grid: true,
                flexbox: 'no-2009',
            },
        }),
        require('autoprefixer'),
        ...(process.env.NODE_ENV === 'production'
            ? [
                  require('cssnano')({
                      preset: [
                          'default',
                          {
                              discardComments: { removeAll: true },
                              normalizeWhitespace: true,
                              calc: true,
                              convertValues: true,
                              discardDuplicates: true,
                              discardEmpty: true,
                              mergeRules: true,
                              minifySelectors: true,
                              reduceInitial: true,
                          },
                      ],
                  }),
              ]
            : []),
    ],
};
