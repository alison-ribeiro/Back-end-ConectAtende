import { Message } from "whatsapp-web.js";
import fs from "fs";
import path from "path";
import { registerMessage } from "../services/registerMessageDB";

export async function handleMediaMessage(msg: Message, numberPhone: string ) {
	const { hasMedia, mediaKey, body, fromMe, id: { _serialized: idMessage } } = msg;

	if (hasMedia && mediaKey) {
		const mediafile = await msg.downloadMedia();
		let dir;
		let filename;
		if (mediafile.mimetype.startsWith("audio/")) {
			dir = "./public/audios";
			filename = `audio-${new Date().getTime()}.mp3`;
		} else {
			dir = "./public/images";
			filename = `image-${new Date().getTime()}.jpg`;
		}

		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		const filePath = path.join(dir, filename);
		fs.writeFile(filePath, mediafile.data, "base64", (err) => {
			if (err) {
				console.log(err);
			} else {
				console.log("Mídia baixada com sucesso!");
			}
		});
		
		fromMe 
			? registerMessage(numberPhone, filePath, idMessage, "attendant", msg.body ? msg.body : undefined) 
			: registerMessage(numberPhone, filePath, idMessage, "attendant", msg.body ? msg.body : undefined);
	}else{
		fromMe ? registerMessage(numberPhone, body, idMessage, "attendant") :  registerMessage(numberPhone, body, idMessage);
	}
}