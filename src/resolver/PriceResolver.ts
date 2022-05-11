import { Price } from "../entites/Price";
import { FieldResolver, Resolver, Root } from "type-graphql";

@Resolver((_of) => Price)
export class PriceResolver {
  @FieldResolver((_return) => Number)
  priceAfterDiscount(@Root() root: Price) {
   
      const price = root.price * ((100 - root.salesPercent) / 100);
      return price;
    
  }
}
