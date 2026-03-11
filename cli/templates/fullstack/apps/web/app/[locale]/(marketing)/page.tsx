import { useTranslations } from 'next-intl'

export default function HomePage(): JSX.Element {
  const t = useTranslations('Home')
  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </main>
  )
}
