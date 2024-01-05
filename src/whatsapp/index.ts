import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { startingConversation } from "./startingConversation";
import { registerMessage } from "../services/registerMessageDB";
import { stores } from "../mocks/stores";
import fs from "fs";
import path from "path";

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
		interface StartMessages {
			[key: string]: { startMessage: boolean, storeOptions: boolean }
		}
		
		const startMessages:StartMessages = {};
	
		whatsappClient.on("message_create", async (msg: Message) => {
			
			const { hasMedia,mediaKey,to ,from, body, fromMe, id: { _serialized: idMessage } } = msg;

			let numberPhone: string ;
			if(fromMe){
				numberPhone = to;
			}else{
				numberPhone = from;
			}

			if (!startMessages[numberPhone]
				&& !fromMe) {
				startMessages[numberPhone] = { startMessage: false, storeOptions: false };
			}
			
			if (!startMessages[numberPhone].startMessage && !fromMe) {
				startMessages[numberPhone] = { startMessage: true, storeOptions: true };
				console.log(startMessages);
				if (whatsappClient === null) {
					console.error("WhatsApp client is not initialized");
					return;
				}
				startingConversation(whatsappClient, numberPhone);
	
			} else if (startMessages[numberPhone]?.storeOptions && !fromMe) {
				if (whatsappClient === null) {
					console.error("WhatsApp client is not initialized");
					return;
				}
				if (stores[body]) {
					whatsappClient.sendMessage(numberPhone, `Transferindo mensagem para loja ${stores[body]}`);
					startMessages[numberPhone].storeOptions = false;
				} else {
					whatsappClient.sendMessage(numberPhone, "Opção inválida");
				}
			} else if (fromMe) {
				registerMessage(numberPhone, body, idMessage, "attendant");
			} else {
				if (hasMedia && mediaKey && body === "") {
					const mediafile = await msg.downloadMedia();
			
					const dir = "./images";
					if (!fs.existsSync(dir)){
						fs.mkdirSync(dir);
					}

					const filename = `image-${new Date().getTime()}.jpg`;
					const filePath = path.join(dir, filename);
					fs.writeFile(filePath, mediafile.data, "base64", (err) => {
						if (err) {
							console.log(err);
						} else {
							console.log("Imagem baixada com sucesso!");
						}
					});console.log("Imagem baixada com sucesso!");
					registerMessage(numberPhone, filePath, idMessage);
				}else{
					registerMessage(numberPhone, body, idMessage);
				}
			}
		});
	
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