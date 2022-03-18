import path from 'path';

export const getBase64 = (img: Blob, callback: (fileReaderResult: string | ArrayBuffer) => void) => {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
};

export const getBase64WithPromise = (file: any) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

export const normUploadFile = (e: any) => {
	if (Array.isArray(e)) {
		return e;
	}
	return e && e.fileList;
};

export const getImageSizeFromName = (urlStr: string, zoom: number = 1) => {
	const url = new URL(urlStr);
	const filename = path.basename(url.pathname);
	const size: string[] = filename.match(/-([0-9]*)x([0-9]*)/);

	return {
		width: size ? +size[1] * zoom : 128,
		height: size ? +size[2] * zoom : 128,
	};
};
