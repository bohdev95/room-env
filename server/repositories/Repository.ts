// we imported all types from mongodb driver, to use in code
// import { MongoClient, Db, Collection, InsertOneWriteOpResult } from 'mongodb';
// import { Collection } from 'mongodb';
import { RepositoryEnum } from '.';
import mongoose, { Collection } from 'mongoose';

export interface IWrite<T> {
    create(item: T): Promise<boolean>;
    update(id: string, item: T): Promise<boolean>;
    delete(id: string): Promise<boolean>;
  }

  export interface IRead<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
}

export interface IRepositoryEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }

export function getRepository<T, E extends string = RepositoryEnum>(
    collectionName: E,
  ): Repository<T, E> {
    return new Repository<T, E>(collectionName);
  }

// that class only can be extended
export default class Repository<T, E> implements IWrite<T>, IRead<T> {
  //creating a property to use your code in all instances 
  // that extends your base repository and reuse on methods of class
  public collectionName: E;
  public readonly _collection: Collection;

  //we created constructor with arguments to manipulate mongodb operations
  constructor(collectionName: string) {
    // this._collection = db.connection.collection(collectionName);
    this._collection = mongoose.Collection[collectionName]
  }

  // we add to method, the async keyword to manipulate the insert result
  // of method.
  async create(item: T): Promise<boolean> {
    // const result: InsertOneWriteOpResult = await this._collection.insert(item);
    // after the insert operations, we returns only ok property (that haves a 1 or 0 results)
    // and we convert to boolean result (0 false, 1 true)
    // return !!result.result.ok;
    return true;
  }


  update(id: string, item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  getAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  getById(id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
