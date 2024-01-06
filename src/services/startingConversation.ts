import { Client } from "whatsapp-web.js";
import { ClientMessage } from "../models/ClientMessage";
import { stores } from "../mocks/stores";


export const startingConversation = async (client: Client | null, number: string) => {
		
	const contact = await client?.getContactById(number);
	
	const clientDB = await ClientMessage.findOne({ phone: number });
	if(clientDB){
		console.error({message: "Cliente já cadastrado"});
	}else{
		console.log("asdasdas");
		const user = new ClientMessage ({
			name: contact?.name,
			phone: number,
			status: "pending",
			store: "all",
			pictureProfile:"",
			messages: [{
				sender: "client",
				idMessage: "", 
				content: "",
				timestamp: new Date()
			}]
		});
		await user.save();
	}   
	client?.sendMessage(number, `Olá, você quer ser atendido por qual loja? \n\n ${Object.entries(stores).map(([key, store]) => `${key} - ${store}`).join("\n")}`);
};