/**
 * @author archmagece
 * @since 2014-09-19-13
 * @with WebGrimPan
 */
//use jquery
//use jquery.ajaxForm
//use jquery.tmpl

/**
 * 초기화
 */
var bsUploader_FileListScreenTmplSample =
	'<div>\
		<canvas src="${fileTmpPath}" title="${fileName}" width="100" height="100" ></canvas>\
		<p>${fileName}</p>\
		<p>${fileSize}</p>\
	</div>'
var bsUploader_FileListScreenTmplSample2 =
	'<div>\
		<img src="${fileTmpPath}" title="${fileName}" width="100" height="100" />\
		<p>${fileName}</p>\
		<p>${fileSize}</p>\
	</div>'
function inputFileImageLoader(bsFileInputElement, $_bsUploaderPreviewScreen, _bsUploader_FileListScreenTmpl){
	var files = bsFileInputElement.files;
	var f = files[0];
	var reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			var tmplData = {
				fileTmpPath: e.target.result,
				fileName: theFile.name,
				fileSize: numberWithCommas(humanFileSize(theFile.size, 1024))
			}
//			$("#bsUploaderFileListScreenTmpl").tmpl(bsUploader_FileListScreenTmpl, tmplData).appendTo($_bsUploaderPreviewScreen);
			var previewTmplObj = $.tmpl(_bsUploader_FileListScreenTmpl, tmplData).appendTo($_bsUploaderPreviewScreen);

//			var canvas = document.getElementById('myCanvas');
			var canvas = previewTmplObj.find("canvas")[0]
			if(canvas){
				var context = canvas.getContext('2d');
				var imageObj = new Image();

				imageObj.onload = function() {
					context.drawImage(imageObj, 0, 0, 100, 100);
				};
				imageObj.src = e.target.result;
			}
		};
	})(f);
	reader.readAsDataURL(f);
}

function BsFileUpload(MainFormId, MainFormFileInputWrapperId, BsUploadFormId, BsUploadFileInputWrapperId, BsUploadControllerGroupId, BsUploadPreviewScreenId, imageCnt, bsUploader_FileListScreenTmpl){
	var mainForm = this.mainForm = $("#"+MainFormId);
	var mainFormFileInputWrapper = this.mainFormFileInputWrapper = $("#"+MainFormFileInputWrapperId)
	var uploadForm = this.uploadForm = $("#"+BsUploadFormId);
	var fileInputWrapper = this.fileInputWrapper = $("#"+BsUploadFileInputWrapperId);
	var previewScreen = this.previewScreen = $("#"+BsUploadPreviewScreenId);
	var uploadControllerGroup = this.uploadControllerGroup = $("#"+BsUploadControllerGroupId);
	var fileListBuffer = this.fileListBuffer = new Queue(imageCnt);
	var fileListScreenTmpl = this.fileListScreenTmpl = bsUploader_FileListScreenTmpl?bsUploader_FileListScreenTmpl:bsUploader_FileListScreenTmplSample;

	var self = this;
	var options = {
		beforeSend: function(){
		},
		uploadProgress: function(event, position, total, percentComplete){
		},
		success: function(response){
			console.log("success", response);
			console.log("success", response.ajaxResponseList);
			//TODO formax form으로 이미지를 전송해서 저장하고 그 결과값을 받아서 현재 페이지에서 추가적으로 처리
			$.each(response.ajaxResponseList, function(e,t,n){
				//mainForm에 imageId입력.
				mainFormFileInputWrapper.append('<input type="hidden" name="imageId" value="'+t.imageId+'"/>')
			});
			console.log("success", response.ajaxResponseList[0]);
			console.log("success", response.ajaxResponseList[0].contentType);
			console.log("success", response.ajaxResponseList[0].imageId);
		},
		complete: function(response){
			//response text from the server.
			console.log("complete", response);
		}
	};
	this.uploadFormData = this.uploadForm.ajaxForm(options);
	this.uploadControllerGroup.find(".add").click(function(){
		self.add();
	});
	this.uploadControllerGroup.find(".upload").click(function(){
		self.upload();
	});
	this.uploadControllerGroup.find(".clear").click(function(){
		self.clear();
	});
}
BsFileUpload.prototype.add = function(){
//		var $_fileInput = this.fileInputWrapper.find("#BsUploadFileInputTmpl")
	var fileInputWrapper = this.fileInputWrapper;
	var uploadControllerGroup = this.uploadControllerGroup;
	var previewScreen = this.previewScreen;
	var fileListBuffer = this.fileListBuffer;
	//	//이미지 미리 표시해주기
	var $_fileInput = this.uploadControllerGroup.find("input");
	var fileListBuffer = this.fileListBuffer;
	var fileListScreenTmpl = this.fileListScreenTmpl;
	if(fileListBuffer.length==0){
		previewScreen.empty();
	}
	$_fileInput.change(function (evt) {
		$_fileInput.removeAttr("id").attr("name", "file"+fileInputWrapper.find("input").size());
		var fileInputTmpl2 = $_fileInput.clone();
		fileListBuffer.enqueue($_fileInput);
		uploadControllerGroup.prepend(fileInputTmpl2);
		fileInputWrapper.empty();
		$.each(fileListBuffer, function(idx, e){
			console.log(e)
			fileInputWrapper.append(e)
		});
		inputFileImageLoader(evt.target, previewScreen, fileListScreenTmpl);
		if(previewScreen.find(".BsPreviewImg").size() >= fileListBuffer.sizeLimit){
			previewScreen.find(".BsPreviewImg")[0].remove();
//			console.log("remove")
		}
	});
	$_fileInput.click();
}
BsFileUpload.prototype.upload = function(){
//	$("#fileSelected").appendTo("#"+mainFormId);
//	var $_fileInput = this.fileInputWrapper.find("input");
//	$.each($_fileInput,function(idx,data){
//		console.log(data.value)
//		console.log(data.value.size)
//	});
	this.uploadForm.submit();
}
BsFileUpload.prototype.clear = function(){
	this.previewScreen.empty();
	this.fileInputWrapper.empty();
	this.mainFormFileInputWrapper.empty();
}
BsFileUpload.prototype.removeIdx = function(idx){
	this.fileListBuffer.popIdx(idx);
}

/**
 * 태그에 html추가
 * @param tagName
 * @param innerHTML
 */
function appendHtmlIntoTag(tagName, innerHTML) {
	var elm;

	elm = document.createElement(tagName);
	elm.innerHTML = innerHTML;
	document.body.appendChild(elm);
}

/**
 * 파일용량 보기 편하게 변경
 * @param bytes
 * @param si
 * @returns {string}
 */
function humanFileSize(bytes, si) {
	var thresh = si ? 1000 : 1024;
	if(bytes < thresh) return bytes + ' B';
	var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
	var u = -1;
	do {
		bytes /= thresh;
		++u;
	} while(bytes >= thresh);
	return bytes.toFixed(1)+' '+units[u];
}

/**
 * 숫자에 콤마 넣어주기
 * @param x
 * @returns {string}
 */
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
