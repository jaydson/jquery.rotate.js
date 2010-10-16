/*
 * rotate: A jQuery cssHooks adding a cross browser 'rotate' property to $.fn.css() and $.fn.animate()
 *
 * Copyright (c) 2010 Louis-Rémi Babé
 * Licensed under the MIT license.
 * 
 * This saved you an hour of work? 
 * Send me music http://www.amazon.fr/wishlist/HNTU0468LQON
 *
 */
(function($) {
  
var div = document.createElement('div'),
  divStyle = div.style,
  support = $.support,
  rmatrixFilter = /M\d{2}=([\d+.\-]+)/g;

support.transform = 
  divStyle.MozTransform === ''? 'MozTransform' :
  (divStyle.WebkitTransform === ''? 'WebkitTransform' : 
  (divStyle.OTransform === ''? 'OTransform' :
  false));
support.matrixFilter = !support.transform && divStyle.filter === '';

$.cssNumber.rotate = true;
$.cssHooks.rotate = {
  set: function( elem, value, animate ) {
    var _support = support,
      supportTransform = _support.transform,
      rad, cos, sin,
      centerOrigin;
    
    if (typeof value === 'string') {
      value = toRadian(value);
    }
    $.data( elem, 'transform', {
      rotate: value
    });
    
    if (supportTransform) {
      elem.style[supportTransform] = 'rotate('+ value +'rad)';
      
    } else if (_support.matrixFilter) {
      rad = toRadian(value);
      cos = Math.cos(rad);
      sin = Math.sin(rad);
      elem.style.filter = [
        "progid:DXImageTransform.Microsoft.Matrix(",
          "M11="+cos+",",
          "M12="+(-sin)+",",
          "M21="+sin+",",
          "M22="+cos+",",
          "SizingMethod='auto expand'",
        ")"
      ].join('');
      
      centerOrigin = $.rotate.centerOrigin;
      if(centerOrigin && !animate) {
        elem.style[centerOrigin == 'margin' ? 'marginLeft' : 'left'] = -(elem.offsetWidth/2) + (elem.clientWidth/2) + "px";
        elem.style[centerOrigin == 'margin' ? 'marginTop' : 'top'] = -(elem.offsetHeight/2) + (elem.clientHeight/2) + "px";
      }
    }
  },
  get: function( elem, computed ) {
    var transform = $.data( elem, 'transform' );
    return transform && transform.rotate?
      // Make sure the value is always between 0 and 2PI
      (transform.rotate + (transform.rotate < 0? 2*Math.PI : 0))%(2*Math.PI) :
      0;
  }
}
$.fx.step.rotate = function( fx ) {
  $.cssHooks.rotate.set( fx.elem, fx.now+fx.unit, true );
}

function radToDeg( rad ) {
  return rad * 180 / Math.PI;
}
function toRadian(value) {
  if(value.indexOf("deg") != -1) {
    return parseInt(value,10) * (Math.PI * 2 / 360);
  } else if (value.indexOf("grad") != -1) {
    return parseInt(value,10) * (Math.PI/200);
  } else {
    return parseFloat(value,10);
  }
}

$.rotate = {
  centerOrigin: 'margin',
  radToDeg: radToDeg
};
  
})(jQuery);