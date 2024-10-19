import React from "react";
import PropTypes from "prop-types";
import { X, Plus, MessageSquare, User } from "lucide-react";
import useAuth from "../../../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const TabNavigation = ({
  activeTab,
  setActiveTab,
  tabs,
  deleteTab,
  setTabs,
}) => {
  const { handleLogoutUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col h-full">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Conversations</h2>
      <div className="flex-1 overflow-y-auto">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`flex items-center justify-between px-3 py-2 mb-2 rounded-lg cursor-pointer ${
              activeTab === index
                ? "bg-indigo-600"
                : "hover:bg-gray-700 transition-colors"
            }`}
            onClick={() => setActiveTab(index)}
          >
            <span className="flex items-center truncate text-sm sm:text-base">
              <MessageSquare size={16} className="mr-2" />
              {tab}
            </span>
            {tabs.length > 1 && (
              <button
                className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTab(index);
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        className="mt-4 bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center text-sm sm:text-base"
        onClick={() => {
          const newTabName = `Chat ${tabs.length + 1}`;
          if (!tabs.includes(newTabName)) {
            setTabs([...tabs, newTabName]);
            setActiveTab(tabs.length);
          }
        }}
      >
        <Plus size={18} className="mr-2" /> New Chat
      </button>
      <button
        className="mt-4 bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center text-sm sm:text-base"
        onClick={() => {
          handleLogoutUser(navigate);
        }}
      >
        <User size={18} className="mr-2" /> Signout
      </button>
    </div>
  );
};

TabNavigation.propTypes = {
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  deleteTab: PropTypes.func.isRequired,
  setTabs: PropTypes.func.isRequired,
};

export default TabNavigation;
