import * as FipeApi from "../services/fipeApi";
import * as ReferenceRepository from "../repository/reference";
import * as ReferenceQueue from "../queue/referenceQueue";
import { normalizeReferences } from "../transformers/valuesFromRemoteApi";
import { PriceReferenceType } from "../types/Types";

const getLastRemoteReference = (
  references: PriceReferenceType[],
): PriceReferenceType =>
  references.reduce((prev, current) => (prev.id > current.id ? prev : current));

const checkForUpdate = async (): Promise<boolean> => {
  const references = await FipeApi.getReferences();
  const currentReferenceId = await ReferenceRepository.getCurrentReference();

  const referencesNormalized = normalizeReferences(references);
  const lastRemoteReference = getLastRemoteReference(referencesNormalized);

  if (
    !currentReferenceId ||
    lastRemoteReference.id > parseInt(currentReferenceId.sk, 10)
  ) {
    await ReferenceQueue.sendMessage(lastRemoteReference);

    return true;
  }

  return false;
};

export default checkForUpdate;
