const asyncHandler = require("express-async-handlr");

const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document found for this id: ${id}`, 404));
    }
    res.status(200).json({ status: "Success" });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndUpdate(id, req.body, { new: true });
    if (!document) {
      return next(new ApiError(`No document for this id :${id}`, 404));
    }
    //trigger "save" event when update doucment
    document.save();
    res.status(200).json({ status: "Sucsess", data: document });
  });

exports.getOne = (Model, populationOpts) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //1-Bulid query
    let query = Model.findById(id);
    if (populationOpts) {
      query = query.populate(populationOpts);
    }
    //2-execute query
    const document = await query;

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.CreateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.create(req.body);

    res.status(201).json({ status: "Succsess", data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    //Build Query
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCount)
      .filter()
      .limitField()
      .search()
      .sort();

    //Execte Query
    const { mongooseQuery, paginSationResult } = apiFeatures;
    const document = await mongooseQuery;

    res
      .status(200)
      .json({ results: document.length, paginSationResult, data: document });
  });
