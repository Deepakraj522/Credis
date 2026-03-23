import React from 'react'
import { motion } from 'framer-motion'
import { Flag, TrendingUp, Calendar, Target } from 'lucide-react'
import './GrowthRoadmap.css'

export default function GrowthRoadmap({ roadmap }) {
  if (!roadmap) return null

  const phases = [
    { 
      key: 'foundation', 
      label: 'Foundation', 
      icon: '🏗️', 
      color: '#6C63FF',
      timeline: 'Months 1-3',
      description: 'Establish strong financial discipline and build foundational income stability'
    },
    { 
      key: 'growth', 
      label: 'Growth', 
      icon: '📈', 
      color: '#00C896',
      timeline: 'Months 4-6',
      description: 'Increase income streams and apply for formal credit facilities'
    },
    { 
      key: 'expansion', 
      label: 'Expansion', 
      icon: '🚀', 
      color: '#FFB84D',
      timeline: 'Months 7-9',
      description: 'Scale operations and invest in income-generating assets'
    },
    { 
      key: 'consolidation', 
      label: 'Consolidation', 
      icon: '🎯', 
      color: '#FF6584',
      timeline: 'Months 10-12',
      description: 'Consolidate gains and plan for sustainable long-term growth'
    },
  ]

  return (
    <motion.div
      className="growth-roadmap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="roadmap-header">
        <h3>📊 12-Month Growth Roadmap</h3>
        <p>Detailed Path to Financial Growth & Sustainability</p>
      </div>

      {/* Phases Timeline */}
      <div className="phases-container">
        {phases.map((phase, index) => (
          <motion.div
            key={phase.key}
            className="phase-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            {/* Phase Number & Timeline */}
            <div className="phase-badge" style={{ backgroundColor: phase.color }}>
              <span className="phase-number">Phase {index + 1}</span>
              <span className="phase-timeline">
                <Calendar size={12} />
                {phase.timeline}
              </span>
            </div>

            {/* Phase Header */}
            <div className="phase-header glass">
              <div className="phase-icon-large">{phase.icon}</div>
              <div className="phase-info">
                <h4 className="phase-title">{phase.label}</h4>
                <p className="phase-description">{phase.description}</p>
              </div>
            </div>

            {/* Phase Targets - Detailed List */}
            <div className="phase-targets-detailed glass">
              {roadmap[phase.key] && roadmap[phase.key].length > 0 ? (
                <ul className="targets-list">
                  {roadmap[phase.key].map((target, idx) => (
                    <motion.li 
                      key={idx}
                      className="target-item-detailed"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                    >
                      <span className="target-bullet">✓</span>
                      <span className="target-text">{target}</span>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="no-targets">No targets defined for this phase</p>
              )}
            </div>

            {/* Connector to next phase */}
            {index < phases.length - 1 && (
              <div className="phase-connector" style={{ borderLeftColor: phase.color }}></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Year End Targets */}
      {roadmap.yearEndTargets && (
        <motion.div
          className="year-end-targets glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="targets-header">
            <Target size={20} color="#6C63FF" />
            <h4>🏁 Year-End Goals & Milestones</h4>
          </div>

          <div className="targets-grid">
            {roadmap.yearEndTargets.map((target, index) => (
              <motion.div
                key={index}
                className="target-card glass"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <TrendingUp size={20} color="#00C896" />
                <span className="target-goal">{target}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
