/* eslint-disable space-in-parens */
// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appName: 'QuadRION ERP',
    appShortName: 'ERP',
    appLogoImage: require( '@src/assets/images/logo/logo.svg' ).default
  },
  layout: {
    isRTL: false,
    skin: 'bordered', // light, dark, bordered, semi-dark
    routerTransition: 'none', // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: 'horizontal', // vertical, horizontal
    contentWidth: 'full', // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'sticky', // static , sticky , floating, hidden
      backgroundColor: 'white' // BS color options [primary, success, etc]
    },
    footer: {
      type: 'hidden' // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true // Enable scroll to top button
  }
};

export default themeConfig;
