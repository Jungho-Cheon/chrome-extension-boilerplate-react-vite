import { Message } from "@/src/types/message";
import { useEffect, useCallback, useState, MouseEventHandler } from "react";

import "@/assets/style/_tailwind.scss";

export default function App() {
	const [capture, setCapture] = useState(false);

	const handler = useCallback(
		(message: Message, sender: chrome.runtime.MessageSender) => {
			console.log("image received", message);
			console.log("sender", sender);

			switch (message.type) {
				case "searchImage": {
					const imageUrl = message.imageUrl;
					window.open(imageUrl);
					break;
				}
				case "captureStart": {
					setCapture(true);
					break;
				}
				default:
					console.error("not defined message type", message);
			}
		},
		[]
	);

	const handleCaptureClick: MouseEventHandler<HTMLDivElement> = (e) => {
		console.log("click");
	};
	const handleContextMenu: MouseEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		setCapture(false);
	};

	useEffect(() => {
		chrome.runtime.onMessage.addListener(handler);
		return () => {
			chrome.runtime.onMessage.removeListener(handler);
		};
	}, []);

	if (capture)
		return (
			<div
				className="z-[9999] top-0 left-0 right-0 bottom-0 bg-gray-900/20 fixed"
				onClick={handleCaptureClick}
				onContextMenu={handleContextMenu}
			></div>
		);

	return <></>;
}
