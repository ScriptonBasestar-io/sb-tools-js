/**
 * @author archmagece
 * @since 2014-10-30-17
 * @with WebGrimPan
 */
/**
 * ==================================================================================================================
 * Form 데이터 Ajax 전송관련 기능.
 * ==================================================================================================================
 */
var version = "0.1";

var formAx = function(){
}

formAx.fn = formAx.prototype = {
	formAx: version,
	constructor: formAx,
	selector: ""
}

/**
 * return default formax form settings    for    json parameter such as spring @RequestParam.
 * @returns {{type: string, cache: boolean, dataType: string, processData: boolean, contentType: string}}
 */
formAx.prototype.createAjaxSettings = function(){
	return {
		type: "POST",
		cache: false,
		dataType: "json",
		processData: false,
		contentType: "application/json; charset=utf-8",
		success:function(response, status){
			console.log("formax success :", response, status);
		},
		error:function(request, status, error) {
			console.log("formax error :", request, status, error);
		}
	}
}

/**
 * custom formax request형태가 있는 경우 여기서 작성해서 보내기
 * @param _lang
 * @param _json
 * @returns {{lang: *, requestAt: number, ajaxRequest: *}}
 */
formAx.prototype.createRequestJson = function (_lang, _json){
	return {
		lang: _lang,
		requestAt: new Date().getTime(),
		ajaxRequest: _json
	};
}

/**
 * :text, :password, :checkbox, :radio, :select별로 분류해서 따로 값 받기
 */
formAx.prototype.formDataEachInput = function($form){
	var unindexed_array = [];
	var indexed_array = {};

	unindexed_array = unindexed_array.concat($form.find("input[type='text']").serializeArray());
	unindexed_array = unindexed_array.concat($form.find("input[type='hidden']").serializeArray());
	unindexed_array = unindexed_array.concat($form.find("input[type='password']").serializeArray());
	unindexed_array = unindexed_array.concat($form.find("input[type='radio']").serializeArray());
	unindexed_array = unindexed_array.concat($form.find("textarea").serializeArray());
//	unindexed_array = unindexed_array.concat($form.find("input[type='select']").serializeArray());
	$.each($form.find("input[type='checkbox']").serializeArray(), function(key, val){
		var result;
		result = true;
//		if(val.value == "on"){
//			result = true;
//		}else{
//			result = false;
//		}
		unindexed_array.push({name:val.name, value:result});
	});

	$.map(unindexed_array, function(n, i){
		//TODO 같은 키값이 있을경우 스트링 어펜드 배열로.
		if(n['name'].indexOf("tag_")==0) {
			//tag_로 시작하는것들은 태그 ','로 나눠서 배열로 변경.
			indexed_array[n['name'].substring(4)] = n['value'].split(/[\s,]+/).clean(undefined).clean("");
		}else if(n['name'].indexOf("local_")==0){
			var birth = new Date(n['value']);
			indexed_array[n['name'].substring(6)] = birth.getTime()+(birth.getTimezoneOffset() * 60000);
		}else if(n['name'].indexOf("global_")==0){
			var birth = new Date(n['value']);
			indexed_array[n['name'].substring(7)] = birth.getTime()+(birth.getTimezoneOffset() * 60000);
		}else{
			indexed_array[n['name']] = n['value'];
		}
	});

	return indexed_array;
}

formAx.prototype.getFormData = function ($form){
	var unindexed_array = $form.serializeArray();
	var indexed_array = {};

	$.map(unindexed_array, function(n, i){
		console.log(n, i);
		indexed_array[n['name']] = n['value'];
	});
	return indexed_array;
}

/**
 * type : string : http method type
 * url : string : ajaxActionUrl
 * success : method : successMethod
 * error : method : errorMethod
 * @param settings
 */
formAx.prototype.callAjaxRequestBody = function (settings){
	var settings = settings ? settings : this.createAjaxSettings();
	console.log("show formax json string ", settings)
	// json 데이터를 받는 경우와 formid를 받는 경우.
	if(settings.data){
		settings.data = JSON.stringify(settings.data)
	}else if(settings.formid){
		settings.data = JSON.stringify(this.createRequestJson("ko", this.formDataEachInput($("#"+settings.formid))))
	}
	$.ajax(settings);
}

var formAx = new formAx();