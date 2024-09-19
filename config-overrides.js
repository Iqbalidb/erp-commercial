/* eslint-disable space-before-function-paren */
/* eslint-disable space-in-parens */
const SassRuleRewire = require( 'react-app-rewire-sass-rule' );
const path = require( 'path' );
const rewireAliases = require( 'react-app-rewire-aliases' );

module.exports = function override( config, env ) {
  require( 'react-app-rewire-postcss' )( config, {
    plugins: loader => [require( 'postcss-rtl' )()]
  } );

  config = rewireAliases.aliasesOptions( {
    '@src': path.resolve( __dirname, 'src' ),
    '@core': path.resolve( __dirname, 'src/@core' ),
    '@assets': path.resolve( __dirname, 'src/@core/assets' ),
    '@custom-assets': path.resolve( __dirname, 'src/assets' ),
    '@custom-styles': path.resolve( __dirname, 'src/assets/scss' ),
    '@components': path.resolve( __dirname, 'src/@core/components' ),
    '@layouts': path.resolve( __dirname, 'src/@core/layouts' ),
    '@custom-layouts': path.resolve( __dirname, 'src/layouts' ),
    '@store': path.resolve( __dirname, 'src/redux' ),
    '@styles': path.resolve( __dirname, 'src/@core/scss' ),
    '@configs': path.resolve( __dirname, 'src/configs' ),
    '@utils': path.resolve( __dirname, 'src/utility/Utils' ),
    '@utility': path.resolve( __dirname, 'src/utility' ),
    '@custom': path.resolve( __dirname, 'src/utility/custom' ),
    '@views': path.resolve( __dirname, 'src/views' ),
    '@api': path.resolve( __dirname, 'src/services/api-end-points' ),
    '@services': path.resolve( __dirname, 'src/services' ),
    '@hooks': path.resolve( __dirname, 'src/utility/hooks' )
  } )( config, env );

  config = new SassRuleRewire()
    .withRuleOptions( {
      test: /\.s[ac]ss$/i,
      use: [
        {
          loader: 'sass-loader',

          options: {
            sassOptions: {
              includePaths: ['node_modules', 'src/assets']
            }
          }
        }
      ]
    } )
    .rewire( config, env );
  return config;
};