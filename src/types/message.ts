/**
 * 이미지 검색 메세지
 */
export type SearchImageMessage = {
	type: "searchImage";
	/**
	 * contextMenu로 img 태그의 이미지 선택시: URL
	 * 화면내 이미지 캡처시: Base64
	 */
	imageUrl: string;
};

/**
 * 이미지 캡처 시작 메세지
 */
export type CaptureStartMessage = {
	type: "captureStart";
};

export type Message = SearchImageMessage | CaptureStartMessage;
