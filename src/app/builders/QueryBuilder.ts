/* The QueryBuilder class in TypeScript provides methods for building and executing queries with
search, filter, sort, pagination, field selection, and total count functionalities. */
import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, unknown>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    search(searchableFields: string[]) {
        const searchTerm = this?.query?.searchTerm || '';

        // search for the searchTerm in the searchableFields
        this.modelQuery = this.modelQuery.find({
            $or: searchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            })),
        } as FilterQuery<T>);
        return this;
    }

    filter() {
        // extract the query object and remove the fields that are not needed for the query
        const _query = { ...this.query };
        const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
        excludeFields.forEach((field) => delete _query[field]);

        this.modelQuery = this.modelQuery.find(_query as FilterQuery<T>);
        return this;
    }

    sort() {
        const sort =
            (this?.query?.sort as string)?.split(',')?.join(' ') ||
            '-createdAt';

        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    paginate() {
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    fields() {
        // generate the fields string to get selected fields ('name,price,-description' -> 'name price -description')
        const fields =
            (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    // generate meta data for pagination
    async countTotal() {
        const totalQueries = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(totalQueries);
        const page = Number(this?.query?.page) || 1;
        const limit = Number(this?.query?.limit) || 10;
        const totalPages = Math.ceil(total / limit);

        return {
            page,
            limit,
            total,
            totalPages,
        };
    }
}

export default QueryBuilder;
