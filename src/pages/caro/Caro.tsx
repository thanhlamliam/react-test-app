import Board from "@/pages/caro/components/Board";
import "./caro.scss";
import { useEffect, useRef, useState } from "react";
import { Button, InputNumber } from "antd";
import Fireworks, { FireworksHandlers } from "@fireworks-js/react";
import { RedoOutlined, UndoOutlined } from "@ant-design/icons";

const MAX_UNDO = 3

export interface ICell {
  value: string | null;
  isWin: boolean;
}

const Caro = () => {
  const fireworkRef = useRef<FireworksHandlers>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number>(24);
  const [size, setSize] = useState<number>(boardSize);
  const [board, setBoard] = useState<ICell[][]>(
    Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => ({
        value: null,
        isWin: false
      }))
    )
  );
  const [isXNext, setIsXNext] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<number[][]>([]);
  const [history, setHistory] = useState<number[][]>([]);
  const [undoTimes, setUndoTimes] = useState<number>(0);

  const directions = [
    [
      [0, -1],
      [0, 1],
    ], // Ngang
    [
      [-1, 0],
      [1, 0],
    ], // Doc
    [
      [1, -1],
      [-1, 1],
    ], // Cheo phai
    [
      [-1, -1],
      [1, 1]
    ] // Cheo trai
  ]

  // Utils
  function checkWinner(board: ICell[][], row: number, col: number) {
    let count = 1;
    let winningArr = [], preventArr = [];
    let currentUser = board[row][col].value;
    if (!currentUser) return;

    for (const direction of directions) {
      count = 1;
      winningArr = [];
      preventArr = [];

      for (const [dx, dy] of direction) {
        winningArr.push([row, col]);
        let rowTemp = row + dx;
        let colTemp = col + dy;

        while (
          rowTemp >= 0 &&
          rowTemp < boardSize &&
          colTemp >= 0 &&
          colTemp < boardSize
        ) {
          if (currentUser && board[rowTemp][colTemp].value && currentUser !== board[rowTemp][colTemp].value) {
            preventArr.push([rowTemp, colTemp]);
            break;
          }

          if (currentUser === board[rowTemp][colTemp].value) {
            winningArr.push([rowTemp, colTemp]);
            count++;
            rowTemp = rowTemp + dx;
            colTemp = colTemp + dy;
          } else {
            break;
          }
        }
      }

      if ((count >= 5 && preventArr.length === 1) || (count === 4 && preventArr.length === 0)) {
        setWinningLine(winningArr);
        return true;
      }
    }

    setWinningLine([]);
    return false;
  }

  // Actions
  function handleCreateNewGame(size: number) {
    setLoading(true);
    setBoard(
      Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({
          value: null,
          isWin: false
        }))
      ));
    setIsXNext(false);
    setWinner(null);
    setWinningLine([]);

    const timeoutId = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timeoutId);
  }

  function handleUndo() {
    if (undoTimes === 0) return;

    const position = history[undoTimes - 1];
    if (position?.[0] >= 0) {
      const newBoard = board.map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          if (rowIndex === position[0] && colIndex === position[1]) {
            return { ...col, value: null };
          }
          return col;
        })
      })

      setUndoTimes(undoTimes - 1);
      setBoard(newBoard);
      setIsXNext((prev) => !prev);
    }
  }

  function handleRedo() {
    if (undoTimes === MAX_UNDO) return;
    console.log("his", history, undoTimes)

    const position = history[undoTimes];
    if (position?.[0] >= 0) {
      const newBoard = board.map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          if (rowIndex === position[0] && colIndex === position[1]) {
            return { ...col, value: isXNext ? "X" : "O" };
          }
          return col;
        })
      })

      setUndoTimes(undoTimes + 1);
      setBoard(newBoard);
      setIsXNext((prev) => !prev);
    }
  }

  function handleClick(row: number, col: number) {
    if (board[row][col].value || winner) return;

    // Init new board
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col].value = isXNext ? "X" : "O";

    if (checkWinner(newBoard, row, col)) {
      setWinner(newBoard[row][col].value);
    }

    setBoard(newBoard);

    // Set max 3 undo and redo
    const newHistory = [...history];
    if (history.length === 3) {
      newHistory.shift();
    }
    newHistory.push([row, col]);

    setUndoTimes((prev) => prev === MAX_UNDO ? prev : prev + 1);
    setHistory(newHistory);

    // Set next player
    setIsXNext((prev) => !prev);
  }

  useEffect(() => {
    handleCreateNewGame(boardSize)
  }, [boardSize]);

  useEffect(() => {
    const newBoard = board.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        return {
          ...cell,
          isWin: winningLine.some((e) => e[0] === rowIndex && e[1] === colIndex),
        }
      })
    })
    setBoard(newBoard);
  }, [winningLine]);

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
      <div className="flex items-center gap-3">
        <InputNumber
          className="w-[134px]"
          value={size}
          min={18}
          max={36}
          addonAfter={
            <div className="cursor-pointer" onClick={() => setBoardSize(size)}>
              Setup
            </div>
          }
          onChange={(e) => setSize(e ?? 24)}
        />

        <Button type="primary" onClick={() => handleCreateNewGame(boardSize)}>New Game</Button>
      </div>

      <div className="flex items-center gap-2">
        <p className={`p-2 rounded-md ${winner ? 'bg-[#d9ffd6]' : ''}`}>
          {winner ? `Winner: ${winner}` : `Next player is: ${isXNext ? "X" : "O"}`}
        </p>

        <Button
          title="Undo"
          icon={<UndoOutlined />}
          onClick={handleUndo}
        />

        {/* <Button
          title="Redo"
          icon={<RedoOutlined />}
          onClick={handleRedo}
        /> */}
      </div>

      <div className="flex items-center justify-center p-4 h-[90%] aspect-square border border-solid border-black shadow-2xl bg-white">
        <Board loading={loading} board={board} onClick={handleClick} />
      </div>

      {
        winner && <Fireworks
          className="firework"
          ref={fireworkRef}
        />
      }
    </div>
  )
}

export default Caro