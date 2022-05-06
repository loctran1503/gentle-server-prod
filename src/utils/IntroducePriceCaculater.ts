import { MONEY_COMMENT_PERCENT, MONEY_INTRODUCE_PERCENT } from "./constants"




export const IntroducePriceCaculater =(value : number) =>{
    return value*MONEY_INTRODUCE_PERCENT
}
export const CommentPriceCaculater =(value : number) =>{
    return value*MONEY_COMMENT_PERCENT
}