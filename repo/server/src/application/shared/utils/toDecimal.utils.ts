import { Decimal } from '@prisma/client/runtime/library.js'


export default function toDecimal(decimal: number) {
    return Decimal(decimal)
}