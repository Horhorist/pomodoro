import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Container, Heading, Text, VStack, HStack, Input, useToast, Table, Thead, Tbody, Tr, Th, Td, IconButton, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { FaSyncAlt, FaGithub } from 'react-icons/fa';

const Index = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [mode, setMode] = useState('work');
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('pomodoroHistory')) || []);
  const [customTime, setCustomTime] = useState(25);
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem('pomodoroHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => {
          if (seconds > 0) return seconds - 1;
          finishTimer();
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const finishTimer = useCallback(() => {
    setIsRunning(false);
    const session = { mode, duration: mode === 'work' ? customTime : mode === 'shortBreak' ? 5 : 15, date: new Date().toISOString() };
    setHistory((prevHistory) => [...prevHistory, session]);
    toast({
      title: mode === 'work' ? 'Break time!' : 'Work time!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    switchMode(mode);
  }, [mode, customTime, setHistory, toast]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setSecondsLeft(newMode === 'work' ? customTime * 60 : newMode === 'shortBreak' ? 5 * 60 : 15 * 60);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(customTime * 60);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSliderChange = (value) => {
    setCustomTime(value);
    setSecondsLeft(value * 60);
  };

  const getBackgroundColor = () => {
    switch (mode) {
      case 'work':
        return '#ba4949';
      case 'shortBreak':
        return '#38858a';
      case 'longBreak':
        return '#397097';
      default:
        return '#ba4949';
    }
  };

  const getBoxBackgroundColor = () => {
    switch (mode) {
      case 'work':
        return '#c15c5c';
      case 'shortBreak':
        return '#4c9196';
      case 'longBreak':
        return '#4d7fa2';
      default:
        return '#c15c5c';
    }
  };

  return (
    <Box bg={getBackgroundColor()} minH="100vh" color="white">
      <HStack justifyContent="space-between" p={4}>
        <Heading size="md">Pomodoro</Heading>
        <IconButton
          as="a"
          href="https://github.com/horhorist/pomodoro"
          target="_blank"
          icon={<FaGithub />}
          aria-label="GitHub"
          color="white"
          fontSize="40px"
          backgroundColor="transparent"
          _hover={{ backgroundColor: 'transparent' }}
          _active={{ backgroundColor: 'transparent' }}
        />
      </HStack>
      <Container centerContent p={8}>
        <VStack spacing={4}>
          <Box bg={getBoxBackgroundColor()} borderRadius="lg" p={8} width="100%" textAlign="center" color="white">
            <HStack spacing={2} justifyContent="center" mb={4}>
              <Button
                onClick={() => switchMode('work')}
                bg={mode === 'work' ? 'blackAlpha.500' : 'transparent'}
                color={mode === 'work' ? 'white' : 'black'}
              >
                Pomodoro
              </Button>
              <Button
                onClick={() => switchMode('shortBreak')}
                bg={mode === 'shortBreak' ? 'blackAlpha.500' : 'transparent'}
                color={mode === 'shortBreak' ? 'white' : 'black'}
              >
                Short Break
              </Button>
              <Button
                onClick={() => switchMode('longBreak')}
                bg={mode === 'longBreak' ? 'blackAlpha.500' : 'transparent'}
                color={mode === 'longBreak' ? 'white' : 'black'}
              >
                Long Break
              </Button>
            </HStack>
            <Text fontSize="8xl" fontWeight="bold">
              {formatTime(secondsLeft)}
            </Text>
            <HStack spacing={2} mt={4} justifyContent="center">
              {isRunning && (
                <Button onClick={resetTimer} size="lg" variant="ghost" aria-label="Reset" color="#ffffff" backgroundColor="transparent"
                     _hover={{ backgroundColor: 'transparent' }}
                     _active={{ backgroundColor: 'transparent' }}>
                  <FaSyncAlt />
                </Button>
              )}
              <Button onClick={toggleTimer} size="lg"  fontSize="25px" p={8} color="#2d2d2d" bg="#ffffff">
                {isRunning ? 'Pause' : 'Start'}
              </Button>
            </HStack>
            <Box mt={8}>
              <Text>Custom Time: {customTime} minutes</Text>
              <Slider aria-label="slider-ex-1" value={customTime} onChange={handleSliderChange} min={1} max={60}>
                <SliderTrack bg="#ebedf0">
                  <SliderFilledTrack bg="#ffffff" />
                </SliderTrack>
                <SliderThumb boxSize={6}>
                  <Text fontSize="lg" color="#2d2d2d" fontWeight="bold">
                    {customTime}
                  </Text>
                </SliderThumb>
              </Slider>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Index;
