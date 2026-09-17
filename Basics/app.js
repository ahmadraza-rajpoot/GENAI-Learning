import 'dotenv/config'
import Groq from 'groq-sdk'

const groq = new Groq({apiKey:process.env.GROQ_API_KEY})

async function main(){
   const completion =  await groq.chat.completions.create({
        model:"openai/gpt-oss-20b",
        response_format:{type:"json_object"},
        messages:[
            {
                role:"system",
                content:`Your name is Jarvis, you are smart AI assistant. You have to give answer in that format so that it could be readable on terminal.
                           You have to response in valid JSON object
                           Example:
                            {
                                Messege:"string"
                            } 
                `
            },
            {
                role:"user",
                content:"HI, who are you?"
            }
        ],
        
    })
   // console.log(completion)
    console.log(completion.choices[0].message.content)
}

main()