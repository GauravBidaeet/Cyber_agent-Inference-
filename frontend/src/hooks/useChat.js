import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = '"https://miya-unsugared-isorhythmically.ngrok-free.dev/generate"';

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createMessage(role, content) {
  return {
    id: generateId(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text, options = {}) => {
    if (!text.trim()) return;

    const {
      max_new_tokens = 100,
      temperature = 0.1,
      top_k = 50,
    } = options;

    const userMessage = createMessage('user', text.trim());
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, {
        prompt: text.trim(),
        max_new_tokens,
        temperature,
        top_k,
      });

      const assistantMessage = createMessage('assistant', response.data.response);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorText =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred. Please try again.';

      const errorMessage = createMessage(
        'assistant',
        `⚠️ **Error:** ${errorText}`
      );
      setMessages((prev) => [...prev, errorMessage]);
      setError(errorText);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearChat };
}
