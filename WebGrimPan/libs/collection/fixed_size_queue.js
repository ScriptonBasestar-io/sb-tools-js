/**
 * @author archmagece@gmail.com
 * size limit 있는 queue
 * FIXME 성능은 고려되지 않음.테스트 및 수정 필요.
 */
function Queue(_sizeLimit){
	this.sizeLimit = _sizeLimit;
}
Queue.prototype = [];
Queue.prototype.enqueue = function(item){
	this.push(item);
	if(this.length > this.sizeLimit){
		this.splice(0,1);
	}
};
Queue.prototype.dequeue = function(){
	if (this.length === 0) return undefined;
	return this.splice(0,1);
};
Queue.prototype.peek = function(){
	return (this[0] ? this[0] : undefined);
};
Queue.prototype.popIdx = function(idx){
	if(this.length < idx){
		return undefined;
	}
	return this.splice(idx);
};

////TEST
//var que = new Queue(3);
//que.enqueue("ddd1");
//que.enqueue("ddd2");
//que.enqueue("ddd3");
//que.enqueue("ddd4");
//
//console.log(que);
//console.log(que.length);
//console.log("========");
//$.each(que, function(e){
//	console.log(e);
//});
//for(var i=0;i<que.length;i++){
//	console.log(que[i]);
//}
//console.log(que.length);
//console.log(que);
//console.log(que.peek());
//console.log(que.length);
//console.log(que.popIdx(2));
//console.log(que);