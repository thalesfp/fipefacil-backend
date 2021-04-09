import * as referenceQueue from "../queue/referenceQueue";
import * as brandQueue from "../queue/brandQueue";
import * as modelQueue from "../queue/modelQueue";
import * as yearModelQueue from "../queue/yearModelQueue";

const checkQueuesAreEmpty = async (): Promise<boolean> => {
  const queuesMessages = await Promise.all(
    [referenceQueue, brandQueue, modelQueue, yearModelQueue].map(
      async (queue) => await queue.numberOfMessages(),
    ),
  );

  return queuesMessages.every((queueMessage) => queueMessage === 0);
};

export default checkQueuesAreEmpty;
