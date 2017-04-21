/* eslint-env mocha */
/* global lowa */
'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
var $ = require('jquery')
var assert = require('chai').assert

// lib - will all expose via window.lowa
require('../src/lowa')
require('../src/lowa-loader-1.js')
require('../src/lowa-error-1.js')

/* -----------------------------------------------------------------------------
 * reusable
 * -------------------------------------------------------------------------- */

var resetlowa = function () {
  lowa.hide()
  $('style').remove()

  lowa.views = {}
  lowa.handlers = []
  delete lowa.loaded
  delete lowa.error
}

/* -----------------------------------------------------------------------------
 * test
 * -------------------------------------------------------------------------- */

describe('loading', function () {
  afterEach(function () {
    resetlowa()
  })

  it('Should load multiple files.', function (done) {
    lowa.load([
      { src: 'base/test/fixtures/stylesheet-1.css', required: true },
      { src: 'base/test/fixtures/stylesheet-2.css', required: true }
    ], function (err) {
      assert.isNull(err)
      assert.equal($('style').length, 2)
      assert.include($('style')[0].innerHTML, 'stylesheet-1')
      assert.include($('style')[1].innerHTML, 'stylesheet-2')

      done()
    })
  })

  it('Should immediately exit on error of required file.', function (done) {
    lowa.load([
      { src: 'base/test/fixtures/stylesheet-1.css', required: true },
      { src: 'base/test/fixtures/stylesheet-3.css', required: true }
    ], function (err) {
      assert.isNotNull(err)
      assert.equal($('style').length, 0)

      done()
    })
  })

  it('Should continue on error of non-required file.', function (done) {
    lowa.load([
      { src: 'base/test/fixtures/stylesheet-1.css', required: true },
      { src: 'base/test/fixtures/stylesheet-3.css' }
    ], function (err) {
      assert.isNull(err)
      assert.equal($('style').length, 1)
      assert.include($('style')[0].innerHTML, 'stylesheet-1')

      done()
    })
  })

  it('Should execute handlers on complete.', function (done) {
    var executed = 0
    var handler = function () {
      executed++
      if (executed === 2) {
        done()
      }
    }

    lowa.ready(handler)
    lowa.ready(handler)
    lowa.load([{ src: 'base/test/fixtures/stylesheet-1.css' }])
  })

  it('Should execute ready handler even if called after initial load.', function (done) {
    lowa.load([{ src: 'base/test/fixtures/stylesheet-1.css' }], function () {
      lowa.ready(done)
    })
  })

  it('Should rewrite relative urls in stylesheet.', function (done) {
    lowa.load([{ src: 'base/test/fixtures/stylesheet-1.css' }], function () {
      assert.include($('style')[0].innerHTML, 'base/test/images/background.jpg')
      done()
    })
  })
})

describe('ui', function () {
  beforeEach(function () {
    lowa.register('view-1', function () {
      return { html: '<div id="view-1"></div>', styles: '.view-1 {}' }
    })

    lowa.register('view-2', function () {
      return { html: '<div id="view-2"></div>', styles: '.view-2 {}' }
    })
  })
  afterEach(function () {
    resetlowa()
  })

  it('Should append html and styles of registered views.', function () {
    lowa.show('view-1')

    assert.ok($('#view-1')[0])
    assert.include($('style')[0].innerHTML, '.view-1')
  })

  it('Should remove all previous ui on showing new view.', function () {
    lowa.show('view-1')
    lowa.show('view-2')

    assert.notOk($('#view-1')[0])
    assert.ok($('#view-2')[0])
    assert.include($('style')[0].innerHTML, '.view-2')
  })

  it('Should remove any existing views.', function () {
    lowa.show('view-1')
    lowa.hide()

    assert.notOk($('#view-1')[0])
    assert.notOk($('style')[0])
  })
})
