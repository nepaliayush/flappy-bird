'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const GRAVITY = 0.5;
const JUMP_STRENGTH = -10;
const PIPE_WIDTH = 52;
const PIPE_GAP = 200;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;  // Increased game height
const PIPE_SPAWN_X = GAME_WIDTH + 100;  // Increased x position for pipe spawning

interface Bird {
    y: number;
    velocity: number;
}

interface Pipe {
    x: number;
    topHeight: number;
}

const FlappyBird: React.FC = () => {
    const [bird, setBird] = useState<Bird>({ y: GAME_HEIGHT / 2, velocity: 0 });
    const [pipes, setPipes] = useState<Pipe[]>([]);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    const jump = useCallback(() => {
        if (!gameOver) {
            setBird((prevBird) => ({ ...prevBird, velocity: JUMP_STRENGTH }));
        }
    }, [gameOver]);

    const resetGame = () => {
        setBird({ y: GAME_HEIGHT / 2, velocity: 0 });
        setPipes([]);
        setGameOver(false);
        setScore(0);
    };

    useEffect(() => {
        const gameLoop = setInterval(() => {
            if (!gameOver) {
                // Update bird position
                setBird((prevBird) => ({
                    y: prevBird.y + prevBird.velocity,
                    velocity: prevBird.velocity + GRAVITY,
                }));

                // Update pipes
                setPipes((prevPipes) => {
                    const newPipes = prevPipes
                        .map((pipe) => ({ ...pipe, x: pipe.x - 2 }))
                        .filter((pipe) => pipe.x > -PIPE_WIDTH);

                    if (prevPipes.length === 0 || prevPipes[prevPipes.length - 1].x < GAME_WIDTH - 200) {
                        newPipes.push({
                            x: PIPE_SPAWN_X,
                            topHeight: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50,
                        });
                    }

                    return newPipes;
                });

                // Check for collisions
                if (
                    bird.y < 0 ||
                    bird.y > GAME_HEIGHT - BIRD_HEIGHT ||
                    pipes.some(
                        (pipe) =>
                            pipe.x < 50 + BIRD_WIDTH &&
                            pipe.x + PIPE_WIDTH > 50 &&
                            (bird.y < pipe.topHeight || bird.y + BIRD_HEIGHT > pipe.topHeight + PIPE_GAP)
                    )
                ) {
                    setGameOver(true);
                }

                // Update score
                setScore((prevScore) => prevScore + 1);
            }
        }, 20);

        return () => clearInterval(gameLoop);
    }, [bird, pipes, gameOver]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [jump]);

    return (
        <div
            style={{ width: `${GAME_WIDTH}px`, height: `${GAME_HEIGHT}px`, position: 'relative', overflow: 'hidden' }}
            onClick={jump}
        >
            {/* Background */}
            <Image
                src="/background-day.png"
                layout="fill"
                objectFit="cover"
                alt="Background"
            />

            {/* Bird */}
            <div style={{
                position: 'absolute',
                left: '50px',
                top: `${bird.y}px`,
                width: `${BIRD_WIDTH}px`,
                height: `${BIRD_HEIGHT}px`,
            }}>
                <Image
                    src="/yellowbird-upflap.png"
                    width={BIRD_WIDTH}
                    height={BIRD_HEIGHT}
                    alt="Bird"
                />
            </div>

            {/* Pipes */}
            {pipes.map((pipe, index) => (
                <React.Fragment key={index}>
                    {/* Top Pipe */}
                    <div style={{
                        position: 'absolute',
                        left: `${pipe.x}px`,
                        top: '0',
                        width: `${PIPE_WIDTH}px`,
                        height: `${pipe.topHeight}px`,
                        overflow: 'hidden',
                    }}>
                        <Image
                            src="/pipe-green.png"
                            width={PIPE_WIDTH}
                            height={320}
                            alt="Top Pipe"
                            style={{ transform: 'rotate(180deg)', position: 'absolute', bottom: 0 }}
                        />
                    </div>
                    {/* Bottom Pipe */}
                    <div style={{
                        position: 'absolute',
                        left: `${pipe.x}px`,
                        top: `${pipe.topHeight + PIPE_GAP}px`,
                        width: `${PIPE_WIDTH}px`,
                        height: `${GAME_HEIGHT - pipe.topHeight - PIPE_GAP}px`,
                        overflow: 'hidden',
                    }}>
                        <Image
                            src="/pipe-green.png"
                            width={PIPE_WIDTH}
                            height={320}
                            alt="Bottom Pipe"
                        />
                    </div>
                </React.Fragment>
            ))}

            {/* Score */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', fontSize: '24px', color: 'white', textShadow: '2px 2px 4px #000000' }}>
                Score: {score}
            </div>

            {/* Game Over */}
            {gameOver && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        padding: '20px',
                        borderRadius: '10px',
                        color: 'white',
                    }}
                >
                    <h2>Game Over</h2>
                    <p>Your score: {score}</p>
                    <button onClick={resetGame} style={{ padding: '10px 20px', fontSize: '16px' }}>Play Again</button>
                </div>
            )}
        </div>
    );
};

export default FlappyBird;