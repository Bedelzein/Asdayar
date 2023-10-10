Mini App Sample Description

@AsdayarBot – a Mini App that provides a demo flow for ordering fictional food using QR code. User is presented with a storefront where they can browse and select food items, then place a sample order.

For choosing dishes you should generate a QR code with data "https://t.me/AsdayarBot/Menu?startapp=${tableName}" where ${tableName} is number of table.

You can use this site to generate QR code: https://hackernoon.com/how-to-build-a-qr-code-generator-in-react

For making bot work you need to create .env file with two following values:
REACT_APP_BOT_TOKEN=${your bot token}
REACT_APP_ACQUIRING_PROVIDER_TOKEN=${your provider token}