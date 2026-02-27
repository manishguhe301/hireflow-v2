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
  Button,
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
  return (
    <Html>
      <Head />
      <Preview>New user registered on HireFlow</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-black">
          <Container className="my-10">
            <Section className="bg-white px-8 py-6 rounded-xl shadow-sm">
              <Heading className="text-xl font-semibold">
                🚀 New User Registered
              </Heading>

              <Text className="mt-4">
                A new user has signed up on HireFlow.
              </Text>

              <Hr className="my-4" />

              <Text><strong>Name:</strong> {name}</Text>
              <Text><strong>Email:</strong> {email}</Text>
              <Text><strong>Role:</strong> {role}</Text>

              <Hr className="my-6" />

              <Link
                // href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/users`}
                href={link}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                View in Admin Panel
              </Link>

              <Hr className="my-6" />

              <Text className="text-sm text-gray-500">
                HireFlow System Notification
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}