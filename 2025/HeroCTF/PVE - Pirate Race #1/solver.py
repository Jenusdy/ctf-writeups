import math
import json

def distance(a, b):
    return math.hypot(a['x'] - b['x'], a['y'] - b['y'])

def angle_to(a, b):
    dx = b['x'] - a['x']
    dy = b['y'] - a['y']
    ang = math.degrees(math.atan2(dx, -dy)) % 360
    return ang

def closest_target(ship_pos, objects, filter_func=lambda o: True):
    """Return the closest object that matches filter_func."""
    valid_objs = [o for o in objects if filter_func(o)]
    if not valid_objs:
        return None
    return min(valid_objs, key=lambda o: distance(ship_pos, o['position']))

def make_move(game_state):
    ship = game_state['your_ship']
    ship_pos = ship['position']
    islands = game_state['islands']
    barrels = game_state['barrels']
    
    # Load persistent data
    try:
        data = json.loads(game_state.get('data', '{}'))
    except:
        data = {}
    
    # Step 1: Select target island if none or already validated
    target_island_id = data.get('target_island')
    if target_island_id is not None:
        target_island = next((i for i in islands if id(i) == target_island_id and not i['validated']), None)
        if target_island is None:
            target_island_id = None
    
    if target_island_id is None:
        target_island = closest_target(ship_pos, islands, lambda i: not i['validated'])
        target_island_id = id(target_island) if target_island else None

    # Step 2: If all islands validated, target nearest barrel
    if not target_island:
        target_barrel = closest_target(ship_pos, barrels, lambda b: not b['collected'])
        if target_barrel:
            target_pos = target_barrel['position']
        else:
            # No target, stop
            return {"acceleration": -50, "angle": ship['angle'], "data": json.dumps(data)}
    else:
        # Navigate around island according to type
        t = target_island
        x, y = t['position']['x'], t['position']['y']
        r = t['radius'] + 5  # safety margin
        # Determine navigation point
        if t['type'] == 1:
            target_pos = {'x': x + r, 'y': y}
        elif t['type'] == 2:
            target_pos = {'x': x, 'y': y + r}
        elif t['type'] == 3:
            target_pos = {'x': x - r, 'y': y}
        elif t['type'] == 4:
            target_pos = {'x': x, 'y': y - r}
    
    # Step 3: Check for barrels near path
    for barrel in barrels:
        if not barrel['collected'] and distance(ship_pos, barrel['position']) < 50:
            target_pos = barrel['position']
            break

    # Step 4: Compute angle and acceleration
    ang = angle_to(ship_pos, target_pos)
    dist = distance(ship_pos, target_pos)
    
    # Simple acceleration control: full thrust if far, brake if close
    accel = 100 if dist > 20 else 0

    # Save target island in persistent data
    data['target_island'] = target_island_id

    return {
        "acceleration": accel,
        "angle": int(ang) % 360,
        "data": json.dumps(data)
    }
