"use client"

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Image as ImageIcon, MessageSquareText, Plus } from 'lucide-react';
import GenerateByImage from './GenerateByImage';
import GenerateByPrompt from './GenerateByPrompt';
import AddMcqs from './AddMcqs';

type Tab = 'add' | 'generate-image' | 'generate-prompt';

function GenerateTest() {
    const [activeTab, setActiveTab] = useState<Tab>('generate-prompt');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGenerateSelect = (tab: Tab) => {
        setActiveTab(tab);
        setIsDropdownOpen(false);
    };

    return (
        <div className='max-w-6xl mx-auto w-full p-4 md:p-8 py-10'>
            
            {/* Navigation Controls */}
            <div className='flex gap-3 font-mono px-4 md:px-10 mb-8'>
                
                {/* Add MCQs Button */}
                <button 
                    onClick={() => setActiveTab('add')}
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all border-2 ${
                        activeTab === 'add' 
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                        : 'border-gray-200 bg-transparent text-gray-500 hover:border-gray-300 hover:text-black dark:border-zinc-800 dark:text-gray-400 dark:hover:border-zinc-600 dark:hover:text-white'
                    }`}
                >
                    <Plus className="w-4 h-4" />
                    Add MCQs
                </button>

                {/* Generate Dropdown Wrapper */}
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all border-2 ${
                            (activeTab === 'generate-image' || activeTab === 'generate-prompt')
                            ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black' 
                            : 'border-gray-200 bg-transparent text-gray-500 hover:border-gray-300 hover:text-black dark:border-zinc-800 dark:text-gray-400 dark:hover:border-zinc-600 dark:hover:text-white'
                        }`}
                    >
                        {activeTab === 'generate-image' ? 'Generate: Image' : activeTab === 'generate-prompt' ? 'Generate: Prompt' : 'Generate'}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-[#0a0a0a] z-50 flex flex-col gap-1 font-sans">
                            <button
                                onClick={() => handleGenerateSelect('generate-image')}
                                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    activeTab === 'generate-image'
                                    ? 'bg-gray-100 text-black dark:bg-zinc-900 dark:text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-900/50 dark:hover:text-white'
                                }`}
                            >
                                <ImageIcon className="w-4 h-4" />
                                By Image
                            </button>
                            <button
                                onClick={() => handleGenerateSelect('generate-prompt')}
                                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                    activeTab === 'generate-prompt'
                                    ? 'bg-gray-100 text-black dark:bg-zinc-900 dark:text-white'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-black dark:text-gray-400 dark:hover:bg-zinc-900/50 dark:hover:text-white'
                                }`}
                            >
                                <MessageSquareText className="w-4 h-4" />
                                By Prompt
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Content Rendering */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'add' && <AddMcqs />}
                {activeTab === 'generate-image' && <GenerateByImage />}
                {activeTab === 'generate-prompt' && <GenerateByPrompt />}
            </div>

        </div>
    );
}

export default GenerateTest;