const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/vezdecode-js/' : '/',
  productionSourceMap: false,
  devServer: {
    port: 3000,
  },
});
