import { Request, Response } from "express";
import { Client } from "whatsapp-web.js";
import { getWhatsAppClient } from "../whatsapp";
import { registerMessage } from "../services/registerMessageDB";
import { ClientMessage } from "../models/ClientMessage";

export const sendMessage = async (req : Request, res : Response) => { 
	try {
		const client:Client = getWhatsAppClient();
		const { numberPhone, message } = req.body;
		const sentMessage = await client.sendMessage(numberPhone, message);
		registerMessage(numberPhone, message, sentMessage.id._serialized, "attendant");
		res.status(201).json({message: "Mensagem enviada com sucesso"});
	} catch {
		res.status(500).json({message: "Erro ao enviar mensagem"});
	}
};
export const deleteMessage = async (req : Request, res : Response) => { 
	try {
		const client:Client = getWhatsAppClient();
		const { numberPhone, idMessage } = req.body;
		console.log(numberPhone, idMessage);
		const clientMessage = await ClientMessage.findOne({ phone:numberPhone });
		if(!clientMessage){
			return res.status(404).json({message: "Client não encontrado"});
		}

		clientMessage.messages.forEach((message) => {
			if(message.idMessage === idMessage){
				message.delete = true;
			}
		});
		await clientMessage.save();
	
		const messageToDelete = await client.getMessageById(idMessage);
		
		if (messageToDelete) {
			try {
				await messageToDelete.delete(true);
				console.log("Mensagem excluída com sucesso");
			} catch (error) {
				console.log("Erro ao excluir a mensagem", error);
			}
		}
		res.status(200).json({message: "Mensagem deletada com sucesso"});
	} catch {
		res.status(500).json({message: "Erro ao deletar mensagem"});
	}

};