<h1 align="center">lowa</h1>
<div align="center">
  <p>- Loader · Of · Web · Assets -</p>
  <p>Easy and fast loading indicators for your SPA.</p>
  <div>
  <a href="https://travis-ci.org/jaridmargolin/lowa"><img src="https://travis-ci.org/jaridmargolin/lowa.svg?branch=master" alt="Build Status"></a>
  <a href="https://coveralls.io/github/jaridmargolin/lowa?branch=master"><img src="https://coveralls.io/repos/github/jaridmargolin/lowa/badge.svg?branch=master" alt="Coverage Status"></a>
  <a href="http://standardjs.com/"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
  </div>
  <div>
  <a href="https://npmjs.org/package/lowa"><img src="https://img.shields.io/npm/v/lowa.svg" alt="NPM lowa package"></a>
  <a href="https://david-dm.org/jaridmargolin/lowa"><img src="https://david-dm.org/jaridmargolin/lowa.svg" alt="Dependency Status"></a>
  <a href="https://david-dm.org/jaridmargolin/lowa#info=devDependencies"><img src="https://david-dm.org/jaridmargolin/lowa/dev-status.svg" alt="devDependency Status"></a>
  </div> 
</div>
<br>

lowa is library that makes displaying a loading indicator for your SPA easy and fast. While it comes packaged with prebuilt UI components, it also provides the flexibility to provide your own.

lowa aims to speed up the process of getting a loader rendered on the screen by asynchronously loading styles and fonts that are usually render blocking. The library and accompanying loading indicator is lightweight and intended to be added inline your html document.

### Example Usage

```html
<!-- PREPROCESS TO INLINE SCRIPTS -->
<script src="scripts/lowa.js?__inline=true"></script>
<script src="scripts/lowa-loader-1.js?__inline=true"></script>
<script src="scripts/lowa-error-1.js?__inline=true"></script>
<!-- PREPROCESS TO INLINE SCRIPTS -->

<script>
lowa.show('loader-1');
lowa.load([
  { src: 'fonts.css' },
  { src: 'styles.css', required: true }
], function (err) {
  if (err) {
    lowa.show('error-1', 'Oops. Looks like we are having some difficulties loading the page. Please try again.');
  }
});
</script>
```


## License

The MIT License (MIT) Copyright (c) 2017 Jarid Margolin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
