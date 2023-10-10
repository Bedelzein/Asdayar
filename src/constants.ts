export const BOT_USERNAME = 'AsdayarBot'
export const LINK_MINI_APP_ENTRY = makeBotLink('RECEPTION')
export const LINK_OBSERVE_MENU = makeBotLink('ObserveMenu')

function makeBotLink(title: string): string {
    return `https://t.me/${BOT_USERNAME}/${title}`
}