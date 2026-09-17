import "dotenv/config";
import {tavily} from '@tavily/core'

import Groq from "groq-sdk";

const tavly =  tavily({apiKey:process.env.TAVILY_API_KEY})

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  
  const messages = [
      {
        role: "system",
        content: `You are smart assist. Respond to the user question and use tools if needed to answer the query.
                
                `,
      },

      {
        role: "user",
        content: "Launched date of iphone 16? and how are you?",
      },
    ]

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    
    temperature: 0,
    messages: messages,

    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description: "Search from web for latest news and information",
          parameters: {
            // JSON Schema object
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Your query, you want to search from web",
              },
              
            },
            required: ["query"],
          },
        },
      },
    ],

    tool_choice:"auto"
  });

  const toolCalls = completion.choices[0].message.tool_calls

  if(toolCalls == null){
    console.log(completion.choices[0].message.content);
    return;
  }

  for(const tool of toolCalls){
        
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments
        

        if(functionName === 'webSearch'){
           const toolResult = await webSearch(JSON.parse(functionParams))

           messages.push({
            tool_call_id: tool.id,
            role:"tool",
            name:functionName,
            content:toolResult
        })
        }
  }


  const completion2 = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    
    temperature: 0,
    messages: messages,

    tools: [
      {
        type: "function",
        function: {
          name: "webSearch",
          description: "Search from web for latest news and information",
          parameters: {
            // JSON Schema object
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Your query, you want to search from web",
              },
              
            },
            required: ["query"],
          },
        },
      },
    ],

    tool_choice:"auto"
  });


  console.log(completion2.choices[0].message.content)

}

main();

async function webSearch({ query }) {
  const response = await tavly.search(query);
  
  const searchResult = response.results.map((res)=>res.content).join("\n\n") 
  
  return searchResult;
}
