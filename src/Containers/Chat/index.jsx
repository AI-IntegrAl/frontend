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
  return (
    <div className="flex flex-col h-full p-4 bg-white overflow-y-auto">
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
            // For bot/assistant messages, render markdown and syntax highlighting
            <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-800">
              <ReactMarkdown
                components={{
                  // Customize rendering of code blocks
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeContent = String(children).replace(/\n$/, ""); // Remove trailing newline

                    return !inline && match ? (
                      <div className="relative">
                        <div className="flex justify-between items-center">
                          {/* Show the detected language */}
                          <span className="text-xs text-gray-500 italic mb-1">{match[1]}</span>

                          {/* Copy button */}
                          <button
                            onClick={() => handleCopy(codeContent)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <FaCopy />
                          </button>
                        </div>

                        {/* Render the code block with syntax highlighting */}
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

// Chat Page Component
function ChatPage() {
  const tabs = ["Chat 1", "Chat 2", "Chat 3"];
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const textareaRef = useRef(null);

  const API_URL = 'https://backend-f5qq.onrender.com/chat'; // Backend API URL
  const systemMessage = {
    role: "system",
    content: "You are a helpful assistant."
  };
  const model = "gpt-4o-mini"; // Fixed model value

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  // Function to handle sending a message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      const userMessage = { role: "user", content: newMessage };

      setMessages([...messages, { sender: "user", text: newMessage }]);
      setNewMessage("");

      // Prepare messages for API call (add system message and all user messages)
      const apiMessages = [
        systemMessage, // Always include system message at the start
        ...messages.map(msg => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.text })),
        userMessage
      ];

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: model,
            messages: apiMessages
          })
        });

        const data = await response.text();
        const botResponse = data || "Sorry, I couldn't get a response.";

        setMessages(prevMessages => [
          ...prevMessages,
          { sender: "bot", text: botResponse }
        ]);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
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
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-auto"
          style={{ minHeight: '40px', maxHeight: '200px' }}
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
