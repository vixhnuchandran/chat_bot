import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal, Bot } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Payload {
  role: string;
  content: string;
}

export function Home() {
  const [chatData, setChatData] = useState<Payload[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleChatConversationWithAI = async (message: string) => {
    const userPayload = { role: "user", content: message };

    const updatedChatData = [...chatData, userPayload];
    setChatData(updatedChatData);

    try {
      const response = await fetch(`http://127.0.0.1:3000/chat`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedChatData }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from response body");
      }

      const decoder = new TextDecoder();
      let accumulatedData = "";

      let done = false;
      while (!done) {
        const { value, done: chunkDone } = await reader.read();
        done = chunkDone;

        if (value) {
          const chunkData = decoder.decode(value);
          accumulatedData += chunkData;

          const aiPayload: Payload = {
            role: "assistant",
            content: accumulatedData,
          };

          setChatData((prevChatData) => {
            const lastMessage = prevChatData[prevChatData.length - 1];
            if (lastMessage?.role === "assistant") {
              const newChatData = [...prevChatData];
              newChatData[newChatData.length - 1] = aiPayload;
              return newChatData;
            } else {
              return [...prevChatData, aiPayload];
            }
          });
        }
      }

      accumulatedData = "";
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatData]);

  return (
    <div className="grid w-full">
      <div className="flex w-full h-[92vh] flex-col">
        <header className="sticky z-10 flex justify-center items-center pb-4 h-[4vh]">
          <h1 className="text-3xl font-bold">Chat Bot</h1>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-4">
            <div className="flex-1">
              {chatData && (
                <ScrollArea className="h-full">
                  <div className="relative items-start px-6 space-y-4 text-sm">
                    {chatData.map((data, index) => (
                      <div key={index} className="flex items-start">
                        <span>
                          {data.role === "user" ? (
                            <Avatar>
                              <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="@shadcn"
                                className="rounded-full w-8 h-8"
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          ) : (
                            <Bot className="border p-1 mr-2 rounded-full w-8 h-8" />
                          )}
                        </span>
                        <span className="pl-3 text-base text-left whitespace-pre-wrap">
                          {data.content}
                        </span>
                      </div>
                    ))}
                    <div ref={scrollAreaRef}></div>
                  </div>
                </ScrollArea>
              )}
            </div>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const message = formData.get("message") as string;
                handleChatConversationWithAI(message);
                e.currentTarget.reset();
              }}
              className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            >
              <Label htmlFor="message" className="sr-only">
                Message
              </Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Type your message here..."
                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                onKeyDown={(e) => {
                  const message = (e.currentTarget as HTMLTextAreaElement)
                    .value;
                  if (e.key === "Enter" && message.trim().length >= 2) {
                    e.preventDefault();
                    e.currentTarget.form?.dispatchEvent(
                      new Event("submit", {
                        bubbles: true,
                        cancelable: false,
                      })
                    );
                  }
                }}
              />
              <div className="flex items-center p-3 pt-0">
                <Button type="submit" size="sm" className="ml-auto gap-1.5">
                  <span className="hidden lg:block">Send Message</span>
                  <SendHorizontal />
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
