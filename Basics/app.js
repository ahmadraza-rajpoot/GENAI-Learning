import 'dotenv/config'
import Groq from 'groq-sdk'

const groq = new Groq({apiKey:process.env.GROQ_API_KEY})

async function main(){
   const completion =  await groq.chat.completions.create({
        model:"openai/gpt-oss-20b",
        messages:[
            {
                role:"user",
                content:"Hi, this is my first app for learning GenAi, is current model is free to use? I'm using it for learning, GIVE ME RESPONSE IN 2 LINES JUST"
            }
        ]
    })
   // console.log(completion)
    console.log(completion.choices[0].message)
}

main()