import queueManager from "./queueManager";

const QUEUE_NAME = process.env.REFERENCES_QUEUE;

const sendMessage = async ({
  id,
  month,
  year,
}: {
  id: number;
  month: number;
  year: number;
}): Promise<void> => {
  const message = JSON.stringify({
    id,
    month,
    year,
  });

  await queueManager.sendMessage(QUEUE_NAME, message);
};

export default sendMessage;
