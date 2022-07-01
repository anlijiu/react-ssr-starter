const path = require('path');

const React = require('react');
const StyleContext = require("isomorphic-style-loader/StyleContext");
const { default: App } = require('../src/App.tsx');

let AppEl = App;

const insertCss = (...styles) => {
  console.log("   StyledApp.jsx   insertCss   styles:", styles)
  return () => {
    styles &&
    styles
      .map(
        (style) =>
          style && typeof style._insertCss === "function" && style._insertCss()
      )
      .forEach((dispose) => {
        if (typeof dispose === "function") {
          dispose();
        }
      });
  }
}

const StyledApp = () => <StyleContext.Provider value={{ insertCss }}>
    <App />
  </StyleContext.Provider>

export default StyledApp;
// module.exports = StyledApp;
