import pygame
import sys

def read_coordinates_from_file(filename):
    coordinates = []
    with open(filename, 'r') as file:
        for line in file:
            line = line.strip()
            if ',' in line:
                try:
                    x, y = map(int, line.split(','))
                    coordinates.append((x, y))
                except ValueError:
                    continue  # Skip lines that aren't valid coordinates
    return coordinates

# Read from file
file_path = "coords.txt"
coordinates = read_coordinates_from_file(file_path)

if not coordinates:
    print("No valid coordinates found in file.")
    sys.exit()

# Initialize pygame
pygame.init()

# Determine the screen size from max coordinates
max_x = max(x for x, y in coordinates) + 50
max_y = max(y for x, y in coordinates) + 50

# Create the screen
screen = pygame.display.set_mode((max_x, max_y))
pygame.display.set_caption("Mouse Movement Visualization")

# Colors
background_color = (30, 30, 30)
line_color = (0, 255, 0)
dot_color = (255, 0, 0)

# Draw loop
running = True
while running:
    screen.fill(background_color)

    # Draw lines between points
    if len(coordinates) > 1:
        pygame.draw.lines(screen, line_color, False, coordinates, 2)

    # Draw points
    for x, y in coordinates:
        pygame.draw.circle(screen, dot_color, (x, y), 5)

    pygame.display.flip()

    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

pygame.quit()
sys.exit()
