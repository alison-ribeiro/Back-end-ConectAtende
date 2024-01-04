import { Client } from "whatsapp-web.js";
import { ClientMessage } from "../models/ClientMessage";
import { stores } from "../mocks/stores";


export const startingConversation = async (client: Client, number: string) => {

	const chat = await client.getChatById(number);
	const contact = await client.getContactById(chat.id._serialized);
	contact.getProfilePicUrl()
		.then(async (url: string) => {
			const client = await ClientMessage.findOne({ phone: number });
			if(!client){
				const user = new ClientMessage ({
					name: contact.name,
					phone: number,
					status: "pending",
					store: "all",
					messages: [{
						sender: "client",
						idMessage: " ",
						content: " ",
						timestamp: new Date()

					}]
				});
				await user.save();
			}
		}).catch((error : Error) => {
			console.log("Error:", error);
		});
	
	client.sendMessage(number, `Olá, você quer ser atendido por qual loja? \n\n ${Object.entries(stores).map(([key, store]) => `${key} - ${store}`).join("\n")}`);	
};