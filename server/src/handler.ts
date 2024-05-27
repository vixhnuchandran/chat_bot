import { Request, Response } from "express"
import { openai } from "@ai-sdk/openai"
import { StreamData, streamText } from "ai"
import dotenv from "dotenv"
dotenv.config()

export async function chat(req: Request, res: Response) {
  const { messages } = req.body

  try {
    const result = await streamText({
      model: openai("gpt-4-turbo"),
      system: `You are a helpful, respectful, and honest assistant.`,
      messages,
    })

    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    })

    res.write(" ")

    let fullResponse = ""

    for await (const delta of result.textStream) {
      fullResponse += delta
      res.write(delta)
    }

    res.end()

    messages.push({ role: "assistant", content: fullResponse })
  } catch (error) {
    console.error("Error while processing the chat request:", error)
    res.status(500).json({ error: "An error occurred" })
  }
}

// async (req: Request, res: Response)=> {
//   try {
//     const { messages } = req.body

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       stream: true,
//       messages,
//     })

//     const stream = OpenAIStream(response)
//     const streamingResponse = new StreamingTextResponse(stream)

//     streamingResponse.pipe(res)
//   } catch (error: any) {
//     res.status(500).json({ error: error.message })
//   }
// })
