import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'
import './LenderCards.css'

export default function LenderCards({ lenders }) {
  if (!lenders || lenders.length === 0) return null

  return (
    <motion.div
      className="lender-cards"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="lender-header">
        <h3>Recommended Lenders</h3>
        <p>Top 3 Lending Partners</p>
      </div>

      <div className="lenders-grid">
        {lenders.map((lender, index) => (
          <motion.div
            key={index}
            className={`lender-card glass ${index === 0 ? 'best-match' : ''}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            {/* Best Match Badge */}
            {index === 0 && (
              <div className="best-match-badge">
                <CheckCircle size={14} />
                Best Match
              </div>
            )}

            {/* Lender Number */}
            <div className="lender-number">{index + 1}</div>

            {/* Lender Name */}
            <h4 className="lender-name">{lender.name}</h4>

            {/* Lender Details */}
            <div className="lender-details">
              <div className="detail">
                <span className="detail-label">Interest Rate</span>
                <span className="detail-value">{lender.rate}%</span>
              </div>
              <div className="detail">
                <span className="detail-label">Max Loan</span>
                <span className="detail-value">₹{lender.maxLoan?.toLocaleString()}</span>
              </div>
              <div className="detail">
                <span className="detail-label">Approval</span>
                <span className="detail-value">{lender.days} Days</span>
              </div>
            </div>

            {/* CTA Button */}
            <button className="btn-apply glass">
              Apply Now
              <ArrowRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
