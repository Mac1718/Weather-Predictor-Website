package com.weatherpredictor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationDto {
    private String city;
    private String state;
    private String country;
    private Double latitude;
    private Double longitude;
    private String timezone;

    @JsonProperty("display_name")
    private String displayName;
}