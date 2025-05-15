# FourSight
> _FourSight is a fusion of "Four Seasons" and "Foresight," reflecting both its hospitality roots and its mission to provide intelligent, proactive operational insight._

> *"Where hotel operations meet foresight."*  
> *"See what matters. Act faster."*

![foursight_fourseasons_banner](https://github.com/user-attachments/assets/937af1eb-4def-4348-9c2b-167f1a74ca3c)

Live Demo: 🚀[Click here to view](https://yellow-island-0f4790e10.6.azurestaticapps.net/tasks)

## 🌟 Overview

FourSight is an intelligent hotel management platform that transforms real-time hotel data into clarity and coordination without overwhelming the team. It leverages AI to streamline operations, improve staff productivity, and enhance guest satisfaction. It provides real-time insights, task management, and predictive analytics to help hotel staff make data-driven decisions and deliver exceptional service.

Every task assignment, alert, and metric you see is generated and updated by a network of AI Agents working silently in the background.

## 🎯 Who Is It For?

| Designed for | Key Focus |
| --- | --- |
| Ops Managers | Live visibility of all task flows |
| Staff | Know what to do, when, and where |
| Guests | Experience seamless, behind-the-scenes service |

## Demo Video
https://github.com/user-attachments/assets/cc65ffe1-f684-49b4-90c6-bafab53235d0

## 🚀 Core Features

- **AI-Driven Task Management**: Intelligent task prioritization and assignment for hotel staff
- **Context-Aware Assignment**: Assigns the right task to the right person based on shift schedules, roles, and availability
- **Smart Escalation**: Flags overdue or high-priority tasks to supervisors immediately
- **Well-Being Aware**: Prevents overloading team members marked as 'Fair' or overburdened
- **Workflow Automation**: Eliminates manual task delegation — no spreadsheets, no communication chaos
- **Performance Analytics**: Actionable insights into hotel operations and staff efficiency

## 💻 Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | Next.js (App Router), React, TailwindCSS, ShadCN UI, Framer Motion |
| State Management | React Hooks, Context API |
| Data Visualization | Custom charts, Interactive dashboards |
| AI Integration | AI Agent for predictive analytics and task optimization |
| Deployment | Azure Static Web Apps |

## 🛠️ Installation & Setup

1. Clone the repository.

2. Navigate to the project directory
   ```bash
   cd src/ui-code/web/hotel-dashboard/
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## 📁 Project Structure

```
src/ui-code/web/hotel-dashboard/
├── public/              # Static assets
├── src/
│   ├── app/             # App Router pages
│   │   ├── api/         # API routes
│   │   ├── tasks/       # Task management hub
│   │   └── utils.js     # Shared utility functions
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # ShadCN UI components
│   └── lib/             # Utility libraries and helpers
└── ...config files      # Various configuration files
```

## 🔌 API Reference

FourSight includes several API endpoints powered by a network of AI agents that process, optimize, and orchestrate data:

| Endpoint | Description |
|----------|-------------|
| `/api/tasks` | Fetch, create, update, and prioritize hotel staff tasks |

Behind the scenes, these AI Agents continuously evaluate incoming requests, staff availability, shift schedules, task urgency, and even well-being status to:
- Auto-assign the right task to the right person
- Escalate overdue or high-priority issues
- Surface only the most relevant data on each screen

## 📋 Usage Guide

FourSight offers the following task management views:

### Tasks Dashboard (`/tasks`)
- **Multi-view Organization**: View tasks by status, department, or due date
- **Task Cards**: Comprehensive task information with visual priority indicators
- **Progress Tracking**: See task counts and completion status at a glance
- **Department Overview**: Visualize task distribution across hotel departments

### Quick View (`/tasks/quick`)
- **At-a-Glance Status**: Immediate overview of pending, in-progress, and completed tasks
- **Critical Metrics**: Track overdue and due-today tasks with visual alerts
- **Department Workload**: See which departments have the highest task volumes
- **Today's Timeline**: Quick visualization of the day's scheduled tasks

### Glanceable View (`/tasks/glanceable`)
- **Urgent Tasks Focus**: Highlighted view of high-priority and time-sensitive tasks
- **Timeline View**: Chronological visualization of today's task schedule
- **Employee Task Load**: Monitor task distribution across staff members
- **Context-Aware Alerts**: Visual indicators for overdue or soon-to-be-due tasks

### Table View (`/tasks/table`)
- **Sortable Columns**: Organize tasks by any attribute with a single click
- **Advanced Filtering**: Comprehensive filtering by status, priority, department, and more
- **Bulk Actions**: Select multiple tasks for batch operations
- **Detailed Task Cards**: Access complete task information and actions

### Analytics (`/tasks/analytics`)
- **Key Metrics Dashboard**: Visualize task completion rates and priority distribution
- **Department Breakdown**: Analyze task allocation across hotel departments
- **Employee Performance**: Track completion efficiency by staff member
- **Time-Based Analysis**: Monitor task patterns by due dates and completion times

## 🚢 Deployment

FourSight is deployed on Microsoft Azure Static Web Apps:

1. Push your repository to GitHub
2. Set up Azure Static Web Apps resource in the Azure Portal
3. Connect to your GitHub repository
4. Configure build settings (Next.js preset)
5. Deploy and monitor through Azure portal

For more details, see [Azure Static Web Apps with Next.js documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/deploy-nextjs).

## 🔮 Future Roadmap

- **Mobile App**: Native mobile experience for staff on the go
- **Guest Portal**: Self-service interface for guests
- **Advanced Analytics**: Deeper insights with machine learning predictions
- **Integration Ecosystem**: Connect with PMS, POS, and other hotel systems
- **Enhanced AI Orchestration**: More sophisticated task delegation based on machine learning
- **Staff Well-being Monitoring**: Expanded capabilities to track and optimize staff workload
- **Predictive Operations**: Anticipate busy periods and staffing needs before they occur

## 💡 Business Impact

"FourSight means less chaos, more coverage, and a system that adapts with the hotel's rhythm."

We're not just visualizing data — we're orchestrating real-time hotel operations using intelligent agents that function like backend co-pilots, connecting task queues, staff data, and shift rosters to automatically generate and update what's shown in FourSight.

---
