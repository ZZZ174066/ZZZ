package com.tsj;

import com.tsj.config.LlmApiProperties;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@MapperScan({"com.tsj.mapper"})
@EnableConfigurationProperties(LlmApiProperties.class)
public class TsjProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(TsjProjectApplication.class, args);
    }

}
