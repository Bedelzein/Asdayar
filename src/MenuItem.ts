import { MenuItem } from "@mui/material"

export interface MenuItem {
  id: number
  title: string
  price: number
  image: string
}

export interface OrderItem extends MenuItem {
  amount: number
}

export function toOrderItem(item: MenuItem): OrderItem {
  return {
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    amount: 0
  }
}