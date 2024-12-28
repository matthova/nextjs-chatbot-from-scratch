"use client";

import { useChat } from "ai/react";

export default function Page() {
  const chatArgs = useChat();

  return (
    <div>
      {chatArgs.messages.map((message) => (
        <div key={message.id}>
          <div>{message.role}</div>
          <div>{message.content}</div>
        </div>
      ))}

      <form onSubmit={chatArgs.handleSubmit}>
        <input
          className="bg-white text-black border border-solid border-black"
          value={chatArgs.input}
          placeholder="Send a message..."
          onChange={chatArgs.handleInputChange}
          disabled={chatArgs.isLoading}
        />
      </form>
    </div>
  );
}
