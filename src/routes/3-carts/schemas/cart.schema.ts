import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CartState } from "~routes/3-carts/enums/cart-state.enum";
import { CartProductDto } from "../dto/cart-product.dto";
import { User } from "~routes/pre-built/1-users/schemas/user.schema";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "carts",
})
export class Cart {
	@Prop({ type: String, ref: User.name })
	userId: string;

	@Prop({ type: String, enum: CartState, default: CartState.Active })
	state: string;

	@Prop({
		type: [
			{
				productId: { type: String, ref: "Product", required: true },
				shopId: { type: String, ref: "Shop", required: true },
				quantity: { type: Number, default: 1 },
				name: { type: String, required: true },
				price: { type: Number, required: true },
			},
		],
		default: [],
	})
	products: CartProductDto[];
}

export type CartDocument = Cart & HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);
