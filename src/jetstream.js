import { JetstreamSubscription } from "@atcute/jetstream"

export const startStream = (startTime) => {
  const subscription = new JetstreamSubscription({
    url: "wss://jetstream2.us-east.bsky.network",
    wantedCollections: ["cx.vmx.dev.tmp001.matadisco"],
    cursor: startTime,
  })
  console.log(`current stream cursor is at ${subscription.cursor}`)

  return subscription
}

export const consumeStream = async function* (subscription) {
  for await (const event of subscription) {
    // Record was created, updated, or deleted.
    if (event.kind === "commit") {
      const { operation } = event.commit

      if (operation === "create" || operation === "update") {
        // Record and cid are available on create/update
        yield event.commit.record
      }
    }
  }
}
