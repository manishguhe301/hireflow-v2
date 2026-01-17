# HireFlow

A comprehensive job portal platform built with Next.js, featuring role-based access control for Platform Admins, Company Admins, and Job Seekers.

## 🚀 Features

### For Platform Admins

- Company approval/rejection workflow
- User and company management
- Platform-wide analytics and statistics
- Admin account management

### For Company Admins

- Company profile creation and management
- Job posting and management
- Application tracking and review
- Applicant filtering and bulk actions
- Company analytics dashboard

### For Job Seekers

- Comprehensive profile builder (resume, skills, experience, education)
- Advanced job search with filters
- One-click job applications
- Application status tracking
- Job bookmarking
- Personalized job recommendations

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Prisma ORM
- **Authentication:** NextAuth.js
- **State Management:** Redux Toolkit
- **File Upload:** Cloud storage integration
- **Email:** NodeMailer / SendGrid

## 📋 Prerequisites

- Node.js 18+
- MongoDB database
- npm or yarn

## 🔧 Installation

1. Clone the repository

```bash
git clone https://github.com/manishguhe301/hireflow-v2
cd hireflow-v2
```

2. Install dependencies

```bash
npm install
```

3. Initialize database

```bash
npx prisma generate
npx prisma db push
```

4. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
hireflow/
├── app/              # Next.js app router
├── src/
│   ├── components/       # Reusable components
│   ├── lib/             # Utility functions
│   ├── store/           # Redux store
│   └── types/           # TypeScript types
├── prisma/
│   └── schema.prisma    # Database schema
└── public/              # Static assets
```

## 🗄️ Database Schema

The application uses a comprehensive schema including:

- **Users** (Job Seekers, Company Admins, Platform Admins)
- **Profiles** (Job seeker professional profiles)
- **Companies** (Company information and verification)
- **Jobs** (Job postings with detailed requirements)
- **Applications** (Application tracking and status)
- **SavedJobs** (Bookmarked jobs)
- **Notifications** (In-app notifications)

## 🔐 User Roles

### Platform Admin

- Full system access
- Approve/reject companies
- View all users and analytics

### Company Admin

- Create company profile (requires approval)
- Post and manage jobs
- Review and manage applications

### Job Seeker

- Create professional profile
- Search and apply for jobs
- Track application status

## 🚦 Development Phases

The project follows a 14-phase development roadmap:

1. **Phase 0-1:** Project foundation & authentication
2. **Phase 2:** Platform admin & company approval
3. **Phase 3:** Company profile system
4. **Phase 4:** Job posting & management
5. **Phase 5:** Job seeker profiles
6. **Phase 6:** Job browsing & search
7. **Phase 7:** Job application system
8. **Phase 8:** Application management
9. **Phase 9:** Saved jobs & bookmarks
10. **Phase 10:** Dashboards & analytics
11. **Phase 11:** Notifications
12. **Phase 12:** UI/UX polish
13. **Phase 13:** Testing & bug fixes
14. **Phase 14:** Deployment

## 📝 Key Workflows

### Company Onboarding

1. Sign up as Company Admin
2. Create company profile
3. Submit for approval
4. Wait for Platform Admin approval
5. Start posting jobs

### Job Application

1. Job seeker creates profile
2. Browse/search jobs
3. Apply with resume and cover letter
4. Track application status
5. Receive notifications on status changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Email - [@email](manishguhe301@gmail.com)

Project Link: [https://github.com/manishguhe301/hireflow-v2](https://github.com/manishguhe301/hireflow-v2)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- All contributors and supporters

---

**Status:** 🚧 In Development | **Version:** 1.0.0
