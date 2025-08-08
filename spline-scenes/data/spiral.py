import json
import math

def generate_spiral(base_point, num_points):
    # Parameters for the spiral
    theta_max = 4 * math.pi
    theta_increment = theta_max / num_points
    z_increment = 2 / num_points
    y_increment = - 0.05

    # Cartesian coordinates for the spiral around the base point
    points = []
    for i in range(num_points):
        theta = i * theta_increment
        z = i * z_increment
        r = z**2 + 1

        x = round( base_point["x"] + r * math.cos(theta), 3)
        y = base_point["y"] + i * y_increment
        z = round( base_point["z"] + r * math.sin(theta), 3)

        point = {"x": x, "y": y, "z": z}
        points.append(point)

    return points

# Define the base point (change these coordinates as needed)
base_point = {"x": 5, "y": 9, "z": 0}

# Number of points in the spiral
num_points = 100

# Generate the spiral around the base point
spiral_points = generate_spiral(base_point, num_points)

# Store the points in a dictionary
points_dict = {"points": spiral_points}

# Convert the dictionary to JSON format
json_points = json.dumps(points_dict, indent=2)

# Print or save the JSON data
print(json_points)
# You can also save it to a file using:
with open('spiral_points.json', 'w') as file:
    file.write(json_points)
