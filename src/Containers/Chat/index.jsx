import React, { useState } from "react";

// Component for the tab navigation
function TabNavigation({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex space-x-4 bg-gray-100 p-4 border-b">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`px-4 py-2 rounded-lg ${
            activeTab === index
              ? "bg-indigo-500 text-white"
              : "bg-white text-gray-800"
          }`}
          onClick={() => setActiveTab(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// Component for the chat area
function ChatArea({ messages }) {
  return (
    <div className="flex flex-col h-full p-4 bg-white overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 ${
            msg.sender === "user" ? "text-right" : "text-left"
          }`}
        >
          <p
            className={`inline-block px-4 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </p>
        </div>
      ))}
    </div>
  );
}

// Chat Page Component
function ChatPage() {
  const tabs = ["Chat 1", "Chat 2", "Chat 3"];
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
    { sender: "user", text: "Tell me a joke!" },
    {
      sender: "bot",
      text: "Why don’t skeletons fight each other? They don’t have the guts.",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "user", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      {/* Chat Area */}
      <div className="flex-grow">
        <ChatArea messages={messages} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center p-4 bg-gray-100"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPage;
