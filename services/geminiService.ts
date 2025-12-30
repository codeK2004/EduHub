import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import { Project, User, ChatMessage } from "../types";

// API key is handled by environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.VITE_API_KEY });

export const generateIEEEResearchPaper = async (project: Project, teamMembers: User[]): Promise<string> => {
    const prompt = `
        Based on the following project details, generate a compelling abstract and introduction for an IEEE-style research paper.
        The output should be well-structured, formal, and suitable for a technical audience.

        Project Name: "${project.name}"

        Project Description: "${project.description}"

        Team Members: ${teamMembers.map(m => m.name).join(', ')}

        Key Files & Code Snippets:
        ${project.files.map(file => `
        ---
        File: ${file.name} (${file.language})
        \`\`\`
        ${file.content.substring(0, 500)}...
        \`\`\`
        ---
        `).join('\n')}

        Generate the "Abstract" and "1. Introduction" sections.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating research paper:", error);
        throw new Error("Failed to generate research paper. Please check the API key and network connection.");
    }
};

export const getCodeSuggestion = async (code: string, language: string, question:string): Promise<string> => {
     const prompt = `
        You are an expert AI coding assistant. Analyze the following code snippet and answer the user's question.
        Provide clear, concise, and helpful explanations or code suggestions.

        Language: ${language}

        Code:
        \`\`\`${language.toLowerCase()}
        ${code}
        \`\`\`

        User's Question: "${question}"

        Your Answer:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting code suggestion:", error);
        throw new Error("Failed to get code suggestion. Please check the API key and network connection.");
    }
};


// New function for meeting scheduling
export const getMeetingSuggestions = async (query: string, teamMembers: User[]): Promise<string> => {
    const scheduleMeetingFunctionDeclaration: FunctionDeclaration = {
        name: 'scheduleMeeting',
        description: 'Finds and suggests meeting times based on user constraints.',
        parameters: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: 'The title of the meeting.' },
                durationMinutes: { type: Type.NUMBER, description: 'The duration of the meeting in minutes.' },
                participants: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'List of participant names who should attend the meeting.'
                },
                constraints: {
                    type: Type.STRING,
                    description: 'A summary of all scheduling constraints, such as "next week", "Alice is busy on Monday mornings", etc.'
                }
            },
            required: ['title', 'durationMinutes', 'participants', 'constraints'],
        },
    };

    const prompt = `
        The user wants to schedule a meeting. The team members are ${teamMembers.map(m => m.name).join(', ')}.
        Analyze the following request and extract the details for the meeting.

        User Request: "${query}"
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ functionDeclarations: [scheduleMeetingFunctionDeclaration] }],
            }
        });

        const functionCall = response.functionCalls?.[0];

        if (functionCall) {
            const args = functionCall.args;
            let result = `**Meeting Details Extracted:**\n`;
            result += `- **Title:** ${args.title || 'Not specified'}\n`;
            result += `- **Duration:** ${args.durationMinutes || 'Not specified'} minutes\n`;
            result += `- **Participants:** ${(args.participants || []).join(', ')}\n`;
            result += `- **Constraints:** ${args.constraints || 'None'}\n\n`;
            result += `**Suggested Times (Prototype):**\n- Wednesday at 2:00 PM\n- Friday at 10:30 AM`;
            return result;
        } else {
            return "I couldn't understand the meeting details from your request. Could you please try rephrasing it? For example: 'Schedule a 30 minute design review for next week with the team.'";
        }
    } catch (error) {
        console.error("Error getting meeting suggestions:", error);
        throw new Error("Failed to get meeting suggestions. Please check the API key and network connection.");
    }
};

// New function for chat summarization
export const summarizeChatHistory = async (messages: ChatMessage[]): Promise<string> => {
    if (messages.length === 0) {
        return "There are no messages to summarize.";
    }

    const formattedMessages = messages.map(msg => `${msg.sender.name} (${msg.timestamp}): ${msg.text}`).join('\n');

    const prompt = `
        You are an expert project assistant. Based on the following chat conversation, provide:
        1. A concise summary of the discussion.
        2. A list of action items.

        Format the output clearly with headings for "Summary" and "Action Items".
        If there are no clear action items, state that.

        Chat History:
        ---
        ${formattedMessages}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error summarizing chat history:", error);
        throw new Error("Failed to summarize chat. Please check the API key and network connection.");
    }
};
