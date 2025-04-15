import { apiRoutes } from 'constants/apiConstants'
import { OrderType } from 'models/order'
import { apiRequest } from './Api'

export const fetchOrders = async (pageNumber: number) =>
    apiRequest<undefined, OrderType[]>(
        'get',
        `${apiRoutes.ORDERS_PREFIX}?page=${pageNumber}`,
    )

export const fetchChart = async () =>
    apiRequest<undefined, { date: string; sum: string }[]>(
        'get',
        `${apiRoutes.ORDERS_PREFIX}/chart`,
    )

