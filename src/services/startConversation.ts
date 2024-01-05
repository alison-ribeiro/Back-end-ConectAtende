import { Client } from "whatsapp-web.js";
import { startingConversation } from "../whatsapp/startingConversation";
import { StartMessages } from "../whatsapp";

export function startConversation(whatsappClient: Client | null, startMessages: StartMessages, numberPhone: string) {
	startMessages[numberPhone] = { startMessage: true, storeOptions: true };
	startingConversation(whatsappClient, numberPhone);
}