import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ProductType } from "../enums/product-type.enum";
import mongoose, { HydratedDocument } from "mongoose";

@Schema({
	timestamps: true,
	versionKey: false,
	collection: "products",
})
export class Product {
	@Prop({ type: String, required: true })
	readonly name: string;

	@Prop({ type: String, required: true })
	readonly thumbnail: string;

	@Prop({ type: String, default: null })
	readonly desc: string;

	@Prop({ type: Number, required: true })
	readonly price: number;

	@Prop({ type: Number, required: true })
	readonly quantity: number;

	@Prop({ type: String, required: true, enum: ProductType })
	readonly type: ProductType;

	@Prop({ type: mongoose.Schema.Types.Mixed })
	readonly attributes: Record<string, any>;

	@Prop({ type: Boolean, default: true })
	readonly isPublished: boolean;
}

export type ProductDocument = Product & HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
