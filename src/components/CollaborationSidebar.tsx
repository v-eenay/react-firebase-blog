import { useState, useEffect, useRef } from 'react';
import { useCollaboration } from '../contexts/CollaborationContext';
import { useAuth } from '../contexts/AuthContext';

interface CollaborationSidebarProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CollaborationSidebar({ postId, isOpen, onClose }: CollaborationSidebarProps) {
  const { collaborators, messages, sendMessage } = useCollaboration();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await sendMessage(postId, newMessage.trim());
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-[var(--color-paper)] border-l-2 border-[var(--color-ink)] shadow-lg overflow-hidden z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-[var(--color-ink)] flex justify-between items-center">
        <h3 className="text-xl font-serif font-bold">Collaboration</h3>
        <button
          onClick={onClose}
          className="text-2xl hover:text-[var(--color-accent)] transition-colors"
        >
          ×
        </button>
      </div>

      {/* Collaborators Section */}
      <div className="p-4 border-b-2 border-[var(--color-ink)]">
        <h4 className="font-serif font-bold mb-2">Active Collaborators</h4>
        <div className="space-y-2">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.uid}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--color-ink)]">
                <img
                  src={collaborator.photoURL || `https://api.dicebear.com/6.x/personas/svg?seed=${collaborator.displayName}`}
                  alt={collaborator.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif">{collaborator.displayName}</span>
              {collaborator.cursor && (
                <span className="text-xs text-[var(--color-accent)]">
                  Line {collaborator.cursor.line + 1}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${message.userId === user?.uid ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-[var(--color-accent)]">
                {message.displayName}
              </span>
              <span className="text-xs text-[var(--color-ink-light)]">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${message.userId === user?.uid
                ? 'bg-[var(--color-accent)] text-[var(--color-paper)]'
                : 'bg-[var(--color-ink-light)] text-[var(--color-ink)]'
                }`}
            >
              {message.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-[var(--color-ink)]">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-retro flex-1"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn-retro px-4 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}