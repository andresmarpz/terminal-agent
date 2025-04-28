"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { env } from "~/lib/constants";
import Terminal from "./Terminal";
import { TerminalInput } from "~/components/terminal/TerminalInput";
import TerminalMessage from "~/components/terminal/TerminalMessage";

// const mockMessages = [
//   {
//     content: "hello react friend. Tell me a whole LONG story",
//     additional_kwargs: {},
//     response_metadata: {},
//     type: "human",
//     name: null,
//     id: "87b4aa9b-3be7-4abb-8aee-85fa99b964b6",
//     example: false,
//   },
//   {
//     content:
//       "Once upon a time, in a bustling village nestled between rolling hills and dense forests, there lived a curious young girl named Elara. Elara had a wild mane of curly hair, sparkling green eyes that seemed to be filled with the essence of the forest, and a heart that yearned for adventure. She was known throughout the village for her insatiable curiosity and her habit of collecting stories as others might collect rare coins or beautiful stones.\n\nEvery morning, Elara would wander through the village, interacting with the villagers, listening to their tales of love, loss, and laughter. From the wise old blacksmith who had traveled far and wide, she learned about distant lands filled with towering mountains and vibrant cultures. The baker, with flour dusting her apron, told Elara about the time she baked a giant cake for the village festival, only for the mischievous squirrels to snatch it away. The stories she collected filled Elara's mind with vivid pictures of worlds beyond her own, igniting a spark of wanderlust in her soul.\n\nOne sunny day, as Elara roamed through the nearby woods, she stumbled upon a glimmering stream she had never seen before. The water sparkled like diamonds under the sun's gaze, and as she knelt to take a closer look, she noticed strange symbols etched into the stones lining the bank. Intrigued, she reached out to touch the cool water, and instantly, a burst of energy surged through her.\n\nTo her astonishment, the surface of the stream began to ripple, revealing a swirling portal. Before she could process what was happening, a gentle but firm voice called out to her, \"Elara, child of curiosity, the world awaits!\" With her heart racing and a mix of excitement and apprehension, she stepped through the portal.\n\nOn the other side, Elara found herself in a realm unlike anything she had ever imagined. The sky glowed with hues of pink and purple, and the air was filled with the sweet scent of blooming flowers that seemed to hum with a life of their own. As she looked around, creatures of all shapes and sizes meandered through the vibrant landscape – majestic unicorns pranced near sparkling waterfalls, while wise owls perched on branches, observing her with knowing eyes.\n\nElara quickly learned that this magical realm was known as Luminara, a place where dreams and reality intertwined. Its inhabitants were not just fantastical creatures but also spirits of nature, each holding a unique story. Elara felt an unmistakable connection with this land, as if she had stepped into the very heart of the stories she had always cherished.\n\nDetermined to explore every inch of Luminara, Elara embarked on a quest to unravel its mysteries. Along the way, she encountered Zephyr, a playful wind spirit who guided her through the enchanted forests and revealed hidden glades filled with ancient trees that whispered secrets. Zephyr introduced her to Mira, a gentle water nymph who shared tales of the river spirits and the eternal struggle between light and darkness.\n\nAs days turned into weeks, Elara learned about Luminara's history and its delicate balance. She discovered that a malevolent shadow, known as the Gloom, threatened to consume the land, casting everything into despair. The only way to restore harmony was to find three sacred crystals hidden within the Kingdom of Elements: the Ruby of Fire, the Sapphire of Water, and the Emerald of Earth.\n\nWith her newfound friends, Elara set out on a perilous journey. The trio faced various challenges, from navigating treacherous terrains to solving intricate puzzles created by ancient guardians. Each crystal was protected by trials that tested not only their courage but also their friendship and determination.\n\nIn the fiery cavern of the Ruby, they encountered Ember, a dragon whose breath could melt stone. Instead of battling, Elara used her gift of storytelling to soothe the dragon's fiery heart, sharing tales of love and bravery that resonated deeply with Ember's own past. Moved by her words, Ember relinquished the Ruby, recognizing the importance of preserving their world.\n\nNext, they ventured to the depths of the Sapphire, where dark waters concealed the second crystal beneath layers of illusions. Mira, with her affinity for water, led them through the maze, using her powers to reveal the truth hidden within. Together, they conquered the deceptive spirits of sorrow and emerged victorious, claiming the Sapphire.\n\nLastly, the journey took them to the Verdant Forest, home to the Emerald, guarded by the mighty Earth Golem, stuck in an endless cycle of rage. This time, it was Zephyr's quick thinking and Elara's empathy that helped calm the Golem. They reminded it of its purpose: to nurture and protect rather than destroy. The Golem, touched by their compassion, gifted them the Emerald, completing their quest.\n\nWith all three crystals in hand, Elara and her companions returned to the heart of Luminara, where the Gloom had begun to spread. As the crystals resonated together, immense light cascaded from them, illuminating the land and banishing the darkness. The spirits of Luminara rejoiced, their home restored.\n\nAs the celebration unfolded, Elara found herself reflective. She had set out to explore a land of stories, but she had become part of an epic tale herself. Recognizing the importance of her bond with Luminara and its inhabitants, she knew she could not stay forever. With a heart full of gratitude and a mind brimming with new stories, she stepped back through the portal, emerging once more by the shimmering stream.\n\nBack in her village, Elara was different; she carried the essence of Luminara within her. Her heart had expanded with the love and courage that resonated throughout her adventures. Armed with the stories of a realm that few had known, she shared her experiences with the villagers, spinning tales that inspired wonder and hope. As she wove her stories into the fabric of her community, Elara's curiosity never waned. She became a bridge between worlds, advocating for adventure, empathy, and the magic of storytelling.\n\nAnd thus, Elara continued to wander and wonder, forging connections through her words and reminding everyone that, sometimes, the most extraordinary adventures lie just a step beyond the familiar.\n\nThe end.",
//     additional_kwargs: {},
//     response_metadata: {
//       finish_reason: "stop",
//       model_name: "gpt-4o-mini-2024-07-18",
//       system_fingerprint: "fp_0392822090",
//     },
//     type: "ai",
//     name: null,
//     id: "run-56ba562a-dc79-43a4-83f6-bf6856ca58da",
//     example: false,
//     tool_calls: [],
//     invalid_tool_calls: [],
//     usage_metadata: null,
//   },
//   {
//     content: "oh I love it , please expand a bit more",
//     additional_kwargs: {},
//     response_metadata: {},
//     type: "human",
//     name: null,
//     id: "0ef52dc1-62ab-4ee5-ad3a-9f41d8501f3f",
//     example: false,
//   },
//   {
//     content:
//       "Of course! However, I'd need a bit more context to know what you'd like me to expand on. Are you referring to a specific topic, concept, piece of writing, or idea? Please share more details so that I can provide a more comprehensive expansion!",
//     additional_kwargs: {},
//     response_metadata: {
//       finish_reason: "stop",
//       model_name: "gpt-4o-mini-2024-07-18",
//       system_fingerprint: "fp_dbaca60df0",
//     },
//     type: "ai",
//     name: null,
//     id: "run-38e728ed-d09f-4916-8bc8-52847245dc91",
//     example: false,
//     tool_calls: [],
//     invalid_tool_calls: [],
//     usage_metadata: null,
//   },
//   {
//     content: "just do it",
//     additional_kwargs: {},
//     response_metadata: {},
//     type: "human",
//     name: null,
//     id: "66f9685b-fa3a-4a09-85ff-b1fa1df32a3f",
//     example: false,
//   },
//   {
//     content:
//       "It sounds like you're motivated! What specific goal or task would you like to focus on?",
//     additional_kwargs: {},
//     response_metadata: {
//       finish_reason: "stop",
//       model_name: "gpt-4o-mini-2024-07-18",
//       system_fingerprint: "fp_0392822090",
//     },
//     type: "ai",
//     name: null,
//     id: "run-10a62e86-d435-4057-935f-bf128554ead8",
//     example: false,
//     tool_calls: [],
//     invalid_tool_calls: [],
//     usage_metadata: null,
//   },
// ];

export default function TerminalChat({
  initialThreadId,
}: {
  initialThreadId?: string;
}) {
  const param = useParams();
  const threadIdParam = param.id as string;
  const [threadId, setThreadId] = useState(initialThreadId ?? threadIdParam);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const { submit, history, messages } = useStream({
    apiUrl: env.AGENT_BASE_URL,
    assistantId: env.AGENT_ASSISTANT_ID!,
    threadId,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (history && history.length && !threadId) {
      const threadFromHistory = history[0].checkpoint.thread_id;
      setThreadId(threadFromHistory);

      if (pathname === "/thread/new") {
        router.push(`/thread/${threadFromHistory}`);
      }
    }
  }, [history, pathname, router, threadId]);

  return (
    <Terminal>
      <div className="flex flex-col gap-2 grow overflow-y-auto py-4">
        {messages.map((message) => (
          <TerminalMessage key={message.id} message={message} />
        ))}
      </div>
      <TerminalInput
        onSubmit={(string) =>
          submit({
            messages: [{ role: "human", content: string }],
          })
        }
      />

      <div ref={messagesEndRef} />

      <div className="bg-zinc-800 p-1 text-xs font-mono text-gray-400 flex justify-between border-t border-gray-700 flex-shrink-0">
        <div>
          <span className="mr-2">ctrl+? help</span>
          <span>Tokens: 0, Cost: $0.00</span>
        </div>
        <div className="text-gray-500">
          press <span className="text-white font-bold">enter</span> to send the
          message, write <span className="text-white font-bold">\</span> and
          enter to add a new line
        </div>
      </div>
    </Terminal>
  );
}
