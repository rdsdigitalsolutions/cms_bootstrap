import { getProviders, signIn, getCsrfToken } from "next-auth/react"
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

export default function SignIn({ providers, csrfToken }) {
  const { t } = useTranslation('common')

  return (
    <>
        {Object.values(providers).filter( (provider) => provider.name !== 'Credentials' ).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            {t('signin')} {provider.name}
          </button>
        </div>
      ))}

      <form method="post" action="/api/auth/credentials">
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
        <label>
          Username
          <input name="username" type="text" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </>
  )
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  const translations = (await serverSideTranslations(context.locale, ['common']))
  const csrfToken = await getCsrfToken(context)

  return {
    props: { ...translations, providers, csrfToken },
  }
}
