import { PAST_ITEMS_OFFSET } from "./config.js"
import { startStream, consumeStream } from "./jetstream.js"

// Start two minutes in the past. Timestamp has to be in microseconds.
const startTime = (Date.now() - PAST_ITEMS_OFFSET) * 1000

const subscription = startStream(startTime)
const stream = consumeStream(subscription)

for await (const record of stream) {
  console.log(JSON.stringify(record))
}
console.log("Stop streaming, enough items were streamed")
