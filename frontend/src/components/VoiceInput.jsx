import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, X, Loader } from 'lucide-react';

// Get the browser-specific SpeechRecognition object
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const VoiceInput = ({
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    textarea = false,
    rows = 4,
    className,
    disabledVoice = false,
    ...props
}) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const [error, setError] = useState(null);

    const isApiSupported = !!SpeechRecognition;

    // Voice input is disabled for these HTML types
    const isTypeDisabled = ['month', 'date', 'tel'].includes(type);
    const isVoiceDisabled = isTypeDisabled || disabledVoice || !isApiSupported;


    const handleResult = useCallback((event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;

        const currentValue = String(value || "").trim();

        const newValue = currentValue + (currentValue.length > 0 ? " " : "") + transcript;

        if (typeof onChange === 'function') {
            onChange({
                target: {
                    value: newValue.trim(),
                    name: props.name
                }
            });
        }
    }, [onChange, value, props.name]);

    const createRecognition = useCallback(() => {
        const newRecognition = new SpeechRecognition();
        newRecognition.continuous = false;
        newRecognition.interimResults = false;
        newRecognition.lang = 'en-US';

        newRecognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        newRecognition.onresult = handleResult;

        newRecognition.onend = () => {
            setIsListening(false);
        };

        newRecognition.onerror = (event) => {
            setIsListening(false);
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                setError(`Speech recognition error: ${event.error}`);
            }
        };

        return newRecognition;
    }, [handleResult]);

    useEffect(() => {
        if (!isApiSupported) {
            setError("Web Speech API not supported in this browser.");
            return;
        }

        return () => {
            const currentRecognition = recognitionRef.current;
            if (currentRecognition) {
                currentRecognition.onend = null;
                currentRecognition.onerror = null;
                if (currentRecognition.state === 'listening') {
                    currentRecognition.abort();
                }
            }
        };
    }, [isApiSupported]);


    const toggleListening = () => {
        if (isVoiceDisabled) return;

        if (isListening) {
            recognitionRef.current?.abort();
        } else {
            try {
                setError(null);
                recognitionRef.current = createRecognition();
                recognitionRef.current.start();
            } catch (e) {
                console.error('Recognition start error:', e);
            }
        }
    };

    const inputClasses = className || "w-full border border-slate-300 rounded-md py-2 px-4 shadow-sm focus:outline-none focus:ring-1 focus:ring-violet-500 transition duration-150 ease-in-out";

    const buttonClasses = `absolute right-2 p-1 rounded-full transition duration-150 ease-in-out z-10 
                           flex items-center justify-center w-8 h-8
                           ${textarea ? 'top-2' : 'top-1/2 -translate-y-1/2'}
                           ${isListening
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'} 
                           ${isVoiceDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    const fieldStyle = `${inputClasses} ${textarea ? 'resize-none' : 'pr-10'}`;

    const Field = textarea ? 'textarea' : 'input';

    return (
        <div className="relative">
            {label && <label className="block text-sm font-bold text-slate-700 mb-3">{label}</label>}
            <Field
                type={type}
                className={fieldStyle}
                placeholder={placeholder}
                value={value || ""}
                onChange={onChange}
                rows={textarea ? rows : undefined}
                {...props}
            />
            {/* Render button only if voice is not disabled by type or manually */}
            {!isVoiceDisabled && (
                <button
                    type="button"
                    onClick={toggleListening}
                    className={buttonClasses}
                    title={isListening ? "Stop Voice Input / Cancel" : "Start Voice Input"}
                    disabled={isVoiceDisabled}
                >
                    {isListening ? <X size={16} /> : <Mic size={16} />}
                </button>
            )}
            {isListening && (
                <p className="mt-1 text-xs text-violet-500 flex items-center">
                    <Loader size={12} className="animate-spin mr-1" /> Listening...
                </p>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
};