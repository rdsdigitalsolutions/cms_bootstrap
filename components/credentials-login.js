import { useState } from 'react';
import { useTranslation } from 'next-i18next'
import { signIn } from "next-auth/react"
import { Loading, Grid, Modal, Checkbox, Input, Row, Button, Text, Spacer } from '@nextui-org/react';
import { FaUserCircle, FaLock, FaGrinBeam, FaChevronRight } from "react-icons/fa";

export default function Handler({ visible, setVisible }) {
  const { t } = useTranslation('common')

  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleForm = () => {
    setProcessing(true);
    signIn("credentials", { username, password, redirect: false })
      .then((result) => {
        setUsername('');
        setPassword('');

        if (!result.error) {
          return setVisible(false)
        }

        switch (result.error) {
          case 'CredentialsSignin':
            setError('Invalid Credentials');
            break;
          default:
            console.log('Login Error:', result)
            setError('Unknown error, please contact the support.');
            break;
        }
      })
      .catch((error) => setError(error))
      .finally(() => setProcessing(false))
  }

  return (
    <Modal
      closeButton
      blur
      aria-labelledby="modal-title"
      open={visible}
      onClose={() => setVisible(false)}
    >
      <Modal.Header>
        <Grid.Container>
          <Grid xs={12} justify="center">
            <Text h1><FaGrinBeam /></Text>
          </Grid>
          <Grid xs={12} justify="center">
            <Text h2>{process.env.NEXT_PUBLIC_APP_NAME}</Text>
          </Grid>
        </Grid.Container>
      </Modal.Header>
      <Modal.Body>
        <Grid.Container gap={4}>
          <Grid xs={12} justify="center">
            <Input
              name='username'
              size="md"
              fullWidth={true}
              type="email"
              clearable
              underlined
              labelPlaceholder="Username"
              contentLeft={<FaUserCircle />}
              initialValue={username}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={processing}
            />
          </Grid>
          <Grid xs={12} justify="center">
            <Input.Password
              name='password'
              size="md"
              fullWidth={true}
              underlined
              labelPlaceholder="Password"
              contentLeft={<FaLock />}
              initialValue={password}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={processing}
            />
          </Grid>
          <Grid xs={12} justify="center">
            <Row justify="space-between">
              <Checkbox>
                <Text size={14}>Remember me</Text>
              </Checkbox>
              <Text size={14}>Forgot password?</Text>
            </Row>
          </Grid>
          { error && <Grid xs={12} justify="center">
            <Text h6 color="error">{error}</Text>
          </Grid> }
        </Grid.Container>
      </Modal.Body>
      <Modal.Footer justify="center">
        {!processing ? <Button auto flat color="error" onClick={() => setVisible(false)}>Close</Button> : null}
        <Button auto flat onClick={handleForm} disabled={processing}>
          {processing ? <Loading type="points" color="currentColor" size="sm" /> : <>{t('signin')} <FaChevronRight /></>}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
