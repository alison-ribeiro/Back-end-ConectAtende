import { Client } from "whatsapp-web.js";
import { stores } from "../mocks/stores";
import { StartMessages } from "../whatsapp";

export function handleStoreOptions(startMessages:StartMessages,whatsappClient:Client | null,numberPhone: string, body: string) {
	if (stores[body]) {
		whatsappClient?.sendMessage(numberPhone, `Transferindo mensagem para loja ${stores[body]}`);
		startMessages[numberPhone].storeOptions = false;
	} else {
		whatsappClient?.sendMessage(numberPhone, "Opção inválida");
	}
}