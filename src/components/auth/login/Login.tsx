'use client'
import LoginForm from './LoginForm'
import AuthAsideSection from '../AuthAsideSection'
import { loginContent } from '@/src/utils/constants'

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