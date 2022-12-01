import { getProviders, signIn, getCsrfToken } from "next-auth/react"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

export default function SignIn({ providers, csrfToken }) {
  const { t } = useTranslation('common')
  
  function handleSignIn(id) {
    signIn(id).then(result => {
      console.log('result:', result)
    });
  }

  return (
    <>
      new user
    </>
  )
}

export async function getServerSideProps({ locale }) {
  const providers = await getProviders()
  const translations = (await serverSideTranslations(locale, ['common', 'footer']))
  const csrfToken = await getCsrfToken()

  return {
    props: { ...translations, providers, csrfToken },
  }
}
