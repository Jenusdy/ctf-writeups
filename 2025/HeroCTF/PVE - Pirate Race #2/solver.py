import math

def distance(a, b):
    return math.hypot(a['x'] - b['x'], a['y'] - b['y'])

def angle_to(a, b):
    dx = b['x'] - a['x']
    dy = b['y'] - a['y']
    return math.degrees(math.atan2(dx, -dy)) % 360

def next_navigation_point(island):
    x, y, r = island['position']['x'], island['position']['y'], island['radius'] + 5
    if island['type'] == 1: return {'x': x + r, 'y': y}
    if island['type'] == 2: return {'x': x, 'y': y + r}
    if island['type'] == 3: return {'x': x - r, 'y': y}
    if island['type'] == 4: return {'x': x, 'y': y - r}

def closest_unvalidated_island(ship_pos, islands):
    unvalidated = [i for i in islands if not i['validated']]
    if not unvalidated: return None
    return min(unvalidated, key=lambda i: distance(ship_pos, next_navigation_point(i)))

def closest_barrel(ship_pos, barrels):
    uncollected = [b for b in barrels if not b['collected']]
    if not uncollected: return None
    return min(uncollected, key=lambda b: distance(ship_pos, b['position']))

def make_move(game_state):
    ship = game_state['your_ship']
    ship_pos = ship['position']
    islands = game_state['islands']
    barrels = game_state['barrels']

    # Load target index from compact data (0-63 chars)
    try:
        target_id = int(game_state.get('data', '-1'))
    except:
        target_id = -1

    # Step 1: Choose island target
    target_island = closest_unvalidated_island(ship_pos, islands)
    if target_island:
        target_pos = next_navigation_point(target_island)
        target_id = id(target_island) % 1000000  # compact ID for data
    else:
        # Step 2: Choose nearest barrel if no islands left
        target_barrel = closest_barrel(ship_pos, barrels)
        if target_barrel:
            target_pos = target_barrel['position']
            target_id = -1  # no island
        else:
            # Nothing left, stop
            return {"acceleration": -50, "angle": ship['angle'], "data": str(target_id)}

    # Step 3: Check nearby barrels for interception
    for barrel in barrels:
        if not barrel['collected'] and distance(ship_pos, barrel['position']) < 50:
            target_pos = barrel['position']
            break

    # Step 4: Compute angle and acceleration
    ang = angle_to(ship_pos, target_pos)
    dist = distance(ship_pos, target_pos)
    accel = 100 if dist > 20 else 0

    return {
        "acceleration": accel,
        "angle": int(ang) % 360,
        "data": str(target_id)  # compact data <= 64 chars
    }
