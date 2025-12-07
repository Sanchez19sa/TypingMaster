import React from 'react';
import { WordDisplay } from '../WordDisplay';
import './CodeSnippet.css';

interface CodeSnippetProps {
    code: string;
    userInput: string;
    onClick: () => void;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, userInput, onClick }) => {
    return (
        <div className="code-snippet-container">
            <WordDisplay text={code} userInput={userInput} onClick={onClick} />
        </div>
    );
};

export default CodeSnippet;

