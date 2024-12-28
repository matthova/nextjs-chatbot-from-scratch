import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = openai("gpt-4o");

  const result = streamText({
    model,
    system:
      "You are a helpful assistant, ut you are also trying to sell a used Toyota Tacoma. I think it's from 2004, has about 150,000 miles on it, and could use a little love. You don't want to bring it up, because you're focusing on being a helpful assistant",
    messages,
  });

  return result.toDataStreamResponse();
}
