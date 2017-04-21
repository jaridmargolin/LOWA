/* eslint-env mocha */
/* global LOWA */
'use strict'

/* -----------------------------------------------------------------------------
 * dependencies
 * -------------------------------------------------------------------------- */

// 3rd party
var $ = require('jquery')
var assert = require('chai').assert

// lib - will all expose via window.LOWA
require('../src/LOWA')
require('../src/LOWA-loader-1.js')
require('../src/LOWA-error-1.js')

/* -----------------------------------------------------------------------------
 * reusable
 * -------------------------------------------------------------------------- */

var resetLOWA = function () {
  LOWA.hide()
  $('style').remove()

  LOWA.views = {}
  LOWA.handlers = []
  delete LOWA.loaded
  delete LOWA.error
}

/* -----------------------------------------------------------------------------
 * test
 * -------------------------------------------------------------------------- */

describe('loading', function () {
  afterEach(function () {
    resetLOWA()
  })

  it('Should load multiple files.', function (done) {
    LOWA.load([
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
    LOWA.load([
      { src: 'base/test/fixtures/stylesheet-1.css', required: true },
      { src: 'base/test/fixtures/stylesheet-3.css', required: true }
    ], function (err) {
      assert.isNotNull(err)
      assert.equal($('style').length, 0)

      done()
    })
  })

  it('Should continue on error of non-required file.', function (done) {
    LOWA.load([
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

    LOWA.ready(handler)
    LOWA.ready(handler)
    LOWA.load([{ src: 'base/test/fixtures/stylesheet-1.css' }])
  })

  it('Should execute ready handler even if called after initial load.', function (done) {
    LOWA.load([{ src: 'base/test/fixtures/stylesheet-1.css' }], function () {
      LOWA.ready(done)
    })
  })

  it('Should rewrite relative urls in stylesheet.', function (done) {
    LOWA.load([{ src: 'base/test/fixtures/stylesheet-1.css' }], function () {
      assert.include($('style')[0].innerHTML, 'base/test/images/background.jpg')
      done()
    })
  })
})

describe('ui', function () {
  beforeEach(function () {
    LOWA.register('view-1', function () {
      return { html: '<div id="view-1"></div>', styles: '.view-1 {}' }
    })

    LOWA.register('view-2', function () {
      return { html: '<div id="view-2"></div>', styles: '.view-2 {}' }
    })
  })
  afterEach(function () {
    resetLOWA()
  })

  it('Should append html and styles of registered views.', function () {
    LOWA.show('view-1')

    assert.ok($('#view-1')[0])
    assert.include($('style')[0].innerHTML, '.view-1')
  })

  it('Should remove all previous ui on showing new view.', function () {
    LOWA.show('view-1')
    LOWA.show('view-2')

    assert.notOk($('#view-1')[0])
    assert.ok($('#view-2')[0])
    assert.include($('style')[0].innerHTML, '.view-2')
  })

  it('Should remove any existing views.', function () {
    LOWA.show('view-1')
    LOWA.hide()

    assert.notOk($('#view-1')[0])
    assert.notOk($('style')[0])
  })
})
