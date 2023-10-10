import { ButtonBase, Stack, Typography, styled } from '@mui/material'
import getTelegramMiniApp from './TelegramMiniApp'
import { useEffect } from 'react'
import { NavigateOptions, useNavigate } from 'react-router-dom'

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: '30vh',
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
}))

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
})

const Image = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.common.white,
}))

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity'),
}))

const ImageMarked = styled('span')(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: 'absolute',
  bottom: -2,
  left: 'calc(50% - 9px)',
  transition: theme.transitions.create('opacity'),
}))

export default function Entry() {
  const tgMiniApp = getTelegramMiniApp()

  useEffect(() => {
    tgMiniApp.ready()
    const mainButton = tgMiniApp.MainButton
    mainButton.setText('Scan table QR')
    mainButton.onClick(onMainButtonClicked)
    mainButton.show()
  }, [])

  const navigate = useNavigate()

  function onMainButtonClicked() {
    if (tgMiniApp.version < 6.4) {
      tgMiniApp.showAlert('Scanning QR code does\'t work for that version of Telegram. Pleace update your application')
      return
    }
    try {
      tgMiniApp.showScanQrPopup({ text: 'Please scan QR placed over the table' }, (data: string) => {
        try {
          if (data.includes('https://t.me/')) {
            tgMiniApp.MainButton.offClick(onMainButtonClicked)
            openMenuByTable(14)
            return true
          } else {
            tgMiniApp.showAlert('Invalid QR scanned. Please contact establishment administrator to make an order')
            return false
          }
        } catch (error: any) {
          tgMiniApp.showAlert(error)
          return false
        }
      })
    } catch (error: any) {
      if (error instanceof Error) {
        handleScanQrError(error.message)
      }
    }
  }

  function openMenuByTable(tableNumber: number) {
    navigate('/menu', { state: { tableNumber, isJustObserving: false } } as NavigateOptions)
  }

  function handleScanQrError(message: string) {
    switch (message) {
      case 'WebAppMethodUnsupported':
        console.log(message)
        break
      case 'webAppScanQrPopupOpened':
        console.log(message)
        break
    }
  }

  return <>
    <Stack>
      <ImageButton focusRipple onClick={() => tgMiniApp.showAlert('This feature is not ready yet and will be developed in the future')}>
        <ImageSrc style={{ backgroundImage: 'url(/booking_a_table.png)' }} />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            sx={{
              position: 'relative',
              p: 4,
              pt: 2,
              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
            }}
          >Book a table<ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
      <ImageButton focusRipple onClick={() => navigate('/menu', { state: { isJustObserving: true } } as NavigateOptions)}>
        <ImageSrc style={{ backgroundImage: 'url(/observe_menu.png)' }} />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            sx={{
              position: 'relative',
              p: 4,
              pt: 2,
              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
            }}
          >Just observe the menu<ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
      <ImageButton focusRipple onClick={() => tgMiniApp.openTelegramLink('https://t.me/BedelartStudio')}>
        <ImageSrc style={{ backgroundImage: 'url(/leave_feedback.png)' }} />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            sx={{
              position: 'relative',
              p: 4,
              pt: 2,
              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
            }}
          >Leave us your opinion<ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
    </Stack>
  </>
}