import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default {
    plugins: [
        postcssImport,
        postcssNested,
        postcssFlexbugsFixes,
        postcssPresetEnv({
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
        autoprefixer,
        ...(process.env.NODE_ENV === 'production'
            ? [
                  cssnano({
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
