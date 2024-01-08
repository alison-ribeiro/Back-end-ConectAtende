import { Request, Response } from "express";
import { Client, MessageMedia } from "whatsapp-web.js";
import { getWhatsAppClient } from "../whatsapp";

import { ClientMessage } from "../models/ClientMessage";

import fs from "fs";
import path from "path";

export const sendMessage = async (req : Request, res : Response) => { 
	try {
		const client:Client = getWhatsAppClient();
		const { numberPhone, message } = req.body;
		console.log(message);
			
		if (fs.existsSync(message) && fs.lstatSync(message).isFile()) {
			const file = fs.readFileSync(message);
			const ext = path.extname(message).slice(1);
			const mediaType = ext === "mp3" ? "audio" : "image";
			const media = new MessageMedia(`${mediaType}/${ext}`, file.toString("base64")); 
			await client.sendMessage(numberPhone, media);
		} else {
			await client.sendMessage(numberPhone, message);
		}
		res.status(201).json({message: "Mensagem enviada com sucesso"});
	} catch (err){
		res.status(500).json({message: "Erro ao enviar mensagem", err});
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
		console.log(numberPhone, newMessage, idMessage);
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

export const getMessages = async (req : Request, res : Response) => {
	const {  numberPhone } = req.body;
	try {
		const clientMessage = await ClientMessage.findOne({ phone:numberPhone });
		if(!clientMessage){
			return res.status(404).json({message: "Client não encontrado"});
		}
		res.status(200).json({messages: clientMessage.messages});
	} catch  {
		res.status(500).json({message: "Erro ao buscar mensagens"});
	}
};