import { ClientMessage } from "../models/ClientMessage";


export const registerMessage = async (phoneNumber:string, messages:string, idMessage:string, sender:"client" | "attendant" = "client" ) => { 
	try {
		const clientMessage = await ClientMessage.findOne({ phone: phoneNumber });
		if(!clientMessage){
			return console.log({message: "Client não encontrado"});
		}else{
			clientMessage.messages.push({
				idMessage,
				content: messages,
				sender,
				timestamp: new Date(),
				delete: false,
				editedMessage: ""
			});
			await clientMessage.save();
		}
	} catch {
		console.log({message: "Erro ao enviar mensagem"});
	}
};