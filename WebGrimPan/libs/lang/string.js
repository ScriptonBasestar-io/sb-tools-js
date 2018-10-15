/**
 * @author archmagece
 * @since 2014-11-18-17
 * @with WebGrimPan
 */
String.prototype.splice = function( idx, rem, s ) {
	return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};