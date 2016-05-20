import { expect } from 'chai';
import * as sinon from 'sinon';

import { DatabaseService, ISchema } from './database.service';
import { MockDatabase } from './database.mock';

interface ITestModel {
	prop1?: string;
	prop2?: number;
}

describe('database service', (): void => {
	let model: ISchema;
	let database: MockDatabase;
	let databaseService: DatabaseService<ITestModel>;

	beforeEach((): void => {
		model = {
			identifier: 'prop2',
			properties: ['prop1', 'prop2'],
		};
		database = new MockDatabase();
		databaseService = new DatabaseService(database, model);
	});

	it('should get an item by its identifier', (done: MochaDone): void => {
		const model: ITestModel = {
			prop2: 2,
		};
		database.currentModel = model;

		databaseService.getDetail(2).then((result: ITestModel): void => {
			expect(result).to.deep.equal(model);
			done();
		});

		database.flush();

		sinon.assert.calledOnce(database.findOne);
		sinon.assert.calledWith(database.findOne, { prop2: 2 })
	});

	it('should get a list of items with a search param', (done: MochaDone): void => {
		const modelList: ITestModel[] = <any>[
			{ prop1: 'value 1' },
			{ prop1: 'value 2' },
		];
		database.list = modelList;

		databaseService.getList({ prop1: 'value 1'}).then((results: ITestModel[]): void => {
			expect(results).to.have.length(2);
			expect(results[0]).to.deep.equal(modelList[0]);
			expect(results[1]).to.deep.equal(modelList[1]);
			done();
		});

		database.flush();

		sinon.assert.calledOnce(database.find);
		sinon.assert.calledWith(database.find, { prop1: 'value 1' });
	});

	it('should update all properties of the model', (done: MochaDone): void => {
		const model: ITestModel = {
			prop1: 'something',
			prop2: 4,
		};
		database.currentModel = model;

		databaseService.update(model).then((result: ITestModel): void => {
			expect(result).to.deep.equal(model);
			done();
		});

		database.flush();
		database.flush();

		sinon.assert.calledOnce(database.update);
		const arg: any = database.update.firstCall.args[1];
		expect(arg.$set.prop1).to.equal('something');
		expect(arg.$set.prop2).to.equal(4);
	});

	it('should create a new model', (done: MochaDone): void => {
		const model: ITestModel = {
			prop1: 'something new',
			prop2: 5,
		};

		databaseService.create(model).then((result: ITestModel): void => {
			expect(result).to.deep.equal(model);
			done();
		});

		database.flush();

		sinon.assert.calledOnce(database.insert);
		sinon.assert.calledWith(database.insert, model);
	});
});