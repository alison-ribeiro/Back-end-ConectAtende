import { ClientMessage } from "../models/ClientMessage";


export const registerMessage = async (phoneNumber:string, messages:string, idMessage:string, sender:"client" | "attendant" = "client", subtitle:string = "" ) => { 
	console.log("aqui", phoneNumber, messages, idMessage, sender, subtitle);
	try {
		const clientMessage = await ClientMessage.findOne({ phone: phoneNumber });
		if(!clientMessage){
			return console.log({message: "Cliente Não encontrado"});
		}else{
			console.log("Salvando no bd");
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