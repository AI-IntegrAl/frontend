// src/components/ChatArea.jsx

import React, { useEffect, useRef, memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { FaCopy } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import PropTypes from "prop-types";
import { handleCopy } from "../../../Utils/handleCopy"; // Ensure this path is correct
import { sharedOptions } from "../../../Services/constants";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  Sandpack,
} from "@codesandbox/sandpack-react";
import { useSelector } from "react-redux";

// Alternatively, using external URLs
const botAvatar = "https://via.placeholder.com/40?text=AI";

const parseMessage = (message) => {
  // Regex for finding content inside <antthinking> tags
  const thinkingRegex = /<antthinking>(.*?)<\/antthinking>/gs;
  const thinkingMatch = thinkingRegex.exec(message);

  // Regex for finding <antartifact> tags and extracting attributes
  const artifactRegex =
    /<antartifact\s+identifier="(.*?)"\s+type="(.*?)"\s+title="(.*?)">(.*?)<\/antartifact>/gs;
  const artifactMatch = artifactRegex.exec(message);

  // Extract <antthinking> content
  const antThinking = thinkingMatch ? thinkingMatch[1] : null;
  const contentWithoutThinking = message.replace(thinkingRegex, "").trim();

  // Extract <antartifact> content
  let artifact = null;
  if (artifactMatch) {
    artifact = {
      identifier: artifactMatch[1],
      type: artifactMatch[2],
      title: artifactMatch[3],
      code: artifactMatch[4], // The code inside the artifact tag
    };
  }
  // console.log(artifact);

  return {
    content: contentWithoutThinking.replace(artifactRegex, "").trim(), // message without <antartifact> content
    antThinking,
    artifact,
  };
};

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
  const { user: userInfo } = useSelector((state) => state.user); // Get user info from Redux store

  const [tab, setTab] = useState("preview"); // State to control the active tab

  const userAvatar =
    userInfo?.picture ||
    `https://via.placeholder.com/40?text=${userInfo?.name?.charAt(0) || "U"}`;

  // Parse the message content to separate regular, <antthinking>, and <antartifact> content
  const { content, antThinking, artifact } = parseMessage(msg.text);

  return (
    <div className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <img
          src={botAvatar}
          alt="Bot Avatar"
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3"
        />
      )}

      <div
        className={`max-w-[80%] sm:max-w-[70%] ${
          isUser ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
        } rounded-lg px-3 py-2 sm:px-4 sm:py-2 shadow`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-sm sm:text-base text-left">
            {msg.text}
          </p>
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
                  <code
                    className={`${className} bg-gray-200 rounded px-1 text-xs sm:text-sm`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              a({ href, children, ...props }) {
                return (
                  <a
                    href={href}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
            }}
            className="text-sm sm:text-base text-left"
          >
            {content}
          </ReactMarkdown>
        )}
        {/* If there is antThinking content, display it in a nested box */}
        {antThinking && (
          <div className="mt-2 p-2 border border-red-500 rounded bg-red-100">
            <p className="text-red-600 text-sm sm:text-base font-semibold">
              {antThinking}
            </p>
          </div>
        )}

        {/* If there is artifact content, display Sandpack Preview and Editor in tabs */}
        {artifact && (
          <div className="mt-4">
            <div className="flex border-b border-gray-300 mb-2">
              <button
                className={`px-4 py-2 ${
                  tab === "preview"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setTab("preview")}
              >
                Preview
              </button>
              <button
                className={`px-4 py-2 ${
                  tab === "code"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => setTab("code")}
              >
                Code
              </button>
            </div>

            {tab === "preview" && (
              <div className="p-3 border border-blue-500 rounded bg-blue-50">
                <p className="text-blue-700 font-semibold text-sm sm:text-base mb-2">
                  {artifact.title}
                </p>
                <SandpackProvider
                  template="react"
                  files={{
                    "/App.js": artifact.code,
                  }}
                  options={{ ...sharedOptions }}
                >
                  <SandpackLayout>
                    <SandpackPreview />
                  </SandpackLayout>
                </SandpackProvider>
              </div>
            )}

            {tab === "code" && (
              <div className="p-3 border border-blue-500 rounded bg-blue-50">
                <SandpackProvider
                  template="react"
                  files={{
                    "/App.js": artifact.code,
                  }}
                  options={{
                    showNavigator: true,
                    showLineNumbers: true,
                    showInlineErrors: true,
                  }}
                >
                  <SandpackLayout>
                    <SandpackCodeEditor
                      style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 14,
                        minHeight: "300px",
                        backgroundColor: "#f4f4f4",
                        borderRadius: "4px",
                        padding: "10px",
                        textAlign: "left",
                      }}
                    />
                  </SandpackLayout>
                </SandpackProvider>
              </div>
            )}
          </div>
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
