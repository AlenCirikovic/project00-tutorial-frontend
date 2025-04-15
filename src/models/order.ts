export interface OrderType{
    id:string
    email:string
    name:string
    total:number
    order_items:OrderItemType[]
}

export interface OrderItemType{
    id:string
    product_title:string
    price:number
    quantity:number
}