import { ClientMessage } from "../models/ClientMessage";


export const registerMessage = async (phoneNumber:string, messages:string, sender:"client" | "attendant" = "client") => { 
	try {
		const clientMessage = await ClientMessage.findOne({ phone: phoneNumber });
		if(!clientMessage){
			console.log("aqui", clientMessage);
			return console.log({message: "Erro ao enviar mensagem"});
		}else{
			clientMessage.messages.push({
				content: messages,
				sender,
				timestamp: new Date(),
			});
			await clientMessage.save();
		}
	} catch {
		console.log({message: "Erro ao enviar mensagem"});
	}
};