import React from 'react'
import { motion } from 'framer-motion'
import './WorkerProfile.css'

export default function WorkerProfile({ workerData }) {
  if (!workerData) return null

  const stats = [
    { label: 'Monthly Income', value: `₹${workerData.avgMonthlyIncome?.toLocaleString()}`, icon: '💰' },
    { label: 'Platform Rating', value: `⭐ ${workerData.rating?.toFixed(1)}`, icon: '⭐' },
    { label: 'Active Days', value: `${workerData.activeDays}`, icon: '📅' },
    { label: 'Total Deliveries', value: `${workerData.totalDeliveries?.toLocaleString()}`, icon: '📦' },
    { label: 'Cancellation Rate', value: `${workerData.cancellationRate?.toFixed(1)}%`, icon: '❌' },
    { label: 'Active Months', value: `${workerData.activeMonths}`, icon: '📊' },
    {
      label: 'Status',
      value: workerData.hasRD ? 'RD Active' : 'No RD',
      icon: '💳',
      highlight: workerData.hasRD,
    },
    {
      label: 'Insurance',
      value: workerData.hasInsurance ? 'Covered' : 'Not Covered',
      icon: '🛡️',
      highlight: workerData.hasInsurance,
    },
    {
      label: 'Growth %',
      value: `${workerData.growthPct?.toFixed(1)}%`,
      icon: '📈',
    },
  ]

  return (
    <motion.div
      className="worker-profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <div className="profile-header">
        <h3>Worker Profile</h3>
        <p>9 Key Metrics Overview</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className={`stat-tile glass ${stat.highlight ? 'highlight' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
