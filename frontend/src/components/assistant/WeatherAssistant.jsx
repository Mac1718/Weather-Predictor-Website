import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const suggestedQuestions = [
  'When will it rain today?',
  'When will it be hottest?',
  'Will it rain tomorrow?',
  'What is the best time to go outside?',
  'Will it be sunny in the afternoon?',
  'How strong will the wind be tonight?',
]

export function WeatherAssistant({ weatherData, onAsk }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!question.trim() || !weatherData) return

    setLoading(true)
    setShowSuggestions(false)
    try {
      const response = await onAsk(question)
      setAnswer(response)
    } catch (err) {
      setAnswer('Weather Assistant is temporarily unavailable. Try again shortly.')
    } finally {
      setLoading(false)
    }
  }, [question, weatherData, onAsk])

  const handleSuggestionClick = (q) => {
    setQuestion(q)
    handleSubmit(new Event('submit'))
  }

  const handleClear = () => {
    setQuestion('')
    setAnswer(null)
    setShowSuggestions(true)
  }

  return (
    <div className="card assistant-card">
      <div className="assistant-header">
        <h3 className="assistant-title">Weather Assistant</h3>
        <p className="assistant-subtitle">Ask anything about the forecast</p>
      </div>

      <form onSubmit={handleSubmit} className="assistant-form">
        <div className="search-input-wrap">
          <svg className="search-input-wrap__icon" aria-hidden="true">
            <use href="#i-search" />
          </svg>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What time will it rain?"
            className="assistant-textarea"
            disabled={loading}
            aria-label="Weather question"
          />
        </div>

        <AnimatePresence mode="wait">
          {showSuggestions && question.trim() === '' && (
            <motion.div
              className="suggestion-chips"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {suggestedQuestions.map((q, index) => (
                <motion.button
                  key={q}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(q)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  {q}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="assistant-actions">
          <motion.button
            type="submit"
            className="ask-btn"
            disabled={!question.trim() || loading}
            whileHover={question.trim() && !loading ? { scale: 1.02 } : {}}
            whileTap={question.trim() && !loading ? { scale: 0.98 } : {}}
          >
            {loading ? 'Thinking...' : 'Ask'}
          </motion.button>
          {(answer || question.trim()) && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="clear-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Clear
            </motion.button>
          )}
        </div>
      </form>

      <AnimatePresence mode="wait">
        {answer && (
          <motion.div
            className="assistant-answer"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{ margin: 0 }}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
