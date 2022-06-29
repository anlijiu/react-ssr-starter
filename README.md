# react-ssr-starter


### postcss
#### postcss-import
一般作为postcss 第一个plugin
> @import 转换为 inlining content
``` css
@import "bar.css" (min-width: 25em);

@import 'baz.css' layer(baz-layer);
```
变为
``` css
@media (min-width: 25em) {
/* ... content of css/bar.css */
}

@layer baz-layer {
/* ... content of css/baz.css */
}
```

#### postcss-pxtorem
``` css
h1 {
    margin: 0 0 20px;
    font-size: 32px;
    line-height: 1.2;
    letter-spacing: 1px;
}
```
变为
``` css
h1 {
    margin: 0 0 20px;
    font-size: 2rem;
    line-height: 1.2;
    letter-spacing: 0.0625rem;
}
```
#### postcss-url
url 参数 
根据postcss 参数 from & to
+ rebase (默认) 改变路径基准 复制到 assetsPath (relative to to or absolute)
+ inline 转化为 data:image/svg+xml ...
+ copy 复制
maxSize inline最大值
``` javascript
const options = [
    { filter: '**/assets/copy/*.png', url: 'copy', assetsPath: 'img', useHash: true },
    { filter: '**/assets/inline/*.svg', url: 'inline' },
    { filter: '**/assets/**/*.gif', url: 'rebase' },
    // using custom function to build url
    { filter: 'cdn/**/*', url: (asset) => `https://cdn.url/${asset.url}` }
];

postcss().use(url(options))
```
#### postcss-mixins
@define-mixin & @mixin
需要在 postcss-simple-vars 和postcss-nested 之前引入
#### postcss-map-get
postcss-map-get
#### postcss-custom-media
 PostCSS Custom Media was moved to @csstools/postcss-plugins. warning
``` css
@custom-media --small-viewport (max-width: 30em);

@media (--small-viewport) {
  /* styles for small viewport */
}

/* becomes */

@media (max-width: 30em) {
  /* styles for small viewport */
}
```
#### postcss-media-minmax
貌似没啥用
``` css
@media screen and (width >= 500px) and (width <= 1200px) {
  .bar {
    display: block;
  }
}
```
变为
``` css
@media screen and (min-width: 500px) and (max-width: 1200px) {
  .bar {
    display: block;
  }
}
```
#### postcss-custom-selectors
PostCSS Custom Selectors was moved to @csstools/postcss-plugins. warning
``` css
@custom-selector :--heading h1, h2, h3;

article :--heading + p {
  margin-top: 0;
}

/* becomes */

article h1 + p, article h2 + p, article h3 + p {}
```
#### postcss-calc
``` css
h1 {
  font-size: calc(16px * 2);
  height: calc(100px - 2em);
  width: calc(2*var(--base-width));
  margin-bottom: calc(16px * 1.5);
}
/* 变为 */
h1 {
  font-size: 32px;
  height: calc(100px - 2em);
  width: calc(2*var(--base-width));
  margin-bottom: 24px
}
```

#### postcss-nested
``` css
.phone {
    &_title {
        width: 500px;
        @media (max-width: 500px) {
            width: auto;
        }
        body.is_dark & {
            color: white;
        }
    }
    img {
        display: block;
    }
}

.title {
  font-size: var(--font);

  @at-root html {
      --font: 16px
  }
}

/* 变为 */
.phone_title {
    width: 500px;
}
@media (max-width: 500px) {
    .phone_title {
        width: auto;
    }
}
body.is_dark .phone_title {
    color: white;
}
.phone img {
    display: block;
}

.title {
  font-size: var(--font);
}
html {
  --font: 16px
}
```

#### postcss-nesting
``` css
a, b {
  color: red;

  & c, & d {
    color: white;
  }
}

/* becomes */

a, b {
  color: red;
}

a c, a d, b c, b d {
  color: white;
}
```
#### postcss-custom-properties
PostCSS Color Custom Properties was moved to @csstools/postcss-plugins. ￼
#### postcss-color-function
#### postcss-extend-rule
#### postcss-grid-kiss
#### postcss-simple-vars
