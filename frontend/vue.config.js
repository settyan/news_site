module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "評価型ニュースサイト";
      return args;
    });
  },
  css: {
    loaderOptions: {
      css: {
        sourceMap: true
      }
    }
  }
};
