import { StartMessages } from "../whatsapp";

export function initializeStartMessages(startMessages:StartMessages,numberPhone: string) {
	startMessages[numberPhone] = { startMessage: false, storeOptions: false };
}