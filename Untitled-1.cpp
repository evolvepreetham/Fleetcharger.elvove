// EV Fleet Management System - Curser Code
// Author: [Your Name]
// Team: Evolve.3X
// Date: [Today's Date]

// ----------------------------
// HEADER FILES
// ----------------------------
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// ----------------------------
// DATA STRUCTURES
// ----------------------------

struct Vehicle {
    int vehicle_id;
    char vehicle_type[20]; // e.g., "Truck", "Van"
    float battery_level;    // percentage
    char status[20];        // e.g., "Available", "Charging", "On Trip"
};

struct ChargingStation {
    int station_id;
    char location[50];
    int available_ports;
    float power_output_kW;
};

struct TripSchedule {
    int vehicle_id;
    char destination[50];
    char start_time[20];
    char end_time[20];
    int charging_required; // 1 for yes, 0 for no
};

// ----------------------------
// GLOBAL ARRAYS
// ----------------------------
struct Vehicle fleet[50];
struct ChargingStation stations[10];
struct TripSchedule schedules[100];

// ----------------------------
// FUNCTION PROTOTYPES
// ----------------------------
void loadFleetData();
void loadChargingStationData();
void displayFleetStatus();
void scheduleTrip();
void optimizeCharging();
void dashboard();

// ----------------------------
// MAIN FUNCTION
// ----------------------------
int main() {
    int choice;

    loadFleetData();
    loadChargingStationData();

    while (1) {
        printf("\n--- EV FLEET MANAGEMENT SYSTEM ---\n");
        printf("1. View Fleet Status\n");
        printf("2. Schedule a Trip\n");
        printf("3. Optimize Charging\n");
        printf("4. View Dashboard\n");
        printf("5. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1: displayFleetStatus(); break;
            case 2: scheduleTrip(); break;
            case 3: optimizeCharging(); break;
            case 4: dashboard(); break;
            case 5: exit(0);
            default: printf("Invalid Choice!\n");
        }
    }

    return 0;
}

// ----------------------------
// FUNCTION DEFINITIONS
// ----------------------------

void loadFleetData() {
    // Dummy data – replace with DB or file later
    fleet[0] = (struct Vehicle){1001, "Van", 78.5, "Available"};
    fleet[1] = (struct Vehicle){1002, "Truck", 32.0, "Charging"};
    // Add more vehicles...
}

void loadChargingStationData() {
    stations[0] = (struct ChargingStation){1, "Depot 1", 3, 22.0};
    stations[1] = (struct ChargingStation){2, "Depot 2", 2, 50.0};
    // Add more stations...
}

void displayFleetStatus() {
    printf("\n--- Fleet Status ---\n");
    for (int i = 0; i < 2; i++) {
        printf("Vehicle ID: %d, Type: %s, Battery: %.1f%%, Status: %s\n",
            fleet[i].vehicle_id, fleet[i].vehicle_type,
            fleet[i].battery_level, fleet[i].status);
    }
}

void scheduleTrip() {
    int id;
    printf("Enter Vehicle ID to schedule trip: ");
    scanf("%d", &id);
    // Add logic to check availability and schedule
    printf("Trip scheduled for Vehicle ID %d.\n", id);
}

void optimizeCharging() {
    printf("\n--- Charging Optimization ---\n");
    // Sample logic: charge low battery vehicles at free ports
    for (int i = 0; i < 2; i++) {
        if (fleet[i].battery_level < 40.0 && strcmp(fleet[i].status, "Available") == 0) {
            printf("Schedule charging for Vehicle ID %d\n", fleet[i].vehicle_id);
            // Assign charging station logic here
        }
    }
}

void dashboard() {
    printf("\n--- Dashboard ---\n");
    // You can later visualize this using web or GUI
    printf("Total Vehicles: 2\n");
    printf("Vehicles in Use: 1\n");
    printf("Charging Stations Available: 2\n");
}
