import React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import './EarningsChart.css'

export default function EarningsChart({ earnings }) {
  if (!earnings || earnings.length === 0) return null

  // Handle both array of objects and array of numbers
  const isObjectArray = typeof earnings[0] === 'object' && earnings[0] !== null
  
  const data = isObjectArray 
    ? earnings 
    : earnings.map((value, index) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
        amount: value,
      }))

  // Extract amounts for calculation
  const amounts = isObjectArray 
    ? earnings.map(e => e.amount)
    : earnings

  const minEarnings = Math.min(...amounts)
  const maxEarnings = Math.max(...amounts)
  const avgEarnings = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length)
  const totalEarnings = amounts.reduce((a, b) => a + b, 0)

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip glass">
          <p className="tooltip-month">{payload[0].payload.month}</p>
          <p className="tooltip-value">₹{payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      className="earnings-chart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="chart-header">
        <h3>Monthly Earnings</h3>
        <p>12-Month Historical Data</p>
      </div>

      {/* Chart Stats */}
      <div className="chart-stats">
        <div className="stat glass">
          <span className="stat-label">Total Annual</span>
          <span className="stat-value">₹{totalEarnings.toLocaleString()}</span>
        </div>
        <div className="stat glass">
          <span className="stat-label">Monthly Average</span>
          <span className="stat-value">₹{avgEarnings.toLocaleString()}</span>
        </div>
        <div className="stat glass">
          <span className="stat-label">Highest Month</span>
          <span className="stat-value">₹{maxEarnings.toLocaleString()}</span>
        </div>
        <div className="stat glass">
          <span className="stat-label">Lowest Month</span>
          <span className="stat-value" style={{ color: '#FF6584' }}>
            ₹{minEarnings.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6C63FF" />
                <stop offset="100%" stopColor="#5D54D4" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(108, 99, 255, 0.1)" />
            <XAxis
              dataKey="month"
              stroke="rgba(255, 255, 255, 0.3)"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.3)"
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey={isObjectArray ? "amount" : "amount"}
              fill="url(#earningsGradient)"
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
