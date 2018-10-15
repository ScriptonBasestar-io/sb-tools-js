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

function inputFileImageLoader(bsFileInputElement, $_previewScreen, jqueryTmplString){
	var files = bsFileInputElement.files;
//	console.log(files)
//	console.log(f)
	var f = files[0];
	var reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			var tmplData = {
				fileTmpPath: e.target.result,
				fileName: theFile.name,
				fileSize: numberWithCommas(humanFileSize(theFile.size, 1024))
			}
			console.log("upload.js inputFileImageLoader", tmplData, $_previewScreen.html());
//			$("#bsUploaderFileListScreenTmpl").tmpl(bsUploader_FileListScreenTmpl, tmplData).appendTo($_bsUploaderPreviewScreen);
			var previewTmplObj = $.tmpl(jqueryTmplString, tmplData).appendTo($_previewScreen);

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

function BsFileUpload(MainFormId, MainFormFileInputWrapperId, BsUploadFormId, BsUploadFileInputWrapperId, BsUploadControllerGroupId, BsUploadPreviewScreenId, imageCnt, bsUploader_FileListScreenTmpl, UploadDirect){
	var mainForm = this.mainForm = $("#"+MainFormId);
	var mainFormFileInputWrapper = this.mainFormFileInputWrapper = $("#"+MainFormFileInputWrapperId)
	var uploadForm = this.uploadForm = $("#"+BsUploadFormId);
	var uploadFileInputWrapper = this.uploadFileInputWrapper = $("#"+BsUploadFileInputWrapperId);
	var previewScreen = this.previewScreen = $("#"+BsUploadPreviewScreenId);
	var uploadControllerGroup = this.uploadControllerGroup = $("#"+BsUploadControllerGroupId);
	var fileListBuffer = this.fileListBuffer = new Queue(imageCnt);
	var fileListScreenTmpl = this.fileListScreenTmpl = bsUploader_FileListScreenTmpl?bsUploader_FileListScreenTmpl:bsUploader_FileListScreenTmplSample;
	var controllerSwitchChecker = this.controllerSwitchChecker = false;
	var uploadDirect = this.uploadDirect = UploadDirect;

	//store default image
	var previewScreenDefaultValue = this.previewScreenDefaultValue = previewScreen.html();

	var self = this;
	var options = {
		beforeSend: function(){
		},
		uploadProgress: function(event, position, total, percentComplete){
		},
		async: false,
		success: function(response){
			console.log("success", response);
			console.log("success", response.ajaxResponseList);
			mainFormFileInputWrapper.empty();
			$.each(response.ajaxResponseList, function(e,t,n){
				//mainForm에 imageId입력.
				mainFormFileInputWrapper.append('<input type="hidden" name="imageId" value="'+t.imageId+'"/>')
			});
			console.log("success", response.ajaxResponseList[0]);
			//console.log("success", response.ajaxResponseList[0].contentType);
			//console.log("success", response.ajaxResponseList[0].imageId);
		},
		complete: function(response){
			//response text from the server.
			console.log("complete", response);
		}
	};
	this.uploadFormData = this.uploadForm.ajaxForm(options);
	this.uploadControllerGroup.find(".add").click(function(e){
//	this.uploadControllerGroup.find(".add").one( "click", function(e){
		e.preventDefault();
		self.add();
	});
	this.uploadControllerGroup.find(".upload").click(function(e){
		e.preventDefault();
		self.upload();
	});
	this.uploadControllerGroup.find(".clear").click(function(e){
		e.preventDefault();
		self.clear();
	});

//	var $_fileInput = this.uploadControllerGroup.find("input");
//	$_fileInput.change(function (evt) {
//
//		$_fileInput.removeAttr("id").attr("name", "file"+uploadFileInputWrapper.find("input").size());
//		var fileInputTmpl2 = $_fileInput.clone();
//		fileListBuffer.enqueue($_fileInput);
//		uploadControllerGroup.prepend(fileInputTmpl2);
//
//		uploadFileInputWrapper.empty();
//
//		$.each(fileListBuffer, function(idx, e){
//			console.log(e)
//			uploadFileInputWrapper.append(e)
//		});
//		console.log("cnt", fileListBuffer.length)
//		if(fileListBuffer.length==0){
//			this.previewScreen.html(this.previewScreenDefaultValue);
//		}
//		previewScreen.empty();
//		$.each(fileListBuffer, function(idx, e) {
//			inputFileImageLoader(e[0], previewScreen, fileListScreenTmpl);
////			inputFileImageLoader(evt.target, previewScreen, fileListScreenTmpl);
//		});
//		console.log(previewScreen.find(".BsPreviewImg").size(), fileListBuffer.sizeLimit);
//		if(previewScreen.find(".BsPreviewImg").size() >= fileListBuffer.sizeLimit){
//			previewScreen.find(".BsPreviewImg")[0].remove();
////			console.log("remove")
//		}
//
//		if(uploadDirect){
//			console.log("upload")
//			self.upload();
//		}
//	});
}
BsFileUpload.prototype.add = function(){
//		var $_fileInput = this.uploadFileInputWrapper.find("#BsUploadFileInputTmpl")
	var fileInputWrapper = this.uploadFileInputWrapper;
	var uploadControllerGroup = this.uploadControllerGroup;
	var $_fileInput = this.uploadControllerGroup.find("input");
	var previewScreen = this.previewScreen;
	var uploadFileInputWrapper = this.uploadFileInputWrapper;
	//var fileListBuffer = this.fileListBuffer;
	//	//이미지 미리 표시해주기
//	var $_fileInput = this.uploadControllerGroup.find("input");
	var fileListBuffer = this.fileListBuffer;
	var fileListScreenTmpl = this.fileListScreenTmpl;
	var uploadDirect = this.uploadDirect;
	var self = this;

	if(fileListBuffer.length==0){
//		previewScreen.empty();
		this.previewScreen.html(this.previewScreenDefaultValue);
	}

////	$_fileInput.change(function (evt) {
//	$_fileInput.unbind( "change" );
//	$_fileInput.one("change", function (evt) {
//
//		$_fileInput.removeAttr("id").attr("name", "file"+fileInputWrapper.find("input").size());
//		var fileInputTmpl2 = $_fileInput.clone();
//		fileListBuffer.enqueue($_fileInput);
//		uploadControllerGroup.prepend(fileInputTmpl2);
//
//		fileInputWrapper.empty();
//
//		$.each(fileListBuffer, function(idx, e){
//			console.log(e)
//			fileInputWrapper.append(e)
//		});
//		console.log(evt.target);
//		inputFileImageLoader(evt.target, previewScreen, fileListScreenTmpl);
//		console.log(previewScreen.find(".BsPreviewImg").size(), fileListBuffer.sizeLimit);
//		if(previewScreen.find(".BsPreviewImg").size() >= fileListBuffer.sizeLimit){
//			previewScreen.find(".BsPreviewImg")[0].remove();
////			console.log("remove")
//		}
//
//		if(uploadDirect){
//			console.log("upload")
//			self.upload();
//		}
//	});
	$_fileInput.unbind( "change" );
	$_fileInput.one("change", function (evt) {
		$_fileInput.removeAttr("id").attr("name", "file"+uploadFileInputWrapper.find("input").size());
		var fileInputTmpl2 = $_fileInput.clone();
		fileListBuffer.enqueue($_fileInput);
		uploadControllerGroup.prepend(fileInputTmpl2);

		uploadFileInputWrapper.empty();

		$.each(fileListBuffer, function(idx, e){
			console.log(e)
			uploadFileInputWrapper.append(e)
		});
		if(fileListBuffer.length==0){
			this.previewScreen.html(this.previewScreenDefaultValue);
		}
		previewScreen.empty();
		$.each(fileListBuffer, function(idx, e) {
			inputFileImageLoader(e[0], previewScreen, fileListScreenTmpl);
//			inputFileImageLoader(evt.target, previewScreen, fileListScreenTmpl);
		});
//		console.log(previewScreen.find(".BsPreviewImg").size(), fileListBuffer.sizeLimit);
		if(previewScreen.find(".BsPreviewImg").size() >= fileListBuffer.sizeLimit){
			previewScreen.find(".BsPreviewImg")[0].remove();
//			console.log("remove")
		}
		if(uploadDirect){
			console.log("upload")
			self.upload();
		}
	});
	$_fileInput.click();
}
BsFileUpload.prototype.upload = function(){
	console.log("업로드 콜콜.")
//	$("#fileSelected").appendTo("#"+mainFormId);
//	var $_fileInput = this.uploadFileInputWrapper.find("input");
//	$.each($_fileInput,function(idx,data){
//		console.log(data.value)
//		console.log(data.value.size)
//	});
	this.uploadForm.submit();
}
BsFileUpload.prototype.clear = function(){
	this.fileListBuffer.clear();
	this.previewScreen.html(this.previewScreenDefaultValue);
	this.uploadFileInputWrapper.empty();
	this.mainFormFileInputWrapper.empty();
}
BsFileUpload.prototype.removeIdx = function(idx){
	this.fileListBuffer.popIdx(idx);
}
BsFileUpload.prototype.controllerSwitch = function(OnOff){
	if(typeof OnOff === "boolean"){
		this.controllerSwitchChecker = OnOff;
	}
	if(this.controllerSwitchChecker == false){
		this.uploadControllerGroup.hide();
		this.controllerSwitchChecker = true;
	}else{
		this.uploadControllerGroup.show();
		this.controllerSwitchChecker = false;
	}
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
