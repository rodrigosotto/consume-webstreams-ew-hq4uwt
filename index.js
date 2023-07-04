// follow me:
// https://twitter.com/erickwendel_
// https://www.instagram.com/erickwendel_/
// https://youtube.com/@erickwendeltraining

// --- How to properly consume WebStreams on-demand---
const appDiv = document.getElementById('app');
const asyncTimeout = (ms) => new Promise((r) => setTimeout(r, ms));
const updateScreen = (content) => {
  appDiv.insertAdjacentHTML('beforeend', content + '<br>');
};

const source = new ReadableStream({
  async start(controller) {
    const encoder = new TextEncoder();
    for (let index = 0; index < 10; index++) {
      const buf = encoder.encode(`Hey there! + ${index}`);
      controller.enqueue(buf);
      await asyncTimeout(200);
    }
    controller.close();
  },
});
// wrong!
// (async function () {
//   const reader = source.getReader();
//   const responses = [];
//   const decoder = new TextDecoder();
//   while (true) {
//     const { done, value } = await reader.read();
//     if (done) break;
//     responses.push(
//       decoder
//         .decode(value)
//         .toUpperCase()
//       );
//   }

//   responses.forEach(updateScreen);
// })();

source
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk.toUpperCase());
      },
    })
  )
  .pipeTo(
    new WritableStream({
      write: updateScreen,
    })
  );
