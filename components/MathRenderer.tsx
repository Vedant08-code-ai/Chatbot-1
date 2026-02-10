
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathRendererProps {
  content: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold text-blue-400 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold text-blue-300 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-md font-medium text-blue-200 mb-1">{children}</h3>,
          p: ({ children }) => <p className="mb-4 leading-relaxed text-slate-300">{children}</p>,
          ul: ({ children }) => <ul className="list-disc ml-5 mb-4 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-5 mb-4 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-slate-300">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
          code: ({ children }) => <code className="bg-slate-800 px-1 rounded text-pink-400 font-mono">{children}</code>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-4">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MathRenderer;
