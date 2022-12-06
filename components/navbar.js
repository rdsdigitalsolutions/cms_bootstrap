import { useState } from 'react';
import { useTranslation } from 'next-i18next'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import { Switch, useTheme, Navbar, Link, Text, Dropdown, Avatar, Spacer } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes'
import { FaUserCircle, FaMoon, FaSun, FaGlobeAmericas } from "react-icons/fa";

import NavbarLink from './navbar-link'
import CredentialsLogin from './credentials-login'

export default function ComponentHandler({ children, locale, providers, session, sessionStatus }) {
  const { t } = useTranslation('common')
  const router = useRouter();
  const { pathname, asPath, query } = router

  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();
  const [visible, setVisible] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(new Set([locale]));

  const handleLocale = (nextLocale) => {
    setCurrentLocale(new Set([nextLocale]));
    router.push({ pathname, query }, asPath, { locale: nextLocale });
  }

  const handleDropdownActions = (actionKey) => {
    switch (actionKey) {
      case 'logout':
        signOut({ redirect: false });
        router.push('/');
        break;

      default:
        if(actionKey.startsWith('/')) {
          router.push(actionKey);
        } else {
          console.log('Navbar Action:', actionKey);
        }
        
        break;
    }
  }

  return (
    <>
      {visible && <CredentialsLogin setVisible={setVisible} visible={visible} providers={providers} locale={locale} />}

      <Navbar isCompact isBordered variant="static" maxWidth="fluid">
        <Navbar.Brand>
          <Switch
            // css={{ background: '$inactive' }}
            color="default"
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
            iconOn={<FaMoon />}
            iconOff={<FaSun />}
          />
          <Spacer x={0.5} />
          <Navbar.Toggle aria-label="toggle navigation" showIn="xs" />
          <Spacer x={0.5} />
          <Text b color="inherit" hideIn="xs">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </Text>
        </Navbar.Brand>

        <Navbar.Content hideIn="xs" variant="underline" enableCursorHighlight >
          <NavbarLink path='/' name={t('Home Page')}  />
          <NavbarLink path='/customers' name={t('Customers')} />
          <NavbarLink path='/pricing' name={t('Pricing')} />

          { sessionStatus === 'authenticated' && <Dropdown>
            <Navbar.Item>
              <Dropdown.Button
                auto
                light
                css={{
                  px: 0,
                  dflex: "center",
                  svg: { pe: "none" },
                }}
                // iconRight={icons.chevron}
                ripple={false}
              >
                {t('Admin')}
              </Dropdown.Button>
            </Navbar.Item>
            <Dropdown.Menu
              onAction={handleDropdownActions}
              color="secondary"
              aria-label="Actions"
              css={{ $$dropdownMenuWidth: "280px" }}
            >
              <Dropdown.Section title="Actions">
                <Dropdown.Item
                  key="/admin"
                  command="⌘N"
                  description="Create a new file"
                >
                  {t('Dashboard')}
                </Dropdown.Item>
                <Dropdown.Item
                  key="/admin/settings"
                  command="⌘N"
                  description="Create a new file"
                >
                  {t('Settings')}
                </Dropdown.Item>
              </Dropdown.Section>
              <Dropdown.Section title="Danger zone">
                <Dropdown.Item
                  key="delete"
                  color="error"
                  command="⌘⇧D"
                  description="Permanently delete the file"
                >
                  Delete file
                </Dropdown.Item>
              </Dropdown.Section>
            </Dropdown.Menu>
          </Dropdown> }

        </Navbar.Content>

        <Navbar.Content enableCursorHighlight css={{
          "@xs": {
            w: "12%",
            jc: "flex-end",
          },
        }}
        >
          {sessionStatus !== 'authenticated' && <Navbar.Link onClick={() => setVisible(true)} hideIn="xs"><FaUserCircle /><Spacer x={0.5} />{t('signin')}</Navbar.Link>}

          {sessionStatus === 'authenticated' && <Dropdown placement="bottom-right">
            <Navbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  as="button"
                  color="secondary"
                  size="md"
                  src={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}${session.user.image}`}
                />
              </Dropdown.Trigger>
            </Navbar.Item>
            <Dropdown.Menu
              aria-label="User menu actions"
              color="secondary"
              onAction={handleDropdownActions}
            >
              <Dropdown.Item key="" css={{ height: "$18" }}>
                <Text b color="inherit" css={{ d: "flex" }}>
                  Signed in as
                </Text>
                <Text b color="inherit" css={{ d: "flex" }}>
                  {session.user.email}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="/admin/profile" withDivider>
                My Profile
              </Dropdown.Item>
              <Dropdown.Item key="logout" withDivider color="error">
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>}

          <Dropdown isBordered>
            <Navbar.Item>
              <Dropdown.Button
                auto
                light
                css={{
                  px: 0,
                  dflex: "center",
                  svg: { pe: "none" },
                }}
                // iconRight={icons.chevron}
                ripple={false}
              >
                <FaGlobeAmericas />
              </Dropdown.Button>
            </Navbar.Item>
            <Dropdown.Menu
              onAction={handleLocale}
              selectedKeys={currentLocale}
              aria-label="ACME features"
              css={{
                $$dropdownMenuWidth: "340px",
                $$dropdownItemHeight: "70px",
                "& .nextui-dropdown-item": {
                  py: "$4",
                  // dropdown item left icon
                  svg: {
                    color: "$secondary",
                    mr: "$4",
                  },
                  // dropdown item title
                  "& .nextui-dropdown-item-content": {
                    w: "100%",
                    fontWeight: "$semibold",
                  },
                },
              }}
            >
              <Dropdown.Item
                key="en-US"
                showFullDescription
                description="Translate the site to english."
              // icon={icons.scale}
              >
                English US
              </Dropdown.Item>
              <Dropdown.Item
                key="pt-BR"
                showFullDescription
                description="Traduzir este site para Português."
              // icon={icons.activity}
              >
                Português Brasil
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </Navbar.Content>

        <Navbar.Collapse showIn="xs">
          <Navbar.CollapseItem>
            <Link
              color="inherit"
              css={{
                minWidth: "100%",
              }}
              onClick={() => setVisible(true)}
            >
              {t('signin')}
            </Link>
          </Navbar.CollapseItem>
        </Navbar.Collapse>

      </Navbar>
    </>
  )
}
