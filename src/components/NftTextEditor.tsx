import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NftTextEditorProps {
    bgMode: boolean;
    invertMode: boolean;
    primaryColor?: string;
    secondaryColor?: string;
}

const NftTextEditor: React.FC<NftTextEditorProps> = ({ bgMode, invertMode, primaryColor, secondaryColor }) => {
    const [isFocused, setIsFocused] = useState(false);

    const [content, setContent] = useState(''); // State to hold contentEditable value
    const inputRef = React.useRef<HTMLDivElement>(null);
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleEditorClick: React.MouseEventHandler = (e) => {
        if (wrapperRef.current && wrapperRef.current.contains(e.target as Node)) {
            e.stopPropagation();
        }

        if (inputRef.current) {
            inputRef.current.focus();
            setIsFocused(true);
        }
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const text = e.currentTarget.textContent || '';

        // clean the inner content of the div
        e.currentTarget.innerHTML = '';
        setContent(e.currentTarget.textContent || ''); // Update the state with the content of contentEditable

        // move the cursor to the end of the text
        const range = document.createRange();
        const selection = window.getSelection();
        if (selection) {
            range.selectNodeContents(inputRef.current as Node);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    return (
        <div
            className='flex flex-col items-center justify-center'
            ref={wrapperRef} onClick={handleEditorClick}>
            <div
                className='text-4xl font-bold outline-none bg-transparent w-full min-h-3 uppercase'
                ref={inputRef}
                contentEditable
                suppressContentEditableWarning={true} // Disable the contentEditable warning in React
                onInput={handleInput} // Handle input to sync content
            >
                {content || <>Write something</>} {/* This will be rendered in the contentEditable div */}
            </div>
        </div>
    );
};

export default NftTextEditor;
