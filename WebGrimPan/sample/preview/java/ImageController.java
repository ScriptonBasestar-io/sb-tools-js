package com.buskingplay.web.mobile.main.controller;

import com.buskingplay.core.web.dto.response.AjaxResponse;
import com.buskingplay.web.mobile.base.controller.MobileWebBaseController;
import com.buskingplay.web.mobile.main.dto.response.FileUploadResultDto;
import com.buskingplay.web.mobile.main.service.ImageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * @author archmagece
 * @since 2014-09-12-17
 */
@Slf4j
@Controller
public class ImageController extends MobileWebBaseController {

	@Autowired
	private ImageService imageService;

	@Value(value = "${imageUpload.rootPath}")
//	private String serverRootPath = "D:\\applications\\image\\";
	private String serverRootPath;

	@RequestMapping(value="image/upload", method=RequestMethod.POST)
//	public @ResponseBody Object fileUpload(FileUploadDto fileUploadDto){
	public @ResponseBody Object fileUpload(MultipartHttpServletRequest request){

		Iterator<String> itr =  request.getFileNames();
		MultipartFile mpf;
		AjaxResponse<FileUploadResultDto> ajaxResponse = new AjaxResponse<>();
		ajaxResponse.setAjaxResponseList(new ArrayList<FileUploadResultDto>());

		while(itr.hasNext()){
			mpf = request.getFile(itr.next());
			ajaxResponse.getAjaxResponseList().add(imageService.fileUpload(getMemberId(), mpf, serverRootPath));
		}

		ajaxResponse.setSuccess(true);
		return ajaxResponse;
	}

}
