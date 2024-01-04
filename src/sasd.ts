import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

let whatsappClient: Client  ;
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
		
		
		
		

		whatsappClient.on("message", async (message:Message) => {
			const numberPhone:string = message.from;
			const sentMessage = await whatsappClient.sendMessage(numberPhone, "message");
			const ids = sentMessage.id._serialized;
			console.log(ids);
			console.log(typeof ids);
			const messageToDelete = await whatsappClient.getMessageById(ids);
			console.log(messageToDelete);
			if (messageToDelete) {
				try {
					await messageToDelete.delete(true);
					console.log("Mensagem excluída com sucesso");
				} catch (error) {
					console.log("Erro ao excluir a mensagem", error);
				}
			}
		});
		
		whatsappClient.initialize();
		
	} catch  {
		console.log("Erro ao inicializar whatssap");
	}
	

};

initialize();