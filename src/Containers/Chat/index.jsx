import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy } from 'react-icons/fa';

// Function to handle copying code to clipboard
const handleCopy = (code) => {
  navigator.clipboard.writeText(code);
  alert('Code copied to clipboard!');
};

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
  const chatAreaRef = useRef(null);

  // Effect to auto-scroll to the bottom of the chat area when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full p-4 bg-white overflow-y-auto" ref={chatAreaRef}>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`mb-4 ${
            msg.sender === "user" ? "text-right" : "text-left"
          }`}
        >
          {msg.sender === "user" ? (
            <p className="inline-block px-4 py-2 rounded-lg bg-indigo-500 text-white">
              {msg.text}
            </p>
          ) : (
            <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeContent = String(children).replace(/\n$/, "");

                    return !inline && match ? (
                      <div className="relative">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 italic mb-1">{match[1]}</span>
                          <button
                            onClick={() => handleCopy(codeContent)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FaCopy />
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {codeContent}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Chat Page Component with Streaming Support
function ChatPage() {
  const tabs = ["Chat 1", "Chat 2", "Chat 3"];
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false); // New state for streaming
  const textareaRef = useRef(null);
  const API_URL = 'https://backend-f5qq.onrender.com/chat'; // Backend API URL
  const systemMessage = { role: "system", content: "You are a helpful assistant." };
  const model = "gpt-4o-mini"; // Fixed model value

  // Handle textarea auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  // Function to handle sending a message with streaming support
const sendMessage = async (e) => {
  e.preventDefault();
  if (newMessage.trim() === "") return;

  const userMessage = { role: "user", content: newMessage };
  setMessages((prevMessages) => [...prevMessages, { sender: "user", text: newMessage }]);
  setNewMessage("");

  // Prepare messages for API call
  const apiMessages = [
    systemMessage,
    ...messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
    userMessage,
  ];

  setIsStreaming(true);

  // Add a placeholder bot message (empty) to be updated with streaming data
  setMessages((prevMessages) => [
    ...prevMessages,
    { sender: "bot", text: "" }, // Initially empty bot message
  ]);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: apiMessages }),
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiResponse = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      aiResponse += chunk;

      // Instead of adding a new message, update the last bot message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].text = aiResponse; // Update the last bot message
        return updatedMessages;
      });
    }
  } catch (error) {
    console.error("Error fetching data from API:", error);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "Sorry, Something went wrong. I couldn't get a response." },
    ]);
  } finally {
    setIsStreaming(false);
  }
};

  return (
    <div className="flex flex-col h-screen">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="flex-grow">
        <ChatArea messages={messages} />
      </div>
      <form onSubmit={sendMessage} className="flex items-center p-4 bg-gray-100">
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-auto"
          style={{ minHeight: '40px', maxHeight: '200px' }}
        />
        <button type="submit" className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPage;