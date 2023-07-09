import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";
import { TokenService } from "~routes/pre-built/5-tokens/token.service";

@Injectable()
export class SocketService {
	constructor(private readonly tokenService: TokenService) {}

	async getUserFromSocket(socket: Socket) {
		const { authorization } = socket.handshake.headers;

		const textBearer = "Bearer ";

		if (!authorization || !authorization.startsWith(textBearer))
			throw new WsException("Requires login!");

		const token = authorization.slice(textBearer.length);

		const user = await this.tokenService.verifyAccessToken(token);

		if (!user) throw new WsException("Invalid credentials.");

		return user;
	}
}