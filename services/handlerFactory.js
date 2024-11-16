const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) => (req, res, next) => {
  const { id } = req.params;

  Model.findByIdAndDelete(id)
    .then((document) => {
      if (!document) {
        return next(new ApiError(`No document found for this id: ${id}`, 404));
      }
      res.status(200).json({ status: "Success" });
    })
    .catch((error) => next(error));
};

exports.updateOne = (Model) => (req, res, next) => {
  const { id } = req.params;

  Model.findByIdAndUpdate(id, req.body, { new: true })
    .then((document) => {
      if (!document) {
        return next(new ApiError(`No document for this id :${id}`, 404));
      }
      // Trigger "save" event when updating the document
      return document.save().then(() => {
        res.status(200).json({ status: "Success", data: document });
      });
    })
    .catch((error) => next(error));
};

exports.getOne = (Model, populationOpts) => (req, res, next) => {
  const { id } = req.params;

  let query = Model.findById(id);
  if (populationOpts) {
    query = query.populate(populationOpts);
  }

  query
    .then((document) => {
      if (!document) {
        return next(new ApiError(`No document for this id ${id}`, 404));
      }
      res.status(200).json({ data: document });
    })
    .catch((error) => next(error));
};

exports.CreateOne = (Model) => (req, res, next) => {
  Model.create(req.body)
    .then((document) => {
      res.status(201).json({ status: "Success", data: document });
    })
    .catch((error) => next(error));
};

exports.getAll = (Model) => (req, res, next) => {
  const filter = req.filterObj || {};

  Model.countDocuments(filter)
    .then((documentsCount) => {
      const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
        .paginate(documentsCount)
        .filter()
        .limitField()
        .search()
        .sort();

      return apiFeatures.mongooseQuery.then((document) => {
        res.status(200).json({
          results: document.length,
          paginationResult: apiFeatures.paginSationResult,
          data: document,
        });
      });
    })
    .catch((error) => next(error));
};
