import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Preview,
  Hr,
  Link,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface Props {
  name: string;
  email: string;
  role: string;
  link: string;
}

export default function NewUserEmail({
  name,
  email,
  role,
  link,
}: Props) {
  const formattedRole =
    role === 'JOB_SEEKER'
      ? 'Job Seeker'
      : role === 'COMPANY_ADMIN'
        ? 'Company Admin'
        : 'Platform Admin';

  return (
    <Html>
      <Head />
      <Preview>🚀 New user registered on HireFlow</Preview>

      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-xl mx-auto my-10 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            <Section className="bg-black px-8 py-6">
              <Heading className="text-white text-2xl font-bold m-0">
                HireFlow Admin Alert
              </Heading>
              <Text className="text-gray-300 text-sm mt-2">
                A new user has joined your platform
              </Text>
            </Section>

            <Section className="px-8 py-8">
              <Heading className="text-xl font-semibold text-gray-900 mb-4">
                🚀 New User Registration
              </Heading>

              <Text className="text-gray-700 mb-6">
                A new account has been successfully created on HireFlow.
                Below are the registration details:
              </Text>

              <Section className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <Text className="text-sm text-gray-500 mb-1">Full Name</Text>
                <Text className="font-medium text-gray-900 mb-4">{name}</Text>

                <Text className="text-sm text-gray-500 mb-1">Email Address</Text>
                <Text className="font-medium text-gray-900 mb-4">{email}</Text>

                <Text className="text-sm text-gray-500 mb-1">Role</Text>
                <Text className="font-medium text-gray-900">{formattedRole}</Text>
              </Section>

              <Hr className="my-8 border-gray-200" />

              <Section className="text-center">
                <Link
                  href={link}
                  className="inline-block bg-black text-white text-sm font-medium px-6 py-3 rounded-lg no-underline"
                >
                  View User in Admin Panel
                </Link>
              </Section>

              <Text className="text-xs text-gray-500 mt-8 text-center">
                This is an automated system notification from HireFlow.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}