#include <ESP8266WiFi.h>
#include <DHT.h>
#include <ESP8266HTTPClient.h>

#define LED_PIN D1
#define DHT_PIN D0
#define DHT_TYPE DHT11

const char* ssid = "Flash";
const char* password = "Billu2244";
const char* serverUrl = "http://localhost:3000/api";

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient wifiClient;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  dht.begin();

  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

void loop() {
  // Read DHT11 Sensor
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(wifiClient, String(serverUrl) + "/sensor");
    http.addHeader("Content-Type", "application/json");

    String jsonPayload = String("{\"temperature\":") + temp +
                         ",\"humidity\":" + humidity + "}";
    http.POST(jsonPayload);
    http.end();
  }

  // Check LED status from the server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(wifiClient, String(serverUrl) + "/led");
    int httpCode = http.GET();
    if (httpCode == HTTP_CODE_OK) {
      String payload = http.getString();
      if (payload == "ON") {
        digitalWrite(LED_PIN, HIGH);
      } else {
        digitalWrite(LED_PIN, LOW);
      }
    }
    http.end();
  }

  delay(5000);
}
