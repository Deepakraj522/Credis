import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Briefcase, TrendingUp } from 'lucide-react'
import './UserProfile.css'

export default function UserProfile({ userInfo, workerData }) {
  if (!userInfo && !workerData) return null

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      className="user-profile-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="profile-header">
        <h3>👤 Profile Information</h3>
      </div>

      <div className="profile-grid">
        {/* Basic Info Card */}
        <motion.div 
          className="profile-card glass"
          variants={itemVariants}
          transition={{ delay: 0.3 }}
        >
          <div className="card-title">Personal Details</div>
          <div className="profile-info-item">
            <span className="info-label">Name</span>
            <span className="info-value">{userInfo?.name || workerData?.name || 'N/A'}</span>
          </div>
          <div className="profile-info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{userInfo?.email || 'N/A'}</span>
          </div>
          <div className="profile-info-item">
            <span className="info-label">Role</span>
            <span className="info-value badge">{userInfo?.role || 'Worker'}</span>
          </div>
        </motion.div>

        {/* Worker Stats Card */}
        {workerData && (
          <motion.div 
            className="profile-card glass worker-stats"
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            <div className="card-title">Work Statistics</div>
            <div className="profile-info-item">
              <span className="info-label">Platform</span>
              <span className="info-value">{workerData.platform}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Location</span>
              <span className="info-value">{workerData.city}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Active Months</span>
              <span className="info-value">{workerData.activeMonths}</span>
            </div>
          </motion.div>
        )}

        {/* Financial Info Card */}
        {workerData && (
          <motion.div 
            className="profile-card glass financial-info"
            variants={itemVariants}
            transition={{ delay: 0.5 }}
          >
            <div className="card-title">Financial Snapshot</div>
            <div className="profile-info-item">
              <span className="info-label">Monthly Income</span>
              <span className="info-value highlight">₹{workerData.avgMonthlyIncome?.toLocaleString()}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Current Balance</span>
              <span className="info-value">₹{workerData.currentBalance?.toLocaleString()}</span>
            </div>
            <div className="profile-info-item">
              <span className="info-label">Growth Rate</span>
              <span className="info-value positive">↑ {workerData.growthPct}%</span>
            </div>
          </motion.div>
        )}

        {/* Benefits Info Card */}
        {workerData && (
          <motion.div 
            className="profile-card glass benefits-info"
            variants={itemVariants}
            transition={{ delay: 0.6 }}
          >
            <div className="card-title">Benefits & Coverage</div>
            <div className="benefit-item">
              <span className={`benefit-badge ${workerData.hasRD ? 'active' : 'inactive'}`}>
                {workerData.hasRD ? '✓' : '✗'}
              </span>
              <div>
                <div className="benefit-name">Recurring Deposit</div>
                {workerData.hasRD && <div className="benefit-detail">₹{workerData.rdAmount}/month</div>}
              </div>
            </div>
            <div className="benefit-item">
              <span className={`benefit-badge ${workerData.hasInsurance ? 'active' : 'inactive'}`}>
                {workerData.hasInsurance ? '✓' : '✗'}
              </span>
              <div>
                <div className="benefit-name">Insurance Coverage</div>
                {workerData.hasInsurance && <div className="benefit-detail">₹{workerData.insurancePremium}/month</div>}
              </div>
            </div>
            <div className="benefit-item">
              <span className={`benefit-badge ${workerData.ckyc ? 'active' : 'inactive'}`}>
                {workerData.ckyc ? '✓' : '✗'}
              </span>
              <div>
                <div className="benefit-name">CKYC Verification</div>
                <div className="benefit-detail">KYC Identity Verified</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
