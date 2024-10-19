import React, { useState, useRef, useEffect, useContext } from "react";
import { notify } from "../../Utils/notify";
import { getUserChat } from "../../Services/Chat/userChat";
import ChatArea from "./Components/ChatArea";
import TabNavigation from "./Components/TabNavigation";
import { MessageSquare, Send, Menu } from "lucide-react";
import { artifactsPrompt } from "../../Services/constants";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

// Chat Page Component with Streaming Support and Enhanced UI
function ChatPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const initialTabs = ["Chat 1"];
  const [tabs, setTabs] = useState(initialTabs);
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const textareaRef = useRef(null);
  const systemMessage = {
    role: "system",
    content: artifactsPrompt,
  };

  console.log(user);


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

    const apiMessages = [
      systemMessage,
      ...messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      userMessage,
    ];

    setIsStreaming(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "" },
    ]);

    try {
      const response = await getUserChat(apiMessages);
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        aiResponse += chunk;

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].text = aiResponse;
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
      notify(
        "Sorry, Something went wrong. I couldn't get a response.",
        "error"
      );
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center">
            <MessageSquare className="mr-2" /> ChatBot
          </h1>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex overflow-hidden">
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:relative lg:inset-auto">
            <div
              className="absolute inset-0 bg-gray-600 opacity-75 lg:hidden"
              onClick={toggleSidebar}
            ></div>
            <div className="relative w-64 h-full">
              <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                deleteTab={deleteTab}
                setTabs={setTabs}
              />
            </div>
          </div>
        )}

        <div className="flex-grow flex flex-col bg-white rounded-lg shadow-lg m-2 sm:m-4 overflow-hidden">
          <ChatArea messages={messages} />

          <form
            onSubmit={sendMessage}
            className="flex items-center p-2 sm:p-4 bg-gray-50 border-t"
          >
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 text-sm sm:text-base border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none overflow-y-auto"
              style={{ maxHeight: "200px" }}
              rows={1}
            />
            <button
              type="submit"
              className={` bg-indigo-600 text-white p-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isStreaming ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isStreaming || newMessage.trim() === ""}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
