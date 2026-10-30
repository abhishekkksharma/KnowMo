"use client"

import { ImagePlus, Loader2, Upload, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';

const API_BASE = 'http://localhost:5000/api';

interface Department {
    _id: string;
    name: string;
    departmentCode: string;
}

interface Subject {
    _id: string;
    name: string;
    subjectCode: string;
}

interface MCQ {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

function GenerateByImage() {
    // Data State
    const [departments, setDepartments] = useState<Department[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loadingDepts, setLoadingDepts] = useState(true);
    const [loadingSubjects, setLoadingSubjects] = useState(false);

    // Form State
    const [department, setDepartment] = useState<string>('');
    const [departmentCode, setDepartmentCode] = useState<string>('');
    const [subjectCode, setSubjectCode] = useState<string>('');
    const [numberOfQuestions, setNumberOfQuestions] = useState<string>('100');

    // Image State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [generatedMcqs, setGeneratedMcqs] = useState<MCQ[]>([]);
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch departments on mount
    useEffect(() => {
        async function fetchDepartments() {
            try {
                const res = await fetch(`${API_BASE}/department`);
                const data = await res.json();
                setDepartments(Array.isArray(data) ? data : []);
            } catch {
                setDepartments([]);
            } finally {
                setLoadingDepts(false);
            }
        }
        fetchDepartments();
    }, []);

    // Fetch subjects when department changes
    useEffect(() => {
        if (!departmentCode) {
            setSubjects([]);
            return;
        }
        setLoadingSubjects(true);
        setSubjectCode('');
        async function fetchSubjects() {
            try {
                const res = await fetch(`${API_BASE}/subject/${departmentCode}`);
                const data = await res.json();
                setSubjects(Array.isArray(data.subjects) ? data.subjects : []);
            } catch {
                setSubjects([]);
            } finally {
                setLoadingSubjects(false);
            }
        }
        fetchSubjects();
    }, [departmentCode]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setMessage(null);
            setGeneratedMcqs([]);
        }
    };

    const handleDepartmentChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selected = departments.find(d => d._id === e.target.value);
        setDepartment(e.target.value);
        setDepartmentCode(selected?.departmentCode ?? '');
        setSubjectCode('');
        setMessage(null);
        setGeneratedMcqs([]);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setGeneratedMcqs([]);

        if (!imageFile || !subjectCode) {
            setMessage({ type: 'error', text: 'Please select an image and a subject.' });
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('numberOfQuestions', numberOfQuestions);

            const response = await fetch(`${API_BASE}/resource/test/mcqs/${subjectCode}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error((err as { message?: string }).message || 'Failed to generate MCQs');
            }

            const data = await response.json();
            const mcqs: MCQ[] = Array.isArray(data.data) ? data.data : [];
            setGeneratedMcqs(mcqs);
            setMessage({ type: 'success', text: `${mcqs.length} MCQs generated and saved to the question bank!` });
        } catch (error) {
            console.error('API Error:', error);
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Something went wrong while processing the image.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const selectClass = `
        w-full rounded-full border border-gray-200 bg-white px-5 py-3.5 text-sm
        focus:border-black focus:ring-1 focus:ring-black outline-none transition-all
        dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white dark:focus:ring-white
        appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
    `;

    return (
        <div className='max-w-6xl mx-auto w-full flex flex-col gap-10 p-6 md:p-12 bg-white dark:bg-[#0a0a0a]'>

            {/* Top Section: Image Upload + Form */}
            <div className='flex flex-col md:flex-row gap-12'>

                {/* Left Side: Image Upload */}
                <div
                    className='relative w-full md:w-1/2 rounded-3xl border-2 border-dashed border-gray-200 dark:border-zinc-800 min-h-[400px] flex flex-col justify-center items-center cursor-pointer overflow-hidden hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group'
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                    {imagePreview ? (
                        <>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                    Click to change
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center text-black dark:text-white gap-4 pointer-events-none">
                            <div className="p-4 rounded-full bg-gray-100 dark:bg-zinc-900">
                                <ImagePlus className='w-8 h-8' />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-lg">Upload material</p>
                                <p className="text-sm text-gray-500 mt-1 font-mono">PNG, JPG, WebP up to 10MB</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Form Controls */}
                <div className='w-full md:w-1/2 flex flex-col justify-center'>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white mb-8">
                        Generate MCQs.
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Department */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black dark:text-white ml-1">Department</label>
                            <div className="relative">
                                <select
                                    value={department}
                                    onChange={handleDepartmentChange}
                                    className={selectClass}
                                    required
                                    disabled={loadingDepts}
                                >
                                    <option value="" disabled>
                                        {loadingDepts ? 'Loading departments...' : 'Select Department...'}
                                    </option>
                                    {departments.map(dept => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={15} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-black dark:text-white ml-1">Subject</label>
                            <div className="relative">
                                <select
                                    value={subjectCode}
                                    onChange={(e) => { setSubjectCode(e.target.value); setMessage(null); setGeneratedMcqs([]); }}
                                    disabled={!department || loadingSubjects}
                                    className={selectClass}
                                    required
                                >
                                    <option value="" disabled>
                                        {loadingSubjects ? 'Loading subjects...' : 'Select Subject...'}
                                    </option>
                                    {subjects.map(sub => (
                                        <option key={sub._id} value={sub.subjectCode}>
                                            {sub.name} ({sub.subjectCode})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={15} className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                            </div>
                        </div>

                        {/* Number of Questions */}
                        <div className="flex flex-col gap-2 mb-4">
                            <label className="text-sm font-semibold text-black dark:text-white ml-1">Number of Questions</label>
                            <input
                                type="number"
                                min="1"
                                max="500"
                                value={numberOfQuestions}
                                onChange={(e) => setNumberOfQuestions(e.target.value)}
                                className="w-full rounded-full border border-gray-200 bg-white px-5 py-3.5 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-all dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-white dark:focus:ring-white"
                                required
                            />
                        </div>

                        {/* Status Message */}
                        {message && (
                            <div
                                role="status"
                                aria-live="polite"
                                className={`flex items-start gap-2 rounded-2xl border p-3 text-sm ${
                                    message.type === 'error'
                                        ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400'
                                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400'
                                }`}
                            >
                                {message.type === 'error' ? (
                                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                                ) : (
                                    <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
                                )}
                                <span>{message.text}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !imageFile || !subjectCode}
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-black px-6 py-4 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-all dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Generate
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Generated MCQs Preview */}
            {generatedMcqs.length > 0 && (
                <section className="rounded-3xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
                        <h3 className="font-semibold text-black dark:text-white">
                            Generated Questions
                        </h3>
                        <span className="rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-3 py-1">
                            {generatedMcqs.length}
                        </span>
                    </div>
                    <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {generatedMcqs.map((mcq, idx) => (
                            <li key={idx} className="px-6 py-4">
                                <button
                                    className="w-full text-left flex items-start justify-between gap-4"
                                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                                >
                                    <span className="text-sm font-medium text-black dark:text-white leading-snug">
                                        <span className="text-gray-400 dark:text-zinc-500 font-mono mr-2">Q{idx + 1}.</span>
                                        {mcq.question}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`shrink-0 mt-0.5 text-gray-400 transition-transform duration-200 ${expandedIdx === idx ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {expandedIdx === idx && (
                                    <div className="mt-3 pl-6 space-y-2">
                                        <ul className="space-y-1.5">
                                            {mcq.options.map((opt, oi) => (
                                                <li
                                                    key={oi}
                                                    className={`text-sm px-3 py-2 rounded-lg ${
                                                        opt === mcq.correctAnswer
                                                            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 font-semibold'
                                                            : 'bg-gray-50 text-gray-700 dark:bg-zinc-900 dark:text-zinc-300'
                                                    }`}
                                                >
                                                    {opt === mcq.correctAnswer && (
                                                        <CheckCircle2 size={13} className="inline mr-1.5 -mt-0.5" />
                                                    )}
                                                    {opt}
                                                </li>
                                            ))}
                                        </ul>
                                        {mcq.explanation && (
                                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 italic">
                                                💡 {mcq.explanation}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

export default GenerateByImage;
