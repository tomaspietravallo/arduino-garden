# Arduino Smart Garden Project

This repo documents my adventures creating an arduino-based watering system for my plants 🌱

<details>

<summary>List of parts (click to show)</summary>

- Arduino UNO (AVR REV 3 SMD). [Pin diagram](https://content.arduino.cc/assets/Pinout-UNOrev3SMD_latest.pdf). [Buy](https://store.arduino.cc/products/arduino-uno-rev3-smd)
- NodeMCU ESP8266 12-E Kit. [Pin diagram](https://randomnerdtutorials.com/esp8266-pinout-reference-gpios/). [Buy](https://www.amazon.com/Wireless-NodeMcu-Internet-Development-ESP8266/dp/B08F7HNGRT)
- Capacitive soil humidity sensor. [Buy](https://www.amazon.com/gp/product/B07H3P1NRM)
- Dupont cables
- Some soldering (could be avoided)
- [*Free* tier Google Cloud resources](https://cloud.google.com/free)

> Please do note using an arduino uno ***and*** an ESP8266 12-E Kit is overkill, but that's what I ended up using for this project

</details>

---

## The concept
The objective is to create a smart watering system that can periodically water plants given an external signal (soil humidity sensor), and send out notifications detailing the plants' conditions, and whether or not the reservoir needs to be refilled.

### *Sensing and watering*
The sensing is performed using a capacitive soil moisture sensor, which was calibrated, and later read by the Arduino, which will determine if a valve or motor needs to be triggered

### *Notifying*
The data from the arduino is sent using the [Wire](https://www.arduino.cc/reference/en/language/functions/communication/wire/) library to the NodeMCU chip, which has a wifi chip (this could be avoided using a Wifi-enabled arduino), and this sends out a request to a [Google Cloud Function](https://cloud.google.com/functions).

This Cloud Function stores the data in [BigQuery](https://cloud.google.com/bigquery), and decides if sending out a notification is required. This can be done over email, IFTTT push notifications, whatsapp, or other. 

> The data in BigQuery is stored indefinitely so it can later be analyzed traditionally, or as part of a future Machine Learning project

![](https://lucid.app/publicSegments/view/1cf532b9-edc9-4a68-8419-372b6e287ed9/image.jpeg)


## Current road map
- [x] GCP Function (read request and write to BigQuery)
- [x] Write tests for GCP code
- [x] Set up BigQuery
- [] Finish Arduino/NodeMCU `Wire` `.ino` code (not part of Git yet)
- [] Push notifications from GCP
- [] Add set up guides to the repo

## Contributions

Contributions are welcomed. Please be respectful, and remember there might be hardware-specific limitations, bugs, implementations details