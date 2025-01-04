import { Tab } from "@headlessui/react";
import React from "react";
import { TabsProps } from "../../tasksTypes";

const Tabs: React.FC<TabsProps> = ({ tabs, setSelected, children }) => {
  return (
    <div className="w-full">
      <Tab.Group onChange={(index) => setSelected(index)}>
        <Tab.List className="flex items-center justify-start space-x-4 border-b border-gray-200 pb-2">
          {tabs.map((tab) => (
            <Tab
              key={tab.title}
              className={({ selected }) =>
                `flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md outline-none transition duration-200 ${
                  selected
                    ? "bg-blue-100 text-blue-600 shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                }`
              }
            >
              {tab.icon}
              <span>{tab.title}</span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">{children}</Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
