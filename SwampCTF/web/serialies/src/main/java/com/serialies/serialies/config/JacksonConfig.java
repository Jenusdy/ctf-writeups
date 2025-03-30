package com.serialies.serialies.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        PolymorphicTypeValidator ptv = BasicPolymorphicTypeValidator.builder()
        .allowIfSubType("com.serialies.serialies.Person")
        .allowIfSubType("com.serialies.serialies.Address")
        .allowIfSubType("com.serialies.serialies.Job")
        .build();
        objectMapper.activateDefaultTyping(ptv, ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY);
        return objectMapper;
    }
}