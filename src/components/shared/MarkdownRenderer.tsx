import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="font-heading text-4xl text-[#FF5A00] uppercase my-6" {...props} />,
          h2: ({ node, ...props }) => <h2 className="font-heading text-2xl text-white uppercase my-5" {...props} />,
          h3: ({ node, ...props }) => <h3 className="font-heading text-xl text-[#B3B3B3] uppercase my-4" {...props} />,
          p: ({ node, ...props }) => <p className="font-sans text-[16px] text-white leading-relaxed my-4" {...props} />,
          a: ({ node, ...props }) => <a className="text-[#FF5A00] hover:underline" target="_blank" rel="noreferrer" {...props} />,
          img: ({ node, ...props }) => <img className="w-full rounded-[8px] max-h-[400px] object-cover my-6" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-[#FF5A00] pl-4 italic text-[#B3B3B3] my-4" {...props} />
          ),
          code: ({ node, inline, className, ...props }: any) => 
            inline ? (
              <code className="bg-[#1A1A1A] text-[#FF5A00] px-1.5 py-0.5 rounded-[4px] font-mono text-sm" {...props} />
            ) : (
              <div className="bg-[#1A1A1A] rounded-[8px] my-4 border border-white/10 overflow-hidden">
                <div className="px-4 py-2 border-b border-white/10 bg-black/40 text-[#B3B3B3] text-xs font-sans uppercase tracking-widest">Code</div>
                <code className="block text-[#FF5A00] p-4 font-mono text-sm overflow-x-auto" {...props} />
              </div>
            ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4 space-y-2 text-white marker:text-[#FF5A00]" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4 space-y-2 text-white marker:text-[#FF5A00]" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
