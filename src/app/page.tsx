"use client";

import { useChat } from "ai/react";

export default function Page() {
  const chatModelA = useChat({
    body: { model: "gpt-4o" },
    onError: (error) => {
      console.error("gpt-4o error", error);
    },
  });
  const chatModelB = useChat({
    body: { model: "gpt-4o-mini" },
    onError: (error) => {
      console.error("o1 error", error);
    },
  });

  return (
    <div>
      <div className="flex">
        <div className="flex-1">
          {chatModelA.messages.map((message) => (
            <div key={message.id}>
              <div>{message.role}</div>
              <div>{message.content}</div>
            </div>
          ))}
        </div>
        <div className="flex-1">
          {chatModelB.messages.map((message) => (
            <div key={message.id}>
              <div>{message.role}</div>
              <div>{message.content}</div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={(formEvent) => {
          chatModelA.handleSubmit(formEvent);
          chatModelB.handleSubmit(formEvent);
        }}
      >
        <input
          className="bg-white text-black border border-solid border-black"
          value={chatModelA.input}
          placeholder="Send a message..."
          onChange={(e) => {
            chatModelA.handleInputChange(e);
            chatModelB.handleInputChange(e);
          }}
          disabled={chatModelA.isLoading || chatModelB.isLoading}
        />
      </form>
    </div>
  );
}
