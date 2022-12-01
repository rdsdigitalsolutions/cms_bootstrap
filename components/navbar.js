import { useState } from 'react';
// import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import { Switch, useTheme, Navbar, Button, Link, Text, Dropdown, Avatar, Spacer } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes'
import { FaUserCircle, FaMoon, FaSun, FaGlobeAmericas } from "react-icons/fa";

import CredentialsLogin from './credentials-login'

export default function Handler({ children, locale }) {
  const { t } = useTranslation('common')
  const { data: session, status } = useSession()
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

  const handleProfileActions = (actionKey) => {
    switch (actionKey) {
      case 'logout':
        signOut()
        break;

      default:
        console.log('Navbar Action:', actionKey);
        break;
    }
  }

  return (
    <>
      {visible && <CredentialsLogin setVisible={setVisible} visible={visible} />}

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

        <Navbar.Content hideIn="xs" variant="underline" enableCursorHighlight>
          {/* <Navbar.Item>
            <Link href="/">Features</Link>
          </Navbar.Item>
          <Navbar.Item>
            <Link href="/">Customers</Link>
          </Navbar.Item>
          <Navbar.Item>
            <Link href="/">Pricing</Link>
          </Navbar.Item>
          <Navbar.Item>
            <Link href="/">Company</Link>
          </Navbar.Item>
          <Navbar.Item>
            <Link href="/">Features</Link>
          </Navbar.Item> */}

          <Navbar.Link href="#">Features</Navbar.Link>
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
                Features
              </Dropdown.Button>
            </Navbar.Item>
            <Dropdown.Menu
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
                key="autoscaling"
                showFullDescription
                description="ACME scales apps to meet user demand, automagically, based on load."
              // icon={icons.scale}
              >
                Autoscaling
              </Dropdown.Item>
              <Dropdown.Item
                key="usage_metrics"
                showFullDescription
                description="Real-time metrics to debug issues. Slow query added? We’ll show you exactly where."
              // icon={icons.activity}
              >
                Usage Metrics
              </Dropdown.Item>
              <Dropdown.Item
                key="production_ready"
                showFullDescription
                description="ACME runs on ACME, join us and others serving requests at web scale."
              // icon={icons.flash}
              >
                Production Ready
              </Dropdown.Item>
              <Dropdown.Item
                key="99_uptime"
                showFullDescription
                description="Applications stay on the grid with high availability and high uptime guarantees."
              // icon={icons.server}
              >
                +99% Uptime
              </Dropdown.Item>
              <Dropdown.Item
                key="supreme_support"
                showFullDescription
                description="Overcome any challenge with a supporting team ready to respond."
              // icon={icons.user}
              >
                +Supreme Support
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Navbar.Link href="#">Customers</Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Company</Navbar.Link>
        </Navbar.Content>

        <Navbar.Content enableCursorHighlight css={{
            "@xs": {
              w: "12%",
              jc: "flex-end",
            },
          }}
        >
          {status !== 'authenticated' && <Navbar.Link onClick={() => setVisible(true)} hideIn="xs"><FaUserCircle /><Spacer x={0.5} />{t('signin')}</Navbar.Link>}

          {status === 'authenticated' && <Dropdown placement="bottom-right">
            <Navbar.Item>
              <Dropdown.Trigger>
                <Avatar
                  bordered
                  as="button"
                  color="secondary"
                  size="md"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </Dropdown.Trigger>
            </Navbar.Item>
            <Dropdown.Menu
              aria-label="User menu actions"
              color="secondary"
              onAction={handleProfileActions}
            >
              <Dropdown.Item key="profile" css={{ height: "$18" }}>
                <Text b color="inherit" css={{ d: "flex" }}>
                  Signed in as
                </Text>
                <Text b color="inherit" css={{ d: "flex" }}>
                  {session.user.email}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="settings" withDivider>
                My Settings
              </Dropdown.Item>
              <Dropdown.Item key="team_settings">Team Settings</Dropdown.Item>
              <Dropdown.Item key="analytics" withDivider>
                Analytics
              </Dropdown.Item>
              <Dropdown.Item key="system">System</Dropdown.Item>
              <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
              <Dropdown.Item key="help_and_feedback" withDivider>
                Help & Feedback
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
