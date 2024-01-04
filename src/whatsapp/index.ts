import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { startingConversation } from "./startingConversation";
import { registerMessage } from "../services/registerMessageDB";
import { stores } from "../mocks/stores";

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
	
		whatsappClient.on("message_create", async (message: Message) => {
			const messages: string = message.body;
			const idMessage: string = message.id._serialized;
			const fromMe: boolean = message.id.fromMe;

			let numberPhone: string ;
			if(fromMe){
				numberPhone = message.to;
			}else{
				numberPhone = message.from;
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
				if (stores[messages]) {
					whatsappClient.sendMessage(numberPhone, `Transferindo mensagem para loja ${stores[messages]}`);
					startMessages[numberPhone].storeOptions = false;
				} else {
					whatsappClient.sendMessage(numberPhone, "Opção inválida");
				}
			} else if (fromMe) {
				registerMessage(numberPhone, messages, idMessage, "attendant");
			} else {
				registerMessage(numberPhone, messages, idMessage);
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