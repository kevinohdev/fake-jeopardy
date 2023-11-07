import React, { useEffect, useState } from 'react'

const Jeopardy = () => {
  const randomNumber = Math.floor(Math.random() * 101);

  const [clues, setClues] = useState<Clue[]>([])
  const [error, setError] = useState({})
  const [showAnswer, setShowAnswer] = useState(false)
  const [index, setIndex] = useState(randomNumber);
  const [score, setScore] = useState(0);

  interface Clue {
    id: number;
    question: string;
    value: number;
    category: {
      title: string;
    }
    answer: string;
  }

  useEffect(() => {
    fetch('https://jservice.io/api/clues')
      .then(response => response.json())
      .then(res => setClues(res))
      .catch(err => setError(err))
  }, [])


  const handleClick = () => {
    setShowAnswer(prev => !prev)
  }

  const showNext = () => {
    if (index === clues.length - 1) {
      setIndex(0)
    }
    setIndex(prev => prev + 1)
    setShowAnswer(false);
  }

  const correctAnswer = () => {
    if (showAnswer) {
      setScore(prev => prev + clues[index].value)
      showNext();
    }
  }

  const incorrectAnswer = () => {
    if (showAnswer) {
      setScore(prev => prev - clues[index].value)
      showNext();
    }
  }

  const resetScore = () => {
    setScore(0);
    showNext();
  }

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <div className='grid grid-cols-2 justify-around min-w-full text-center font-robo  
      uppercase border-spacing-3'>
        <div className='grid bg-blue-700 m-1 text-white lg:text-5xl sm:text-4xl text-2xl'>
          <div className='self-center p-4'>
            {clues[index]?.category.title}
          </div>
        </div>
        <div className='grid bg-blue-700 m-1  text-yellow-300 lg:text-5xl sm:text-4xl text-2xl'>
          <div className='self-center p-4'>
            ${clues[index]?.value}
          </div>
        </div>
      </div >
      <div className='bg-blue-700 flex-1 text-center flex justify-center items-center m-1 lg:text-5xl md:text-4xl text-2xl
       text-white font-fraunces uppercase'>
        <div className='w-[80vw] lg:w-[60vw] md:leading-[4rem] leading-[2rem]'>
          {!showAnswer && clues[index]?.question.replaceAll(/<i>|<\/i>|\\/gi, '')}
          {showAnswer && clues[index]?.answer.replaceAll(/<i>|<\/i>|\\/gi, '')}
        </div>
      </div>
      <div className='flex min-w-full text-center text-gray-300 lg:text-xl md:text-lg text-xs'>
        <div className='bg-blue-700 m-1 p-4 font-extrabold flex-1' onClick={handleClick}>
          <div className='self-center '>{showAnswer ? 'Reveal Question' : 'Reveal Answer'}</div>
        </div>
        <div className='grid bg-blue-700 m-1 p-4 text-green-500 font-extrabold flex-1' onClick={correctAnswer}>
          {showAnswer && <button type='button' className='self-center'>Correct</button>}
        </div>
        {showAnswer && <div className='grid bg-blue-700 m-1 p-4 text-white-500 font-extrabold' onClick={resetScore}>
          <button type='button' className='self-center'>Reset</button>
        </div>}
        <div className='grid bg-blue-700 m-1 p-4 text-red-500 font-extrabold flex-1' onClick={incorrectAnswer}>
          {showAnswer && <button type='button' className='self-center'>Incorrect</button>}
        </div>
        <div className='grid bg-blue-700 m-1 p-4 font-extrabold flex-1' onClick={showNext}>
          <button type='button' className='self-center'>Skip</button>
        </div>
      </div>
      <div className='flex flex-col min-w-full font-robo text-center pb-2'>
        <div className='bg-blue-700 m-1 p-4  text-white lg:text-9xl text-6xl'>${score}</div>
      </div>
    </div >
  )
}

export default Jeopardy;