import { Request, Response } from "express";
import { Client } from "whatsapp-web.js";
import { getWhatsAppClient } from "../whatsapp";
import { registerMessage } from "../services/registerMessageDB";

export const sendMessage = async (req : Request, res : Response) => { 
	try {
		const client:Client = getWhatsAppClient();
		const { numberPhone, message } = req.body;
		client.sendMessage(numberPhone, message);
		registerMessage(numberPhone, message, "attendant");
	} catch {
		res.status(500).json({message: "Erro ao enviar mensagem"});
	}
};

