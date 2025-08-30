package com.email.writer.app;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;

@Service
public class EmailGeneratorService {

    // private final Client client;

    // // Inject API key from application.properties
    // public EmailGeneratorService(@Value("${gemini.api.key}") String apiKey) {
    //     if (apiKey == null || apiKey.isEmpty()) {
    //         throw new IllegalArgumentException("Gemini API key not found in application.properties");
    //     }

    //     // Ensure SDK can read it as env variable
    //     System.setProperty("GOOGLE_API_KEY", apiKey);

    //     this.client = new Client(); // Will now succeed
    // }

    public String generateEmailReply(EmailRequest emailRequest) {
        

// Use Builder class for instantiation. Explicitly set the API key to use Gemini
// Developer backend.
Client client = Client.builder().apiKey(System.getenv("GEMINI_API_KEY")).build();
        GenerateContentResponse response = client.models.generateContent(
            "gemini-1.5-flash",
            buildPrompt(emailRequest),
            null
        );
        return response.text();
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Please don't generate a subject line. ");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone. ");
        }
        prompt.append("\nOriginal email:\n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}