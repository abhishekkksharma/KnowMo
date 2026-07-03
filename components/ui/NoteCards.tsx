"use client";

import React from "react";
import { Caveat, Shadows_Into_Light } from "next/font/google";
import { motion, Variants } from "framer-motion";

const caveat = Caveat({
    subsets: ["latin"],
    weight: ["400", "700"],
});

const shadows = Shadows_Into_Light({
    subsets: ["latin"],
    weight: "400",
});

export default function ThemeCards() {
    const notes = [
        "- DBMS",
        "- Complete DSA",
        "- Check Website Build",
        "- Revise OOP",
        "- Check deployment",
    ];

    const cardSize = "w-56 h-60";

    const quoteCardVariants: Variants = {
        initial: { opacity: 0, scale: 0.8, rotate: 0, x: -20 },
        animate: { 
            opacity: 1, 
            scale: 1, 
            rotate: -10, 
            x: 0,
            transition: { type: "spring", stiffness: 80, damping: 12, delay: 0.1 } 
        },
        hover: { 
            rotate: -18, 
            x: -24, 
            y: -8,
            transition: { type: "spring", stiffness: 150, damping: 15 }
        }
    };

    const notebookCardVariants: Variants = {
        initial: { opacity: 0, scale: 0.8, rotate: 0, x: 20 },
        animate: { 
            opacity: 1, 
            scale: 1, 
            rotate: 8, 
            x: 0,
            transition: { type: "spring", stiffness: 80, damping: 12, delay: 0.2 } 
        },
        hover: { 
            rotate: 14, 
            x: 24, 
            y: 16,
            transition: { type: "spring", stiffness: 150, damping: 15 }
        }
    };

    return (
        <div className="flex md:mt-0 mt-0 items-center justify-center bg-transparent">
            <motion.div 
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="relative w-96 h-96 cursor-pointer"
            >
                {/* Quote Card */}
                <motion.div
                    variants={quoteCardVariants}
                    className={`absolute top-4 left-12 ${cardSize} bg-[#0a0a0a] rounded-[2.5rem] border border-gray-800 shadow-2xl shadow-gray-400/50 dark:shadow-lg z-10 flex flex-col p-7`}
                >
                    <div className="text-white text-7xl font-serif leading-none mt-2">
                        “
                    </div>

                    <div className="flex flex-col gap-3 mt-auto mb-2">
                        <div className="h-2.5 w-11/12 bg-gray-500 rounded-full" />
                        <div className="h-2.5 w-full bg-gray-500 rounded-full" />
                        <div className="h-2.5 w-3/4 bg-gray-500 rounded-full" />
                    </div>
                </motion.div>

                {/* Notebook Card */}
                <motion.div
                    variants={notebookCardVariants}
                    className={`absolute top-12 left-24 sm:top-14 sm:left-28 md:top-16 md:left-32 ${cardSize}
                        bg-[#FBECA0] rounded-[2.5rem] shadow-2xl dark:shadow-lg
                        shadow-gray-400/60 dark:shadow-gray-600/90
                        z-20 overflow-hidden flex flex-col`}
                >
                    {/* Header */}
                    <div className="w-full h-11 bg-[#0a0a0a] shrink-0" />

                    {/* Notebook Body */}
                    <div className="relative flex-1 overflow-hidden">
                        {/* Red margin lines */}
                        <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-400/40" />
                        <div className="absolute left-7 top-0 bottom-0 w-[1px] bg-red-400/40" />

                        {/* Notebook content */}
                        <div className="relative z-10 mt-3">
                            {notes.map((note, index) => (
                                <div
                                    key={index}
                                    className="h-[1.65rem] border-b border-orange-300/40 pl-10 flex items-end pb-1"
                                >
                                    <span
                                        className={`${index === 0 ? caveat.className : shadows.className
                                            } text-[#1f4db8] ${index === 0
                                                ? "text-xl font-bold"
                                                : "text-[15px] tracking-wide"
                                            }`}
                                    >
                                        {note}
                                    </span>
                                </div>
                            ))}

                            {/* Empty notebook lines */}
                            <div className="h-[1.65rem] border-b border-orange-300/40" />
                            <div className="h-[1.65rem] border-b border-orange-300/40" />
                            <div className="h-[1.65rem] border-b border-orange-300/40" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
