/**
 * @author archmagece
 * @since 2014-10-30-17
 * @with WebGrimPan
 */
/**
 * 기본 Array 추가 메서드
 *
 *  Array 의 모든 값을 비교해서 deleteValue와 같은 값을 삭제.
 * @param deleteValue
 * @returns {Array}
 */
Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};