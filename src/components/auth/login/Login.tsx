'use client'
import LoginForm from './LoginForm'
import AuthAsideSection from '../AuthAsideSection'

const loginContent = [
  {
    srNo: 1,
    title: 'Secure access',
    desc: 'Your account is protected with role-based access and verified authentication.'
  },
  {
    srNo: 2,
    title: 'Continue where you left off',
    desc: 'Resume applications, job postings, and profile updates seamlessly.'
  }, {
    srNo: 3,
    title: 'Trusted hiring platform',
    desc: 'Join a verified ecosystem of approved companies and genuine candidates.'
  }
]

const Login = () => {
  return (
    <main className="min-h-screen bg-background text-foreground grid lg:grid-cols-5">
      <AuthAsideSection
        title='Welcome back to HireFlow'
        highLightedText='sign in.'
        desc='Sign in to access your dashboard, manage applications, and continue your hiring or job search journey.'
        content={loginContent}
      />
      <section className="lg:col-span-3 flex items-center justify-center px-6 py-16">
        <LoginForm />
      </section>
    </main>

  )
}

export default Login