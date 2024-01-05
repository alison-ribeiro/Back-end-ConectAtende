import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { startConversation } from "../services/startConversation";
import { initializeStartMessages } from "../utils/initializeStartMessages";
import { handleStoreOptions } from "../services/handleStoreOptions";
import { handleMediaMessage } from "../utils/handleMediaMessage";

export interface StartMessages {
	[key: string]: { startMessage: boolean, storeOptions: boolean }
}

let whatsappClient: Client | null = null;
export const initialize = async () => {
	try {
		whatsappClient = new Client({
			authStrategy: new LocalAuth()
		});
		
		whatsappClient.on("qr", (qr: string) => {
			qrcode.generate(qr, {small: true});
		});
		
		whatsappClient.on("ready", () => {
			console.log("whatsappClient is ready!");
		});
		
		
		const startMessages:StartMessages = {};
	

		whatsappClient.on("message_create", async (msg: Message) => {
			const {  to, from, body, fromMe } = msg;
			let numberPhone: string;
			fromMe ? numberPhone = to : numberPhone = from;
	
			if (!startMessages[numberPhone] && !fromMe) {
				initializeStartMessages(startMessages,numberPhone);
			}
			if (startMessages[numberPhone] && !startMessages[numberPhone].startMessage && !fromMe) {
				startConversation(whatsappClient, startMessages, numberPhone);
			} else if (startMessages[numberPhone] && startMessages[numberPhone].storeOptions && !fromMe) {
				handleStoreOptions(startMessages,whatsappClient,numberPhone, body);
			} else {
				handleMediaMessage(msg, numberPhone);
			}
		});
	




		// whatsappClient.on("message_create", async (msg: Message) => {

		// 	const { hasMedia,mediaKey,to ,from, body, fromMe, id: { _serialized: idMessage } } = msg;

		// 	let numberPhone: string ;
		// 	fromMe ? numberPhone = to : numberPhone = from;
			

		// 	if (!startMessages[numberPhone]	&& !fromMe) {
		// 		startMessages[numberPhone] = { startMessage: false, storeOptions: false };
		// 	}
			
		// 	if (startMessages[numberPhone] && !startMessages[numberPhone].startMessage && !fromMe) {
		// 		startMessages[numberPhone] = { startMessage: true, storeOptions: true };
		// 		startingConversation(whatsappClient, numberPhone);
		// 	} else 
		// 		if (startMessages[numberPhone] && startMessages[numberPhone].storeOptions && !fromMe) {
		// 			if (stores[body]) {
		// 				whatsappClient?.sendMessage(numberPhone, `Transferindo mensagem para loja ${stores[body]}`);
		// 				startMessages[numberPhone].storeOptions = false;
		// 			} else {
		// 				whatsappClient?.sendMessage(numberPhone, "Opção inválida");
		// 			}
		// 		} else{
		// 			if (hasMedia && mediaKey) {
		// 				const mediafile = await msg.downloadMedia();
		// 				let dir;
		// 				let filename;
		// 				if (mediafile.mimetype.startsWith("audio/")) {
		// 					dir = "./public/audios";
		// 					filename = `audio-${new Date().getTime()}.mp3`;
		// 				} else {
		// 					dir = "./public/images";
		// 					filename = `image-${new Date().getTime()}.jpg`;
		// 				}

		// 				if (!fs.existsSync(dir)){
		// 					fs.mkdirSync(dir, { recursive: true });
		// 				}
		// 				const filePath = path.join(dir, filename);
		// 				fs.writeFile(filePath, mediafile.data, "base64", (err) => {
		// 					if (err) {
		// 						console.log(err);
		// 					} else {
		// 						console.log("Mídia baixada com sucesso!");
		// 					}
		// 				});
		// 				if(!fromMe)
		// 					registerMessage(numberPhone, filePath, idMessage);
		// 				else
		// 					registerMessage(numberPhone, filePath, idMessage, "attendant");

		// 			}else{
		// 				if(!fromMe)
		// 					registerMessage(numberPhone, body, idMessage);
		// 				else
		// 					registerMessage(numberPhone, body, idMessage, "attendant");
		// 			}
		// 		}	
		// });
	
		whatsappClient.initialize();

	} catch  {
		console.log("Erro ao inicializar whatssap");
	}
};

export const getWhatsAppClient = () => {
	if (!whatsappClient) {
		throw new Error("WhatsApp client not initialized");
	}
	return whatsappClient;
};