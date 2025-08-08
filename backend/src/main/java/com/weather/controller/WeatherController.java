package com.weather.controller;

import com.weather.model.WeatherResponse;
import com.weather.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/weather")
@CrossOrigin(origins = "http://localhost:5173")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/city/{cityName}")
    public Mono<ResponseEntity<WeatherResponse>> getWeatherByCity(@PathVariable String cityName) {
        return weatherService.getCurrentWeather(cityName)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.notFound().build());
    }

    @GetMapping("/coordinates")
    public Mono<ResponseEntity<WeatherResponse>> getWeatherByCoordinates(
            @RequestParam double lat,
            @RequestParam double lon) {
        return weatherService.getCurrentWeatherByCoordinates(lat, lon)
                .map(ResponseEntity::ok)
                .onErrorReturn(ResponseEntity.notFound().build());
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Weather API is running!");
    }
}
