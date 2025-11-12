const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {
      overrideBrowserslist: ["last 2 versions", "> 1%", "IE 10"], // 自定义浏览器范围
    }, // 启用 autoprefixer，可传入配置选项
  },
};

export default config;
