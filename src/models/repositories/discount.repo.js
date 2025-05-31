const { getSelectData, unGetSelectData } = require("../../utils");

const findDiscountCodeUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  Select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .collation({ locale: "en", strength: 2 })
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(getSelectData(Select))
    .exec();
  return documents;
};

const findDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  Select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const documents = await model
    .find(filter)
    .collation({ locale: "en", strength: 2 })
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(getSelectData(Select))
    .exec();
  return documents;
};

const checkDiscountExists = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

module.exports = {
  findDiscountCodeUnSelect,
  findDiscountCodeSelect,
  checkDiscountExists,
};
