package com.email.writer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EmailWriterSbApplication {

	public static void main(String[] args) {
		System.out.println("Env var: " + System.getenv("GEMINI_API_KEY"));

		SpringApplication.run(EmailWriterSbApplication.class, args);
	}

}
