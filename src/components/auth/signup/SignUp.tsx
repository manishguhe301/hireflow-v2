'use client'
import SignUpForm from './SignUpForm'
import AuthAsideSection from '../AuthAsideSection'
import { signUpContent } from '@/src/utils/constants'

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
