const openAI = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai");

class summarizeController {

    // Google Bard (Primary)
    async summarizeTheText(req, res) {
        const googleBard = new GoogleGenerativeAI(process.env.GOOGLEBARD_KEY);
        const model = googleBard.getGenerativeModel({ model: "gemini-pro"});
        const prompt = `Tóm tắt nội dung của cuốn sách ${req.body.text}, nếu sách có nhiều chương thì hãy tóm tắt nội dung từng chương một một cách cụ thể (dưới dạng markdown)`
        const result = await model.generateContent(prompt);
        const response = await result.response;
        //replace all \n to <br>
        const text = response.text().replace(/\n/g, "<br>");
        if (text) {
            res.status(200);
            res.json({
                summarizedText: text
            });
        } else {
            res.status(500);
            res.json({
                error: "Internal Server Error"
            });
        }
    }

    //GPT 3.5 Turbo 1106 (Backup)
    async summarizeTheTextByGPT35(req, res) {
        const openai = new openAI({ apiKey: process.env.OPENAI_KEY });
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Tóm tắt nội dung của cuốn sách ${req.body.text} một cách cụ thể, nếu sách có nhiều chương thì hãy tóm tắt nội dung từng chương một một cách cụ thể. (trả lời ở dạng json)`
                }
            ],
            model: "gpt-3.5-turbo-1106",
            response_format: { type: "json_object" },
        })
        if (completion) {
            res.status(200)
            res.json({
                summarizedText: completion.choices[0].message.content
            })
        } else {
            res.status(500)
            res.json({
                error: "Internal Server Error"
            })
        }
    }
}

module.exports = new summarizeController();