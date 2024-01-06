import { Document, model, Schema } from "mongoose";

interface IMessage {
  sender: string;
  content: string;
  timestamp: Date;
	idMessage:string;
	delete:boolean;
	editedMessage:string;
	subtitle:string ;
}

export interface IClientMessage extends Document {
  name: string;
  phone: string;
  status: string;
  messages: IMessage[];
	store:string;
	pictureProfile:string;
}

const UserSchema = new Schema<IClientMessage>({
	name: {
		type: String,
		required: false
	},
	pictureProfile: {
		type: String,
		required: false
	},
	phone: {
		type: String,
		required: true,
		unique: true
	},
	status: {
		type: String,
		required: true,
		enum: ["pending", "finished"],
		default: "pending"
	},
	messages: [{
		idMessage:{
			type: String,
			required: false,
			unique: true
			
		},
		editedMessage:{
			type: String,
			required: false
		},
		subtitle: {
			type: String ,
			required: false,
			default: ""
		},
		sender: {
			type: String,
			enum: ["client", "attendant"],
			default: "client",
			required: false
		},
		content: {
			type: String,
			required: false
		},
		timestamp: {
			type: Date,
			default: Date.now,
			required: false
		},
		delete: {
			type: Boolean,
			default: false,
			required: false
		}
	}],
	store: {
		type: String,
		required: true,
		default: "all"
	}
});

export const ClientMessage = model<IClientMessage>("ClientMessage", UserSchema);