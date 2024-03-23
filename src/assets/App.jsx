import { useState } from "react";
import "./App.css"

function calculateWinner(squares,numBoard){
    let lines=[
        //Filas
        [0,1,2],
        [3,4,5],
        [6,7,8],
        //Columnas
        [0,3,6],
        [1,4,7],
        [2,5,8],
        //Diagonales
        [0,4,8],
        [2,4,6]
    ];
    const gato=lines.map((line,i)=>{
        return(
            [line[0]+(numBoard*9),line[1]+(numBoard*9),line[2]+(numBoard*9)]    
        ); 
    });
    
    for(let i=0;i<lines.length;i++){
        const [a, b, c] = gato[i];
        //console.log(squares);
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


function calculateGlobalWinner(squares){
    let lines=[
        //Filas
        [0,1,2],
        [3,4,5],
        [6,7,8],
        //Columnas
        [0,3,6],
        [1,4,7],
        [2,5,8],
        //Diagonales
        [0,4,8],
        [2,4,6]
    ];
    
    for(let i=0;i<lines.length;i++){
        const [a, b, c] = lines[i];
        //console.log(squares);
        const winner=calculateWinner(squares,a);
        if(winner && winner===calculateWinner(squares,b) && winner===calculateWinner(squares,c)){
            return winner;
        }
    }
    return null;
}

export function Square({children,onSquareClick}){
    return(
        <button className="square" onClick={onSquareClick}>{children}</button>
    );
}

export function Row({board,span,handleClick, disable}){
    return(
        <div className="row">
            <Square onSquareClick={()=>handleClick(0+span,disable)}>{board[span+0]}</Square>
            <Square onSquareClick={()=>handleClick(1+span,disable)}>{board[span+1]}</Square>
            <Square onSquareClick={()=>handleClick(2+span,disable)}>{board[span+2]}</Square>
        </div>
    );
}

export function Board({numBoard, xIsNext, squares, onPlay, availableBoard}){
    //console.log(squares)
    function handleClick(i,disable){
        if(calculateWinner(squares,numBoard) || squares[i] || disable || calculateGlobalWinner(squares)){
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext?"X":"O";
        if(calculateWinner(nextSquares,i%9)){
            console.log(numBoard,i%9)
            if(calculateWinner(nextSquares,numBoard)){
                nextSquares[81]=null;
                onPlay(nextSquares,null);
            }else{
                nextSquares[81]=numBoard;
                onPlay(nextSquares,numBoard);
            }
            return;
        }
        nextSquares[81]=i%9;
        onPlay(nextSquares,i%9);
    }
    const winner=calculateWinner(squares,numBoard);
    const aviable=availableBoard==null||availableBoard==numBoard?false:true;
    const res=()=>{
        if(!winner){
            return(          
                <>
                    <Row board={squares} span={0+(numBoard*9)} handleClick={handleClick} disable={aviable}></Row>
                    <Row board={squares} span={3+(numBoard*9)} handleClick={handleClick} disable={aviable}> </Row>
                    <Row board={squares} span={6+(numBoard*9)} handleClick={handleClick} disable={aviable}></Row>
                </>                  

            );
        }else{
            return(
                <>
                    <div className="winner">{winner}</div>
                </>
            );
        }
    }

    return(
        <>
            <div className="board">
                {res()}

            </div>
        </>
    );
}

export function Game(){
    const [history, setHistory] = useState([Array(82).fill(null)]);
    const [currentMove,setCurrentMove]=useState(0);
    const [currentBoard,setCurrentBoard]=useState(null);
    const currentSquares = history[currentMove];
    //console.log(currentBoard);
    const xIsNext=currentMove%2==0;

    function handlePlay(nextSquares,i) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        //console.log(i)
        setCurrentBoard(i)
    }

    function jumpTo(nextMove){
        setCurrentMove(nextMove);
        setCurrentBoard(history[nextMove][81])
    }

    const moves=history.map((squares,move)=>{
        let description=move>0?'Ir al movimiento #' + move:"Ir al inicio del juego";

        return(
            <li key={move}>
                <button onClick={()=>jumpTo(move)}>{description}</button>
            </li>
        );
    });

    const next=calculateGlobalWinner(currentSquares)?`El ganador es: ${!xIsNext?"X":"O"}`:`En ${currentBoard!==null?currentSquares[81]+1:"donde sea"} le toca a ${xIsNext?"X":"O"}`;
    return(
        <>
            <h1>MetaGato</h1>
            <h2>{next}</h2>
            <div className="game">
                <div className="board-row">
                    <Board numBoard={0} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} availableBoard={currentBoard}></Board>
                    <Board numBoard={3} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} availableBoard={currentBoard}></Board>
                    <Board numBoard={6} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} availableBoard={currentBoard}></Board>
                </div>
                <div className="board-row">
                    <Board numBoard={1} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} availableBoard={currentBoard}></Board>
                    <Board numBoard={4} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} availableBoard={currentBoard}></Board>
                    <Board numBoard={7} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} availableBoard={currentBoard}></Board>
                </div>
                <div className="board-row">
                    <Board numBoard={2} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} availableBoard={currentBoard}></Board>
                    <Board numBoard={5} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} availableBoard={currentBoard}></Board>
                    <Board numBoard={8} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} availableBoard={currentBoard}></Board>
                </div>
            </div>    
            <div className="game-info">
                <ol>{moves}</ol>
            </div>       
        </>
    );
}