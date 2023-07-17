import { SearchImageMessage } from "@/src/types/message";
import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "SSM_IMAGE_SEARCH",
		title: "신상마켓에서 유사한 이미지 찾기",
		contexts: ["image"],
	});
});
chrome.contextMenus.onClicked.addListener((info) => {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const message: SearchImageMessage = {
			type: "searchImage",
			imageUrl: info.srcUrl,
		};

		chrome.tabs.sendMessage(tabs[0].id, message);
	});
});
