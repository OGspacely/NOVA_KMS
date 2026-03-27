import React, { useState } from 'react';
import { CheckCircle, XCircle, Award, BrainCircuit } from 'lucide-react';

export const Quizzes = () => {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  // Mock quizzes
  const quizzes = [
    {
      id: 1,
      title: 'Basic Algebra Quiz',
      subject: 'Mathematics',
      questions: [
        { text: 'Solve for x: 2x + 5 = 15', options: ['x = 5', 'x = 10', 'x = 2', 'x = 20'], correct: 0 },
        { text: 'What is the value of 3^3?', options: ['9', '27', '81', '6'], correct: 1 },
        { text: 'Simplify: 4a + 3b - 2a + b', options: ['2a + 4b', '6a + 4b', '2a + 2b', '6a + 2b'], correct: 0 }
      ]
    },
    {
      id: 2,
      title: 'Cellular Biology Basics',
      subject: 'Integrated Science',
      questions: [
        { text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'], correct: 1 },
        { text: 'Which organelle is responsible for protein synthesis?', options: ['Golgi apparatus', 'Lysosome', 'Ribosome', 'Vacuole'], correct: 2 },
        { text: 'Which of the following is found in plant cells but not in animal cells?', options: ['Cell membrane', 'Nucleus', 'Chloroplast', 'Cytoplasm'], correct: 2 }
      ]
    },
    {
      id: 3,
      title: 'Ghanaian History: Independence',
      subject: 'Social Studies',
      questions: [
        { text: 'In what year did Ghana gain independence?', options: ['1957', '1960', '1945', '1966'], correct: 0 },
        { text: 'Who was the first President of Ghana?', options: ['J.B. Danquah', 'Kwame Nkrumah', 'Jerry John Rawlings', 'Kofi Annan'], correct: 1 },
        { text: 'What was the name of Ghana before independence?', options: ['Gold Coast', 'Ivory Coast', 'Slave Coast', 'Ashanti Empire'], correct: 0 }
      ]
    },
    {
      id: 4,
      title: 'Introduction to Spreadsheets',
      subject: 'Information and Communication Technology (ICT)',
      questions: [
        { text: 'Which software is primarily used for spreadsheets?', options: ['Microsoft Word', 'Microsoft Excel', 'Microsoft PowerPoint', 'Microsoft Access'], correct: 1 },
        { text: 'What is the intersection of a row and a column called?', options: ['Cell', 'Box', 'Grid', 'Table'], correct: 0 },
        { text: 'Which symbol is used to start a formula in Excel?', options: ['+', '-', '=', '*'], correct: 2 }
      ]
    },
    {
      id: 5,
      title: 'English Grammar & Comprehension',
      subject: 'English Language',
      questions: [
        { text: 'Identify the noun in this sentence: "The quick brown fox jumps over the lazy dog."', options: ['quick', 'brown', 'fox', 'jumps'], correct: 2 },
        { text: 'What is the past tense of "go"?', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
        { text: 'Choose the correct synonym for "happy".', options: ['sad', 'angry', 'joyful', 'tired'], correct: 2 }
      ]
    },
    {
      id: 6,
      title: 'Basic French Vocabulary',
      subject: 'French',
      questions: [
        { text: 'How do you say "Hello" in French?', options: ['Au revoir', 'Bonjour', 'Merci', 'S\'il vous plaît'], correct: 1 },
        { text: 'What does "Chat" mean in English?', options: ['Dog', 'Bird', 'Cat', 'Fish'], correct: 2 },
        { text: 'Which of the following means "Thank you"?', options: ['Pardon', 'Oui', 'Non', 'Merci'], correct: 3 }
      ]
    },
    {
      id: 7,
      title: 'Moral Values and Ethics',
      subject: 'Religious and Moral Education (RME)',
      questions: [
        { text: 'Which of the following is a moral value?', options: ['Stealing', 'Honesty', 'Lying', 'Cheating'], correct: 1 },
        { text: 'What is the Golden Rule?', options: ['Do unto others as you would have them do unto you', 'An eye for an eye', 'Survival of the fittest', 'Might makes right'], correct: 0 },
        { text: 'Which of these is a traditional Ghanaian value?', options: ['Disrespect for elders', 'Individualism over community', 'Hospitality', 'Greed'], correct: 2 }
      ]
    },
    {
      id: 8,
      title: 'Materials and Tools',
      subject: 'Design and Technology',
      questions: [
        { text: 'Which tool is used for cutting wood?', options: ['Hammer', 'Screwdriver', 'Saw', 'Pliers'], correct: 2 },
        { text: 'What is a common property of metals?', options: ['Brittle', 'Good conductor of heat', 'Transparent', 'Soft'], correct: 1 },
        { text: 'Which of these is a natural material?', options: ['Plastic', 'Nylon', 'Wood', 'Polyester'], correct: 2 }
      ]
    },
    {
      id: 9,
      title: 'Physical Fitness Basics',
      subject: 'Physical Education and Health (PEH)',
      questions: [
        { text: 'Which of the following is a cardiovascular exercise?', options: ['Weightlifting', 'Running', 'Stretching', 'Yoga'], correct: 1 },
        { text: 'Why is warming up important before exercise?', options: ['To get tired faster', 'To prevent injuries', 'To cool down the body', 'To decrease heart rate'], correct: 1 },
        { text: 'Which nutrient is primarily responsible for muscle repair?', options: ['Carbohydrates', 'Fats', 'Protein', 'Vitamins'], correct: 2 }
      ]
    },
    {
      id: 10,
      title: 'Akan Culture and Traditions',
      subject: 'Ghanaian Language and Culture',
      questions: [
        { text: 'What is the traditional cloth worn by the Akan people?', options: ['Kente', 'Batakari', 'Smock', 'Agbada'], correct: 0 },
        { text: 'Which day born name is given to a male born on Friday in Akan?', options: ['Kwame', 'Kofi', 'Kwasi', 'Yaw'], correct: 1 },
        { text: 'What is the symbol of authority for an Akan chief?', options: ['Crown', 'Stool', 'Sword', 'Scepter'], correct: 1 }
      ]
    },
    {
      id: 11,
      title: 'Fractions and Decimals',
      subject: 'Mathematics',
      questions: [
        { text: 'What is 1/4 as a decimal?', options: ['0.25', '0.5', '0.75', '0.14'], correct: 0 },
        { text: 'Add 1/2 and 1/3.', options: ['2/5', '5/6', '1/6', '1/5'], correct: 1 },
        { text: 'Convert 0.8 to a fraction in its simplest form.', options: ['8/10', '4/5', '2/3', '1/8'], correct: 1 }
      ]
    },
    {
      id: 12,
      title: 'States of Matter',
      subject: 'Integrated Science',
      questions: [
        { text: 'Which state of matter has a definite shape and volume?', options: ['Solid', 'Liquid', 'Gas', 'Plasma'], correct: 0 },
        { text: 'What is the process of a liquid turning into a gas called?', options: ['Condensation', 'Evaporation', 'Melting', 'Freezing'], correct: 1 },
        { text: 'Which of these is NOT a state of matter?', options: ['Solid', 'Energy', 'Liquid', 'Gas'], correct: 1 }
      ]
    },
    {
      id: 13,
      title: 'Geography of Ghana',
      subject: 'Social Studies',
      questions: [
        { text: 'What is the capital city of Ghana?', options: ['Kumasi', 'Tamale', 'Accra', 'Cape Coast'], correct: 2 },
        { text: 'Which river is the longest in Ghana?', options: ['Pra', 'Ankobra', 'Volta', 'Tano'], correct: 2 },
        { text: 'Ghana is bordered to the west by which country?', options: ['Togo', 'Burkina Faso', 'Côte d\'Ivoire', 'Nigeria'], correct: 2 }
      ]
    },
    {
      id: 14,
      title: 'Internet Basics',
      subject: 'Information and Communication Technology (ICT)',
      questions: [
        { text: 'What does WWW stand for?', options: ['World Wide Web', 'World Web Wide', 'Wide World Web', 'Web World Wide'], correct: 0 },
        { text: 'Which of the following is a web browser?', options: ['Google', 'Windows', 'Chrome', 'Linux'], correct: 2 },
        { text: 'What is an IP address?', options: ['Internet Provider', 'Internet Protocol', 'Internal Processor', 'Intranet Protocol'], correct: 1 }
      ]
    },
    {
      id: 15,
      title: 'Figures of Speech',
      subject: 'English Language',
      questions: [
        { text: 'Which figure of speech compares two things using "like" or "as"?', options: ['Metaphor', 'Simile', 'Personification', 'Hyperbole'], correct: 1 },
        { text: 'What is "The wind whispered through the trees" an example of?', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], correct: 2 },
        { text: 'An exaggerated statement not meant to be taken literally is called:', options: ['Hyperbole', 'Irony', 'Oxymoron', 'Pun'], correct: 0 }
      ]
    },
    {
      id: 16,
      title: 'French Numbers and Colors',
      subject: 'French',
      questions: [
        { text: 'What is the number 10 in French?', options: ['Cinq', 'Huit', 'Dix', 'Douze'], correct: 2 },
        { text: 'What color is "Rouge"?', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 1 },
        { text: 'How do you say "White" in French?', options: ['Noir', 'Blanc', 'Vert', 'Jaune'], correct: 1 }
      ]
    },
    {
      id: 17,
      title: 'Major World Religions',
      subject: 'Religious and Moral Education (RME)',
      questions: [
        { text: 'What is the holy book of Islam?', options: ['Bible', 'Torah', 'Quran', 'Vedas'], correct: 2 },
        { text: 'Who is the central figure of Christianity?', options: ['Moses', 'Muhammad', 'Jesus Christ', 'Buddha'], correct: 2 },
        { text: 'Which religion originated in India and follows the teachings of Siddhartha Gautama?', options: ['Hinduism', 'Buddhism', 'Sikhism', 'Jainism'], correct: 1 }
      ]
    },
    {
      id: 18,
      title: 'Basic Electronics',
      subject: 'Design and Technology',
      questions: [
        { text: 'What is the unit of electrical resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correct: 2 },
        { text: 'Which component stores electrical energy?', options: ['Resistor', 'Capacitor', 'Diode', 'Transistor'], correct: 1 },
        { text: 'What does LED stand for?', options: ['Light Emitting Diode', 'Low Energy Device', 'Liquid Emission Display', 'Light Energy Diode'], correct: 0 }
      ]
    },
    {
      id: 19,
      title: 'Rules of Football (Soccer)',
      subject: 'Physical Education and Health (PEH)',
      questions: [
        { text: 'How many players are on a standard football team on the field?', options: ['9', '10', '11', '12'], correct: 2 },
        { text: 'What happens when a player receives a red card?', options: ['Warning', 'Free kick', 'Sent off the field', 'Penalty'], correct: 2 },
        { text: 'How long is a standard professional football match (excluding extra time)?', options: ['60 minutes', '80 minutes', '90 minutes', '120 minutes'], correct: 2 }
      ]
    },
    {
      id: 20,
      title: 'Ewe Culture and Traditions',
      subject: 'Ghanaian Language and Culture',
      questions: [
        { text: 'Which region in Ghana is predominantly inhabited by the Ewe people?', options: ['Ashanti', 'Volta', 'Northern', 'Western'], correct: 1 },
        { text: 'What is a popular traditional dance of the Ewe people?', options: ['Adowa', 'Agbadza', 'Kpanlogo', 'Bamaya'], correct: 1 },
        { text: 'What is the staple food often associated with the Volta Region?', options: ['Fufu', 'Banku', 'Akple', 'Kenkey'], correct: 2 }
      ]
    }
  ];

  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleNext = () => {
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    activeQuiz.questions.forEach((q: any, index: number) => {
      if (answers[index] === q.correct) score++;
    });
    return score;
  };

  if (activeQuiz) {
    if (showResults) {
      const score = calculateScore();
      const percentage = (score / activeQuiz.questions.length) * 100;
      return (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <Award className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
            <p className="text-xl text-gray-600 mb-8">You scored {score} out of {activeQuiz.questions.length} ({percentage.toFixed(0)}%)</p>
            
            <div className="space-y-6 text-left mb-8">
              {activeQuiz.questions.map((q: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                  <p className="font-medium text-gray-900 mb-4">{i + 1}. {q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isSelected = answers[i] === optIdx;
                      const isCorrect = q.correct === optIdx;
                      let className = "p-3 rounded-xl border ";
                      if (isCorrect) className += "bg-green-50 border-green-200 text-green-700";
                      else if (isSelected && !isCorrect) className += "bg-red-50 border-red-200 text-red-700";
                      else className += "bg-white border-gray-200 text-gray-500";
                      
                      return (
                        <div key={optIdx} className={`flex items-center justify-between ${className}`}>
                          <span>{opt}</span>
                          {isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                          {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setActiveQuiz(null)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      );
    }

    const question = activeQuiz.questions[currentQuestion];
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{activeQuiz.title}</h2>
            <span className="text-gray-500 font-medium">Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
          </div>
          
          <div className="mb-8">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <p className="text-xl font-medium text-gray-900 mb-8">{question.text}</p>
          
          <div className="space-y-4 mb-8">
            {question.options.map((opt: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQuestion] === index ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' : 'border-gray-100 hover:border-blue-200 text-gray-700'}`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {currentQuestion === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Practice Quizzes</h1>
          <p className="text-gray-500 mt-1">Test your knowledge and track your progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold uppercase tracking-wider">
                {quiz.subject}
              </span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold uppercase tracking-wider">
                {quiz.questions.length} Questions
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">{quiz.title}</h3>
            <button 
              onClick={() => handleStartQuiz(quiz)}
              className="mt-auto w-full py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl font-medium transition-colors border border-gray-200 hover:border-blue-200"
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
