package com.tsj.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tsj.config.LlmApiProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class LlmChatService {

    private final LlmApiProperties props;
    private final ObjectMapper objectMapper;
    private final RestClient restClient = RestClient.builder().build();

    public LlmChatService(LlmApiProperties props, ObjectMapper objectMapper) {
        this.props = props;
        this.objectMapper = objectMapper;
    }


    public boolean isConfigured() {
        String key = props.getKey();
        return props.isEnabled()
                && key != null
                && !key.isBlank();
    }


    public String chat(String systemPrompt, String userPrompt) throws Exception {
        if (!isConfigured()) {
            throw new IllegalStateException("LLM 未就绪：请在 application.properties 填写 llm.api.key；若已关闭功能请检查 llm.api.enabled=false。");
        }

        Map<String, Object> body = new HashMap<>();
        body.put("model", props.getModel());
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userPrompt));
        body.put("messages", messages);
        body.put("temperature", 0.35);

        String jsonBody = objectMapper.writeValueAsString(body);

        String responseJson = restClient.post()
                .uri(props.getUrl())
                .header("Authorization", "Bearer " + props.getKey().strip())
                .header("Content-Type", "application/json")
                .body(jsonBody)
                .retrieve()
                .body(String.class);

        if (responseJson == null || responseJson.isBlank()) {
            throw new IllegalStateException("LLM 返回空响应");
        }

        JsonNode root = objectMapper.readTree(responseJson);
        JsonNode err = root.get("error");
        if (err != null && !err.isNull()) {
            String msg = err.has("message") ? err.get("message").asText() : err.toString();
            throw new IllegalStateException("LLM 接口错误: " + msg);
        }

        JsonNode choices = root.get("choices");
        if (choices == null || !choices.isArray() || choices.isEmpty()) {
            throw new IllegalStateException("LLM 响应缺少 choices: " + responseJson);
        }

        JsonNode message = choices.get(0).get("message");
        if (message == null || message.get("content") == null) {
            throw new IllegalStateException("LLM 响应缺少 message.content");
        }

        return message.get("content").asText();
    }
}
