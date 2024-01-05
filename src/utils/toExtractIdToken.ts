import jwt, { JwtPayload } from "jsonwebtoken";

export function toExtractIdToken(token: string): string | undefined {
    
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw new Error("JWT_SECRET is not defined");
	}

	const parts = token.split(" ");

	if(parts.length > 1 && parts[0] === "Bearer") {
		const decoded = jwt.verify(parts[1], secret);

		if (typeof decoded === "object" && "id" in decoded) {
			const payload = decoded as JwtPayload;
			return payload.id;
		}
	}
    
	return undefined;
}