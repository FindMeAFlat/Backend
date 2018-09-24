import { Document, Model } from "mongoose";

export interface IRead<T> {
  where(cond: Object, projection?: Object): Promise<T[]>;
  single(cond: Object, projection?: Object): Promise<T>;
  singleById(id: string, projection?: Object): Promise<T>;
}

export interface IWrite<T> {
  create(item: T, duplicateCondition?: (item: T) => any): Promise<T>;
  delete(cond: Object): Promise<any>;
  deleteById(id: string): Promise<any>;
  update(cond: Object, item: T): Promise<any>;
  updateById(_id: string, item: T): Promise<any>;
}

export abstract class RepositoryBase<T> implements IRead<T>, IWrite<T> {
  constructor(private model: Model<Document>) { }

  //READ
  where(cond: Object, projection?: Object): Promise<T[]> {
    return (projection ? this.model.find(cond, projection).exec() : this.model.find(cond).exec()) as any as Promise<T[]>;
  }

  single(cond: Object, projection?: Object): Promise<T> {
    return (projection ? this.model.findOne(cond, projection).exec() : this.model.findOne(cond).exec()) as any as Promise<T>;
  }

  singleById(id: string, projection?: Object): Promise<T> {
    return (projection ? this.model.findById(id, projection).exec() : this.model.findById(id).exec()) as any as Promise<T>;
  }

  async create(item: T, duplicateCondition?: (item: T) => any): Promise<T> {
    const existingItems = await this.single(duplicateCondition ? duplicateCondition(item) : item);
    return (existingItems ? await existingItems : this.model.create(item)) as any as Promise<T>;
  }

  update(cond: Object, item: T): Promise<T> { return this.model.update(cond, item).exec() as any as Promise<T>; }
  updateById(_id: string, item: T): Promise<T> { return this.model.findByIdAndUpdate(_id, item).exec() as any as Promise<T> }

  delete(cond: Object): Promise<any> { return this.model.remove(cond).exec() as any as Promise<T>; }
  deleteById(id: string): Promise<any> { return this.model.findByIdAndRemove(id).exec() as any as Promise<T>; }
}
