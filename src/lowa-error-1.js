/* global lowa */

/* -----------------------------------------------------------------------------
 * error-1
 * -------------------------------------------------------------------------- */

lowa.register('error-1', function (err) {
  return {
    styles: '.site-loader-error{margin:-7px 0 0 0;padding:0;position:absolute;top:50%;left:0;width:100%;text-align:center;font-size:14px;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;}',
    html: '<p class="site-loader-error">' + err + '</p>'
  }
})
