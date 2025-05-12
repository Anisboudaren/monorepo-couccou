'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';

const BubbleIframePage = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');

  const handleClick = () => {
    window.parent.postMessage({ message: 'closeChat' }, '*');
  };

  const typeText = (text: string) => {
    let index = 0;
    setTypingMessage('');
    const interval = setInterval(() => {
      setTypingMessage(prev => prev + text[index]);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, 20); // typing speed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer sk-c961a411bc0e4959a05face4be26dbce', // Replace this with your actual key
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [...messages, userMessage].slice(-5),
        }),
      });

      const data = await res.json();
      const botReply = data.choices?.[0]?.message?.content || 'Error: no reply';
      typeText(botReply);

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
        setTypingMessage('');
      }, botReply.length * 20 + 300); // wait until typing animation ends
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error contacting DeepSeek.' }]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Close Button */}
      <div className="absolute top-4 right-4">
        <XCircle
          className="text-violet-500 hover:text-violet-800 transition cursor-pointer"
          size={36}
          onClick={handleClick}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-14">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-violet-100 self-end text-right ml-auto'
                : 'bg-gray-100 text-left'
            }`}
          >
            <div className="text-sm text-gray-700">{msg.content}</div>
          </div>
        ))}
        {typingMessage && (
          <div className="max-w-[75%] p-3 rounded-lg bg-gray-100 text-left">
            <div className="text-sm text-gray-700 whitespace-pre-line">{typingMessage}</div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex p-4 border-t gap-2">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          type="submit"
          disabled={loading}
className="bg-[linear-gradient(155deg,_#7f22fe,_#22ff9c)] text-white px-4 py-2 rounded-lg hover:bg-violet-700 disabled:opacity-50 transition"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default BubbleIframePage;
