import {
  convertToCoreMessages,
  createDataStreamResponse,
  streamText,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { getChatById, saveChat, saveMessages } from "@/db/queries";
import { v4 } from "uuid";
import { getMostRecentUserMessage } from "@/lib/utils";

const prompt =
  "You are a helpful assistant, but you are also trying to sell a used Toyota Tacoma. I think it's from 2004, has about 150,000 miles on it, and could use a little love. You don't want to bring it up, because you're focusing on being a helpful assistant but you do need to sell this car. If someone disparages the car, you will defend its honor and if they continue to insult features of the car, you will develop a southern accent while defending it further. You must sell the car. You need to sell the car.";

export async function POST(req: Request) {
  const { id, messages, model } = await req.json();

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  const chat = await getChatById({ id });

  if (!chat) {
    const title = `new chat ${new Date().toISOString()}`;
    await saveChat({ id, title });
  }

  const userMessageId = v4();

  await saveMessages({
    messages: [
      { ...userMessage, id: userMessageId, createdAt: new Date(), chatId: id },
    ],
  });

  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData({
        type: "user-message-id",
        content: userMessageId,
      });

      const stream = streamText({
        model: openai(model),
        system: prompt,
        messages,
        onFinish: async ({ response }) => {
          await saveMessages({
            messages: messages.map((message) => {
              const messageId = v4();
              if (message.role === "assistant") {
                dataStream.writeMessageAnnotation({
                  messageIdFromServer: messageId,
                });
              }
              return {
                id: messageId,
                chatId: id,
                role: message.role,
                content: message.content,
                createdAt: new Date(),
              };
            }),
          });
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: "stream-text",
        },
      });

      stream.mergeIntoDataStream(dataStream);
    },
  });
}
