import React, { useEffect, useState } from 'react';
import { Player, GameState, GameOverData } from '@/pages/caro/types/socket';
import { useSocket } from '@/pages/context/SocketContext';
import { Button, Flex, Form, Input } from 'antd';

const CaroWithSocket: React.FC = () => {
  const { socket, connectSocket } = useSocket();
  const [gameId, setGameId] = useState<string | null>(null);
  const [board, setBoard] = useState<string[][]>(Array(24).fill('').map(() => Array(24).fill('')));
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurn, setCurrentTurn] = useState<string>('');
  const [winner, setWinner] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Connect to socket on mount if not already connected
  useEffect(() => {
    if (!socket) {
      connectSocket();
    }
  }, [socket, connectSocket]);

  // Setup socket event listeners
  useEffect(() => {
    if (!socket) return;
    console.log(socket.id)

    socket.on('gameCreated', (gameId: string) => {
      setGameId(gameId);
      setError(null);
      console.log(`Game created with ID: ${gameId}`);
    });

    socket.on('gameJoined', (gameId: string) => {
      setGameId(gameId);
      setError(null);
      console.log(`Joined game: ${gameId}`);
    });

    socket.on('joinFailed', (message: string) => {
      setError(message);
    });

    socket.on('playersUpdated', (players: Player[]) => {
      setPlayers(players);
    });

    socket.on('boardUpdated', (newBoard: string[][]) => {
      setBoard(newBoard);
    });

    socket.on('turnChanged', (newTurn: string) => {
      setCurrentTurn(newTurn);
    });

    socket.on('gameOver', (data: GameOverData) => {
      setWinner(data.winner);
      setBoard(data.board);
    });

    socket.on('gameEnded', (message: string) => {
      setGameId(null);
      setBoard(Array(24).fill('').map(() => Array(24).fill('')));
      setPlayers([]);
      setWinner(null);
      setError(message);
    });

    socket.on('error', (message: string) => {
      setError(message);
    });

    // Cleanup listeners on unmount or socket change
    return () => {
      socket.off('gameCreated');
      socket.off('gameJoined');
      socket.off('joinFailed');
      socket.off('playersUpdated');
      socket.off('boardUpdated');
      socket.off('turnChanged');
      socket.off('gameOver');
      socket.off('gameEnded');
      socket.off('error');
    };
  }, [socket]);

  // Event handlers
  const handleCreateGame = () => {
    if (socket) {
      socket.emit('createGame');
    }
  };

  const handleJoinGame = (values: any) => {
    const gameId = values.gameId;
    setGameId(gameId);
    if (socket) {
      socket.emit('joinGame', gameId);
    }
  };

  const handleMove = (x: number, y: number) => {
    if (socket && gameId && !winner && currentTurn === socket.id) {
      socket.emit('makeMove', gameId, x, y);
    }
  };

  return (
    <div>
      <h1>Caro Game</h1>
      {!gameId ? (
        <Flex gap={16} vertical>
          <Button className='w-fit' type='primary' onClick={handleCreateGame}>Create Game</Button>

          <Form onFinish={handleJoinGame}>
            <Flex gap={8}>
              <Form.Item name="gameId">
                <Input type="text" placeholder="Enter Game ID" />
              </Form.Item>
              <Button htmlType='submit'>Join Game</Button>
            </Flex>
          </Form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Flex>
      ) : (
        <>
          <p>Game ID: {gameId}</p>
          <p>Your ID: {socket?.id}</p>
          <p>Current Turn: {currentTurn}</p>
          <p>Players: {players.map((p) => `${p.id} (${p.mark})`).join(', ')}</p>
          {winner && <p>Winner: {winner}</p>}
          <div>
            {board.map((row, y) => (
              <div key={y} style={{ display: 'flex' }}>
                {row.map((cell, x) => (
                  <button
                    key={x}
                    onClick={() => handleMove(x, y)}
                    style={{
                      width: '30px',
                      height: '30px',
                      margin: '1px',
                      background: cell ? '#ddd' : '#fff',
                    }}
                    disabled={!!cell || currentTurn !== socket?.id || !!winner}
                  >
                    {cell}
                  </button>
                ))}
              </div>
            ))}
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default CaroWithSocket;
