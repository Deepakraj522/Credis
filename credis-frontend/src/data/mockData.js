export const USERS = {
  "officer@nbcfdc.gov.in": {
    password: "nbcfdc123",
    name: "Rajesh Sharma",
    role: "Loan Officer",
    workerAccess: ["W001","W002","W003","W004","W005"]
  },
  "ravi@credis.com": {
    password: "ravi123",
    name: "Ravi Kumar",
    role: "Gig Worker",
    workerAccess: ["W001"]
  },
  "meena@credis.com": {
    password: "meena123",
    name: "Meena Devi",
    role: "Gig Worker",
    workerAccess: ["W002"]
  },
  "arjun@credis.com": {
    password: "arjun123",
    name: "Arjun Das",
    role: "Gig Worker",
    workerAccess: ["W003"]
  },
  "priya@credis.com": {
    password: "priya123",
    name: "Priya Lakshmi",
    role: "Gig Worker",
    workerAccess: ["W004"]
  },
  "suresh@credis.com": {
    password: "suresh123",
    name: "Suresh Babu",
    role: "Gig Worker",
    workerAccess: ["W005"]
  }
};

export const AGENT_META = [
  {id:1, name:"DataWeaver",       desc:"Loading and validating worker data",        icon:"📂", dur:2800},
  {id:2, name:"PatternMind",      desc:"Analyzing 12-month behavioral patterns",     icon:"📊", dur:2800},
  {id:3, name:"IdentityForge",    desc:"Calculating CREDIS Score 0–100",             icon:"🎯", dur:3200},
  {id:4, name:"RiskGuard",        desc:"Classifying risk band and loan decision",    icon:"🛡️", dur:2000},
  {id:5, name:"OpportunityScout", desc:"Matching best lenders from database",        icon:"🔍", dur:2800},
  {id:6, name:"GrowthCoach",      desc:"Generating 12-month growth roadmap",         icon:"🌱", dur:2500}
];

export const WORKERS = {
  W001: {
    id:"W001", name:"Ravi Kumar", platform:"Swiggy", city:"Chennai",
    credisScore:98.8, riskBand:"Low Risk — High Need",
    loanDecision:"APPROVE_FAST", maxLoan:300000, approvalDays:1,
    avgMonthlyIncome:30067, rating:4.8, cancellationRate:0.02,
    activeDays:24, totalDeliveries:4200, hasRD:true, rdAmount:500,
    hasInsurance:true, insurancePremium:1200, ckyc:true,
    currentBalance:14200, activeMonths:12, growthPct:1.3,
    scoreBreakdown:{
      incomeStability:80, platformReliability:95,
      workConsistency:100, spendingDiscipline:100, incomeGrowth:60
    },
    topLenders:[
      {name:"NBCFDC", type:"Government", rate:8.0, maxLoan:300000, days:7},
      {name:"PM SVANidhi", type:"Government", rate:7.0, maxLoan:50000, days:3},
      {name:"MUDRA Shishu", type:"Government", rate:10.0, maxLoan:50000, days:7}
    ],
    roadmap:{
      foundation:[
        "Maximize Swiggy peak hour deliveries — target Rs.32,000/month",
        "Increase RD from Rs.500 to Rs.1,500/month",
        "Maintain 100% rent payment consistency"
      ],
      growth:[
        "Apply for NBCFDC loan Rs.3,00,000 at 8% interest",
        "Invest Rs.1,50,000 in electric scooter upgrade",
        "Register on Zomato for additional income"
      ],
      expansion:[
        "Target 15% increase in daily deliveries",
        "Start SIP of Rs.2,000/month in mutual fund",
        "Complete supply chain management certification"
      ],
      consolidation:[
        "Prepay Rs.50,000 of NBCFDC loan principal",
        "Increase SIP to Rs.3,500/month",
        "Target CREDIS Score 99.5/100"
      ],
      yearEnd:{
        expectedIncome:"Rs.38,000–40,000/month",
        savingsTarget:"Rs.72,000",
        credisTarget:"99.5/100"
      }
    },
    agentLogs:[
      [
        {t:"process",m:"Opening User Details/W001.json..."},
        {t:"info",m:"Worker: Ravi Kumar identified"},
        {t:"success",m:"74 bank transactions loaded"},
        {t:"success",m:"12 months earnings ready"},
        {t:"success",m:"RD active — Rs.500/month"},
        {t:"success",m:"Insurance policy active"},
        {t:"success",m:"NBCFDC: COMPLETED"},
        {t:"process",m:"Sending to ASI-1..."},
        {t:"success",m:"ASI-1: All 8 data points verified"},
        {t:"warn",m:"Passing to PatternMind"}
      ],
      [
        {t:"process",m:"Receiving from DataWeaver..."},
        {t:"info",m:"Calculating income average..."},
        {t:"success",m:"Avg income: Rs.30,067/month"},
        {t:"success",m:"CV: 0.11 — Highly stable"},
        {t:"success",m:"Active months: 12/12"},
        {t:"success",m:"Rent payments: 12/12"},
        {t:"success",m:"Growth H1 to H2: +1.3%"},
        {t:"process",m:"Sending to ASI-1..."},
        {t:"warn",m:"Passing to IdentityForge"}
      ],
      [
        {t:"process",m:"Calculating 5 signals..."},
        {t:"info",m:"Signal 1 Income Stability: 80/100"},
        {t:"info",m:"Signal 2 Platform Reliability: 95/100"},
        {t:"info",m:"Signal 3 Work Consistency: 100/100"},
        {t:"info",m:"Signal 4 Spending Discipline: 100/100"},
        {t:"info",m:"Signal 5 Income Growth: 60/100"},
        {t:"info",m:"Base score: 88.8/100"},
        {t:"success",m:"CKYC verified: +5"},
        {t:"success",m:"NBCFDC completed: +5"},
        {t:"success",m:"CREDIS Score: 98.8/100"}
      ],
      [
        {t:"process",m:"Analyzing score: 98.8/100..."},
        {t:"success",m:"Score >= 75 — Low Risk High Need"},
        {t:"success",m:"Decision: APPROVE_FAST"},
        {t:"success",m:"Max loan: Rs.3,00,000"},
        {t:"success",m:"Approval: 1 day"},
        {t:"warn",m:"Passing to OpportunityScout"}
      ],
      [
        {t:"process",m:"Loading lenders database..."},
        {t:"info",m:"8 lenders found"},
        {t:"success",m:"NBCFDC: eligible (score 98.8 >= 70)"},
        {t:"success",m:"PM SVANidhi: eligible"},
        {t:"success",m:"All 8 lenders eligible"},
        {t:"process",m:"ASI-1 ranking lenders..."},
        {t:"success",m:"Best: NBCFDC @ 8.0%"},
        {t:"warn",m:"Passing to GrowthCoach"}
      ],
      [
        {t:"process",m:"Generating roadmap..."},
        {t:"success",m:"Months 1-3 Foundation ready"},
        {t:"success",m:"Months 4-6 Growth ready"},
        {t:"success",m:"Months 7-9 Expansion ready"},
        {t:"success",m:"Months 10-12 Consolidation ready"},
        {t:"success",m:"Target: Rs.38,000-40,000/month"},
        {t:"success",m:"Report saved to output/"},
        {t:"success",m:"CREDIS Analysis Complete!"}
      ]
    ],
    agentOutputs:[
      "74 transactions loaded — verified",
      "CV: 0.11 — 12/12 active — +1.3%",
      "CREDIS Score: 98.8/100",
      "Low Risk High Need — APPROVE FAST",
      "8 lenders — NBCFDC @ 8% best",
      "12-month roadmap generated"
    ]
  },
  W002: {
    id:"W002", name:"Meena Devi", platform:"Urban Company", city:"Madurai",
    credisScore:91.2, riskBand:"Low Risk — High Need",
    loanDecision:"APPROVE_FAST", maxLoan:300000, approvalDays:1,
    avgMonthlyIncome:10958, rating:4.5, cancellationRate:0.05,
    activeDays:18, totalDeliveries:890, hasRD:false, rdAmount:0,
    hasInsurance:false, insurancePremium:0, ckyc:true,
    currentBalance:8200, activeMonths:12, growthPct:-4.6,
    scoreBreakdown:{
      incomeStability:80, platformReliability:75,
      workConsistency:100, spendingDiscipline:100, incomeGrowth:35
    },
    topLenders:[
      {name:"NBCFDC", type:"Government", rate:8.0, maxLoan:300000, days:7},
      {name:"PM SVANidhi", type:"Government", rate:7.0, maxLoan:50000, days:3},
      {name:"MUDRA Shishu", type:"Government", rate:10.0, maxLoan:50000, days:7}
    ],
    roadmap:{
      foundation:[
        "Open RD account Rs.1,500/month immediately",
        "Activate term life and health insurance",
        "Increase Urban Company bookings by 15-20%"
      ],
      growth:[
        "Apply NBCFDC loan Rs.3,00,000 at 8%",
        "Complete Urban Company specialist certification",
        "Add spa and bridal service categories"
      ],
      expansion:[
        "Launch weekend freelance services",
        "Build digital presence on premium tier",
        "Start SIP Rs.1,000/month"
      ],
      consolidation:[
        "Begin NBCFDC EMI Rs.5,500/month",
        "Build emergency fund Rs.35,000",
        "Annual insurance coverage review"
      ],
      yearEnd:{
        expectedIncome:"Rs.16,500/month",
        savingsTarget:"Rs.54,000",
        credisTarget:"94.0/100"
      }
    },
    agentLogs:[
      [
        {t:"process",m:"Opening W002.json..."},
        {t:"success",m:"60 transactions loaded"},
        {t:"warn",m:"No RD account found"},
        {t:"warn",m:"No insurance found"},
        {t:"success",m:"NBCFDC: COMPLETED"},
        {t:"process",m:"Sending to ASI-1..."},
        {t:"success",m:"Data validated"}
      ],
      [
        {t:"process",m:"Analyzing Meena Devi..."},
        {t:"success",m:"Avg: Rs.10,958/month"},
        {t:"info",m:"CV: 0.17 — Moderate"},
        {t:"success",m:"Active: 12/12"},
        {t:"warn",m:"Growth H1 to H2: -4.6%"}
      ],
      [
        {t:"process",m:"Calculating score..."},
        {t:"info",m:"Income Stability: 80/100"},
        {t:"info",m:"Platform Reliability: 75/100"},
        {t:"info",m:"Work Consistency: 100/100"},
        {t:"info",m:"Spending Discipline: 100/100"},
        {t:"warn",m:"Income Growth: 35/100"},
        {t:"success",m:"CREDIS Score: 91.2/100"}
      ],
      [
        {t:"success",m:"Low Risk High Need"},
        {t:"success",m:"APPROVE_FAST"},
        {t:"success",m:"Max: Rs.3,00,000"}
      ],
      [
        {t:"success",m:"8 lenders eligible"},
        {t:"success",m:"Best: NBCFDC @ 8%"}
      ],
      [
        {t:"success",m:"Roadmap generated"},
        {t:"success",m:"Target: Rs.16,500/month"}
      ]
    ],
    agentOutputs:[
      "60 transactions loaded",
      "CV: 0.17 — 12/12 — -4.6%",
      "CREDIS Score: 91.2/100",
      "Low Risk High Need — APPROVE FAST",
      "8 lenders — NBCFDC @ 8% best",
      "12-month roadmap generated"
    ]
  },
  W003: {
    id:"W003", name:"Arjun Das", platform:"Uber", city:"Coimbatore",
    credisScore:60.2, riskBand:"Low Risk — Low Need",
    loanDecision:"APPROVE_STANDARD", maxLoan:150000, approvalDays:7,
    avgMonthlyIncome:5733, rating:4.2, cancellationRate:0.09,
    activeDays:14, totalDeliveries:620, hasRD:false, rdAmount:0,
    hasInsurance:false, insurancePremium:0, ckyc:false,
    currentBalance:3200, activeMonths:11, growthPct:13.7,
    scoreBreakdown:{
      incomeStability:60, platformReliability:45,
      workConsistency:80, spendingDiscipline:100, incomeGrowth:100
    },
    topLenders:[
      {name:"PM SVANidhi", type:"Government", rate:7.0, maxLoan:50000, days:3},
      {name:"MUDRA Shishu", type:"Government", rate:10.0, maxLoan:50000, days:7},
      {name:"Arohan Financial", type:"MFI", rate:22.0, maxLoan:100000, days:3}
    ],
    roadmap:{
      foundation:[
        "Open RD Rs.500/month — build savings habit",
        "Enroll in basic health insurance plan",
        "Maintain Uber hours 8-10 hrs/day"
      ],
      growth:[
        "Apply PM SVANidhi Rs.50,000 at 7%",
        "Invest Rs.30,000 in vehicle maintenance",
        "Track peak hours for maximum earnings"
      ],
      expansion:[
        "Apply 2nd SVANidhi tranche Rs.50,000",
        "Start SIP Rs.500/month",
        "Leverage Uber incentive programs"
      ],
      consolidation:[
        "Increase SIP to Rs.700/month",
        "Build emergency fund Rs.15,000-18,000",
        "Plan vehicle servicing from savings"
      ],
      yearEnd:{
        expectedIncome:"Rs.8,500–9,000/month",
        savingsTarget:"Rs.18,000-20,000",
        credisTarget:"70-75/100"
      }
    },
    agentLogs:[
      [
        {t:"process",m:"Opening W003.json..."},
        {t:"success",m:"56 transactions loaded"},
        {t:"warn",m:"No RD found"},
        {t:"warn",m:"No insurance found"},
        {t:"warn",m:"No NBCFDC history"},
        {t:"warn",m:"CKYC not compliant — penalty"},
        {t:"success",m:"Data validated"}
      ],
      [
        {t:"process",m:"Analyzing Arjun Das..."},
        {t:"info",m:"Avg: Rs.5,733/month"},
        {t:"warn",m:"CV: 0.29 — High volatility"},
        {t:"info",m:"Active: 11/12"},
        {t:"success",m:"Growth: +13.7%"}
      ],
      [
        {t:"process",m:"Calculating score..."},
        {t:"info",m:"Income Stability: 60/100"},
        {t:"warn",m:"Platform Reliability: 45/100"},
        {t:"info",m:"Work Consistency: 80/100"},
        {t:"success",m:"Spending Discipline: 100/100"},
        {t:"success",m:"Income Growth: 100/100"},
        {t:"warn",m:"CKYC penalty: -10"},
        {t:"success",m:"CREDIS Score: 60.2/100"}
      ],
      [
        {t:"info",m:"Low Risk Low Need"},
        {t:"info",m:"APPROVE_STANDARD"},
        {t:"info",m:"Max: Rs.1,50,000"}
      ],
      [
        {t:"info",m:"4 lenders eligible"},
        {t:"success",m:"Best: SVANidhi @ 7%"}
      ],
      [
        {t:"success",m:"Roadmap generated"},
        {t:"success",m:"Target: Rs.9,000/month"}
      ]
    ],
    agentOutputs:[
      "56 transactions — CKYC pending",
      "CV: 0.29 — 11/12 — +13.7%",
      "CREDIS Score: 60.2/100",
      "Low Risk Low Need — STANDARD",
      "4 lenders — SVANidhi @ 7% best",
      "12-month roadmap generated"
    ]
  },
  W004: {
    id:"W004", name:"Priya Lakshmi", platform:"Zomato", city:"Bengaluru",
    credisScore:100, riskBand:"Low Risk — High Need",
    loanDecision:"APPROVE_FAST", maxLoan:300000, approvalDays:1,
    avgMonthlyIncome:39975, rating:4.9, cancellationRate:0.01,
    activeDays:26, totalDeliveries:6800, hasRD:true, rdAmount:1000,
    hasInsurance:true, insurancePremium:2400, ckyc:true,
    currentBalance:38500, activeMonths:12, growthPct:1.2,
    scoreBreakdown:{
      incomeStability:80, platformReliability:100,
      workConsistency:100, spendingDiscipline:100, incomeGrowth:60
    },
    topLenders:[
      {name:"NBCFDC", type:"Government", rate:8.0, maxLoan:300000, days:7},
      {name:"PM SVANidhi", type:"Government", rate:7.0, maxLoan:50000, days:3},
      {name:"MUDRA Kishor", type:"Government", rate:11.0, maxLoan:500000, days:10}
    ],
    roadmap:{
      foundation:[
        "Apply NBCFDC loan Rs.3,00,000 at 8%",
        "Increase RD to Rs.2,000/month",
        "Target income Rs.45,000/month"
      ],
      growth:[
        "Register on Swiggy for multi-platform income",
        "Build emergency fund Rs.50,000",
        "Start credit card for daily expenses"
      ],
      expansion:[
        "Add health and accident insurance",
        "Start SIP Rs.3,000/month",
        "Complete Zomato Gold certification"
      ],
      consolidation:[
        "Target 80% NBCFDC loan repayment",
        "Achieve Rs.70,000 plus monthly income",
        "File ITR and claim tax deductions"
      ],
      yearEnd:{
        expectedIncome:"Rs.75,000/month",
        savingsTarget:"Rs.75,000",
        credisTarget:"100/100"
      }
    },
    agentLogs:[
      [
        {t:"process",m:"Opening W004.json..."},
        {t:"success",m:"73 transactions loaded"},
        {t:"success",m:"RD active — Rs.1,000/month"},
        {t:"success",m:"Insurance active"},
        {t:"success",m:"NBCFDC: COMPLETED — 0 late"},
        {t:"process",m:"Sending to ASI-1..."},
        {t:"success",m:"Perfect data quality confirmed"}
      ],
      [
        {t:"process",m:"Analyzing Priya Lakshmi..."},
        {t:"success",m:"Avg: Rs.39,975/month"},
        {t:"success",m:"CV: 0.15 — Very stable"},
        {t:"success",m:"Active: 12/12"},
        {t:"success",m:"Growth: +1.2%"}
      ],
      [
        {t:"process",m:"Calculating score..."},
        {t:"info",m:"Income Stability: 80/100"},
        {t:"success",m:"Platform Reliability: 100/100"},
        {t:"success",m:"Work Consistency: 100/100"},
        {t:"success",m:"Spending Discipline: 100/100"},
        {t:"info",m:"Income Growth: 60/100"},
        {t:"success",m:"CKYC: +5 | NBCFDC perfect: +10"},
        {t:"success",m:"CREDIS Score: 100/100 — PERFECT!"}
      ],
      [
        {t:"success",m:"Low Risk High Need"},
        {t:"success",m:"APPROVE_FAST"},
        {t:"success",m:"Max: Rs.3,00,000"}
      ],
      [
        {t:"success",m:"All 8 lenders eligible"},
        {t:"success",m:"Best: NBCFDC @ 8%"}
      ],
      [
        {t:"success",m:"Roadmap generated"},
        {t:"success",m:"Target: Rs.75,000/month"}
      ]
    ],
    agentOutputs:[
      "73 transactions — perfect data",
      "CV: 0.15 — 12/12 — +1.2%",
      "CREDIS Score: 100/100 — PERFECT",
      "Low Risk High Need — APPROVE FAST",
      "8 lenders — NBCFDC @ 8% best",
      "12-month roadmap generated"
    ]
  },
  W005: {
    id:"W005", name:"Suresh Babu", platform:"Swiggy", city:"Hyderabad",
    credisScore:93.5, riskBand:"Low Risk — High Need",
    loanDecision:"APPROVE_FAST", maxLoan:300000, approvalDays:1,
    avgMonthlyIncome:36742, rating:4.7, cancellationRate:0.02,
    activeDays:25, totalDeliveries:5600, hasRD:true, rdAmount:800,
    hasInsurance:false, insurancePremium:0, ckyc:true,
    currentBalance:18500, activeMonths:12, growthPct:-0.9,
    scoreBreakdown:{
      incomeStability:80, platformReliability:92,
      workConsistency:100, spendingDiscipline:100, incomeGrowth:35
    },
    topLenders:[
      {name:"NBCFDC", type:"Government", rate:8.0, maxLoan:300000, days:7},
      {name:"PM SVANidhi", type:"Government", rate:7.0, maxLoan:50000, days:3},
      {name:"MUDRA Kishor", type:"Government", rate:11.0, maxLoan:500000, days:10}
    ],
    roadmap:{
      foundation:[
        "Purchase term life and health insurance immediately",
        "Activate NBCFDC loan Rs.3,00,000 at 8%",
        "Track daily deliveries and peak hours"
      ],
      growth:[
        "Analyze top zones — extend 2 hrs/day",
        "Register on Zomato for extra income",
        "Increase RD to Rs.2,000/month"
      ],
      expansion:[
        "Complete Swiggy Gold certification",
        "Start SIP Rs.3,000/month",
        "Explore vehicle sub-leasing off-peak"
      ],
      consolidation:[
        "Review investment portfolio",
        "Plan next vehicle upgrade cycle",
        "Set 2-year financial goals"
      ],
      yearEnd:{
        expectedIncome:"Rs.43,000–45,000/month",
        savingsTarget:"Rs.60,000-70,000",
        credisTarget:"96-98/100"
      }
    },
    agentLogs:[
      [
        {t:"process",m:"Opening W005.json..."},
        {t:"success",m:"72 transactions loaded"},
        {t:"success",m:"RD active — Rs.800/month"},
        {t:"warn",m:"No insurance found"},
        {t:"success",m:"NBCFDC: ONGOING — on track"},
        {t:"process",m:"Sending to ASI-1..."},
        {t:"success",m:"Data validated"}
      ],
      [
        {t:"process",m:"Analyzing Suresh Babu..."},
        {t:"success",m:"Avg: Rs.36,742/month"},
        {t:"success",m:"CV: 0.16 — Stable"},
        {t:"success",m:"Active: 12/12"},
        {t:"warn",m:"Growth H1 to H2: -0.9%"}
      ],
      [
        {t:"process",m:"Calculating score..."},
        {t:"info",m:"Income Stability: 80/100"},
        {t:"success",m:"Platform Reliability: 92/100"},
        {t:"success",m:"Work Consistency: 100/100"},
        {t:"success",m:"Spending Discipline: 100/100"},
        {t:"warn",m:"Income Growth: 35/100"},
        {t:"success",m:"CREDIS Score: 93.5/100"}
      ],
      [
        {t:"success",m:"Low Risk High Need"},
        {t:"success",m:"APPROVE_FAST"},
        {t:"success",m:"Max: Rs.3,00,000"}
      ],
      [
        {t:"success",m:"8 lenders eligible"},
        {t:"success",m:"Best: NBCFDC @ 8%"}
      ],
      [
        {t:"success",m:"Roadmap generated"},
        {t:"success",m:"Target: Rs.43,000-45,000/month"}
      ]
    ],
    agentOutputs:[
      "72 transactions — verified",
      "CV: 0.16 — 12/12 — -0.9%",
      "CREDIS Score: 93.5/100",
      "Low Risk High Need — APPROVE FAST",
      "8 lenders — NBCFDC @ 8% best",
      "12-month roadmap generated"
    ]
  }
};