'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, VStack, HStack, Input, Button, Text, IconButton } from '@chakra-ui/react';
import { LuMessageCircle, LuX, LuSend } from 'react-icons/lu';

export default function ChatbotFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Add placeholder for streaming response
    const botMessageIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: 'model', text: '', streaming: true }]);

    try {
      // Call streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: history,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Read the streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // Update the message in real-time
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[botMessageIndex] = {
            role: 'model',
            text: fullText,
            streaming: true,
          };
          return newMessages;
        });
      }

      // Mark streaming as complete
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[botMessageIndex] = {
          role: 'model',
          text: fullText,
          streaming: false,
        };
        return newMessages;
      });

      // Update conversation history for Gemini API
      setHistory([
        ...history,
        { role: 'user', parts: [{ text: input }] },
        { role: 'model', parts: [{ text: fullText }] },
      ]);

    } catch (error) {
      console.error('Chat error:', error);

      // Replace streaming message with error
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[botMessageIndex] = {
          role: 'model',
          text: error.message || 'Sorry, something went wrong. Please try again.',
          error: true,
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Box position="fixed" bottom="24px" right="24px" zIndex={1000}>
          <IconButton
            onClick={() => setIsOpen(true)}
            size="lg"
            colorPalette="gray"
            bg="gray.800"
            color="white"
            borderRadius="full"
            boxShadow="lg"
            _hover={{ bg: 'gray.700', transform: 'scale(1.1)' }}
            transition="all 0.2s"
            aria-label="Open chat"
            fontSize="2xl"
            width="60px"
            height="60px"
          >
            <LuMessageCircle />
          </IconButton>
        </Box>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Box
          position="fixed"
          bottom="24px"
          right="24px"
          width={{ base: '90vw', sm: '380px' }}
          height={{ base: '70vh', sm: '550px' }}
          bg="white"
          borderRadius="xl"
          boxShadow="2xl"
          display="flex"
          flexDirection="column"
          zIndex={1000}
          border="1px"
          borderColor="gray.200"
          overflow="hidden"
        >
          {/* Header */}
          <HStack
            bg="gray.800"
            color="white"
            p={4}
            justify="space-between"
            flexShrink={0}
          >
            <HStack gap={2}>
              <LuMessageCircle size={20} />
              <Text fontWeight="bold" fontSize="md">
                AI Assistant
              </Text>
            </HStack>
            <IconButton
              onClick={() => setIsOpen(false)}
              size="sm"
              variant="ghost"
              colorPalette="whiteAlpha"
              _hover={{ bg: 'whiteAlpha.200' }}
              aria-label="Close chat"
            >
              <LuX />
            </IconButton>
          </HStack>

          {/* Messages Container */}
          <VStack
            flex={1}
            overflowY="auto"
            p={4}
            gap={3}
            align="stretch"
            bg="gray.50"
          >
            {messages.length === 0 && (
              <VStack py={8} gap={2}>
                <Box fontSize="4xl" color="gray.300">
                  <LuMessageCircle />
                </Box>
                <Text color="gray.500" fontSize="sm" textAlign="center">
                  Hi! I'm your AI assistant.
                </Text>
                <Text color="gray.400" fontSize="xs" textAlign="center">
                  Ask me anything!
                </Text>
              </VStack>
            )}

            {messages.map((msg, idx) => (
              <Box
                key={idx}
                alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                bg={msg.role === 'user' ? 'gray.800' : 'white'}
                color={msg.role === 'user' ? 'white' : 'gray.800'}
                p={3}
                borderRadius="lg"
                maxW="85%"
                boxShadow={msg.role === 'model' ? 'sm' : 'none'}
                border={msg.role === 'model' ? '1px' : 'none'}
                borderColor={msg.error ? 'red.300' : 'gray.200'}
              >
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {msg.text}
                  {msg.streaming && (
                    <Box
                      as="span"
                      display="inline-block"
                      w="2px"
                      h="14px"
                      bg="gray.800"
                      ml={1}
                      animation="blink 1s infinite"
                      sx={{
                        '@keyframes blink': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0 },
                        },
                      }}
                    />
                  )}
                </Text>
              </Box>
            ))}

            <div ref={messagesEndRef} />
          </VStack>

          {/* Input Area */}
          <Box
            as="form"
            onSubmit={sendMessage}
            p={3}
            borderTop="1px"
            borderColor="gray.200"
            bg="white"
            flexShrink={0}
          >
            <HStack gap={2}>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                size="md"
                disabled={loading}
                variant="outline"
                borderColor="gray.300"
                _focus={{ borderColor: 'gray.600', boxShadow: 'none' }}
                _disabled={{ opacity: 0.6 }}
              />
              <IconButton
                type="submit"
                size="md"
                colorPalette="gray"
                bg="gray.800"
                color="white"
                _hover={{ bg: 'gray.700' }}
                disabled={loading || !input.trim()}
                aria-label="Send message"
              >
                <LuSend />
              </IconButton>
            </HStack>
          </Box>
        </Box>
      )}
    </>
  );
}
