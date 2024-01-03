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
		
		const startMessage: { [key: string]: boolean } = {};
		const storeOptions: {[key: string]: boolean} = {};
		
		whatsappClient.on("message", async (message:Message) => {
			console.log(message.body);
			const numberPhone:string = message.from;
			const messages:string = message.body;
			console.log(startMessage);
			
			if(!startMessage[numberPhone]){
				startMessage[numberPhone] = true;
				storeOptions[numberPhone] = true;
				if (whatsappClient === null) {
					console.error("WhatsApp client is not initialized");
					return;
				}
				startingConversation(whatsappClient, numberPhone);
				
			}else if(storeOptions[numberPhone]){
				if (whatsappClient === null) {
					console.error("WhatsApp client is not initialized");
					return;
				}
				if(stores[messages]){
					whatsappClient.sendMessage(numberPhone, `Transferindo mensagem para loja ${stores[messages]}`);
					storeOptions[numberPhone] = false;
				}else{
					whatsappClient.sendMessage(numberPhone, "Opção inválida");
				}
			}
	
			registerMessage(numberPhone, messages);
						
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