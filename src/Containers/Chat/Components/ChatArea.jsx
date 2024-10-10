// src/components/ChatArea.jsx

import React, { useEffect, useRef, memo } from "react";
import ReactMarkdown from "react-markdown";
import { FaCopy } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import PropTypes from "prop-types";
import { handleCopy } from "../../../Utils/handleCopy"; // Ensure this path is correct

// Alternatively, using external URLs
const userAvatar = "https://via.placeholder.com/40?text=U";
const botAvatar = "https://via.placeholder.com/40?text=AI";

// CodeBlock component for rendering code with copy functionality
const CodeBlock = ({ language, value }) => {
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500 italic">{language}</span>
        <button
          onClick={() => handleCopy(value)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Copy code"
        >
          <FaCopy />
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        className="rounded-lg overflow-hidden text-xs sm:text-sm"
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

CodeBlock.propTypes = {
  language: PropTypes.string,
  value: PropTypes.string.isRequired,
};

// Message component for rendering individual messages with avatars
const Message = ({ msg }) => {
  const isUser = msg.sender === "user";

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <img
          src={botAvatar}
          alt="Bot Avatar"
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3"
        />
      )}

      <div className={`max-w-[80%] sm:max-w-[70%] ${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg px-3 py-2 sm:px-4 sm:py-2 shadow`}>
        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-sm sm:text-base text-left">{msg.text}</p>
        ) : (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : "";
                const codeContent = String(children).replace(/\n$/, "");

                return !inline && language ? (
                  <CodeBlock language={language} value={codeContent} />
                ) : (
                  <code className={`${className} bg-gray-200 rounded px-1 text-xs sm:text-sm`} {...props}>
                    {children}
                  </code>
                );
              },
            }}
            className="text-sm sm:text-base text-left"
          >
            {msg.text}
          </ReactMarkdown>
        )}
      </div>

      {isUser && (
        <img
          src={userAvatar}
          alt="User Avatar"
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full ml-2 sm:ml-3"
        />
      )}
    </div>
  );
};

Message.propTypes = {
  msg: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

// Main ChatArea component
const ChatArea = ({ messages }) => {
  const chatAreaRef = useRef(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="flex-grow p-2 sm:p-4 overflow-y-auto bg-white"
      ref={chatAreaRef}
    >
      {messages.map((msg, index) => (
        <Message key={index} msg={msg} />
      ))}
    </div>
  );
};

ChatArea.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      sender: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};

// Exporting memoized ChatArea to prevent unnecessary re-renders
export default memo(ChatArea);
