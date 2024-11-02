const { modelName } = require("../models/hotelModel");

class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    const queryStringObj = { ...this.queryString };
    const excludesFields = ["page", "limit", "sort", "field", "search"];

    excludesFields.forEach((feild) => delete queryStringObj[feild]);

    //1-Apply filteration using[gte,gt,lte,lt]
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitField() {
    if (this.queryString.field) {
      const field = this.queryString.field.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(`${field}  -_id`);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search() {
    if (this.queryString.search) {
      let query = {};

      query.$or = [
        { name: { $regex: this.queryString.search, $options: "i" } },
        { location: { $regex: this.queryString.search, $options: "i" } },
        { userName: { $regex: this.queryString.search, $options: "i" } },
      ];

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
  paginate(countDocuments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    //Pagination

    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocuments / limit);

    //next page
    if (endIndex < countDocuments) {
      pagination.next = page + 1;
    }

    //previous page

    if (skip > 0) {
      pagination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginSationResult = pagination;
    return this;
  }
}

module.exports = ApiFeatures;
