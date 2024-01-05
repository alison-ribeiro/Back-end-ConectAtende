import express, { ErrorRequestHandler, Request, Response } from "express";

import path from "path";
import dotenv from "dotenv";
import cors from "cors";

import passport from "passport";
import mongoose from "mongoose";
import api from "./routes/api";
import { initialize } from "./whatsapp";

dotenv.config();



const dbUrl = process.env.DB_URL as string;
const dbName = process.env.DB_DATABASE as string;

mongoose.connect(`${dbUrl}${dbName}`)

	.then(() => {
		const server = express();
		server.use(cors({

		}));


		server.use(express.json());
		const filePath = path.join(__dirname, "../images");
		console.log(filePath);
		server.use("/images", express.static(filePath));
		
		server.use(express.urlencoded({ extended: true }));
		server.use(api);
		
		server.use(passport.initialize());		
		
		
		server.use((req: Request, res: Response) => {
				
			res.status(404);
			res.json({ error: "Endpoint não encontrado." });
		});
		
		
		
		const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
			err.status ? res.status(err.status) : res.status(400);
			err.message ? res.json({ error: err.message }) : res.json({ error: "Ocorreu algum erro" });
		};
		
		server.use(errorHandler);
		
		server.listen(process.env.PORT);

		initialize().then(() => {
			console.log("WhatsApp client initialized");
	
		}).catch((error) => {
			console.error("Failed to initialize WhatsApp client:", error);
		});

		
	})
	.catch((err) => console.log("Erro ao conectar ao MongoDB: " + err));



