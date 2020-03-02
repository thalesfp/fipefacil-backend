const axios = require("axios");

const BASE_URL = "https://tabela-fipe-api-node.herokuapp.com";

const instance = axios.create({
  baseURL: BASE_URL,
});

module.exports = {
  getReferences: async () => {
    const { data } = await instance.get("/referencias");

    return data;
  },
  getBrands: async ({ referenceId, vehicleType }) => {
    const { data } = await instance.get(`/${vehicleType}/marcas`, {
      params: { referencia: referenceId },
    });

    return data;
  },
  getModels: async ({ referenceId, vehicleType, brandId }) => {
    const { data } = await instance.get(
      `/${vehicleType}/marcas/${brandId}/modelos`,
      {
        params: { referencia: referenceId },
      },
    );

    return data;
  },
  getYearModels: async ({ referenceId, vehicleType, brandId, modelId }) => {
    const { data } = await instance.get(
      `/${vehicleType}/marcas/${brandId}/modelos/${modelId}/ano_modelos`,
      {
        params: { referencia: referenceId },
      },
    );

    return data;
  },
  getYearModel: async ({
    referenceId,
    vehicleType,
    brandId,
    modelId,
    yearModelId,
  }) => {
    const { data } = await instance.get(
      `/${vehicleType}/marcas/${brandId}/modelos/${modelId}/ano_modelos/${yearModelId}`,
      {
        params: { referencia: referenceId },
      },
    );

    return data;
  },
};
