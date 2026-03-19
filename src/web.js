import { PAST_ITEMS_OFFSET } from "./config.js"
import { startStream, consumeStream } from "./jetstream.js"

export const MAX_ITEMS = 250
const recordsElement = document.querySelector(".records")

// Start two minutes in the past. Timestamp has to be in microseconds.
const startTime = (Date.now() - PAST_ITEMS_OFFSET) * 1000

const subscription = startStream(startTime)
const stream = consumeStream(subscription)

for await (const record of stream) {
  // Remove initial text node from div.
  if (
    recordsElement.childNodes.length === 1 &&
    recordsElement.firstChild.nodeType === Node.TEXT_NODE
  ) {
    recordsElement.firstChild.remove()
    recordsElement.classList.remove("loading-ellipsis")
  }

  console.log(JSON.stringify(record))
  const recordElement = document
    .getElementById("record-template")
    .content.cloneNode(true)

  const previewElement = recordElement.querySelector("div.preview")

  // Each record contains a link to the metadata
  recordElement.querySelector("a").href = record.resource
  recordElement.querySelector("a").textContent = record.resource

  if (record.preview !== undefined) {
    if (record.preview.mimeType.startsWith("image/")) {
      const imageElement = document
        .getElementById("record-template-preview-image")
        .content.querySelector("img")
        .cloneNode(true)
      imageElement.src = record.preview.url
      previewElement.prepend(imageElement)
    } else if (record.preview.mimeType.startsWith("text/plain")) {
      const textElement = document
        .getElementById("record-template-preview-text-plain")
        .content.querySelector("div")
        .cloneNode(true)
      textElement.innerText = record.preview.data
      previewElement.prepend(textElement)
    }
  }

  recordsElement.prepend(recordElement)

  if (recordsElement.children.length > MAX_ITEMS) {
    recordsElement.lastElementChild.remove()
  }
}
