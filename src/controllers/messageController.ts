import { Request, Response } from "express";
import { Client } from "whatsapp-web.js";
import { getWhatsAppClient } from "../whatsapp";

import { ClientMessage } from "../models/ClientMessage";

export const sendMessage = async (req : Request, res : Response) => { 
	try {
		const client:Client = getWhatsAppClient();
		const { numberPhone, message } = req.body;
		await client.sendMessage(numberPhone, message);
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
	
		const message = await client.getMessageById(idMessage);
		
		if (message) {
			try {
				await message.delete(true);
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

export const editMessage = async (req : Request, res : Response) => { 
	try {
		const client:Client = getWhatsAppClient();
		const {  numberPhone, newMessage ,idMessage } = req.body;
		const clientMessage = await ClientMessage.findOne({ phone:numberPhone });
		if(!clientMessage){
			return res.status(404).json({message: "Client não encontrado"});
		}

		clientMessage.messages.forEach((message) => {
			if(message.idMessage === idMessage){
				message.editedMessage = message.content;
				message.content = newMessage;
			}
		});
		await clientMessage.save();
		
		const messageToDelete = await client.getMessageById(idMessage);
		
		if (messageToDelete) {
			try {
				await messageToDelete.edit(newMessage);
				console.log("Mensagem editada");
			} catch (error) {
				console.log("Erro ao excluir a mensagem", error);
			}
		}
		res.status(200).json({message: "Mensagem deletada com sucesso"});
	} catch {
		res.status(500).json({message: "Erro ao deletar mensagem"});
	}
};