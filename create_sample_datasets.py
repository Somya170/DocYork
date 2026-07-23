import pandas as pd
import datetime

def create_sales_inventory():
    data = {
        "item_id": [f"INV-{1000 + i}" for i in range(1, 9)],
        "product_name": [
            "Heavy Duty Drill", "Safety Helmet", "Welding Mask", "Steel Toe Boots",
            "Angle Grinder", "Industrial Screws Pack", "Safety Goggles", "Hydraulic Jack"
        ],
        "category": ["Power Tools", "Safety Gear", "Welding", "Footwear", "Power Tools", "Fasteners", "Safety Gear", "Heavy Equipment"],
        "unit_price": [120.50, 45.00, 85.00, 110.00, 95.00, 15.75, 25.00, 250.00],
        "quantity_sold": [15, 40, 12, 25, 18, 120, 50, 8],
        "store_location": ["Plant 1 Store", "Warehouse A", "Plant 2 Store", "Warehouse A", "Plant 1 Store", "Warehouse B", "Warehouse A", "Plant 2 Store"],
        "sales_date": [
            "2026-07-01", "2026-07-02", "2026-07-02", "2026-07-03",
            "2026-07-04", "2026-07-04", "2026-07-05", "2026-07-06"
        ],
        "customer_segment": ["Enterprise", "Contractor", "Enterprise", "Contractor", "Retail", "Enterprise", "Retail", "Enterprise"]
    }
    df = pd.DataFrame(data)
    df.to_excel("c:/Users/Somya/Downloads/DocYork/sample_sales_inventory.xlsx", index=False)
    print("Created sample_sales_inventory.xlsx")

def create_employee_attendance():
    data = {
        "employee_id": [f"EMP-{200 + i}" for i in range(1, 9)],
        "employee_name": [
            "Rahul Sharma", "Sneha Patil", "John Doe", "Aman Verma",
            "Meera Nair", "Vikram Rathore", "Karan Johar", "Shalini Sen"
        ],
        "department": ["Production", "Logistics", "Operations", "Production", "Quality Control", "Logistics", "Operations", "Quality Control"],
        "date": ["2026-07-20"] * 8,
        "check_in_time": ["08:55", "09:05", "08:45", "09:00", "08:58", "09:15", "08:50", "09:02"],
        "check_out_time": ["17:05", "17:00", "17:15", "17:00", "17:02", "18:00", "17:00", "17:05"],
        "hours_worked": [8.1, 7.9, 8.5, 8.0, 8.0, 8.7, 8.1, 8.0],
        "status": ["Present", "Present", "Present", "Present", "Present", "Present", "Present", "Present"]
    }
    df = pd.DataFrame(data)
    df.to_excel("c:/Users/Somya/Downloads/DocYork/sample_employee_attendance.xlsx", index=False)
    print("Created sample_employee_attendance.xlsx")

def create_fleet_vehicles():
    data = {
        "vehicle_id": [f"FLT-{300 + i}" for i in range(1, 9)],
        "model": [
            "Ford F-150", "Toyota Hilux", "Mercedes Sprinter", "Caterpillar Forklift",
            "Volvo FH16 Truck", "Chevrolet Silverado", "Toyota Hiace", "Komatsu Excavator"
        ],
        "type": ["Pickup Truck", "Pickup Truck", "Cargo Van", "Forklift", "Heavy Truck", "Pickup Truck", "Cargo Van", "Heavy Equipment"],
        "last_service_date": [
            "2026-05-10", "2026-06-15", "2026-04-20", "2026-07-01",
            "2026-03-12", "2026-06-28", "2026-07-10", "2026-02-28"
        ],
        "mileage_miles": [12400, 8500, 24500, 1200, 48000, 15300, 4200, 3100],
        "fuel_efficiency_mpg": [18.5, 22.0, 24.5, 5.0, 8.5, 17.0, 23.0, 4.0],
        "driver_assigned": [
            "Rajesh Yadav", "Sanjay Dutt", "Manish Paul", "Amit Kumar",
            "Jaspreet Singh", "Kunal Kapoor", "Abhishek Roy", "Dinesh Karthik"
        ],
        "active_status": ["Active", "Active", "Active", "Under Maintenance", "Active", "Active", "Active", "Inactive"]
    }
    df = pd.DataFrame(data)
    df.to_excel("c:/Users/Somya/Downloads/DocYork/sample_fleet_vehicles.xlsx", index=False)
    print("Created sample_fleet_vehicles.xlsx")

if __name__ == "__main__":
    create_sales_inventory()
    create_employee_attendance()
    create_fleet_vehicles()
