import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import PlayerBar from '../components/PlayerBar';
import { usePlayerStore } from '../stores/playerStore';

// Mock Zustand store
jest.mock('../stores/playerStore');

describe('PlayerBar', () => {
  const mockUsePlayerStore = usePlayerStore as jest.MockedFunction<typeof usePlayerStore>;

  beforeEach(() => {
    mockUsePlayerStore.mockReturnValue({
      currentSong: {
        id: '1',
        title: 'tr(Ever)',
        artist: { id: '1', name: 'Hebl' },
        image: '/img_cover1.svg',
      },
      isPlaying: false,
      volume: 0.7,
      currentTime: 0,
      setCurrentSong: jest.fn(),
      setIsPlaying: jest.fn(),
      setVolume: jest.fn(),
      setCurrentTime: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      next: jest.fn(),
      previous: jest.fn(),
    });
  });

  test('renders song information correctly', () => {
    render(<PlayerBar />);

    expect(screen.getByText('tr(Ever)')).toBeInTheDocument();
    expect(screen.getByText('Hebl')).toBeInTheDocument();
    expect(screen.getByText('CHU PIANO')).toBeInTheDocument();
  });

  test('renders no song state when currentSong is null', () => {
    mockUsePlayerStore.mockReturnValue({
      currentSong: null,
      isPlaying: false,
      volume: 0.7,
      currentTime: 0,
      setCurrentSong: jest.fn(),
      setIsPlaying: jest.fn(),
      setVolume: jest.fn(),
      setCurrentTime: jest.fn(),
      play: jest.fn(),
      pause: jest.fn(),
      next: jest.fn(),
      previous: jest.fn(),
    });

    render(<PlayerBar />);

    expect(screen.getByText('No song selected')).toBeInTheDocument();
    expect(screen.getByText('CHU PIANO')).toBeInTheDocument();
  });
});
