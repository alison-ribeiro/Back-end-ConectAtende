import { Client, LocalAuth,  Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({
	authStrategy: new LocalAuth()
});

client.on("qr", (qr: string) => {
	qrcode.generate(qr, {small: true});
});

client.on("ready", () => {
	console.log("Client is ready!");
});

let firstMessage = true; 
let optionMenssage = true;

client.on("message", async (message:Message) => {
	if (message.body === "get profile pic") {
		const chat = await message.getChat();
		const contact = await client.getContactById(chat.id._serialized);
		contact.getProfilePicUrl().then((url: string) => {
			const user = {
				name: contact.name,
				numberPhone: contact.number,
				pictureProfile: url,
				pendingMessage: true
			};
			console.log(user);
			console.log("id", chat.id._serialized);
		}).catch((error : Error) => {
			console.log("Error:", error);
		});
	}
	if (firstMessage){
		client.sendMessage(message.from, "Olá, qual loja você gostaria de ser atendido ? 1- Gravatai 2- Canoas");
		firstMessage = false;
	}
	if(optionMenssage){
		if(message.body === "1"){
			client.sendMessage(message.from, "Transferindo mensagem para loja Gravatai");
			optionMenssage = false;
		}
		if(message.body === "2"){
			client.sendMessage(message.from, "Transferindo mensagem para loja Canoas");
			optionMenssage = false;
		}
	}else{
		client.sendMessage(message.from, message.body);
	}
        
});


 
client.initialize();