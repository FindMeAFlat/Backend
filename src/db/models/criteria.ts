import { Document, Schema, Model, model } from "mongoose";

import { RepositoryBase } from '../baseRepository';
import ICustomApi from "../../models/customApi";

interface ICriteria {
    customApi: ICustomApi,
    name: string,
    userId: string,
}

const CriteriaSchema: Schema = new Schema({
    customApi: {
        type: {
            url: { type: String, required: true, },
            requestsLimit: { type: Number, required: false },
            propertyAccess: { type: String, required: true, },
            minRatingValue: { type: Number, required: true, },
            maxRatingValue: { type: Number, required: true, },
            importance: { type: Number, required: true, },
            ascending: { type: Boolean, required: true, },
        },
        required: true,
    },
    name: { type: String, required: true },
    userId: { type: String, required: true, },
});
interface ICriteriaDocument extends Document, ICriteria { }
const Criteria: Model<ICriteriaDocument> = model<ICriteriaDocument>("Criteria", CriteriaSchema);

class CriteriaRepository extends RepositoryBase<ICriteria> { constructor() { super(Criteria); } }

export {
    CriteriaRepository,
    ICriteria
}
