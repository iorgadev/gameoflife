import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import produce from "immer";

const numRows = 40;
const numCols = 40;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const tiles = [];
  for (let y = 0; y < numRows; y++) {
    tiles.push(Array.from(Array(numCols), () => 0));
  }
  return tiles;
};

const Home: NextPage = () => {
  const [running, setRunning] = useState(false);
  const [board, setBoard] = useState(() => {
    return generateEmptyGrid();
  });

  const runningRef = useRef(running);
  runningRef.current = running;

  useEffect(() => {
    if (!runningRef.current) return;

    const updateBoard = () => {
      setBoard((g) => {
        return produce(g, (gridCopy) => {
          for (let i = 0; i < numRows; i++) {
            for (let k = 0; k < numCols; k++) {
              let neighbors = 0;
              operations.forEach(([x, y]) => {
                const newI = i + x;
                const newK = k + y;
                if (
                  newI >= 0 &&
                  newI < numRows &&
                  newK >= 0 &&
                  newK < numCols
                ) {
                  neighbors += g[newI][newK];
                }
              });

              if (neighbors < 2 || neighbors > 3) {
                gridCopy[i][k] = 0;
              } else if (g[i][k] === 0 && neighbors === 3) {
                gridCopy[i][k] = 1;
              }
            }
          }
        });
      });
    };

    setTimeout(updateBoard, 100);
  }, [running, board]);

  return (
    <>
      <div className="board">
        <div className="buttons">
          <button
            onClick={() => {
              setRunning((prevRunning) => {
                if (!prevRunning) {
                  runningRef.current = true;
                  return true;
                }
                runningRef.current = false;
                return false;
              });
            }}
          >
            {running ? `Stop` : `Start`} Simulation
          </button>

          <button
            onClick={() => {
              setBoard(() => {
                const tiles = [];
                for (let y = 0; y < numRows; y++) {
                  tiles.push(
                    Array.from(Array(numCols), () =>
                      Math.random() > 0.7 ? 1 : 0
                    )
                  );
                }
                return tiles;
              });
            }}
          >
            Randomize Cells
          </button>

          <button
            onClick={() => {
              setBoard(() => {
                return generateEmptyGrid();
              });
            }}
          >
            Clear Board
          </button>
        </div>

        <div className="cells">
          {board.map((rows, y) =>
            rows.map((col, x) => (
              <div
                key={`${y}-${x}`}
                className={`tile ${board[y][x] ? `alive` : `dead`}`}
                onClick={() => {
                  const newGrid = produce(board, (gridCopy) => {
                    gridCopy[y][x] = board[y][x] ? 0 : 1;
                  });
                  setBoard(newGrid);
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
