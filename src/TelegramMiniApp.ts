export interface TelegramWebApp {
  initData: string
  initDataUnsafe: WebAppInitData
  colorScheme: 'light' | 'dark'
  themeParams: ThemeParams
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  MainButton: MainButton
  BackButton: BackButton
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  HapticFeedback: HapticFeedback
  CloudStorage: CloudStorage
  version: number
  isVersionAtLeast(version: string): void
  setHeaderColor(color: string): void
  setBackgroundColor(color: string): void
  enableClosingConfirmation(): void
  disableClosingConfirmation(): void
  onEvent(eventType: EventType, eventHandler: Function): void
  offEvent(eventType: EventType, eventHandler?: Function): void
  sendData(data: any): void
  switchInlineQuery(query: string, choose_chat_types?: ChatType): void
  openLink(url: string, options: any): void
  openTelegramLink(url: string): void
  openInvoice(url: string, callback?: Function): void
  showPopup(params: PopupParams, callback?: Function): void
  showAlert(message: string, callback?: Function): void
  showConfirm(message: string, callback?: Function): void
  showScanQrPopup(params: ScanQrPopupParams, callback?: Function): void
  closeScanQrPopup(): void
  readTextFromClipboard(callback?: Function): void
  requestWriteAccess(callback?: Function): void
  requestContact(callback?: Function): void
  ready(): void
  expand(): void
  close(): void
}

type EventType = 'themeChanged' | 'viewportChanged' | 'mainButtonClicked' | 'backButtonClicked'
                | 'settingsButtonClicked' | 'invoiceClosed' | 'popupClosed' | 'qrTextReceived'
                | 'clipboardTextReceived' | 'writeAccessRequested' | 'contactRequested'

type ChatType = 'users' | 'bots' | 'groups' | 'channels'

type HapticFeedbackImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'

type HapticFeedbackNotificationType = 'success' | 'warning' | 'error'

interface WebAppInitData {
  query_id?: string
  user?: WebAppUser
  receiver?: WebAppUser
  start_param?: string
  auth_date?: number
  hash?: string
}

interface WebAppUser {
  id?: number
  is_bot: boolean
  first_name: string
  last_name?: string
  usernames?: string
  language_code?: string
  photo_url?: string
}

interface MainButton {
  text: string
  color: string
  textColor: string
  isVisible: boolean
  isActive: boolean
  isProgressVisible: boolean
  setText(text: string): void
  onClick(callback: Function): void
  offClick(callback: Function): void
  show(): void
  hide(): void
  enable(): void
  disable(): void
  showProgress(leaveActive: boolean): void
  hideProgress(): void
  setParams(params: MainButtonParams): void
}

interface PopupParams {
  title: string,
  message: string,
  buttons: PopupButton[]
}

interface PopupButton {
  id?: String,
  type?: String,
  text?: String
}

interface BackButton {
  isVisible: boolean
  onClick(callback: Function): void
  offClick(callback: Function): void
  show(): void
  hide(): void
}

interface HapticFeedback {
  impactOccured(style: HapticFeedbackImpactStyle): void
  notificationOccured(type: HapticFeedbackNotificationType): void
  selectionChanged(): void
}

interface CloudStorage {
  setItem(key: any, value: any, callback?: Function): void
  getItem(key: any, callback: Function): void
  getItems(keys: Array<any>, callback: Function): void
  removeItem(key: any, callback?: Function): void
  removeItems(keys: Array<any>, callback?: Function): void
  getKeys(callback: Function): void
}

interface ScanQrPopupParams {
  text: string
}

interface MainButtonParams {
  text?: string
  color?: string
  text_color?: string
  is_active?: boolean
  is_visible?: boolean
}

export interface ThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
}

function getTgWebAppUnsafe(): any {
  const myWindow = window as { [key: string]: any }
  const tg = myWindow['Telegram'] as any
  const webApp = tg['WebApp'] as any
  return webApp
}

function getTelegramMiniApp(): TelegramWebApp {
  const tgWebApp = getTgWebAppUnsafe()
  return {
    initData: tgWebApp.initData,
    initDataUnsafe: tgWebApp.initDataUnsafe,
    colorScheme: tgWebApp.colorScheme,
    themeParams: tgWebApp.themeParams,
    isExpanded: tgWebApp.isExpanded,
    viewportHeight: tgWebApp.viewportHeight,
    viewportStableHeight: tgWebApp.viewportStableHeight,
    MainButton: tgWebApp.MainButton,
    BackButton: tgWebApp.BackButton,
    headerColor: tgWebApp.headerColor,
    backgroundColor: tgWebApp.backgroundColor,
    isClosingConfirmationEnabled: tgWebApp.isClosingConfirmationEnabled,
    HapticFeedback: tgWebApp.HapticFeedback,
    CloudStorage: tgWebApp.CloudStorage,
    version: parseFloat(tgWebApp.version),
    isVersionAtLeast: tgWebApp.isVersionAtLeast,
    setHeaderColor: tgWebApp.setHeaderColor,
    setBackgroundColor: tgWebApp.setBackgroundColor,
    enableClosingConfirmation: tgWebApp.enableClosingConfirmation,
    disableClosingConfirmation: tgWebApp.disableClosingConfirmation,
    onEvent: tgWebApp.onEvent,
    offEvent: tgWebApp.offEvent,
    sendData: tgWebApp.sendData,
    switchInlineQuery: tgWebApp.switchInlineQuery,
    openLink: tgWebApp.openLink,
    openTelegramLink: tgWebApp.openTelegramLink,
    openInvoice: tgWebApp.openInvoice,
    showPopup: tgWebApp.showPopup,
    showAlert: tgWebApp.showAlert,
    showConfirm: tgWebApp.showConfirm,
    showScanQrPopup: tgWebApp.showScanQrPopup,
    closeScanQrPopup: tgWebApp.closeScanQrPopup,
    readTextFromClipboard: tgWebApp.readTextFromClipboard,
    requestWriteAccess: tgWebApp.requestWriteAccess,
    requestContact: tgWebApp.requestContact,
    ready: tgWebApp.ready,
    expand: tgWebApp.expand,
    close: tgWebApp.close,
  }
}

export default getTelegramMiniApp