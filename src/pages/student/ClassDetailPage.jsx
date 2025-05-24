import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiMessageSquare, 
  FiDownload, 
  FiClock, 
  FiChevronDown, 
  FiChevronUp,
  FiCode,
  FiPlay,
  FiCheck,
  FiX
} from 'react-icons/fi';
import CodeEditor from '../../components/CodeEditor';

const ClassDetailPage = () => {
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState('lessons');
  const [expandedLesson, setExpandedLesson] = useState(null);
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);

  // Sample data
  const classData = {
    id: classId,
    name: 'Advanced Programming',
    code: 'CS401',
    instructor: 'Dr. Smith',
    description: 'Advanced concepts in programming including algorithms, data structures and system design',
    lessons: [
      { 
        id: 1, 
        title: 'Algorithm Complexity', 
        type: 'lecture', 
        date: '2023-05-01',
        content: 'Learn about time and space complexity analysis...',
        practiceProblem: {
          description: 'Implement a function that calculates the time complexity of a given algorithm',
          starterCode: 'function analyzeComplexity(algorithm) {\n  // Your code here\n  return "O(n)";\n}',
          testCases: [
            { input: 'algorithm1', output: 'O(n^2)', isPublic: true },
            { input: 'algorithm2', output: 'O(log n)', isPublic: true }
          ]
        }
      },
      { 
        id: 2, 
        title: 'Data Structures Review', 
        type: 'slides', 
        date: '2023-05-08',
        content: 'Review of fundamental data structures...',
        practiceProblem: {
          description: 'Implement a stack data structure with push and pop methods',
          starterCode: 'class Stack {\n  constructor() {\n    this.items = [];\n  }\n\n  push(item) {\n    // Your code here\n  }\n\n  pop() {\n    // Your code here\n  }\n}',
          testCases: [
            { input: 'push(5)', output: '[5]', isPublic: true },
            { input: 'push(3); pop()', output: '3', isPublic: true }
          ]
        }
      },
    ],
    assignments: [
      { 
        id: 1, 
        title: 'Sorting Algorithms Quiz', 
        type: 'quiz', 
        due: '2023-05-10', 
        duration: 30, // minutes
        status: 'not-started',
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            text: 'What is the time complexity of bubble sort in the worst case?',
            options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(1)'],
            correctAnswer: 2
          },
          {
            id: 2,
            type: 'programming',
            text: 'Implement a bubble sort algorithm',
            language: 'javascript',
            starterCode: 'function bubbleSort(arr) {\n  // Your code here\n}',
            testCases: [
              { input: '[3,1,4,2]', output: '[1,2,3,4]', isPublic: false }
            ],
            points: 10
          }
        ]
      },
      { 
        id: 2, 
        title: 'Final Exam', 
        type: 'exam', 
        due: '2023-06-01', 
        duration: 120, // minutes
        status: 'not-started',
        questions: [
          {
            id: 1,
            type: 'short-answer',
            text: 'Explain the difference between BFS and DFS',
            correctAnswer: 'BFS explores all neighbors first while DFS goes as deep as possible first',
            points: 5
          }
        ]
      },
    ]
  };

  // Run code for practice problems
  const runCode = () => {
    setIsRunning(true);
    setOutput('Running tests...\n');
    
    // Simulate code execution and testing
    setTimeout(() => {
      // In a real app, this would be handled by a backend service
      const currentLesson = classData.lessons.find(l => l.id === expandedLesson);
      if (currentLesson && currentLesson.practiceProblem) {
        const testResults = currentLesson.practiceProblem.testCases.map((testCase, i) => {
          // This is just a simulation - real implementation would actually run the code
          const passed = Math.random() > 0.5; // Random pass/fail for demo
          return `Test case ${i+1}: ${passed ? 'PASSED' : 'FAILED'}\n` +
                 `Input: ${testCase.input}\n` +
                 `Expected: ${testCase.output}\n` +
                 `Received: ${testCase.output}\n`; // Simulating correct output for demo
        });
        
        setOutput(prev => prev + testResults.join('\n') + '\nAll tests completed');
      }
      setIsRunning(false);
    }, 1500);
  };

  // Start exam timer
  const startExam = (duration) => {
    setExamStarted(true);
    setTimeLeft(duration * 60); // convert to seconds
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };

  // Submit exam
  const submitExam = () => {
    setExamStarted(false);
    // In a real app, this would submit to the backend
    alert('Exam submitted successfully!');
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">{classData.name}</h2>
      </header>

      <div className="p-6 space-y-6">
        {/* Class Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{classData.name}</h1>
              <p className="text-gray-600">{classData.code} • {classData.instructor}</p>
              <p className="mt-2 text-gray-700">{classData.description}</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
              <FiMessageSquare className="mr-2" /> Message Instructor
            </button>
          </div>
        </div>

        {/* Class Navigation */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-6 py-3 font-medium ${activeTab === 'lessons' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Lessons
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-6 py-3 font-medium ${activeTab === 'assignments' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`px-6 py-3 font-medium ${activeTab === 'grades' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Grades
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'lessons' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Class Materials</h2>
                <div className="space-y-3">
                  {classData.lessons.map(lesson => (
                    <div key={lesson.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow overflow-hidden">
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                      >
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs mr-2 capitalize">
                              {lesson.type}
                            </span>
                            <span>Posted: {lesson.date}</span>
                          </div>
                        </div>
                        {expandedLesson === lesson.id ? (
                          <FiChevronUp className="text-gray-500" />
                        ) : (
                          <FiChevronDown className="text-gray-500" />
                        )}
                      </div>

                      {expandedLesson === lesson.id && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Lesson Content</h4>
                            <p className="text-gray-700">{lesson.content}</p>
                            <button className="mt-2 px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center text-sm">
                              <FiDownload className="mr-2" /> Download Materials
                            </button>
                          </div>

                          {lesson.practiceProblem && (
                            <div className="mt-4 border-t pt-4">
                              <h4 className="font-medium mb-2 flex items-center">
                                <FiCode className="mr-2" /> Practice Exercise
                              </h4>
                              <p className="text-gray-700 mb-3">{lesson.practiceProblem.description}</p>
                              
                              <CodeEditor
                                value={lesson.practiceProblem.starterCode}
                                onChange={setCode}
                                language="javascript"
                                height="200px"
                              />
                              
                              <div className="mt-3 flex justify-between items-center">
                                <button
                                  onClick={runCode}
                                  disabled={isRunning}
                                  className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center ${isRunning ? 'opacity-50' : ''}`}
                                >
                                  <FiPlay className="mr-2" /> {isRunning ? 'Running...' : 'Run Code'}
                                </button>
                              </div>

                              {output && (
                                <div className="mt-3 bg-black text-green-400 p-3 rounded font-mono text-sm overflow-auto max-h-40">
                                  <pre>{output}</pre>
                                </div>
                              )}

                              <div className="mt-4">
                                <h5 className="text-sm font-medium mb-2">Test Cases</h5>
                                <div className="space-y-2">
                                  {lesson.practiceProblem.testCases.map((testCase, i) => (
                                    <div key={i} className="bg-gray-100 p-2 rounded text-sm">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <span className="text-gray-500">Input:</span>
                                          <pre className="bg-white p-1 rounded">{testCase.input}</pre>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">Expected Output:</span>
                                          <pre className="bg-white p-1 rounded">{testCase.output}</pre>
                                        </div>
                                      </div>
                                      <span className={`text-xs px-2 py-1 rounded ${testCase.isPublic ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                        {testCase.isPublic ? 'Public' : 'Private'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Assignments</h2>
                <div className="space-y-3">
                  {classData.assignments.map(assignment => (
                    <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                      <div 
                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => setExpandedAssignment(expandedAssignment === assignment.id ? null : assignment.id)}
                      >
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FiClock className="mr-1" />
                            <span>Due: {assignment.due}</span>
                            {assignment.status === 'in-progress' && (
                              <span className="ml-3 text-orange-600">
                                Time left: {formatTime(timeLeft)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-xs rounded-full mr-3 ${
                            assignment.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : assignment.status === 'in-progress'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {assignment.status.replace('-', ' ')}
                          </span>
                          {expandedAssignment === assignment.id ? (
                            <FiChevronUp className="text-gray-500" />
                          ) : (
                            <FiChevronDown className="text-gray-500" />
                          )}
                        </div>
                      </div>

                      {expandedAssignment === assignment.id && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          {assignment.status === 'completed' ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="font-medium text-green-800">Completed</h4>
                                  <p className="text-sm text-green-600">Your submission has been received</p>
                                </div>
                                <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                                  View Results
                                </button>
                              </div>
                            </div>
                          ) : examStarted ? (
                            <div className="space-y-4">
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex justify-between items-center">
                                <div className="flex items-center">
                                  <FiClock className="text-orange-500 mr-2" />
                                  <span className="text-orange-800">Time remaining: {formatTime(timeLeft)}</span>
                                </div>
                                <button 
                                  onClick={submitExam}
                                  className="px-3 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                                >
                                  Submit Exam
                                </button>
                              </div>

                              <div className="space-y-6">
                                {assignment.questions.map((question, qIndex) => (
                                  <div key={qIndex} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h4 className="font-medium">
                                          Question {qIndex + 1} ({question.points} points)
                                        </h4>
                                        <p className="text-gray-700 mt-1">{question.text}</p>
                                      </div>
                                    </div>

                                    {question.type === 'multiple-choice' && (
                                      <div className="mt-3 space-y-2">
                                        {question.options.map((option, oIndex) => (
                                          <div key={oIndex} className="flex items-center">
                                            <input
                                              type="radio"
                                              name={`question-${qIndex}`}
                                              id={`question-${qIndex}-option-${oIndex}`}
                                              className="mr-2"
                                            />
                                            <label htmlFor={`question-${qIndex}-option-${oIndex}`}>
                                              {option}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {question.type === 'short-answer' && (
                                      <div className="mt-3">
                                        <textarea
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                          rows="3"
                                          placeholder="Type your answer here..."
                                        />
                                      </div>
                                    )}

                                    {question.type === 'programming' && (
                                      <div className="mt-3">
                                        <CodeEditor
                                          value={question.starterCode}
                                          onChange={(value) => {
                                            // Handle code changes for submission
                                          }}
                                          language={question.language}
                                          height="200px"
                                        />
                                        <div className="mt-2">
                                          <h5 className="text-sm font-medium mb-1">Test Cases</h5>
                                          <div className="space-y-2">
                                            {question.testCases.filter(tc => tc.isPublic).map((testCase, tIndex) => (
                                              <div key={tIndex} className="bg-gray-100 p-2 rounded text-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                  <div>
                                                    <span className="text-gray-500">Input:</span>
                                                    <pre className="bg-white p-1 rounded">{testCase.input}</pre>
                                                  </div>
                                                  <div>
                                                    <span className="text-gray-500">Expected Output:</span>
                                                    <pre className="bg-white p-1 rounded">{testCase.output}</pre>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-medium text-blue-800 mb-2">{assignment.type === 'quiz' ? 'Quiz' : 'Exam'} Instructions</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                  <li>Duration: {assignment.duration} minutes</li>
                                  <li>Total questions: {assignment.questions.length}</li>
                                  <li>Once started, you cannot pause the timer</li>
                                  <li>Make sure you have stable internet connection</li>
                                </ul>
                              </div>
                              <div className="flex justify-end">
                                <button
                                  onClick={() => startExam(assignment.duration)}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                  Start {assignment.type === 'quiz' ? 'Quiz' : 'Exam'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'grades' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Grades</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {classData.assignments.map(assignment => (
                        <tr key={assignment.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {assignment.title}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment.due}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              assignment.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {assignment.status.replace('-', ' ')}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment.score || '-'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            {assignment.status === 'completed' ? (
                              <button className="text-indigo-600 hover:text-indigo-900">
                                View Feedback
                              </button>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassDetailPage;