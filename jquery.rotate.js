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
support.matrixFilter = !support.tranfsorm && divStyle.filter === '';

$.cssNumber.rotate = true;
$.cssHooks.rotate = {
  set: function( elem, value, animate ) {
    var _support = support,
      supportTransform = _support.transform,
      rad, cos, sin,
      centerOrigin;
    if (supportTransform) {
      elem.style[supportTransform] = 'rotate('+ value +'deg)';
      
    } else if (_support.matrixFilter) {
      rad = degToRad(value);
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
      
      centerOrigin = $.transform.centerOrigin;
      if(centerOrigin && !animate) {
        elem.style[centerOrigin == 'margin' ? 'marginLeft' : 'left'] = -(elem.offsetWidth/2) + (elem.clientWidth/2) + "px";
        elem.style[centerOrigin == 'margin' ? 'marginTop' : 'top'] = -(elem.offsetHeight/2) + (elem.clientHeight/2) + "px";
      }
    }
    $.data( elem, 'transform', {
      rotate: value
    });
  },
  get: function( elem, computed ) {
    var transform = $.data( elem, 'transform' );
    return transform && transform.rotate?
      (transform.rotate + (transform.rotate < 0? 360 : 0))%360 :
      0;
  }
}
$.fx.step.rotate = function( fx ) {
  $.cssHooks.rotate.set( fx.elem, fx.now, true );
}

function degToRad( deg ) {
  return deg / 180 * Math.PI;
}
function radToDeg( rad ) {
  return rad * 180 / Math.PI;
}

$.transform = {
  centerOrigin: 'margin'
};
  
})(jQuery);