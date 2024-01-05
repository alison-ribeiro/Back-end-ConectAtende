import { ClientMessage } from "../models/ClientMessage";


export const registerMessage = async (phoneNumber:string, messages:string, idMessage:string, sender:"client" | "attendant" = "client", subtitle:string = "" ) => { 
	console.log(subtitle);
	try {
		const clientMessage = await ClientMessage.findOne({ phone: phoneNumber });
		if(!clientMessage){
			return console.log({message: "Criando cliente"});
		}else{
			clientMessage.messages.push({
				idMessage,
				content: messages,
				sender,
				timestamp: new Date(),
				delete: false,
				editedMessage: "",
				subtitle
			});
			await clientMessage.save();
		}
	} catch {
		console.log({message: "Erro ao enviar mensagem"});
	}
};