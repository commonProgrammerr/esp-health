// import { eventRepository, ticketRepository } from "@/data-source";
// import { Device, User } from "@/entities";
// import { device_status } from "@/entities/Device";
// import AppEvent, { EventType } from "@/entities/Event";

// interface ICreateEventOptions {
//   user?: User
//   device?: Device
//   type: EventType
//   description?: string
// }

// export class AppEventController {

//   async emitNewEvent(payload: ICreateEventOptions): Promise<AppEvent> {
//     const new_event = eventRepository.create()
//     new_event.type = payload.type
//     new_event.created_by = payload.user

//     switch (new_event.type) {
//       case EventType.LOG:
//         if (!new_event.description)
//           throw new Error('Missing event description!')

//         new_event.description = payload.description
//         break;

//       case EventType.PRINT:
//         if (!new_event.device)
//           throw new Error('Missing device target!')

//         if (new_event.device.status !== device_status.REDY)
//           throw new Error('Invalid device status! Expected status equal to READY')
      
//         if (!new_event.created_by)
//           throw new Error('Missing device target!')

//         ticketRepository.create()
//         break;

//       default:
//         throw new Error('Invalid event type')
//     }

//     return eventRepository.save(new_event)
//   }
// }