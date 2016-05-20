# Monk Database Helper

A helper for working with mongo db using monk.

This helper is designed to hide the complexity of simple CRUD operations on mongo collections. I opted to go with a schema model so the helper can track what properties need to be set with $set, and what identifier to use for an entity. (Usually `_id`, but there are reasons why you might want to use a different identifier)

### Install

```
npm install monk-database-helper --save
```

### Running locally

Get the source by cloning the repository:

```
$ git clone https://github.com/SamGraber/MonkDatabaseHelper
```

Navigate to the project folder and install the dependencies via:

```
$ npm install
```

The following script will build the typescript files and run the unit tests against them:
```
$ npm test
```

### Usage

Typescript:
```
import { DatabaseService, ISchema } from 'monk-database-helper';

let schema: ISchema = {
	identifier: 'id',
	properties: ['prop1', 'prop2'],
};

let database = new DatabaseService<MyType>(monkDatabase.get('myCollection'), schema);
```

Javascript:
```
var DatabaseService = require('monk-database-helper').DatabaseService;

var schema = {
	identifier: 'id',
	properties: ['prop1', 'prop2'],
};

var database = new DatabaseService(monkDatabase.get('myCollection'), schema);
```

#### `getList<TSearchModel>(searchModel?: TSearchModel): Promise<TDataType[]>`

Make a simple `find` call and return the results as a promise. Search model is passed directly to the `find` function.

#### `getDetail(id: any): Promise<TDataType>`

Make a `findOne` call to get a specific entity. The helper uses the `identifier` field in the schema as the key for the search model.

Example:
```
helperInstance.schema = { identifier: 'id' };
helperInstance.getDetail(11);

// results in
findOne({ 'id': 11 })
```

#### `update(model: TDataType): Promise<TDataType>`

Makes an `update` call for the specified entity. The query is constructed the same as for a `getDetail` request. All `properties` listed in the schema will be updated with `$set` values in the update request.

Example:
```
helperInstance.schema = {
	identifier: 'id',
	properties: ['prop1', 'prop2'],
};

let model = {
	id: 11,
	prop1: 'value',
	prop2: 52,
}; 

helperInstance.update(model);

// results in
update({ 'id': 11 }, {
	'$set': { 'prop1': 'value' },
	'$set': { 'prop2': 52 },
};
```

#### `create(model: TDataType): Promise<TDataType>`

Makes an `insert` request to create a new model in the collection. The model is passed directly to the `insert` command.

Example:
```
let model = {
	id: 11,
	prop1: 'value',
	prop2: 52,
}; 

helperInstance.create(model);

// results in
insert({ 
	'prop1': 'value' },
	'prop2': 52 },
};
```
