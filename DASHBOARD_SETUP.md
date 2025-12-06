# Dashboard Features - Setup Guide

## ✅ Completed Features

### 1. Dashboard Sidebar
- **Location**: `/components/DashboardSidebar.tsx`
- Role-based navigation for Client, Employee, and Admin
- Lucide-style SVG icons
- Active route highlighting
- Responsive design

### 2. Dashboard Analytics Page
- **Location**: `/app/dashboard/page.tsx`
- Project statistics (Total, Active, Completed, Inactive)
- Bar chart visualization
- Pie chart for approval status
- Recent activity feed
- Role-based content

### 3. Projects Page (Client)
- **Location**: `/app/dashboard/projects/page.tsx`
- Grid layout of all projects
- Status badges (Active, Inactive, Full)
- 3-dot menu with Edit and Delete options
- Create new project with "+" button
- Project cards with:
  - Cover image
  - Title and description
  - Tags
  - Cost and seats info
  - Status indicator

### 4. Project Form Component
- **Location**: `/components/ProjectForm.tsx`
- Modal popup for creating and editing projects
- Fields:
  - Title
  - Description
  - Cost & Duration
  - Available seats
  - Tags (comma-separated)
  - Requirements (line-separated)
  - Deliverables (line-separated)
  - Cover image URL
- Form validation
- Create and Edit modes

### 5. Approvals Page
- **Location**: `/app/dashboard/approvals/page.tsx`
- Employee application cards with full details
- Approve (✓) and Reject (✗) buttons
- Email notification on approval/rejection
- Statistics: Pending, Approved, Rejected
- Expandable cover letter section
- Skills display
- Portfolio links

### 6. Email System
- **Email Helper**: `/helper/emailHelper.ts`
- **API Route**: `/app/api/send-approval-email/route.ts`
- Beautiful HTML email templates
- Approval and rejection emails
- Nodemailer integration

## 📧 Email Setup Instructions

### Option 1: Gmail Setup (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Project Platform"
   - Copy the 16-character password

3. **Update `.env.local`**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="Project Platform" <your-email@gmail.com>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Option 2: Other SMTP Services

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

**Amazon SES:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

### Testing the Email System

1. Navigate to `/dashboard/approvals`
2. Click the green checkmark (✓) to approve an application
3. Check the employee's email for the approval notification
4. The app will show an alert confirming email delivery

**Note**: If SMTP is not configured, the system will still update the approval status locally, but emails won't be sent.

## 🎨 Theme Colors

- Primary: `#647FBC`
- Secondary: `#91ADC8`
- Accent: `#AED6CF`

## 🔗 Routes

### Client Routes
- `/dashboard` - Analytics overview
- `/dashboard/projects` - Manage projects
- `/dashboard/approvals` - Review applications
- `/dashboard/analytics` - Detailed analytics

### Employee Routes
- `/dashboard` - Performance overview
- `/dashboard/my-projects` - Assigned projects
- `/dashboard/available-projects` - Browse opportunities
- `/dashboard/performance` - Stats and metrics

### Admin Routes
- `/dashboard` - System overview
- `/dashboard/users` - User management
- `/dashboard/all-projects` - All projects
- `/dashboard/reports` - System reports
- `/dashboard/settings` - Platform settings

## 📝 Next Steps

To fully integrate the dashboard:

1. **Connect to Database**: Replace mock data with actual MongoDB queries
2. **Add Authentication Checks**: Ensure role-based access control
3. **Implement File Uploads**: For project cover images
4. **Add Search/Filter**: For projects and approvals
5. **Create Employee Views**: Build employee dashboard pages
6. **Add Notifications**: Real-time notifications for approvals

## 🚀 Usage

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev

# Access dashboard
http://localhost:3000/dashboard
```

## 🔐 Role Setup

Users get their role from Clerk metadata. To set a user's role:

1. Go to Clerk Dashboard
2. Select user
3. Add to `unsafeMetadata`:
```json
{
  "role": "client"
}
```

Options: `"client"`, `"employee"`, `"admin"`
