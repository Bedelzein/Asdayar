import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Entry from './Entry'
import Menu from './Menu'
import getTelegramMiniApp, { ThemeParams } from './TelegramMiniApp'
import { ThemeProvider, createTheme } from '@mui/material'
import { useMemo, useState } from 'react'

export default function App() {
  const tgMiniApp = getTelegramMiniApp()
  tgMiniApp.ready()

  const [mode, setMode] = useState<'light' | 'dark'>(tgMiniApp.colorScheme)
  const [tgTheme, setTgTheme] = useState<ThemeParams>(tgMiniApp.themeParams)

  const defaultTheme = createTheme({ palette: { mode }})

  const theme = useMemo(
    () => createTheme({
      palette: {
        primary: {
          main: tgTheme.button_color ? tgTheme.button_color : defaultTheme.palette.primary.main
        },
        text: {
          primary: tgTheme.text_color ? tgTheme.text_color : defaultTheme.palette.text.primary
        },
        background: {
          default: tgTheme.secondary_bg_color ? tgTheme.secondary_bg_color : defaultTheme.palette.background.default,
          paper: tgTheme.bg_color ? tgTheme.bg_color : defaultTheme.palette.background.paper
        },
        mode
      }
    }),
    [mode, tgTheme, defaultTheme]
  )

  tgMiniApp.onEvent('themeChanged', () => {
    setMode(tgMiniApp.colorScheme)
    setTgTheme(tgMiniApp.themeParams)
  })

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Entry />
    },
    {
      path: '/menu',
      element: <Menu />
    }
  ])

  return <ThemeProvider theme={theme}><RouterProvider router={router} /></ThemeProvider>
}