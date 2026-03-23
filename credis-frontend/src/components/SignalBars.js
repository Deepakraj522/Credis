import React from 'react'
import { motion } from 'framer-motion'
import './SignalBars.css'

export default function SignalBars({ signals }) {
  if (!signals) return null

  const signalNames = {
    incomeStability: { label: 'Income Stability', icon: '💰' },
    platformReliability: { label: 'Platform Reliability', icon: '🏢' },
    workConsistency: { label: 'Work Consistency', icon: '⏰' },
    spendingDiscipline: { label: 'Spending Discipline', icon: '💳' },
    incomeGrowth: { label: 'Income Growth', icon: '📈' }
  }

  const signalKeys = Object.keys(signals)

  return (
    <motion.div
      className="signal-bars"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="signal-header">
        <h3>Behavioral Signals</h3>
        <p>5-Factor Score Breakdown</p>
      </div>

      <div className="signals-grid">
        {signalKeys.map((key, index) => {
          const score = signals[key]
          const signalInfo = signalNames[key]

          return (
            <motion.div
              key={key}
              className="signal-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="signal-top">
                <div className="signal-label">
                  <span className="signal-icon">{signalInfo.icon}</span>
                  <span className="signal-name">{signalInfo.label}</span>
                </div>
                <span className="signal-score">{score}%</span>
              </div>

              <div className="signal-bar-container">
                <motion.div
                  className="signal-bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>

              <div className="signal-status">
                {score >= 80 && <span className="status-excellent">Excellent</span>}
                {score >= 60 && score < 80 && <span className="status-good">Good</span>}
                {score >= 40 && score < 60 && <span className="status-fair">Fair</span>}
                {score < 40 && <span className="status-poor">Needs Work</span>}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
