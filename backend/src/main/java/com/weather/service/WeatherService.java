package com.weather.service;

import com.weather.model.WeatherResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class WeatherService {

    @Value("${openweather.api.key}")
    private String apiKey;

    @Value("${openweather.api.base-url}")
    private String baseUrl;

    private final WebClient webClient;

    public WeatherService() {
        this.webClient = WebClient.builder().build();
    }

    public Mono<WeatherResponse> getCurrentWeather(String city) {
        String url = String.format("%s/weather?q=%s&appid=%s&units=metric", baseUrl, city, apiKey);
        
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(WeatherResponse.class);
    }

    public Mono<WeatherResponse> getCurrentWeatherByCoordinates(double lat, double lon) {
        String url = String.format("%s/weather?lat=%f&lon=%f&appid=%s&units=metric", baseUrl, lat, lon, apiKey);
        
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(WeatherResponse.class);
    }
}
