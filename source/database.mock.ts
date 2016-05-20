import * as _ from 'lodash';
import * as sinon from 'sinon';

interface IMockAsync extends sinon.SinonSpy {
	callback(): void;
}

export class MockDatabase {
	findOne: IMockAsync;
	find: IMockAsync;
	update: IMockAsync;
	insert: IMockAsync;

	currentModel: any;
	list: any[];

	constructor() {
		this.findOne = <IMockAsync>sinon.spy(this.findOneFunc);
		this.find = <IMockAsync>sinon.spy(this.findFunc);
		this.update = <IMockAsync>sinon.spy(this.updateFunc);
		this.insert = <IMockAsync>sinon.spy(this.insertFunc);
	}

	flush(): void {
		_.each(this, (prop: IMockAsync): void => {
			if (prop.callback) {
				prop.callback();
				prop.callback = null;
			}
		});
	}

	private findOneFunc(query: any, param: any, callback: { (error: any, results: any): void }): void {
		this.findOne.callback = () => callback(null, this.currentModel);
	}

	private findFunc(query: any, param: any, callback: { (error: any, results: any[]): void }): void {
		this.find.callback = () => callback(null, this.list);
	}

	private updateFunc(query: any, update: any, callback: { (): void }): void {
		this.update.callback = callback;
	}

	private insertFunc(object: any, callback: { (error: any, results: any): void }): void {
		this.update.callback = () => callback(null, object);
	}
}