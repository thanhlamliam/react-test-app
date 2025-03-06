import React, { useEffect, useRef, useState } from 'react';
import { Player, GameOverData } from '@/pages/caro/types/socket';
import { useSocket } from '@/pages/context/SocketContext';
import { Button, Flex, Form, Input } from 'antd';
import Cell from '@/pages/caro/components/Cell';
import { ICell } from '@/pages/caro/Caro';
import "./caro.scss";
import Fireworks, { FireworksHandlers } from '@fireworks-js/react';

const CaroWithSocket: React.FC = () => {
  const fireworkRef = useRef<FireworksHandlers>(null);

  const { socket, connectSocket } = useSocket();
  const [gameId, setGameId] = useState<string | null>(null);
  const [board, setBoard] = useState<ICell[][]>(
    Array.from({ length: 24 }, () =>
      Array.from({ length: 24 }, () => ({
        value: null,
        isWin: false
      }))
    )
  );
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

    socket.on('boardUpdated', (newBoard: ICell[][]) => {
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

  const handleMove = (row: number, col: number) => {
    if (socket && gameId && !winner && currentTurn === socket.id) {
      socket.emit('makeMove', gameId, row, col);
    }
  };

  useEffect(() => {
    fireworkRef.current?.updateOptions({
      autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,
      friction: 0.97,
      gravity: 1.5,
      particles: 50,
      traceLength: 3,
      traceSpeed: 10,
      explosion: 5,
      intensity: 30,
      flickering: 50,
      lineStyle: 'round',
      hue: {
        min: 0,
        max: 360
      },
      delay: {
        min: 30,
        max: 60
      },
      rocketsPoint: {
        min: 50,
        max: 50
      },
      lineWidth: {
        explosion: {
          min: 1,
          max: 3
        },
        trace: {
          min: 1,
          max: 2
        }
      },
      brightness: {
        min: 50,
        max: 80
      },
      decay: {
        min: 0.015,
        max: 0.03
      },
      mouse: {
        click: false,
        move: false,
        max: 1
      }
    });
  }, []);

  return (
    <div className="caro">
      <h1>Caro Game</h1>
      {
        !gameId ? (
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
            <div
              className="caro-board grid"
              style={{
                gridTemplateColumns: `repeat(${board.length}, 1fr)`,
                cursor: currentTurn !== socket?.id || !!winner ? 'not-allowed' : 'none'
              }}
            >
              {board.map((row, rowIndex) =>
                <div className="caro-board__row" key={rowIndex}>
                  {
                    row.map((cell, colIndex) =>
                      <Cell cell={cell} onClick={() => handleMove(rowIndex, colIndex)} key={colIndex} />
                    )
                  }
                </div>
              )}
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {
              winner && <Fireworks
                className="firework"
                ref={fireworkRef}
              />
            }
          </>
        )
      }
    </div>
  )
};

export default CaroWithSocket;
