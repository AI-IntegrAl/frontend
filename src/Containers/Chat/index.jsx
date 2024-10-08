import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy } from "react-icons/fa";

// Function to handle copying code to clipboard
const handleCopy = (code) => {
  navigator.clipboard.writeText(code);
  alert("Code copied to clipboard!");
};

// Component for the tab navigation
function TabNavigation({ activeTab, setActiveTab, tabs, deleteTab, setTabs }) {
  return (
    <div className="w-1/2 bg-gray-100 p-4 border-r flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <div className="flex-1 overflow-y-auto">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-3 py-2 mb-2 rounded-lg cursor-pointer ${
              activeTab === index
                ? "bg-indigo-500 text-white"
                : "bg-white text-gray-800"
            } hover:bg-indigo-400 hover:text-white transition-colors`}
            onClick={() => setActiveTab(index)}
          >
            <span>{tab}</span>
            <button
              className="opacity-0 hover:opacity-100 ml-2 text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                deleteTab(index);
              }}
            >
              {/* Using SVG for the cross icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
        onClick={() => {
          const newTabName = `Chat ${tabs.length + 1}`;
          console.log(newTabName);
          // Prevent duplicate tab names
          if (!tabs.includes(newTabName)) {
            setTabs([...tabs, newTabName]);
            setActiveTab(tabs.length);
          }
        }}
      >
        + New Chat
      </button>
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
    <div
      className="flex flex-col h-full p-4 bg-white overflow-y-auto"
      ref={chatAreaRef}
    >
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
                          <span className="text-xs text-gray-500 italic mb-1">
                            {match[1]}
                          </span>
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
  const initialTabs = ["Chat 1"];
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false); // New state for streaming
  const textareaRef = useRef(null);
  const API_URL = "https://backend-f5qq.onrender.com/chat"; // Backend API URL
  const systemMessage = {
    role: "system",
    content: "You are a helpful assistant.",
  };
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
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: newMessage },
    ]);
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
        {
          sender: "bot",
          text: "Sorry, Something went wrong. I couldn't get a response.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };
  const deleteTab = (index) => {
    if (tabs.length === 1) return; // Prevent deleting the last tab
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    if (activeTab === index) {
      setActiveTab(0);
    } else if (activeTab > index) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Tab Navigation on the Left */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        deleteTab={deleteTab}
        setTabs={setTabs}
      />

      {/* Chat Area */}
      <div className="flex flex-col flex-grow">
        <ChatArea messages={messages} />

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
            style={{ minHeight: "40px", maxHeight: "200px" }}
          />
          <button
            type="submit"
            className="ml-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
