import {
    Html,
    Text,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Head,
    Button
} from '@react-email/components';

interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function verificationEmail({
    username,
    otp
}: VerificationEmailProps) {
    return (
       <Html lang='en' dir='ltr'>
        <Head>
            <title>Verification code</title>
           <Font
                fontFamily='Roboto, sans-serif'
                fallbackFontFamily={['Verdana', 'sans-serif']}
                webFont={{
                    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
                    format: 'woff2'
                }}  
                fontWeight={400}
                fontStyle='normal'
            />
        </Head>
        <Preview>Here&apos;s your verification code</Preview>
        <Section>
            <Row>
                <Heading as = 'h2'>
                    Hello {username}, here is your verification code
                </Heading>
            </Row>
            <Row>
                <Text>
                    Your verification code is: {otp}
                </Text>
            </Row>
            <Row>
                <Text>
                    {/* {otp}  is valid for 10 minutes. If you did not request this code, please ignore this email. */}
                    {otp}
                </Text>
            </Row>
            <Row>
                <Text>
                   if you did not request this code, please ignore this email.
                </Text>
            </Row>
            <Row>
                <Button
                    href="https://mysterymessage.vercel.app"
                    style={{
                        background: '#000',
                        color: '#fff',
                        padding: '12px 20px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                    }}
                >
                    Visit Mystery Message
                </Button>
            </Row>
        </Section>
       </Html>
    )
}