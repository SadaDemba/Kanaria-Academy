import React, { useState } from 'react';
import './TabSystem.css';

const TabSystem = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="tab-system">
            <div className="tab-navigation">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`tab-button ${activeTab === index ? 'active' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        {tab.label}
                        {tab.badge && (
                            <span className="tab-badge">{tab.badge}</span>
                        )}
                    </button>
                ))}
            </div>
            <div className="tab-content">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};

export default TabSystem;