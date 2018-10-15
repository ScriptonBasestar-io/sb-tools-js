package com.buskingplay.web.mobile.main.service;

import com.buskingplay.domain.model.resource.Image;
import com.buskingplay.domain.repository.resources.ImageRepository;
import com.buskingplay.web.mobile.main.dto.response.FileUploadResultDto;
import com.buskingplay.web.mobile.main.dto.response.FileUploadResultDtoBuilder;
import lombok.extern.slf4j.Slf4j;
import org.imgscalr.Scalr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

/**
 * @author archmagece
 * @since 2014-09-15-15
 */
@Slf4j
@Service
public class ImageService {

	@Autowired
	private ImageRepository imageRepository;

	private void thumbnail(File rawFile, File thumbnailFile) throws IOException {
		BufferedImage img = ImageIO.read(rawFile); // load image

		//Quality indicate that the scaling implementation should do everything
		// create as nice of a result as possible , other options like speed
		// will return result as fast as possible
		//Automatic mode will calculate the resultant dimensions according
		//to image orientation .so resultant image may be size of 50*36.if you want
		//fixed size like 50*50 then use FIT_EXACT
		//other modes like FIT_TO_WIDTH..etc also available.

		BufferedImage thumbImg = Scalr.resize(img, Scalr.Method.QUALITY, Scalr.Mode.AUTOMATIC, 80, 80, Scalr.OP_ANTIALIAS);
		//convert bufferedImage to outpurstream
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		ImageIO.write(thumbImg,"jpg",os);

		ImageIO.write(thumbImg, "jpg", thumbnailFile);
//		System.out.println("time is : " +(System.currentTimeMillis()-startTime));
	}

	private String middlePathString(){
		SimpleDateFormat dateFormat = new SimpleDateFormat("/yyyy/MM/dd");
		return dateFormat.format(new Date());
	}

	public FileUploadResultDto fileUpload(Long accountId, MultipartFile multipartFile, String serverRootPath){
		String middlePathString = middlePathString();
		String[] splits = multipartFile.getOriginalFilename().split("\\.");
		String extension = splits[splits.length-1];
		String uploadFileName = UUID.randomUUID().toString().replace("-","");

		File targetDir = new File(serverRootPath, middlePathString);
		targetDir.mkdirs();
		File uploadFile = new File(targetDir, uploadFileName+"."+extension);
		upload(multipartFile, uploadFile);
		File thumbnaleFile = new File(targetDir, uploadFileName+"-thumb."+extension);
		try {
			thumbnail(uploadFile, thumbnaleFile);
		} catch (IOException e) {
			e.printStackTrace();
		}

		Image image = new Image();
		image.setCreatedBy(accountId);

		image.setName(multipartFile.getOriginalFilename());
//		image.setDescription();
		image.setContentType(multipartFile.getContentType());
		image.setExtension(extension);

		image.setServerFileName(uploadFileName);
		image.setServerFileUrl(middlePathString + "/" + uploadFileName);
		image.setServerFileSize(multipartFile.getSize());

		image.setThumbnailFilename(thumbnaleFile.getName());
		image.setThumbnailFileUrl(middlePathString + "/" + thumbnaleFile.getName());
		image.setThumbnailFileSize(thumbnaleFile.length());

		image = imageRepository.saveAndFlush(image);

		return FileUploadResultDtoBuilder.create().with(image).build();
	}

	/**
	 *
	 * @param file
	 * @param destFile
	 * @return
	 */
	public boolean upload(MultipartFile file, File destFile) {
		boolean result = false;
		if (file != null && !file.isEmpty()) {
			try {
				file.transferTo(destFile);
				result = true;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return result;
	}

	/**
	 * 파일 업로드
	 *
	 * @param file
	 * @param serverFileFullPath
	 * @return
	 */
	public boolean upload(MultipartFile file, String serverFileFullPath) {
		boolean result = false;
		if (file != null && !file.isEmpty()) {
			try {
//				new File(serverRootPath, serverFileName).mkdirs();
				Path path = Paths.get(serverFileFullPath);
				Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
				result = true;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return result;
	}

	/**
	 * 업로드한 파일 삭제
	 *
	 * @param serverFileFullPath
	 * @return
	 */
	public boolean remove(String serverFileFullPath) {
		File file = new File(serverFileFullPath);
		file.delete();
		return true;
	}

}
