'use client';

import { useState } from 'react';
import { Box, VStack, HStack, Heading, Text, Input, Button, IconButton, Separator } from '@chakra-ui/react';
import { Checkbox } from '@/components/ui/checkbox';
import { LuTrash2, LuClipboardList } from 'react-icons/lu';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <Box minH="100vh" bg="gray.50" py={12} px={4}>
      <VStack maxW="2xl" mx="auto" gap={8}>
        {/* Header */}
        <VStack gap={2}>
          <Heading size="4xl" color="gray.800" fontWeight="light">
            Tasks
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Simple and organized
          </Text>
        </VStack>

        {/* Add Todo Form */}
        <Box as="form" onSubmit={addTodo} w="full">
          <HStack gap={2}>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new task..."
              size="lg"
              variant="outline"
              borderColor="gray.300"
              _focus={{ borderColor: 'gray.600', boxShadow: 'none' }}
              bg="white"
            />
            <Button
              type="submit"
              size="lg"
              colorPalette="gray"
              variant="solid"
              bg="gray.800"
              color="white"
              _hover={{ bg: 'gray.700' }}
              px={8}
            >
              Add
            </Button>
          </HStack>
        </Box>

        {/* Todo List */}
        <Box w="full" bg="white" borderRadius="md" border="1px" borderColor="gray.200">
          {todos.length === 0 ? (
            <VStack py={16} gap={3}>
              <Box color="gray.300" fontSize="4xl">
                <LuClipboardList />
              </Box>
              <Text color="gray.400" fontSize="sm">
                No tasks yet
              </Text>
            </VStack>
          ) : (
            <VStack gap={0} align="stretch">
              {todos.map((todo, index) => (
                <Box key={todo.id}>
                  <HStack
                    py={4}
                    px={5}
                    gap={3}
                    _hover={{ bg: 'gray.50' }}
                    transition="background 0.2s"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      variant="outline"
                    />
                    <Text
                      flex={1}
                      textDecoration={todo.completed ? 'line-through' : 'none'}
                      color={todo.completed ? 'gray.400' : 'gray.700'}
                    >
                      {todo.text}
                    </Text>
                    <IconButton
                      onClick={() => deleteTodo(todo.id)}
                      variant="ghost"
                      colorPalette="gray"
                      size="sm"
                      aria-label="Delete task"
                    >
                      <LuTrash2 />
                    </IconButton>
                  </HStack>
                  {index < todos.length - 1 && <Separator />}
                </Box>
              ))}
            </VStack>
          )}
        </Box>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <HStack w="full" justify="space-between" px={1}>
            <Text fontSize="sm" color="gray.500">
              {remainingTodos} {remainingTodos === 1 ? 'task' : 'tasks'} remaining
            </Text>
            {todos.some((todo) => todo.completed) && (
              <Button
                onClick={clearCompleted}
                variant="ghost"
                size="sm"
                colorPalette="gray"
                color="gray.600"
                _hover={{ color: 'gray.800' }}
              >
                Clear completed
              </Button>
            )}
          </HStack>
        )}
      </VStack>
    </Box>
  );
}
