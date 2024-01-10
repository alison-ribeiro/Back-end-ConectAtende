import { Server as IOServer } from "socket.io";

let io: IOServer | undefined;

export function setIo(newIo: IOServer) {
	io = newIo;
}

export function getIo() {
	if (!io) {
		throw new Error("Socket.IO server not initialized");
	}
	return io;
}