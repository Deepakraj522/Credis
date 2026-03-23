import React from 'react'
import { motion } from 'framer-motion'
import './ScoreHero.css'

export default function ScoreHero({ workerData }) {
  if (!workerData) return null

  const getRiskColor = (band) => {
    switch(band) {
      case 'AA': return '#00C896'
      case 'A': return '#6C63FF'
      case 'B': return '#FFB84D'
      case 'C': return '#FF6584'
      default: return '#6C63FF'
    }
  }

  const getLoanDecisionColor = (decision) => {
    return decision === 'Approved' ? '#00C896' : '#FF6584'
  }

  // SVG Progress Ring
  const circumference = 2 * Math.PI * 85
  const strokeDashoffset = circumference - (workerData.credisScore / 100) * circumference

  // Counter animation for score
  const scoreVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.5 }
    }
  }

  return (
    <motion.div
      className="score-hero"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="score-hero-layout">
        {/* Left: SVG Progress Ring */}
        <div className="score-circle-container">
          {/* Glow effect */}
          <motion.div 
            className="score-glow"
            animate={{ 
              boxShadow: [
                `0 0 20px ${getRiskColor(workerData.riskBand)}33`,
                `0 0 30px ${getRiskColor(workerData.riskBand)}66`,
                `0 0 20px ${getRiskColor(workerData.riskBand)}33`
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <svg className="score-circle" viewBox="0 0 180 180">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="85"
              fill="none"
              stroke="rgba(108, 99, 255, 0.1)"
              strokeWidth="12"
            />
            {/* Progress circle with enhanced animation */}
            <motion.circle
              cx="90"
              cy="90"
              r="85"
              fill="none"
              stroke={getRiskColor(workerData.riskBand)}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              animate={{ strokeDashoffset }}
              transition={{ 
                duration: 2.5, 
                ease: 'easeInOut',
                delay: 0.3
              }}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '90px 90px' }}
            />
          </svg>
          <div className="score-text">
            <motion.div
              className="score-number"
              variants={scoreVariants}
              initial="hidden"
              animate="visible"
            >
              {workerData.credisScore}
            </motion.div>
            <motion.div 
              className="score-label"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
            >
              /100
            </motion.div>
          </div>
        </div>

        {/* Right: Worker Info & Badges */}
        <div className="score-info">
          <div className="worker-header">
            <h2>{workerData.name}</h2>
            <p className="worker-platform">{workerData.platform}</p>
            <p className="worker-city">📍 {workerData.city}</p>
          </div>

          {/* Badges */}
          <div className="score-badges">
            {/* Risk Band */}
            <div className="badge glass">
              <span className="badge-label">Risk Band</span>
              <span
                className="badge-value"
                style={{ color: getRiskColor(workerData.riskBand) }}
              >
                {workerData.riskBand}
              </span>
            </div>

            {/* Loan Decision */}
            <div className="badge glass">
              <span className="badge-label">Loan Decision</span>
              <span
                className="badge-value"
                style={{ color: getLoanDecisionColor(workerData.loanDecision) }}
              >
                {workerData.loanDecision}
              </span>
            </div>

            {/* Max Loan */}
            <div className="badge glass">
              <span className="badge-label">Max Loan</span>
              <span className="badge-value">₹{workerData.maxLoan?.toLocaleString()}</span>
            </div>

            {/* Approval Days */}
            <div className="badge glass">
              <span className="badge-label">Approval Days</span>
              <span className="badge-value">{workerData.approvalDays} Days</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="key-metrics">
            <div className="metric">
              <span className="metric-label">Avg Monthly Income</span>
              <span className="metric-value">₹{workerData.avgMonthlyIncome?.toLocaleString()}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Platform Rating</span>
              <span className="metric-value">⭐ {workerData.rating?.toFixed(1)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Active Days</span>
              <span className="metric-value">{workerData.activeDays}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
