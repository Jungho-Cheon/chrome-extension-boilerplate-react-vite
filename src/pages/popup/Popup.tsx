import logo from "@/assets/img/logo.svg";
import { CaptureStartMessage } from "@/src/types/message";

const Popup = () => {
	const handleCaptureButtonClick = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const message: CaptureStartMessage = {
				type: "captureStart",
			};

			console.log("tabs", tabs);
			chrome.tabs.sendMessage(tabs[0].id, message);
		});
	};

	return (
		<div className="w-[420px] p-[20px] flex flex-col">
			<img src={logo} alt="logo" className="h-[32px] mb-[12px]" />

			<button
				className="w-full flex py-[4px] border border-gray-300 rounded-[4px] justify-center items-center hover:bg-gray-100"
				onClick={handleCaptureButtonClick}
			>
				화면내 이미지 캡처
			</button>
		</div>
	);
};

export default Popup;
