import { each } from 'lodash';

export interface ISchema {
	identifier: string;
	properties: string[];
}

export class DatabaseService<TDataType> {
	constructor(public database: any
			, public schema: ISchema) { }

	getList<TSearchModel>(searchModel?: TSearchModel): Promise<TDataType[]> {
		return new Promise((resolve: Function, reject: Function): void => {
			this.database.find(searchModel || {}, {}, (error: any, data: TDataType[]): void => {
				resolve(data);
			});
		});
	}

	getDetail(id: any): Promise<TDataType> {
		return new Promise((resolve: Function, reject: Function): void => {
			const query: any = this.buildQuery(this.schema, id);
			this.database.findOne(query, {}, (error: any, data: TDataType): void => {
				resolve(data);
			});
		});
	}

	update(model: TDataType): Promise<TDataType> {
		return new Promise((resolve: Function, reject: Function): void => {
			const id: any = model[this.schema.identifier];
			const query: any = this.buildQuery(this.schema, id);
			this.database.update(query, this.buildUpdateModel(this.schema, model), (updateError): void => {
				this.database.findOne(query, {}, (findError, updatedModel): void => {
					resolve(updatedModel);
				});
			});
		});
	}

	create(model: TDataType): Promise<TDataType> {
		return new Promise((resolve: Function, reject: Function): void => {
			this.database.insert(model, (error, newModel): void => {
				resolve(newModel);
			});
		});
	}

	private buildQuery(schema: ISchema, id: any): any {
		const query: any = {};
		query[schema.identifier] = id;
		return query;
	}

	private buildUpdateModel(schema: ISchema, model: any): any {
		const updateModel: any = { $set: {} };
		each(schema.properties, (prop: string): any => {
			updateModel.$set[prop] = model[prop];
		});
		return updateModel;
	}
}