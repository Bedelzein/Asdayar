import { Box, Card, CardMedia, Fab, Stack, Theme, Typography, Zoom } from '@mui/material'
import getTelegramMiniApp from './TelegramMiniApp'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Add, Delete, Info, Remove } from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { OrderItem, toOrderItem } from './MenuItem'
import { MOCK_MENU } from './mock'
import { useTheme } from '@emotion/react'

const Title = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  display: 'flex',
  color: (theme as any).palette.text,
}))

const TopBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: '20%',
  backgroundColor: (theme as any).palette.background.paper,
  opacity: 0.6,
  transition: (theme as any).transitions.create('opacity'),
}))

const BottomBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '20%',
  backgroundColor: (theme as any).palette.background.paper,
  opacity: 0.6,
  transition: (theme as any).transitions.create('opacity'),
}))

function getPairs(obj: Record<string, any>, keys: string[] = []): [string[], any][] {
  return Object.entries(obj).reduce<[string[], any][]>((pairs, [key, value]) => {
    if (typeof value === 'object') {
      pairs.push(...getPairs(value, [...keys, key]))
    } else {
      pairs.push([[...keys, key], value])
    }
    return pairs
  }, [])
}

const botToken = process.env.REACT_APP_BOT_TOKEN

export default function Menu() {
  const navigate = useNavigate()
  const { state }: any = useLocation()
  const tgMiniApp = getTelegramMiniApp()
  const { tableNumber, isJustObserving } = state || {
    tableNumber: tgMiniApp.initDataUnsafe.start_param || -1,
    isJustObserving: !tgMiniApp.initDataUnsafe.start_param
  }
  console.log(state)

  const [choices, setChoices] = useState<Array<OrderItem>>(MOCK_MENU.map(item => toOrderItem(item)))
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const theme = useTheme() as Theme

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  }

  useEffect(() => { tgMiniApp.ready() }, [])
  useEffect(() => {
    const mainButton = tgMiniApp.MainButton
    if (totalAmount > 0) {
      mainButton.setText(`Proceed order (${totalAmount} dishes)`)
      mainButton.onClick(openInvoice)
      mainButton.show()
    } else {
      mainButton.offClick(openInvoice)
      mainButton.hide()
    }
  }, [totalAmount])

  const backButton = tgMiniApp.BackButton
  backButton.show()
  backButton.onClick(() => navigate(-1))

  function handleAddToCart(id: number) {
    handleChoices(id, 1)
  }

  function handleRemoveOneFromCart(id: number) {
    handleChoices(id, -1)
  }

  function handleDeleteFromCart(id: number) {
    handleChoices(id, 0)
  }

  function handleChoices(id: number, amountValue: number) {
    let nextTotalAmount = 0
    const nextChoices = choices.map(choice => {
      if (choice.id === id) {
        const nextAmount = amountValue === 0 ? 0 : choice.amount + amountValue
        nextTotalAmount += nextAmount
        return {
          ...choice,
          amount: nextAmount
        }
      } else {
        nextTotalAmount += choice.amount
        return choice
      }
    })
    setTotalAmount(nextTotalAmount)
    setChoices(nextChoices)
  }

  async function openInvoice() {
    const prices = choices.filter(choice => choice.amount > 0).map(choice => ({ label: choice.title, amount: choice.amount * choice.price * 100 }))
    console.log(prices)
    const invoiceInput: any = {
      title: 'Order N8917223',
      description: `Your order for table ${tableNumber}`,
      payload: '!',
      provider_token: process.env.REACT_APP_ACQUIRING_PROVIDER_TOKEN,
      currency: 'KZT',
      prices: encodeURIComponent(JSON.stringify(prices))
    }

    const params = getPairs(invoiceInput)
      .map(([[firstKey, ...restKeys], value]) =>
        `${firstKey}${restKeys.map(currentKey => `[${currentKey}]`).join('')}=${value}`)
      .join('&')

    console.log(params)
    const response = await fetch(`https://api.telegram.org/bot${botToken}/createInvoiceLink?${params}`)
    const body = await response.json()
    const link = body.result

    try {
      tgMiniApp.openInvoice(link, (status: string) => {
        // ignore
      })
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'WebAppPopupOpened') {
          // ignore
        }
      }
    }
  }

  return <Box sx={{ mx: 1, mt: 1 }}>
    <Stack spacing={1}>
      {choices.map(choice => (
        <Card key={choice.id}>
          <div style={{ position: 'relative' }}>
            <CardMedia
              component='img'
              height={280}
              image={choice.image}
            />
            <TopBackdrop />
            <Title>
              <Typography
                component='span'
                variant='h6'
                color='inherit'
                sx={{
                  position: 'relative',
                  left: theme => theme.spacing(1),
                  top: theme => theme.spacing(1.5)
                }}
              >{choice.title}: {choice.price}₸</Typography>
            </Title>
            <BottomBackdrop />
            <Fab
              size='small'
              onClick={() => tgMiniApp.showAlert('This feature is not ready yet')}
              sx={{
                position: 'absolute',
                opacity: 0.8,
                right: theme => theme.spacing(1),
                top: theme => theme.spacing(1)
              }}>
              <Info />
            </Fab>
            <Zoom
              in={choice.amount > 0}
              timeout={transitionDuration}
              style={{
                transitionDelay: `${choice.amount > 0 ? transitionDuration.exit : 0}ms`,
              }}
              unmountOnExit>
              <Fab
                size='small'
                onClick={() => handleRemoveOneFromCart(choice.id)}
                sx={{
                  zIndex: 1,
                  position: 'absolute',
                  opacity: 0.8,
                  left: theme => theme.spacing(1),
                  bottom: theme => theme.spacing(1)
                }}>
                <Remove />
              </Fab>
            </Zoom>
            <Zoom
              in={choice.amount > 0}
              timeout={transitionDuration}
              style={{
                transitionDelay: `${choice.amount > 0 ? transitionDuration.exit : 0}ms`
              }}
              unmountOnExit>
              <Fab
                variant='extended'
                size='medium'
                onClick={() => handleDeleteFromCart(choice.id)}
                sx={{
                  width: '50%',
                  position: 'absolute',
                  opacity: 0.8,
                  left: 0,
                  right: 0,
                  mx: 'auto',
                  bottom: theme => theme.spacing(1)
                }}>
                <Delete /> | Amount: {choice.amount}
              </Fab>
            </Zoom>
            {isJustObserving ? <></> : <Fab
              size='small'
              onClick={() => handleAddToCart(choice.id)}
              sx={{
                zIndex: 1,
                position: 'absolute',
                opacity: 0.8,
                right: theme => theme.spacing(1),
                bottom: theme => theme.spacing(1)
              }}>
              <Add />
            </Fab>
            }
          </div>
        </Card>
      ))}
    </Stack>
  </Box>
}