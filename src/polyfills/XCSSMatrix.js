// XCSSMatrix polyfill
// https://github.com/jfsiii/XCSSMatrix
(function(e){if("function"==typeof bootstrap)bootstrap("xcssmatrix",e);else if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeXCSSMatrix=e}else"undefined"!=typeof window?window.XCSSMatrix=e():global.XCSSMatrix=e()})(function(){var e,t,n,r,i;return function(e,t,n){function r(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(i)return i(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var i=e[n][1][t];return r(i?i:t)},u,u.exports)}return t[n].exports}var i=typeof require=="function"&&require;for(var s=0;s<n.length;s++)r(n[s]);return r}({1:[function(e,t,n){var r=e("./lib/XCSSMatrix.js");t.exports=r},{"./lib/XCSSMatrix.js":2}],2:[function(e,t,n){function i(e){this.m11=this.m22=this.m33=this.m44=1;this.m12=this.m13=this.m14=this.m21=this.m23=this.m24=this.m31=this.m32=this.m34=this.m41=this.m42=this.m43=0;if(typeof e==="string"){this.setMatrixValue(e)}}function u(e){return String.fromCharCode(e+97)}function a(e){return"m"+(Math.floor(e/4)+1)+(e%4+1)}function l(e){return e.value}function c(e){return f[e]}function h(e){if(e.units==="rad"){e.value=r.angles.rad2deg(e.value);e.units="deg"}else if(e.units==="grad"){e.value=r.angles.grad2deg(e.value);e.units="deg"}return e}function p(e,t){t.value=t.value.map(h);var n=c(t.key);var r=n(e,t);return r||e}function d(e){var t=r.transp.stringToStatements(e);if(t.length===1&&/^matrix/.test(e)){return e}var n=r.funcs.onlyFirstArg(r.transp.statementToObject);var s=t.map(n);var o=new i;var u=s.reduce(p,o);var a=u.toString();return a}var r={angles:e("./utils/angle"),matrix:e("./utils/matrix"),transp:e("./utils/cssTransformString"),funcs:{onlyFirstArg:function(e,t){t=t||this;return function(n){return e.call(t,n)}}}};i.displayName="XCSSMatrix";var s=["a","b","c","d","e","f"];var o=["m11","m12","m13","m14","m21","m22","m23","m24","m31","m32","m33","m34","m41","m42","m43","m44"];[["m11","a"],["m12","b"],["m21","c"],["m22","d"],["m41","e"],["m42","f"]].forEach(function(e){var t=e[0],n=e[1];Object.defineProperty(i.prototype,n,{set:function(e){this[t]=e},get:function(){return this[t]},enumerable:true,configurable:true})});i.prototype.multiply=function(e){return r.matrix.multiply(this,e)};i.prototype.inverse=function(){return r.matrix.inverse(this)};i.prototype.rotate=function(e,t,n){if(typeof e!=="number"||isNaN(e))e=0;if((typeof t!=="number"||isNaN(t))&&(typeof n!=="number"||isNaN(n))){n=e;e=0;t=0}if(typeof t!=="number"||isNaN(t))t=0;if(typeof n!=="number"||isNaN(n))n=0;e=r.angles.deg2rad(e);t=r.angles.deg2rad(t);n=r.angles.deg2rad(n);var s=new i,o=new i,u=new i,a,f,l;n/=2;a=Math.sin(n);f=Math.cos(n);l=a*a;u.m11=u.m22=1-2*l;u.m12=u.m21=2*a*f;u.m21*=-1;t/=2;a=Math.sin(t);f=Math.cos(t);l=a*a;o.m11=o.m33=1-2*l;o.m13=o.m31=2*a*f;o.m13*=-1;e/=2;a=Math.sin(e);f=Math.cos(e);l=a*a;s.m22=s.m33=1-2*l;s.m23=s.m32=2*a*f;s.m32*=-1;var c=new i;var h=this.toString()===c.toString();var p=h?u.multiply(o).multiply(s):this.multiply(s).multiply(o).multiply(u);return p};i.prototype.rotateAxisAngle=function(e,t,n,s){if(typeof e!=="number"||isNaN(e))e=0;if(typeof t!=="number"||isNaN(t))t=0;if(typeof n!=="number"||isNaN(n))n=0;if(typeof s!=="number"||isNaN(s))s=0;if(e===0&&t===0&&n===0)n=1;s=(r.angles.deg2rad(s)||0)/2;var o=new i,u=Math.sqrt(e*e+t*t+n*n),a=Math.cos(s),f=Math.sin(s),l=f*f,c=f*a,h=function(e){return parseFloat(e.toFixed(6))},p,d,v;if(u===0){e=0;t=0;n=1}else if(u!==1){e/=u;t/=u;n/=u}if(e===1&&t===0&&n===0){o.m22=o.m33=1-2*l;o.m23=o.m32=2*c;o.m32*=-1}else if(e===0&&t===1&&n===0){o.m11=o.m33=1-2*l;o.m13=o.m31=2*c;o.m13*=-1}else if(e===0&&t===0&&n===1){o.m11=o.m22=1-2*l;o.m12=o.m21=2*c;o.m21*=-1}else{p=e*e;d=t*t;v=n*n;o.m11=h(1-2*(d+v)*l);o.m12=h(2*(e*t*l+n*c));o.m13=h(2*(e*n*l-t*c));o.m21=h(2*(e*t*l-n*c));o.m22=h(1-2*(p+v)*l);o.m23=h(2*(t*n*l+e*c));o.m31=h(2*(e*n*l+t*c));o.m32=h(2*(t*n*l-e*c));o.m33=h(1-2*(p+d)*l)}return this.multiply(o)};i.prototype.scale=function(e,t,n){var r=new i;if(typeof e!=="number"||isNaN(e))e=1;if(typeof t!=="number"||isNaN(t))t=e;if(typeof n!=="number"||isNaN(n))n=1;r.m11=e;r.m22=t;r.m33=n;return this.multiply(r)};i.prototype.skewX=function(e){var t=r.angles.deg2rad(e);var n=new i;n.c=Math.tan(t);return this.multiply(n)};i.prototype.skewY=function(e){var t=r.angles.deg2rad(e);var n=new i;n.b=Math.tan(t);return this.multiply(n)};i.prototype.translate=function(e,t,n){var r=new i;if(typeof e!=="number"||isNaN(e))e=0;if(typeof t!=="number"||isNaN(t))t=0;if(typeof n!=="number"||isNaN(n))n=0;r.m41=e;r.m42=t;r.m43=n;return this.multiply(r)};i.prototype.setMatrixValue=function(e){var t=d(e.trim());var n=r.transp.statementToObject(t);if(!n)return;var i=n.key===r.transp.matrixFn3d;var s=i?a:u;var o=n.value;var f=o.length;if(i&&f!==16||!(i||f===6))return;o.forEach(function(e,t){var n=s(t);this[n]=e.value},this)};i.prototype.toString=function(){var e,t;if(r.matrix.isAffine(this)){t=r.transp.matrixFn2d;e=s}else{t=r.transp.matrixFn3d;e=o}return t+"("+e.map(function(e){return this[e].toFixed(6)},this).join(", ")+")"};var f={matrix:function(e,t){var n=new i(t.unparsed);return e.multiply(n)},matrix3d:function(e,t){var n=new i(t.unparsed);return e.multiply(n)},perspective:function(e,t){var n=new i;n.m34-=1/t.value[0].value;return e.multiply(n)},rotate:function(e,t){return e.rotate.apply(e,t.value.map(l))},rotate3d:function(e,t){return e.rotateAxisAngle.apply(e,t.value.map(l))},rotateX:function(e,t){return e.rotate.apply(e,[t.value[0].value,0,0])},rotateY:function(e,t){return e.rotate.apply(e,[0,t.value[0].value,0])},rotateZ:function(e,t){return e.rotate.apply(e,[0,0,t.value[0].value])},scale:function(e,t){return e.scale.apply(e,t.value.map(l))},scale3d:function(e,t){return e.scale.apply(e,t.value.map(l))},scaleX:function(e,t){return e.scale.apply(e,t.value.map(l))},scaleY:function(e,t){return e.scale.apply(e,[0,t.value[0].value,0])},scaleZ:function(e,t){return e.scale.apply(e,[0,0,t.value[0].value])},skew:function(e,t){var n=new i("skewX("+t.value[0].unparsed+")");var r=new i("skewY("+(t.value[1]&&t.value[1].unparsed||0)+")");var s="matrix(1.00000, "+r.b+", "+n.c+", 1.000000, 0.000000, 0.000000)";var o=new i(s);return e.multiply(o)},skewX:function(e,t){return e.skewX.apply(e,[t.value[0].value])},skewY:function(e,t){return e.skewY.apply(e,[t.value[0].value])},translate:function(e,t){return e.translate.apply(e,t.value.map(l))},translate3d:function(e,t){return e.translate.apply(e,t.value.map(l))},translateX:function(e,t){return e.translate.apply(e,[t.value[0].value,0,0])},translateY:function(e,t){return e.translate.apply(e,[0,t.value[0].value,0])},translateZ:function(e,t){return e.translate.apply(e,[0,0,t.value[0].value])}};t.exports=i},{"./utils/angle":3,"./utils/matrix":4,"./utils/cssTransformString":5}],4:[function(e,t,n){function r(e,t,n,r){return e*r-t*n}function i(e,t,n,i,s,o,u,a,f){return e*r(s,o,a,f)-i*r(t,n,a,f)+u*r(t,n,s,o)}function s(e){var t=e,n=t.m11,r=t.m21,s=t.m31,o=t.m41,u=t.m12,a=t.m22,f=t.m32,l=t.m42,c=t.m13,h=t.m23,p=t.m33,d=t.m43,v=t.m14,m=t.m24,g=t.m34,y=t.m44;return n*i(a,h,m,f,p,g,l,d,y)-r*i(u,c,v,f,p,g,l,d,y)+s*i(u,c,v,a,h,m,l,d,y)-o*i(u,c,v,a,h,m,f,p,g)}function o(e){return e.m13===0&&e.m14===0&&e.m23===0&&e.m24===0&&e.m31===0&&e.m32===0&&e.m33===1&&e.m34===0&&e.m43===0&&e.m44===1}function u(e){var t=e;return t.m11===1&&t.m12===0&&t.m13===0&&t.m14===0&&t.m21===0&&t.m22===1&&t.m23===0&&t.m24===0&&t.m31===0&&t.m31===0&&t.m33===1&&t.m34===0&&t.m44===1}function a(e){var t=e,n=new e.constructor,r=t.m11,s=t.m12,o=t.m13,u=t.m14,a=t.m21,f=t.m22,l=t.m23,c=t.m24,h=t.m31,p=t.m32,d=t.m33,v=t.m34,m=t.m41,g=t.m42,y=t.m43,b=t.m44;n.m11=i(f,p,g,l,d,y,c,v,b);n.m21=-i(a,h,m,l,d,y,c,v,b);n.m31=i(a,h,m,f,p,g,c,v,b);n.m41=-i(a,h,m,f,p,g,l,d,y);n.m12=-i(s,p,g,o,d,y,u,v,b);n.m22=i(r,h,m,o,d,y,u,v,b);n.m32=-i(r,h,m,s,p,g,u,v,b);n.m42=i(r,h,m,s,p,g,o,d,y);n.m13=i(s,f,g,o,l,y,u,c,b);n.m23=-i(r,a,m,o,l,y,u,c,b);n.m33=i(r,a,m,s,f,g,u,c,b);n.m43=-i(r,a,m,s,f,g,o,l,y);n.m14=-i(s,f,p,o,l,d,u,c,v);n.m24=i(r,a,h,o,l,d,u,c,v);n.m34=-i(r,a,h,s,f,p,u,c,v);n.m44=i(r,a,h,s,f,p,o,l,d);return n}function f(e){var t;if(u(e)){t=new e.constructor;if(!(e.m41===0&&e.m42===0&&e.m43===0)){t.m41=-e.m41;t.m42=-e.m42;t.m43=-e.m43}return t}var n=a(e);var r=s(e);if(Math.abs(r)<1e-8)return null;for(var i=1;i<5;i++){for(var o=1;o<5;o++){n["m"+i+o]/=r}}return n}function l(e,t){if(!t)return null;var n=t,r=e,i=new e.constructor;i.m11=n.m11*r.m11+n.m12*r.m21+n.m13*r.m31+n.m14*r.m41;i.m12=n.m11*r.m12+n.m12*r.m22+n.m13*r.m32+n.m14*r.m42;i.m13=n.m11*r.m13+n.m12*r.m23+n.m13*r.m33+n.m14*r.m43;i.m14=n.m11*r.m14+n.m12*r.m24+n.m13*r.m34+n.m14*r.m44;i.m21=n.m21*r.m11+n.m22*r.m21+n.m23*r.m31+n.m24*r.m41;i.m22=n.m21*r.m12+n.m22*r.m22+n.m23*r.m32+n.m24*r.m42;i.m23=n.m21*r.m13+n.m22*r.m23+n.m23*r.m33+n.m24*r.m43;i.m24=n.m21*r.m14+n.m22*r.m24+n.m23*r.m34+n.m24*r.m44;i.m31=n.m31*r.m11+n.m32*r.m21+n.m33*r.m31+n.m34*r.m41;i.m32=n.m31*r.m12+n.m32*r.m22+n.m33*r.m32+n.m34*r.m42;i.m33=n.m31*r.m13+n.m32*r.m23+n.m33*r.m33+n.m34*r.m43;i.m34=n.m31*r.m14+n.m32*r.m24+n.m33*r.m34+n.m34*r.m44;i.m41=n.m41*r.m11+n.m42*r.m21+n.m43*r.m31+n.m44*r.m41;i.m42=n.m41*r.m12+n.m42*r.m22+n.m43*r.m32+n.m44*r.m42;i.m43=n.m41*r.m13+n.m42*r.m23+n.m43*r.m33+n.m44*r.m43;i.m44=n.m41*r.m14+n.m42*r.m24+n.m43*r.m34+n.m44*r.m44;return i}function c(e){var t=new e.constructor;var n=4,r=4;var i=r,s;while(i){s=n;while(s){t["m"+i+s]=e["m"+s+i];s--}i--}return t}t.exports={determinant2x2:r,determinant3x3:i,determinant4x4:s,isAffine:o,isIdentityOrTranslation:u,adjoint:a,inverse:f,multiply:l}},{}],3:[function(e,t,n){function r(e){return e*Math.PI/180}function i(e){return e*(180/Math.PI)}function s(e){return e/(400/360)}t.exports={deg2rad:r,rad2deg:i,grad2deg:s}},{}],5:[function(e,t,n){function r(e){var t=/([\-\+]?[0-9]+[\.0-9]*)(deg|rad|grad|px|%)*/;var n=e.match(t)||[];return{value:parseFloat(n[1]),units:n[2],unparsed:e}}function i(e,t){var n=/(\w+)\(([^\)]+)\)/i;var i=e.toString().match(n).slice(1);var s=i[0];var o=i[1].split(/, ?/);var u=!t&&o.map(r);return{key:s,value:u||o,unparsed:e}}function s(e){var t=/(\w+)\([^\)]+\)/ig;var n=e.match(t)||[];return n}t.exports={matrixFn2d:"matrix",matrixFn3d:"matrix3d",valueToObject:r,statementToObject:i,stringToStatements:s}},{}]},{},[1])(1)});