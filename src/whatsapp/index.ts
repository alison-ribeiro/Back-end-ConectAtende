import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

import { initializeStartMessages } from "../utils/initializeStartMessages";
import { handleStoreOptions } from "../services/handleStoreOptions";
import { handleMediaMessage } from "../utils/handleMediaMessage";
import { startingConversation } from "../services/startingConversation";

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
			console.log(numberPhone);
			if (!startMessages[numberPhone] && !fromMe) {
				initializeStartMessages(startMessages,numberPhone);
			}
			if (startMessages[numberPhone] && !startMessages[numberPhone].startMessage && !fromMe) {
				startMessages[numberPhone] = { startMessage: true, storeOptions: true };
				startingConversation(whatsappClient, numberPhone);
			} else if (startMessages[numberPhone] && startMessages[numberPhone].storeOptions && !fromMe) {
				handleStoreOptions(startMessages,whatsappClient,numberPhone, body);
			} else {
				handleMediaMessage(msg, numberPhone);
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