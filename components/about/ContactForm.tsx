"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const baseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;

function ContactForm() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const showExtraFields = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async () => {
        if (!email || !message.trim()) return;

        setLoading(true);

        try {
            const response = await fetch(`${baseUrl}/api/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject: "Portfolio Contact",
                    content: message,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            alert("Message sent successfully!");

            setEmail("");
            setName("");
            setMessage("");
        } catch (error) {
            console.error(error);
            alert("Failed to send message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center px-4">
            <div className="w-full max-w-lg flex flex-col gap-3">

                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                        {loading ? "Sending..." : "Contact Us"}
                    </button>
                </div>

                <AnimatePresence>
                    {showExtraFields && (
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-2"
                        >
                            <motion.input
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                                type="text"
                                placeholder="Name (Optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />

                            <motion.textarea
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                placeholder="Your message..."
                                rows={6}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full resize-none rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-black px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

export default ContactForm;