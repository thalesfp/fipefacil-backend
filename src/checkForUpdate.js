const api = require("./fipeApi");
const { getCurrentReferenceId } = require("./repository/references");
const { startUpdate } = require("./updater");

const getLastRemoteReferenceId = references =>
  references
    .map(reference => reference.Codigo)
    .reduce((a, b) => Math.max(a, b));

const checkForUpdate = async () => {
  const references = await api.getReferences();
  const lastRemoteReferenceId = getLastRemoteReferenceId(references);
  const currentReferenceId = await getCurrentReferenceId();

  if (lastRemoteReferenceId > currentReferenceId) {
    startUpdate(lastRemoteReferenceId);
  }
};

module.exports = checkForUpdate;
