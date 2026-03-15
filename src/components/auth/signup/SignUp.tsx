'use client'
import Link from 'next/link'
import SignUpForm from './SignUpForm'
import AuthAsideSection from '../AuthAsideSection'

const signUpContent = [
  {
    srNo: 1,
    title: 'Verified companies only',
    desc: 'Every company is manually approved by platform admins.'
  },
  {
    srNo: 2,
    title: 'Real-time tracking',
    desc: 'Track your applications from "Applied" to "Hired" with complete transparency.'
  },
  {
    srNo: 3,
    title: 'Complete profiles',
    desc: 'Build detailed profiles with resume, skills, experience, and certifications.'
  }
]

const SignUp = () => {
  return (
    <main className="min-h-screen bg-background text-foreground grid lg:grid-cols-5">
      <AuthAsideSection
        title='Join HireFlow'
        highLightedText='today.'
        desc='A verified job platform with three-tier system ensuring quality hiring for both companies and job seekers.'
        content={signUpContent}
      />

      <section className="lg:col-span-3 flex items-center justify-center px-6 py-16">
        <SignUpForm />
      </section>
    </main>
  );
}

export default SignUp
