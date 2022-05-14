import { MyEvent } from "../entites/MyEvent";
import { checkAdmin } from "../middleware/checkAdmin";
import { MyEventInput } from "../types/input/MyEventInput";
import { MyEventResponse } from "../types/response/MyEventResponse";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { dataSource } from "../data-source";

@Resolver((_of) => MyEvent)
export class MyEventResolver {
  @Query((_return) => MyEventResponse)
  async getEvents(): Promise<MyEventResponse> {
    try {
      const events = await MyEvent.find();
      if (events) {
        return {
          code: 200,
          success: true,
          myEvents: events,
        };
      } else {
        return {
          code: 400,
          success: false,
          message: "Not have any event",
        };
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }
  //get one event
  @Query((_return) => MyEventResponse)
  async getEvent(@Arg("eventId")eventId: number): Promise<MyEventResponse> {
    try {
      const event = await MyEvent.findOne({
        where:{
          id:eventId
        }
      });
      if (event) {
        return {
          code: 200,
          success: true,
          myEvent: event,
        };
      } else {
        return {
          code: 400,
          success: false,
          message: "Not have any event",
        };
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
  }
  //create Event
  @Mutation((_return) => MyEventResponse)
  @UseMiddleware(checkAdmin)
  async adminCreateEvent(
    @Arg("input") input: MyEventInput
  ): Promise<MyEventResponse> {
    return await dataSource.transaction(async transactionManager =>{
      const { content, title, thumbnailForDesktop,thumbnailForMobile } = input;
    try {
     
        const newEvent = transactionManager.create(MyEvent,{
          content,
          title,
          thumbnailForDesktop,
          thumbnailForMobile,
 
        });
        await transactionManager.save(newEvent)
        return{
          code:200,
          success:true,
          myEvent:newEvent
        }
   
      
      
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: error.message,
      };
    }
    })
  }
}
