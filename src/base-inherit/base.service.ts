import {
	FilterQuery,
	PaginateModel,
	QueryOptions,
	Types,
	UpdateQuery,
	UpdateWithAggregationPipeline,
} from "mongoose";

import { PaginateOptions } from "./base.interface";

export class BaseService<T> {
	private model: PaginateModel<T>;
	constructor(model: PaginateModel<T>) {
		this.model = model;
	}

	create(input: Record<string, any> | Record<string, any>[]) {
		return this.model.create(input);
	}

	findAll(filter: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.find(filter, options?.projection, options).lean();
	}

	findById(id: string, options?: QueryOptions<T>) {
		return this.model.findById(id, options?.projection, options).lean();
	}

	findOne(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.findOne(filter, options?.projection, options).lean();
	}

	count(filter: FilterQuery<T> = {}, options: QueryOptions = {}) {
		return this.model.countDocuments(filter, { ...options, lean: true });
	}

	distinct(field: string, filter?: FilterQuery<T>) {
		return this.model.distinct(field, filter).lean();
	}

	updateById(
		id: string | Types.ObjectId,
		input: UpdateQuery<T>,
		options: QueryOptions<T> = { new: true },
	) {
		return this.model.findByIdAndUpdate(id, input, options);
	}

	updateOne(
		filter: FilterQuery<T>,
		input: UpdateQuery<T>,
		options: QueryOptions<T> = { new: true },
	) {
		return this.model.findOneAndUpdate(filter, input, options);
	}

	updateMany(
		filter: FilterQuery<T>,
		input: UpdateQuery<T> | UpdateWithAggregationPipeline,
		options?: QueryOptions<T>,
	) {
		return this.model.updateMany(filter, input, options);
	}

	deleteById(id: string, options?: QueryOptions<T>) {
		return this.model.findByIdAndDelete(id, options);
	}

	deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.findOneAndDelete(filter, options);
	}

	deleteMany(filter: FilterQuery<T>, options?: QueryOptions<T>) {
		return this.model.deleteMany(filter, options);
	}

	async paginate(filter: FilterQuery<T>, pageOptions?: PaginateOptions) {
		const {
			projection,
			limit = 10,
			populate = [],
			page = 1,
			sort = "-updatedAt",
		} = pageOptions;

		const options = {
			page,
			limit,
			sort,
			populate,
			projection,
			lean: true,
		};

		return this.model.paginate(filter, options);
	}
}
